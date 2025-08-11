from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import schemas, database
from ..controllers import deal_controllers

router = APIRouter(prefix="/deals", tags=["Deals"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[schemas.DealResponse])
def getDeals(db: Session = Depends(get_db)):
    return deal_controllers.get_all_deals(db)

@router.get("/{id}", response_model=schemas.DealResponse)
def getDealById(id: int, db: Session = Depends(get_db)):
    return deal_controllers.get_deal_by_id(id, db)

@router.post("/", response_model=schemas.DealResponse)
def createDeal(deal: schemas.DealCreate, db: Session = Depends(get_db)):
    return deal_controllers.create_deal(deal, db)

@router.put("/{id}", response_model=schemas.DealResponse)
def updateDeal(id: int, deal: schemas.DealCreate, db: Session = Depends(get_db)):
    return deal_controllers.update_deal(id, deal, db)

@router.delete("/{id}")
def deleteDeal(id: int, db: Session = Depends(get_db)):
    return deal_controllers.delete_deal(id, db)