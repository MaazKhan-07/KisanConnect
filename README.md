# KisanConnect

**Know your price. Sell with confidence.**

KisanConnect is a market-linkage and price-discovery platform built for Maharashtra farmers. It combines real-time mandi (market) price trends with AI-powered advisory and a rule-based buyer-matching engine, helping farmers decide when and where to sell their harvest.
**This website is made for SIH 2026 internal hackathon for learning purpose**

🔗 **Live app:** https://kisan-connect-mu.vercel.app

---

## Features

- 📈 **Price trend engine** — compares the last 7 days of mandi prices against the previous 7 days to show whether prices are rising, falling, or stable
- 🤖 **AI advisory messages** — generates plain-language selling advice using an LLM (Gemini), with a safe templated fallback when no API key is configured
- 🤝 **Buyer-matching engine** — rule-based, explainable matching between farmer crop lots and potential buyers
- 🌾 **Farmer dashboard** — price dashboard, lot-creation form, and buyer-matches screen
- 🗃️ **Seeded sample data** — pre-loaded with realistic synthetic Maharashtra mandi price data for demo purposes

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js |
| Backend | FastAPI (Python) |
| Database | SQLite |
| AI/LLM | Google Gemini API (optional) |
| Frontend hosting | Vercel |
| Backend hosting | Render |

---

## Project Structure

```
KisanConnect/
├── backend/     # FastAPI app, price engine, buyer matching, DB seeding
├── data/        # Sample/synthetic mandi price CSV data
├── frontend/    # Next.js app (dashboard, lot form, buyer matches)
└── README.md
```

## Roadmap / Ideas

- Real-time push notifications for price alerts
- Multi-language support (Marathi, Hindi)
- Historical price charts and export
- Buyer-side dashboard and direct messaging

---

## Acknowledgements

Made for Maharashtra farmers. © 2026 KisanConnect.
