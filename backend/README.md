# Backend — FastAPI

## Run
```bash
python3 -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
python seed_db.py
uvicorn app.main:app --reload --port 8000
```

## Key files
- `app/main.py` — app entrypoint, mounts routers, enables CORS
- `app/models.py` — SQLAlchemy tables: MandiPrice, Lot, BuyerDemand, Offer
- `app/routers/prices.py` — GET /prices/, GET /prices/{commodity}/{district}
- `app/routers/lots.py` — POST /lots/, GET /lots/, GET /lots/{id}
- `app/routers/matches.py` — GET /lots/{id}/matches
- `app/services/trend.py` — the 7-day vs 7-day trend calculation
- `app/services/advisory.py` — LLM call + safe fallback message
- `app/services/matching.py` — explainable rule-based buyer scoring
- `seed_db.py` — loads ../data/mandi_prices_sample.csv + demo buyers

## Test it's alive
```bash
curl http://localhost:8000/
curl http://localhost:8000/prices/
```
