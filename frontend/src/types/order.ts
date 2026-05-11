export type orderStatus = "pending" | "done";
export type invoiceStatus = "unpaid" | "paid";

export interface Price {
  selling_price: number;
  cost_price: number;
  formatted_selling_price: string;
  formatted_cost_price: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  item_name: string;
  quantity: number;
  unit: string;
  price: Price;
  subtotal: number;
  formated_subtotal: string;
}
export interface Invoice {
  id: number;
  order_id: number;
  invoice_number: string;
  subtotal: number;
  formated_subtotal: string;
  is_taxable: boolean;
  tax_rate: number;
  formated_tax_rate: string;
  tax_amount: number;
  formated_tax_amount: string;
  grand_total: number;
  formated_grand_total: string;
  status: invoiceStatus;
}

export interface Customer {
  id: number;
  company_name: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer_id: number;
  order_date: string;
  status: orderStatus;
  items: OrderItem[];
  invoices: Invoice;
  customers: Customer;
}
