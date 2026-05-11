export interface RecentTransaction {
  type: "Quotation" | "Order";
  id: number;
  number: string;
  date: string;
  status: string;
  grand_total?: string;
}

export interface Customer {
  id: number;
  company_name: string;
  pic_name: string;
  contact: {
    address: string;
    phone: string;
  };
  quotations_count: number;
  orders_count: number;
  recent_transactions: RecentTransaction[];
}

export interface CustomerRequest {
  pic_name: string;
  company_name: string;
  address: string;
  phone: string;
}
