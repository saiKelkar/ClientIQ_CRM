from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional
from decimal import Decimal
from enum import Enum

# Enums
class UserRole(str, Enum):
    admin = 'admin'
    staff = 'staff'


class DealProspect(str, Enum):
    opportunity = 'opportunity'
    lead = 'lead'


class DealStage(str, Enum):
    initiated = 'initiated'
    in_progress = 'in_progress'
    finalized = 'finalized'
    closed_lost = 'closed_lost'
    closed_won = 'closed_won'


class PaymentMethod(str, Enum):
    credit_card = 'credit_card'
    debit_card = 'debit_card'
    bank_transfer = 'bank_transfer'
    paypal = 'paypal'
    cheque = 'cheque'


class PaymentStatus(str, Enum):
    pending = 'pending'
    completed = 'completed'
    failed = 'failed'
    refunded = 'refunded'


# Users
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole

class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: UserRole
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Contacts
class ContactCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None


class ContactResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None

    class Config:
        from_attributes = True


# Customers
class CustomerCreate(BaseModel):
    negotiated_value: Decimal
    closing_date: Optional[datetime] = None
    contact_id: int
    converted_by_staff_id: int


class CustomerResponse(BaseModel):
    id: int
    negotiated_value: Decimal
    closing_date: Optional[datetime] = None
    contact: ContactResponse
    converted_by_staff: UserResponse

    class Config:
        from_attributes = True


# Leads
class LeadCreate(BaseModel):
    prospect_type: DealProspect
    estimated_value: Decimal
    potential_investment: Decimal
    stage: DealStage
    contact_id: int
    customer_id: Optional[int] = None


class LeadResponse(BaseModel):
    id: int
    prospect_type: DealProspect
    estimated_value: Decimal
    potential_investment: Decimal
    stage: DealStage
    contact: ContactResponse
    customer: Optional[CustomerResponse] = None

    class Config:
        from_attributes = True


# Transactions
class TransactionCreate(BaseModel):
    amount_invested: Decimal
    payment_method: PaymentMethod
    payment_status: PaymentStatus
    contact_id: int
    customer_id: int


class TransactionResponse(BaseModel):
    id: int
    amount_invested: Decimal
    payment_method: PaymentMethod
    payment_status: PaymentStatus
    contact: ContactResponse
    customer: CustomerResponse

    class Config:
        from_attributes = True