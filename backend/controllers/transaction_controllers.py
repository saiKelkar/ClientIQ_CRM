from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models import Transaction
import schemas

def get_all_transactions(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Transaction).offset(skip).limit(limit).all()


def get_transaction_by_id(id: int, db: Session):
    transaction = db.query(Transaction).filter(Transaction.id == id).first()
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Transaction with ID {id} not found"
        )
    return transaction


def create_transaction(transaction_data: schemas.TransactionCreate, db: Session):
    new_transaction = Transaction(
        amount_invested=transaction_data.amount_invested,
        payment_method=transaction_data.payment_method,
        payment_status=transaction_data.payment_status,
        contact_id=transaction_data.contact_id,
        customer_id=transaction_data.customer_id
    )
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    return new_transaction


def update_transaction(id: int, transaction_data: schemas.TransactionCreate, db: Session):
    transaction = db.query(Transaction).filter(Transaction.id == id).first()
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Transaction with ID {id} not found"
        )

    transaction.amount_invested = transaction_data.amount_invested
    transaction.payment_method = transaction_data.payment_method
    transaction.payment_status = transaction_data.payment_status
    transaction.contact_id = transaction_data.contact_id
    transaction.customer_id = transaction_data.customer_id

    db.commit()
    db.refresh(transaction)
    return transaction


def delete_transaction(id: int, db: Session):
    transaction = db.query(Transaction).filter(Transaction.id == id).first()
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Transaction with ID {id} not found"
        )
    db.delete(transaction)
    db.commit()
    return {"message": f"Transaction with ID {id} deleted successfully"}
