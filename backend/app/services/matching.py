"""
Rule-based farmer<->buyer matching engine.
Explainable by design: every match shows WHY it scored the way it did,
which plays much better in a live demo than an unexplained ML score.
"""
from sqlalchemy.orm import Session
from ..models import BuyerDemand, Lot

GRADE_RANK = {"A": 3, "B": 2, "C": 1}


def find_matches(db: Session, lot: Lot):
    buyers = (
        db.query(BuyerDemand).filter(BuyerDemand.commodity == lot.commodity).all()
    )
    results = []

    for b in buyers:
        score = 0
        reasons = []

        # Location match
        if b.district == lot.district:
            score += 40
            reasons.append(f"Same district ({lot.district})")
        else:
            score += 15
            reasons.append(f"Different district ({b.district})")

        # Quality match
        lot_rank = GRADE_RANK.get(lot.quality_grade, 1)
        req_rank = GRADE_RANK.get(b.quality_required, 1)
        if lot_rank >= req_rank:
            score += 30
            reasons.append(f"Grade {lot.quality_grade} meets requirement (min {b.quality_required})")
        else:
            score += 5
            reasons.append(f"Grade {lot.quality_grade} below requirement (min {b.quality_required})")

        # Quantity fit
        if lot.quantity_kg >= b.quantity_needed_kg:
            score += 15
            reasons.append("Quantity fully covers buyer's need")
        else:
            partial = round((lot.quantity_kg / b.quantity_needed_kg) * 100)
            score += round(15 * (partial / 100))
            reasons.append(f"Covers ~{partial}% of buyer's need")

        # Reliability
        score += b.reliability_rating * 3  # up to 15 pts for a 5.0 rating
        reasons.append(f"Buyer rating {b.reliability_rating}/5")

        results.append({
            "buyer_id": b.id,
            "buyer_name": b.buyer_name,
            "match_score": round(min(score, 100), 1),
            "reasons": reasons,
            "district": b.district,
            "max_price": b.max_price,
            "reliability_rating": b.reliability_rating,
        })

    results.sort(key=lambda r: r["match_score"], reverse=True)
    return results
