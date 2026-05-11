"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export const ThemeSwitcher = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);
  if (!mounted) return <div className="fixed bottom-6 right-6 w-11 h-11" />;
  const currentTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="flex items-center justify-between w-full px-4 py-3 rounded-xl 
                 bg-zinc-100/50 dark:bg-white/5 border border-zinc-200/50 dark:border-white/10
                 hover:bg-gold-luxury/10 hover:border-gold-luxury/20 transition-all group hover:cursor-pointer"
    >
      <div className="flex items-center gap-3">
        {currentTheme === "dark" ? (
          <Sun className="w-5 h-5 text-gold-luxury animate-pulse" />
        ) : (
          <Moon className="w-5 h-5 text-zinc-500 group-hover:text-gold-luxury" />
        )}
        <span className="text-sm font-bold text-foreground tracking-tight">
          {currentTheme === "dark" ? "Light Mode" : "Dark Mode"}
        </span>
      </div>

      <div className="w-8 h-4 bg-zinc-300 dark:bg-zinc-700 rounded-full relative p-1 transition-colors">
        <div
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            currentTheme === "dark"
              ? "translate-x-4 bg-gold-luxury"
              : "translate-x-0 bg-white"
          }`}
        />
      </div>
    </button>
  );
};
