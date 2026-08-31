"""
Price trend logic — intentionally simple and explainable for a 5-hour build.
Compares the average modal price of the last 7 days vs. the previous 7 days.
This is a transparent, defensible "AI-assisted" signal, not a black box.

Swap this out for Prophet/ARIMA/XGBoost later (see the full research doc) —
but for the hackathon, reliability and explainability beat model complexity.
"""
from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import timedelta
from ..models import MandiPrice


def compute_trend(db: Session, commodity: str, district: str):
    rows = (
        db.query(MandiPrice)
        .filter(MandiPrice.commodity == commodity, MandiPrice.district == district)
        .order_by(desc(MandiPrice.date))
        .limit(14)
        .all()
    )
    if not rows:
        return None

    rows = sorted(rows, key=lambda r: r.date)  # oldest -> newest
    last7 = rows[-7:] if len(rows) >= 7 else rows
    prev7 = rows[-14:-7] if len(rows) >= 14 else rows[: max(len(rows) - 7, 0)]

    avg_last7 = sum(r.modal_price for r in last7) / len(last7)
    avg_prev7 = sum(r.modal_price for r in prev7) / len(prev7) if prev7 else avg_last7

    if avg_prev7 == 0:
        pct_change = 0.0
    else:
        pct_change = round(((avg_last7 - avg_prev7) / avg_prev7) * 100, 1)

    if pct_change > 2:
        direction = "up"
    elif pct_change < -2:
        direction = "down"
    else:
        direction = "stable"

    latest = rows[-1]
    return {
        "commodity": commodity,
        "market": latest.market,
        "district": district,
        "latest_date": latest.date,
        "latest_modal_price": latest.modal_price,
        "trend_direction": direction,
        "trend_pct": pct_change,
    }
