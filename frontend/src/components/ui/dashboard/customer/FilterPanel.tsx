"use client";

import { useState } from "react";
import { RotateCcw, Check } from "lucide-react";

interface FilterProps {
  onApply: (filters: FilterValues) => void;
  onReset: () => void;
}

export interface FilterValues {
  start_date: string;
  end_date: string;
}

export default function FilterPanel({ onApply, onReset }: FilterProps) {
  const [values, setValues] = useState<FilterValues>({
    start_date: "",
    end_date: "",
  });

  const handleApply = () => {
    onApply(values);
  };

  const handleReset = () => {
    const defaultValues = { company_name: "", start_date: "", end_date: "" };
    setValues(defaultValues);
    onReset();
  };

  return (
    <div className="w-110 p-5 bg-surface border border-white/10 rounded-3xl shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-gold-luxury">
        Filter Data
      </h4>

      <div className="space-y-4">
        {/* Date Range */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 font-bold uppercase">
              Start Date
            </label>
            <input
              type="date"
              className="w-full bg-surface-light border border-surface-accent rounded-xl py-2 px-3 text-[10px] text-foreground outline-none focus:border-gold-luxury/50 transition-all scheme-dark"
              value={values.start_date}
              onChange={(e) =>
                setValues({ ...values, start_date: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 font-bold uppercase">
              End Date
            </label>
            <input
              type="date"
              className="w-full bg-surface-light border border-surface-accent rounded-xl py-2 px-3 text-[10px] text-foreground outline-none focus:border-gold-luxury/50 transition-all scheme-dark"
              value={values.end_date}
              onChange={(e) =>
                setValues({ ...values, end_date: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={handleReset}
          className="flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-bold uppercase tracking-tighter text-zinc-400 hover:text-foreground bg-surface-accent rounded-lg transition-all"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
        <button
          onClick={handleApply}
          className="flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-bold uppercase tracking-tighter bg-gold-luxury text-surface rounded-lg hover:opacity-90 transition-all shadow-lg shadow-gold-luxury/10"
        >
          <Check className="w-3 h-3" /> Apply
        </button>
      </div>
    </div>
  );
}
