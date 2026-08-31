"""
Run this once to create tables and load demo data:
    python seed_db.py

Data Engineer: replace data/mandi_prices_sample.csv with the real
Agmarknet/data.gov.in export before the demo, keeping the same column names:
commodity,variety,market,district,date,min_price,max_price,modal_price,arrival_qty
"""
import csv
import datetime
import sys
import os

sys.path.append(os.path.dirname(__file__))

from app.database import Base, engine, SessionLocal
from app.models import MandiPrice, BuyerDemand, Lot

CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "mandi_prices_sample.csv")

DEMO_BUYERS = [
    {"buyer_name": "Nashik AgroFresh Pvt Ltd", "commodity": "Onion", "quantity_needed_kg": 5000,
     "quality_required": "B", "max_price": 1900, "district": "Nashik", "reliability_rating": 4.6},
    {"buyer_name": "Maharashtra FoodTech Exports", "commodity": "Onion", "quantity_needed_kg": 20000,
     "quality_required": "A", "max_price": 2000, "district": "Pune", "reliability_rating": 4.2},
    {"buyer_name": "FreshMart Retail Chain", "commodity": "Tomato", "quantity_needed_kg": 3000,
     "quality_required": "A", "max_price": 1400, "district": "Pune", "reliability_rating": 4.8},
    {"buyer_name": "Latur Soy Processors Ltd", "commodity": "Soybean", "quantity_needed_kg": 10000,
     "quality_required": "B", "max_price": 4400, "district": "Latur", "reliability_rating": 4.1},
    {"buyer_name": "Vidarbha Pulses Co-op", "commodity": "Tur", "quantity_needed_kg": 8000,
     "quality_required": "B", "max_price": 7200, "district": "Akola", "reliability_rating": 3.9},
    {"buyer_name": "Aurangabad Cotton Mills", "commodity": "Cotton", "quantity_needed_kg": 15000,
     "quality_required": "A", "max_price": 7000, "district": "Aurangabad", "reliability_rating": 4.5},
]


def seed():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # --- Load mandi prices from CSV ---
    count = 0
    with open(CSV_PATH, newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            db.add(MandiPrice(
                commodity=row["commodity"],
                variety=row["variety"],
                market=row["market"],
                district=row["district"],
                date=datetime.date.fromisoformat(row["date"]),
                min_price=float(row["min_price"]),
                max_price=float(row["max_price"]),
                modal_price=float(row["modal_price"]),
                arrival_qty=float(row["arrival_qty"]),
            ))
            count += 1
    db.commit()
    print(f"Seeded {count} mandi price rows")

    # --- Seed demo buyers ---
    for b in DEMO_BUYERS:
        db.add(BuyerDemand(**b))
    db.commit()
    print(f"Seeded {len(DEMO_BUYERS)} buyer demand records")

    db.close()


if __name__ == "__main__":
    seed()
