from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from .database import Base


class MandiPrice(Base):
    """Daily mandi price record - seeded from data/mandi_prices_sample.csv.
    Replace the CSV with real Agmarknet/data.gov.in data before the demo."""
    __tablename__ = "mandi_prices"

    id = Column(Integer, primary_key=True, index=True)
    commodity = Column(String, index=True)
    variety = Column(String)
    market = Column(String)
    district = Column(String, index=True)
    date = Column(Date, index=True)
    min_price = Column(Float)
    max_price = Column(Float)
    modal_price = Column(Float)
    arrival_qty = Column(Float)


class Lot(Base):
    """A produce lot listed by a farmer / FPO."""
    __tablename__ = "lots"

    id = Column(Integer, primary_key=True, index=True)
    seller_name = Column(String)
    commodity = Column(String, index=True)
    quantity_kg = Column(Float)
    quality_grade = Column(String)  # 'A', 'B', 'C'
    district = Column(String, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class BuyerDemand(Base):
    """Seeded demo buyer-demand records used by the matching engine."""
    __tablename__ = "buyer_demand"

    id = Column(Integer, primary_key=True, index=True)
    buyer_name = Column(String)
    commodity = Column(String, index=True)
    quantity_needed_kg = Column(Float)
    quality_required = Column(String)  # minimum acceptable grade
    max_price = Column(Float)
    district = Column(String, index=True)
    reliability_rating = Column(Float)  # 0-5


class Offer(Base):
    """A digital offer made by a buyer against a lot (simplified for MVP)."""
    __tablename__ = "offers"

    id = Column(Integer, primary_key=True, index=True)
    lot_id = Column(Integer, ForeignKey("lots.id"))
    buyer_id = Column(Integer, ForeignKey("buyer_demand.id"))
    offer_price = Column(Float)
    status = Column(String, default="pending")  # pending / accepted / rejected
    created_at = Column(DateTime(timezone=True), server_default=func.now())
