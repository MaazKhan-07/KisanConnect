from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class PriceTrendOut(BaseModel):
    commodity: str
    market: str
    district: str
    latest_date: date
    latest_modal_price: float
    trend_direction: str        # "up" / "down" / "stable"
    trend_pct: float
    advisory_message: str

    class Config:
        from_attributes = True


class LotCreate(BaseModel):
    seller_name: str
    commodity: str
    quantity_kg: float
    quality_grade: str
    district: str


class LotOut(LotCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class MatchOut(BaseModel):
    buyer_id: int
    buyer_name: str
    match_score: float
    reasons: list[str]
    district: str
    max_price: float
    reliability_rating: float
