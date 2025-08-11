from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import schemas, database
from ..controllers import invoice_controllers

router = APIRouter(prefix="/invoices", tags=["Invoices"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[schemas.InvoiceResponse])
def getInvoices(db: Session = Depends(get_db)):
    return invoice_controllers.get_all_invoices(db)

@router.get("/{id}", response_model=schemas.InvoiceResponse)
def getInvoiceById(id: int, db: Session = Depends(get_db)):
    return invoice_controllers.get_invoice_by_id(id, db)

@router.post("/", response_model=schemas.InvoiceResponse)
def createInvoice(invoice: schemas.InvoiceCreate, db: Session = Depends(get_db)):
    return invoice_controllers.create_invoice(invoice, db)

@router.put("/{id}", response_model=schemas.InvoiceResponse)
def updateInvoice(id: int, invoice: schemas.InvoiceCreate, db: Session = Depends(get_db)):
    return invoice_controllers.update_invoice(id, invoice, db)

@router.delete("/{id}")
def deleteInvoice(id: int, db: Session = Depends(get_db)):
    return invoice_controllers.delete_invoice(id, db)