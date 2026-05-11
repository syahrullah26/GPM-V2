import { axiosInstance } from "../lib/axios";
import { Order } from "@/types/order";

export const orderService = {
  async fetchOrders(): Promise<Order[]> {
    try {
      const response = await axiosInstance.get("/api/orders");
      return response.data?.data?.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Server Error");
    }
  },
};
