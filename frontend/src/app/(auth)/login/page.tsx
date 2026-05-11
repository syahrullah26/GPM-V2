"use client";

import React, { useState } from "react";
import Image from "next/image";
import { authService } from "@/service/authService";
import { useRouter } from "next/navigation";
import { ThemeSwitcher } from "@/components/ui/themeSwitcher";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.login({ email, password });
      router.push("/dashboard");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl min-h-150 grid lg:grid-cols-12 gap-6 p-2">
      <div
        data-aos="fade-right"
        className="hidden lg:flex lg:col-span-7 bg-surface rounded-[2.5rem] p-12 flex-col justify-between border border-black/50 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-[-20%] right-[-20%] w-87,5 h-87.5 bg-gold-luxury/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-62.5 h-62.5 bg-gold-luxury/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 ">
          <div className="mb-10 flex items-center space-y-4 py-4 px-4 backdrop-blur-3xl rounded-2xl bg-surface-light ">
            <Image
              src="/purnama.png"
              alt="GPM Logo"
              width={160}
              height={65}
              className="w-full object-contain 
             transition-all duration-300
             opacity-100 
             dark:opacity-90 dark:brightness-110
             "
            />
          </div>
          <h2 className="text-5xl font-extrabold text-foreground leading-tight tracking-tight">
            PT Gangsar <br />
            <span className="text-gold-luxury bg-linear-to-r from-gold-luxury via-gold-soft to-gold-luxury bg-clip-text text-transparent">
              Purnama Mandiri.
            </span>
          </h2>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-foreground/25 pt-6">
          <p className="text-zinc-500 text-sm">
            © 2026 GPM Global System. All Rights Reserved.
          </p>
        </div>
      </div>

      <div
        data-aos="fade-left"
        className="lg:col-span-5 bg-surface rounded-[2.5rem] p-8 lg:p-12 shadow-2xl flex flex-col justify-center border border-black/50 transition-colors duration-500"
      >
        <div className="mb-10 lg:hidden flex justify-center">
          <Image
            src="/purnama.png"
            alt="Logo"
            width={180}
            height={75}
            className="dark:brightness-0 dark:invert object-contain"
          />
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Welcome Back
          </h1>
          <p className="text-steel-gray mt-2 font-medium">
            Masuk untuk melanjutkan ke GPM System.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-steel-gray">
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@gpm.com"
              className="w-full bg-surface-light border border-surface px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-gold-luxury text-foreground transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-widest text-steel-gray">
                Password
              </label>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-surface-light border border-surface px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-gold-luxury text-foreground transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-deep-black dark:bg-gold-luxury text-white dark:text-zinc-950 py-4.5 rounded-2xl font-bold text-lg hover:shadow-[0_10px_25px_rgba(212,175,55,0.25)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Authenticating...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <div className="flex justify-center items-center mt-4 gap-2">
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
}
