import { axiosInstance } from "@/lib/axios";
import { Customer, CustomerRequest } from "@/types/customer";
import { AxiosError } from "axios"; // Import tipe AxiosError

interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: {
    data: T;
  };
}

export const customerService = {
  async fetchCustomers(): Promise<Customer[]> {
    try {
      const { data } =
        await axiosInstance.get<ApiResponse<Customer[]>>("/api/customers");
      return data.data?.data || [];
    } catch (error) {
      return this.handleError(error);
    }
  },

  async fetchCustomer(id: string | number): Promise<Customer> {
    try {
      const response = await axiosInstance.get(`/api/customers/${id}`);
      const result = response.data;

      if (!result.status) {
        throw new Error(result.message || "Gagal mengambil data");
      }

      return result.data;
    } catch (error) {
      return this.handleError(error);
    }
  },

  async createCustomer(payload: CustomerRequest): Promise<Customer> {
    try {
      const { data } = await axiosInstance.post<ApiResponse<Customer>>(
        "/api/customers",
        payload,
      );

      if (!data.status) {
        throw new Error(data.message || "Gagal membuat customer");
      }

      return data.data?.data;
    } catch (error) {
      return this.handleError(error);
    }
  },

  async updateCustomer(
    id: string,
    payload: CustomerRequest,
  ): Promise<Customer> {
    try {
      const { data } = await axiosInstance.put<ApiResponse<Customer>>(
        `/api/customers/${id}`,
        payload,
      );

      if (!data.status) {
        throw new Error(data.message || "Gagal mengupdate customer");
      }

      return data.data?.data;
    } catch (error) {
      return this.handleError(error);
    }
  },
  async deleteCustomer(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/api/customers/${id}`);
    } catch (error) {
      return this.handleError(error);
    }
  },
  handleError(error: unknown): never {
    let message = "Server Error";

    if (error instanceof AxiosError) {
      message = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    console.error("API Service Error:", message);
    throw new Error(message);
  },
};
