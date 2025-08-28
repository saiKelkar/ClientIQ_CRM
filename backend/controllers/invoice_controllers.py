from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models import Invoice
import schemas

def get_all_invoices(db: Session):
    return db.query(Invoice).all()

def get_invoice_by_id(id: int, db: Session):
    invoice = db.query(Invoice).filter(Invoice.id == id).first()
    if not invoice:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Invoice with ID {id} not found")
    return invoice

def create_invoice(invoice_data: schemas.InvoiceCreate, db: Session):
    new_invoice = Invoice(
        customer_id = invoice_data.customer_id,
        amount = invoice_data.amount,
        status = invoice_data.status,
        due_date = invoice_data.due_date
    )
    db.add(new_invoice)
    db.commit()
    db.refresh(new_invoice)
    return new_invoice

def update_invoice(id: int, invoice_data: schemas.InvoiceCreate, db: Session):
    invoice = db.query(Invoice).filter(Invoice.id == id).first()
    if not invoice:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Invoice with ID {id} not found")
    invoice.customer_id = invoice_data.customer_id
    invoice.amount = invoice_data.amount
    invoice.status = invoice_data.status
    invoice.due_date = invoice_data.due_date

    db.commit()
    db.refresh(invoice)
    return invoice

def delete_invoice(id: int, db: Session):
    invoice = db.query(Invoice).filter(Invoice.id == id).first()
    if not invoice:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Invoice with ID {id} not found")
    db.delete(invoice)
    db.commit()
    return { "message": f"Invoice with ID {id} deleted successfully" }