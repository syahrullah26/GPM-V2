"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  FileCheckCorner,
  ChartBar,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { ThemeSwitcher } from "@/components/ui/themeSwitcher";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Customers  ", href: "/customers" },
  { icon: FileText, label: "Penawaran", href: "/quotations" },
  { icon: FileCheckCorner, label: "Order", href: "/orders" },
  { icon: ChartBar, label: "Rugi/Laba", href: "/revenue" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z- p-3.5 bg-surface border border-surface-light rounded-xl shadow-2xl text-foreground transition-all active:scale-90 flex items-center justify-center"
        aria-label="Toggle Menu"
      >
        {isOpen ? (
          <X className="w-6 h-6 animate-in fade-in zoom-in spin-in-90 duration-300" />
        ) : (
          <Menu className="w-6 h-6 animate-in fade-in zoom-in duration-300" />
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z- lg:hidden animate-in fade-in duration-300"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
          fixed left-3 top-3 bottom-3 w-65 bg-surface 
          rounded-xl border border-zinc-200/50 dark:border-white/5 shadow-lg z-
          flex flex-col overflow-hidden transition-all duration-500 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-[110%] lg:translate-x-0"}
        `}
      >
        <div className="p-6 mb-2">
          <div className="bg-surface-light p-2.5 rounded-lg inline-block shadow-md">
            <Image
              src="/purnama.png"
              alt="Logo"
              width={90}
              height={35}
              className="brightness-200"
            />
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all group
                  ${
                    isActive
                      ? "bg-gold-luxury/10 text-gold-luxury font-bold"
                      : "text-foreground hover:text-gold-luxury hover:bg-gold-luxury/5"
                  }
                `}
              >
                <item.icon
                  className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "text-gold-luxury" : ""}`}
                />
                <span className="font-medium text-sm tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-100 dark:border-white/5">
          <ThemeSwitcher />
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all text-sm font-bold">
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
