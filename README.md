🌌 SightZen AI — Automated Root Cause Analysis for IT Operations

SightZen AI is an intelligent AIOps platform that analyzes ITSM tickets, detects repeating operational patterns, identifies probable root causes, and recommends fixes — transforming reactive support into proactive reliability.

Built with Python ML, Node.js APIs & a futuristic neon React UI.
Designed for Kaggle, competitions, hiring managers & real-world IT Ops teams.

🚀 Key Features

✅ Automated RCA detection using ML
✅ Clusters similar incidents using NLP
✅ Confidence scoring for RCA reliability
✅ RCA Insights dashboard with explanations
✅ AI Assistant — ask natural-language operational queries
✅ Synthetic enterprise ITSM dataset (Jira, Tableau, PowerBI, AWS)
✅ React cyber-console UI with animated background
✅ Modular backend + frontend + ML engine architecture

🧠 Why This Matters

IT teams waste hours digging through previous tickets.
SightZen AI learns from history — so the next outage resolves faster.

🔹 Reduced MTTR
🔹 Fewer escalations
🔹 Prevent recurring failures
🔹 Better decision-making
🔹 Happier engineers & customers

🏗 System Architecture

React UI → Express API → Python RCA Engine → Dataset → Insights

📦 Tech Stack

Frontend

React, CSS, animated neon UI

Backend

Node.js, Express, REST APIs

Machine Learning

Python, pandas, scikit-learn, TF-IDF, KMeans

Data

800 synthetic ITSM records (JSON/CSV)

📊 Dataset Overview
Category	Count
Jira Incidents	200
Tableau Issues	200
PowerBI Failures	200
AWS CloudWatch Alerts	200

Fields include:

title, description, timestamp

service/application

past resolution text

category

cluster ID

recommended fix

RCA summary

✅ Fully anonymized & safe for public use

💡 Example RCA Output
Pattern #3
Occurrences: 46
Probable RCA: Tableau Server CPU Overload
Recommended Fix: Increase extract refresh interval
Confidence: 96.2%

🗂 Folder Structure
sightzen-ai/
│
├── frontend/        # React neon UI
├── backend/         # Express REST API
├── rca_engine/      # Python ML + clustering
├── dataset/         # Synthetic ITSM data
├── docs/            # Architecture diagram, notes
└── README.md

⚙️ Setup & Run
1️⃣ Clone Repo
git clone https://github.com/yourusername/sightzen-ai.git
cd sightzen-ai

2️⃣ Start Backend
cd backend
npm install
npm start


Backend runs at:

http://localhost:5000

3️⃣ Start Frontend
cd frontend
npm install
npm start


Open UI:

http://localhost:3000

4️⃣ Rebuild RCA Model (optional)
cd rca_engine
python train_rca.py

🎯 Use Cases

✅ IT Operations & NOC Teams
✅ Helpdesk & Support Automation
✅ AI-powered Monitoring Platforms
✅ SRE & DevOps analytics
✅ RCA recommendation engines

🚧 Future Roadmap

🔹 ServiceNow / Jira Cloud integration
🔹 Time-series correlation with monitoring tools
🔹 LLM-generated RCA explanations
🔹 Incident severity prediction
🔹 RCA confidence interpretability
🔹 Deployment on AWS / Azure

🏆 Competition Statement

This project was developed for the Google 5-Day AI Kaggle Competition, focusing on real-world enterprise reliability problems, innovation, ML practicality, and user-centered design.

🤝 Contributing

Pull requests welcome!
Ideal contributions: dataset expansion, UI enhancements, RCA models, visualizations.

📜 License

MIT — free for learning, research & innovation.

💛 Author

Sai Harshitha, Nagam
AI, Product & AIOps enthusiast
🌍 India

🌟 Final Words

SightZen AI turns operational chaos into root-cause intelligence — before outages happen.
