from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Lot
from ..schemas import LotCreate, LotOut

router = APIRouter(prefix="/lots", tags=["lots"])


@router.post("/", response_model=LotOut)
def create_lot(lot: LotCreate, db: Session = Depends(get_db)):
    db_lot = Lot(**lot.dict())
    db.add(db_lot)
    db.commit()
    db.refresh(db_lot)
    return db_lot


@router.get("/", response_model=list[LotOut])
def list_lots(db: Session = Depends(get_db)):
    return db.query(Lot).order_by(Lot.created_at.desc()).all()


@router.get("/{lot_id}", response_model=LotOut)
def get_lot(lot_id: int, db: Session = Depends(get_db)):
    lot = db.query(Lot).filter(Lot.id == lot_id).first()
    if not lot:
        raise HTTPException(status_code=404, detail="Lot not found")
    return lot
