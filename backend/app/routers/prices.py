from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import MandiPrice
from ..services.trend import compute_trend
from ..services.advisory import generate_advisory
from ..schemas import PriceTrendOut

router = APIRouter(prefix="/prices", tags=["prices"])


@router.get("/", response_model=list[PriceTrendOut])
def list_all_price_trends(db: Session = Depends(get_db)):
    """Dashboard endpoint: trend + advisory for every commodity in the DB."""
    pairs = (
        db.query(MandiPrice.commodity, MandiPrice.district)
        .distinct()
        .all()
    )
    # de-dup (commodity, district) pairs
    seen = set()
    out = []
    for commodity, district in pairs:
        key = (commodity, district)
        if key in seen:
            continue
        seen.add(key)
        trend = compute_trend(db, commodity, district)
        if not trend:
            continue
        trend["advisory_message"] = generate_advisory(
            commodity, trend["trend_direction"], trend["trend_pct"]
        )
        out.append(trend)
    return out


@router.get("/{commodity}/{district}", response_model=PriceTrendOut)
def get_price_trend(commodity: str, district: str, db: Session = Depends(get_db)):
    trend = compute_trend(db, commodity, district)
    if not trend:
        raise HTTPException(status_code=404, detail="No price data for this commodity/district")
    trend["advisory_message"] = generate_advisory(
        commodity, trend["trend_direction"], trend["trend_pct"]
    )
    return trend
