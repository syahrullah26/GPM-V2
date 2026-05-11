import { Quotation } from "@/types/quotation";
import { axiosInstance } from "@/lib/axios";

export const quotationService = {
  async fetchQuotations(): Promise<Quotation[]> {
    try {
      const response = await axiosInstance.get("/api/quotations");
      return response.data?.data?.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Server Error");
    }
  },
};
