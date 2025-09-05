import axios from "axios";
import type { AxiosResponse } from "axios";
import type {
  UserCreate,
  UserLogin,
  UserResponse,
  ContactCreate,
  ContactResponse,
  CustomerCreate,
  CustomerResponse,
  LeadCreate,
  LeadResponse,
  TransactionCreate,
  TransactionResponse
} from "./types";

// Axios instance
const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  withCredentials: true, 
});

// ---- Users ----
export const signupUser = (data: UserCreate): Promise<AxiosResponse<UserResponse>> =>
  api.post("/auth/signup", data);

export const loginUser = (data: UserLogin): Promise<AxiosResponse<any>> =>
  api.post("/auth/login", data);

export const logoutUser = (): Promise<AxiosResponse<any>> => api.post("/auth/logout");
export const getDashboard = (): Promise<AxiosResponse<any>> => api.get("/auth/dashboard");

// ---- Contacts ----
export const getContacts = (params?: object): Promise<AxiosResponse<ContactResponse[]>> =>
  api.get("/contacts", { params });

export const getContact = (id: number): Promise<AxiosResponse<ContactResponse>> =>
  api.get(`/contacts/${id}`);

export const createContact = (data: ContactCreate): Promise<AxiosResponse<ContactResponse>> =>
  api.post("/contacts", data);

export const updateContact = (id: number, data: ContactCreate): Promise<AxiosResponse<ContactResponse>> =>
  api.put(`/contacts/${id}`, data);

export const deleteContact = (id: number): Promise<AxiosResponse<any>> =>
  api.delete(`/contacts/${id}`);

// ---- Customers ----
export const getCustomers = (params?: object): Promise<AxiosResponse<CustomerResponse[]>> =>
  api.get("/customers", { params });

export const getCustomer = (id: number): Promise<AxiosResponse<CustomerResponse>> =>
  api.get(`/customers/${id}`);

export const createCustomer = (data: CustomerCreate): Promise<AxiosResponse<CustomerResponse>> =>
  api.post("/customers", data);

export const updateCustomer = (id: number, data: CustomerCreate): Promise<AxiosResponse<CustomerResponse>> =>
  api.put(`/customers/${id}`, data);

export const deleteCustomer = (id: number): Promise<AxiosResponse<any>> =>
  api.delete(`/customers/${id}`);

// ---- Leads ----
export const getLeads = (params?: object): Promise<AxiosResponse<LeadResponse[]>> =>
  api.get("/leads", { params });

export const getLead = (id: number): Promise<AxiosResponse<LeadResponse>> =>
  api.get(`/leads/${id}`);

export const createLead = (data: LeadCreate): Promise<AxiosResponse<LeadResponse>> =>
  api.post("/leads", data);

export const updateLead = (id: number, data: LeadCreate): Promise<AxiosResponse<LeadResponse>> =>
  api.put(`/leads/${id}`, data);

export const deleteLead = (id: number): Promise<AxiosResponse<any>> =>
  api.delete(`/leads/${id}`);

// ---- Transactions ----
export const getTransactions = (params?: object): Promise<AxiosResponse<TransactionResponse[]>> =>
  api.get("/transactions", { params });

export const getTransaction = (id: number): Promise<AxiosResponse<TransactionResponse>> =>
  api.get(`/transactions/${id}`);

export const createTransaction = (data: TransactionCreate): Promise<AxiosResponse<TransactionResponse>> =>
  api.post("/transactions", data);

export const updateTransaction = (id: number, data: TransactionCreate): Promise<AxiosResponse<TransactionResponse>> =>
  api.put(`/transactions/${id}`, data);

export const deleteTransaction = (id: number): Promise<AxiosResponse<any>> =>
  api.delete(`/transactions/${id}`);

export default api;
