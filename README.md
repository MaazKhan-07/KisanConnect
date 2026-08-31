# SIH26132 — KisanConnect (Starter Codebase)

Market Linkages & Price Discovery for Farmers — working MVP scaffold for the
5-hour internal hackathon build.

## What's already working
- FastAPI backend with SQLite (no DB server install needed)
- Price trend engine (7-day vs. previous-7-day comparison)
- LLM advisory message generation (Gemini, with safe offline fallback)
- Rule-based, explainable buyer-matching engine
- Next.js frontend: price dashboard, lot-creation form, buyer-matches screen
- 300 rows of realistic (synthetic) Maharashtra mandi price data pre-seeded

## Quickstart

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python seed_db.py               # creates + fills sih26132.db
uvicorn app.main:app --reload --port 8000
```
Visit http://localhost:8000/docs for interactive API docs (auto-generated).

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Visit http://localhost:3000

### Optional: enable real AI-generated advisory text
```bash
# backend/.env
GEMINI_API_KEY=your_key_here
```
Without a key, the app falls back to a templated (still perfectly demo-safe) message.

## Replacing sample data with real data
`data/mandi_prices_sample.csv` is synthetic-but-realistic. Replace it with a real
Agmarknet/data.gov.in export (same column names), then re-run `python seed_db.py`.

## Folder structure
See the accompanying Game Plan document for the full team task breakdown.
