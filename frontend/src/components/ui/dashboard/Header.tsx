"use client";

import React from "react";
import { Bell } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const user = {
    name: "Muhammad Syahrullah",
    role: "Web Developer",
    avatar: "/purnama.png",
  };

  return (
    <header className="flex items-center justify-end px-4 py-4 mb-2 relative z-10">
      {/* Sisi Kanan: Notif & Avatar */}
      <div className="flex items-center gap-2 md:gap-6" data-aos="fade-left">
        {/* Notification Icon */}
        <button className="relative p-2.5 bg-surface border border-surface-light rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-all group">
          <Bell className="w-4 h-4 md:w-5 md:h-5 text-zinc-600 dark:text-zinc-300 group-hover:text-gold-luxury" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 border-2 border-surface rounded-full"></span>
        </button>

        {/* User Avatar & Info */}
        <div className="flex items-center gap-3 pl-2 border-l border-zinc-200 dark:border-white/10">
          <div className="hidden sm:block text-right">
            <p className="text-xs md:text-sm font-bold text-foreground leading-none whitespace-nowrap">
              {user.name}
            </p>
          </div>
          <div className="relative w-9 h-9 md:w-11 md:h-11 rounded-xl overflow-hidden border-2 border-surface-light shadow-md hover:border-gold-luxury transition-colors cursor-pointer">
            <Image
              src={user.avatar}
              alt="User Avatar"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
