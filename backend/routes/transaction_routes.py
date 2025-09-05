from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

import database
import schemas
from controllers import transaction_controllers

router = APIRouter(prefix="/transactions", tags=["Transactions"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[schemas.TransactionResponse])
def get_transactions(skip: int = Query(0, ge=0), limit: int = Query(10, ge=1), db: Session = Depends(get_db)):
    return transaction_controllers.get_all_transactions(db, skip, limit)


@router.get("/{id}", response_model=schemas.TransactionResponse)
def get_transaction_by_id(id: int, db: Session = Depends(get_db)):
    return transaction_controllers.get_transaction_by_id(id, db)


@router.post("/", response_model=schemas.TransactionResponse)
def create_transaction(transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    return transaction_controllers.create_transaction(transaction, db)


@router.put("/{id}", response_model=schemas.TransactionResponse)
def update_transaction(id: int, transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    return transaction_controllers.update_transaction(id, transaction, db)


@router.delete("/{id}")
def delete_transaction(id: int, db: Session = Depends(get_db)):
    return transaction_controllers.delete_transaction(id, db)
