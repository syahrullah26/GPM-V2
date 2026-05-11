import { axiosInstance } from "../lib/axios";
import { setCookie, deleteCookie } from "cookies-next";

export const authService = {
  async login(credentials: { email: string; password: string }) {
    try {
      const response = await axiosInstance.post("/api/login", credentials);
      const { data } = response;

      if (data.status && data.token) {
        setCookie("auth_token", data.token, {
          maxAge: 60 * 60 * 12,
          path: "/",
        });
        setCookie("user_name", data.user.name);
        setCookie("user_avatar", data.user.avatar || "");

        return data;
      }

      throw new Error(data.message || "Login gagal");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Terjadi kesalahan pada server";
      throw new Error(message);
    }
  },

  async logout() {
    try {
      await axiosInstance.post("/api/logout");
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      deleteCookie("auth_token");
      deleteCookie("user_name");
      deleteCookie("user_avatar");
      window.location.href = "/login";
    }
  },
};
