// Users
export interface UserCreate {
  name: string;
  email: string;
  password: string;
  role: "admin" | "staff";
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: "admin" | "staff";
  created_at?: string;
  updated_at?: string;
}

// Contacts
export interface ContactCreate {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

export interface ContactResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

// Customers
export interface CustomerCreate {
  negotiated_value: number;
  closing_date?: string;
  contact_id: number;
  converted_by_staff_id: number;
}

export interface CustomerResponse {
  id: number;
  negotiated_value: number;
  closing_date?: string;
  contact: ContactResponse;
  converted_by_staff: UserResponse;
}

// Leads
export interface LeadCreate {
  prospect_type: "opportunity" | "lead";
  estimated_value: number;
  potential_investment: number;
  stage: "initiated" | "in_progress" | "finalized" | "closed_lost" | "closed_won";
  contact_id: number;
  customer_id?: number;
}

export interface LeadResponse {
  id: number;
  prospect_type: "opportunity" | "lead";
  estimated_value: number;
  potential_investment: number;
  stage: "initiated" | "in_progress" | "finalized" | "closed_lost" | "closed_won";
  contact: ContactResponse;
  customer?: CustomerResponse;
}

// Transactions
export interface TransactionCreate {
  amount_invested: number;
  payment_method: "credit_card" | "debit_card" | "bank_transfer" | "paypal" | "cheque";
  payment_status: "pending" | "completed" | "failed" | "refunded";
  contact_id: number;
  customer_id: number;
}

export interface TransactionResponse {
  id: number;
  amount_invested: number;
  payment_method: "credit_card" | "debit_card" | "bank_transfer" | "paypal" | "cheque";
  payment_status: "pending" | "completed" | "failed" | "refunded";
  contact: ContactResponse;
  customer: CustomerResponse;
}
