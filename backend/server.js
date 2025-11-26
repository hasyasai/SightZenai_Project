// backend/server.js
// SightZen demo backend
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import csv from 'csv-parser'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

function safeLoadJSON(relPath) {
  try {
    const p = path.join(__dirname, 'data', relPath);
    const raw = fs.readFileSync(p, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${relPath}:`, err.message);
    return null;
  }
}

const REPORT_SCREENSHOT_LOCAL_PATH = path.join(__dirname, 'public', 'reports', 'report_screenshot.png');

app.get('/dashboard', (req, res) => {
  const dashboard = safeLoadJSON('dashboard.json') || {};
  return res.json({ ok: true, data: dashboard });
});

app.get('/cloudwatch', (req, res) => {
  const cloud = safeLoadJSON('cloudwatch.json') || {};
  return res.json({ ok: true, data: cloud });
});

app.get('/reports', (req, res) => {
  const reports = safeLoadJSON('reports.json') || {};
  reports.local_screenshot = '/public/reports/report_screenshot.png';
  return res.json({ ok: true, data: reports });
});

app.get('/jira/search', (req, res) => {
  const q = (req.query.query || '').trim().toLowerCase();
  if (!q) return res.status(400).json({ ok: false, error: 'query parameter required' });

  const cases = safeLoadJSON('jira_cases.json') || [];
  const tokens = q.split(/\s+/).filter(Boolean);

  const scored = cases.map(c => {
    const hay = `${c.issue_id} ${c.problem} ${c.root_cause} ${c.solution} ${c.category}`.toLowerCase();
    let score = 0;
    tokens.forEach(t => { if (hay.includes(t)) score += 2; });
    if (tokens.includes(c.category.toLowerCase())) score += 1;
    return { score, case: c };
  }).filter(s => s.score > 0);

  scored.sort((a,b) => b.score - a.score);

  if (scored.length === 0) {
    const fallback = cases.find(c =>
      tokens.some(t =>
        `${c.problem} ${c.root_cause} ${c.solution}`.toLowerCase().includes(t)
      )
    );
    if (fallback) return res.json({ ok: true, match: fallback });
    return res.json({ ok: true, match: null, message: 'No matching Jira case found' });
  }

  const top = scored[0].case;
  const top3 = scored.slice(0,3).map(s=>s.case);
  return res.json({ ok: true, match: top, candidates: top3 });
});
app.get('/rca/patterns', (req, res) => {
  const results = [];
  const filePath = path.join(__dirname, 'data', 'rca_summary.csv');

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      // Convert numeric fields correctly
      row.cluster_id = Number(row.cluster_id);
      row.ticket_count = Number(row.ticket_count);
      row.confidence_score = Number(row.confidence_score);

      // Convert sample_titles from string to array if needed
      if (row.sample_titles && typeof row.sample_titles === 'string') {
        row.sample_titles = row.sample_titles.replace(/[[\]"]/g, '').split(',');
      }

      results.push(row);
    })
    .on('end', () => {
      res.json({ ok: true, data: results });
    })
    .on('error', (err) => {
      console.error(err);
      res.status(500).json({ ok: false, error: 'Failed to load RCA summary' });
    });
});


app.post('/ask-ai', (req, res) => {
  const query = (req.body.query || '').trim();
  if (!query) return res.status(400).json({ ok: false, error: 'query required in body' });

  const q = query.toLowerCase();
  const reports = safeLoadJSON('reports.json') || {};
  const dashboard = safeLoadJSON('dashboard.json') || {};
  const cloudwatch = safeLoadJSON('cloudwatch.json') || {};
  const jiraCases = safeLoadJSON('jira_cases.json') || [];

  function analyzeCpuTrend() {
    const cpu = (cloudwatch && cloudwatch.cpu && Array.isArray(cloudwatch.cpu.values))
                ? cloudwatch.cpu.values : (dashboard.cpu_trend_24h || []);
    if (!cpu || cpu.length === 0) return null;
    const max = Math.max(...cpu);
    const avg = cpu.reduce((a,b)=>a+b,0) / cpu.length;
    const peakIndex = cpu.indexOf(max);
    const morningSpike = peakIndex <= 3;
    return { values: cpu, max, avg: Math.round(avg*100)/100, peakIndex, morningSpike };
  }

  if (q.includes('report') || q.includes('dashboard') || q.includes('power bi') || q.includes('tableau')) {
    let chosen = null;
    if (q.includes('performance') || q.includes('cpu') || q.includes('utilization')) {
      chosen = reports.tableau && reports.tableau.performance_dashboard ? reports.tableau.performance_dashboard : (reports.powerbi && reports.powerbi.retail_analysis);
    } else if (q.includes('uptime') || q.includes('availability')) {
      chosen = (reports.powerbi && reports.powerbi.inventory_dashboard) || (reports.tableau && reports.tableau.regional_performance);
    } else {
      chosen = (reports.tableau && Object.values(reports.tableau)[0]) || (reports.powerbi && Object.values(reports.powerbi)[0]);
    }

    const cpuAnalysis = analyzeCpuTrend();
    let summary = `Report link: ${chosen || 'No report link configured.'}`;
    if (cpuAnalysis) {
      summary += `\nSummary from sample metrics: CPU avg ${cpuAnalysis.avg}%, peak ${cpuAnalysis.max}%.`;
      if (cpuAnalysis.morningSpike) summary += ' Peak appears early in the day (sample data).';
    }

    return res.json({
      ok: true,
      type: 'report',
      answer: summary,
      link: chosen,
      evidence: { cpu: cpuAnalysis }
    });
  }

  if (q.includes('cpu') && (q.includes('morning') || q.includes('every morning') || q.includes('daily'))) {
    const cpuAnalysis = analyzeCpuTrend();
    const matches = jiraCases.filter(c => {
      const hay = `${c.problem} ${c.root_cause} ${c.solution} ${c.category}`.toLowerCase();
      return hay.includes('cpu') || hay.includes('morning') || hay.includes('cron') || hay.includes('backup');
    });
    const topMatch = matches.length ? matches[0] : null;

    const answerParts = [];
    if (cpuAnalysis) {
      answerParts.push(`Sample CPU trend (24h): avg ${cpuAnalysis.avg}%, peak ${cpuAnalysis.max}%.`);
      if (cpuAnalysis.morningSpike) answerParts.push('Pattern: highest samples occur early in the day (sample data indicates morning spike).');
    } else {
      answerParts.push('No CPU metric sample available.');
    }

    if (topMatch) {
      answerParts.push(`Matching historical Jira case: ${topMatch.issue_id} — ${topMatch.problem}.`);
      answerParts.push(`Recorded root cause: ${topMatch.root_cause}.`);
      answerParts.push(`Suggested solution: ${topMatch.solution}.`);
    } else {
      answerParts.push('No similar Jira case found in sample data.');
    }

    return res.json({
      ok: true,
      type: 'rca',
      answer: answerParts.join(' '),
      evidence: { cpu: cpuAnalysis, jira_match: topMatch }
    });
  }

  if (q.startsWith('why') || q.includes('why') || q.includes('cause') || q.includes('root cause') || q.includes('reason')) {
    const tokens = q.split(/\s+/).filter(Boolean);
    let best = null;
    let bestScore = 0;
    jiraCases.forEach(c => {
      let score = 0;
      const hay = `${c.problem} ${c.root_cause} ${c.solution} ${c.category}`.toLowerCase();
      tokens.forEach(t => { if (hay.includes(t)) score += 1; });
      if (score > bestScore) { bestScore = score; best = c; }
    });

    if (best) {
      return res.json({
        ok: true,
        type: 'rca',
        answer: `Based on previous similar cases (${best.issue_id}): root cause: ${best.root_cause}. Solution: ${best.solution}.`,
        evidence: { jira_match: best }
      });
    } else {
      const dash = dashboard || {};
      return res.json({
        ok: true,
        type: 'explain',
        answer: `Sample analysis: performance dip appears correlated with CPU increase and higher latency in the sample metrics. Dashboard sample top service: ${dash.top_service || 'unknown'}.`,
        evidence: { dashboard: dash }
      });
    }
  }

  const tokens = q.split(/\s+/).filter(Boolean);
  const fallbackMatch = jiraCases.find(c =>
    tokens.some(t => `${c.problem} ${c.root_cause} ${c.solution} ${c.category}`.toLowerCase().includes(t))
  );

  if (fallbackMatch) {
    return res.json({
      ok: true,
      type: 'jira-fallback',
      answer: `I found a similar case: ${fallbackMatch.issue_id} — ${fallbackMatch.problem}. Root cause: ${fallbackMatch.root_cause}. Solution: ${fallbackMatch.solution}`,
      evidence: { jira_match: fallbackMatch }
    });
  }

  return res.json({
    ok: true,
    type: 'unknown',
    answer: `I couldn't find a direct match in sample data. You can ask "Where is the performance report", "Why is CPU high every morning" or "Show me Jira cases for disk IOPS".`,
    evidence: {}
  });
});

app.get('/local-screenshot-path', (req, res) => {
  return res.json({ ok: true, path: REPORT_SCREENSHOT_LOCAL_PATH });
});

app.use('/public', express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`SightZen demo backend running on http://localhost:${PORT}`);
  console.log('Available endpoints: /dashboard, /cloudwatch, /reports, /jira/search, /ask-ai, /local-screenshot-path');
});
