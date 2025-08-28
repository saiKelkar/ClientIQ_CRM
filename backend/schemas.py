from datetime import datetime, date
from decimal import Decimal
from pydantic import BaseModel, EmailStr
from enum import Enum
from typing import Optional

# Timestamp Response
class TimestampedResponse(BaseModel):
    id: int
    created_at: datetime
    updated_at: datetime | None

    class Config:
        from_attributes = True

# User Authentication
class UserRole(str, Enum):
    admin = "admin"
    staff = "staff"

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    role: UserRole

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    role: UserRole

    class Config:
        from_attributes = True

# Customer
class CustomerCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    company: str

class CustomerResponse(CustomerCreate, TimestampedResponse):
    pass

# Deals
class DealStage(str, Enum):
    new = "new"
    qualified = "qualified"
    proposal = "proposal"
    negotiation = "negotiation"
    won = "won"
    lost = "lost"

class DealCreate(BaseModel):
    title: str
    stage: DealStage
    value: Decimal
    owner_id: int
    customer_id: int

class DealResponse(DealCreate, TimestampedResponse):
    pass

# Projects
class ProjectStage(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"

class ProjectCreate(BaseModel):
    customer_id: int
    name: str
    status: ProjectStage
    budget: Decimal

class ProjectResponse(ProjectCreate):
    id: int
    start_date: Optional[str] = None
    end_date: Optional[str] = None

    class Config:
        from_attributes = True
        json_encoders = {
            Decimal: float
        }

# Tickets
class TicketStage(str, Enum):
    open = "open"
    in_progress = "in_progress"
    closed = "closed"

class TicketPriority(str, Enum):
    high = "high"
    medium = "medium"
    low = "low"

class TicketCreate(BaseModel):
    customer_id: int
    subject: str
    description: str
    status: TicketStage
    priority: TicketPriority

class TicketResponse(TicketCreate, TimestampedResponse):
    pass

# Invoices
class InvoiceStage(str, Enum):
    paid = "paid"
    unpaid = "unpaid"
    overdue = "overdue"

class InvoiceCreate(BaseModel):
    customer_id: int
    amount: Decimal
    status: InvoiceStage
    due_date: datetime

class InvoiceResponse(InvoiceCreate, TimestampedResponse):
    pass