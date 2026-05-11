import { Customer } from "./customer";

export type QuotationStatus = "pending" | "approved" | "rejected";

export interface QuotationItem {
  id: number;
  quotation_id: number;
  item_name: string;
  quantity: number;
  unit: string;
  price: number;
  cost_price: number;
  subtotal: number;
  formatted_price: string;
  formatted_cost_price: string;
  formatted_subtotal: string;
}

export interface Quotation {
  id: number;
  quotation_number: string;
  customer_id: number;
  date: string;
  status: QuotationStatus;
  items: QuotationItem[];
  customers: Customer;
}
