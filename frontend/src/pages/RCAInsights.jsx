import { useEffect, useState } from "react";

export default function RCAInsights() {
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/rca/patterns")
      .then((res) => res.json())
      .then((json) => {
        if (json.ok) setPatterns(json.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching RCA:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ color: "#00FFE7", padding: "30px" }}>Loading RCA insights...</p>;

  return (
    <div style={{ padding: "25px", color: "white" }}>
      <h1 style={{ fontSize: "38px", marginBottom: "20px", color: "#00FFE7" }}>
        RCA Insights
      </h1>

      {patterns.map((p) => (
        <div
          key={p.cluster_id}
          style={{
            border: "2px solid #00FFE7",
            padding: "18px",
            marginBottom: "16px",
            borderRadius: "14px",
            background: "rgba(0, 255, 231, 0.08)",
            boxShadow: "0 0 12px #00FFE7",
          }}
        >
          <h2 style={{ color: "#FF00E6" }}>Pattern #{p.cluster_id}</h2>
          <p><strong>Occurrences:</strong> {p.ticket_count}</p>
          <p><strong>Probable RCA:</strong> {p.probable_rca}</p>
          <p><strong>Recommended Fix:</strong> {p.recommended_fix}</p>
          <p><strong>Confidence:</strong> {(p.confidence_score * 100).toFixed(1)}%</p>

          <p><strong>Example Tickets:</strong></p>
          <ul>
            {p.sample_titles.map((t, idx) => (
              <li key={idx}>{t}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
