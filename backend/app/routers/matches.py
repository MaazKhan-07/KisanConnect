from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Lot
from ..services.matching import find_matches
from ..schemas import MatchOut

router = APIRouter(prefix="/lots", tags=["matches"])


@router.get("/{lot_id}/matches", response_model=list[MatchOut])
def get_matches_for_lot(lot_id: int, db: Session = Depends(get_db)):
    lot = db.query(Lot).filter(Lot.id == lot_id).first()
    if not lot:
        raise HTTPException(status_code=404, detail="Lot not found")
    return find_matches(db, lot)
