"use client";

import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import Sidebar from "@/components/ui/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out-back",
    });
    AOS.refresh();
  }, []);
  if (!mounted) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      <Sidebar />
      <main className="lg:pl-71.25 p-3 pt-20 lg:pt-3 min-h-screen transition-all duration-500">
        <div className="bg-surface rounded-xl min-h-[calc(100vh-24px)] border border-zinc-200/50 dark:border-white/5 shadow-sm p-6 lg:p-10 transition-colors duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
