"use client";
import { useState, useEffect } from "react";
import { Filter, Search, Plus } from "lucide-react";
import TableData from "@/components/ui/TableData";

import { QuotationsColumns } from "@/constants/DataTable";

import { quotationService } from "@/service/quotationService";
import { Quotation } from "@/types/quotation";

export default function Quotations() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        setLoading(true);
        const data = await quotationService.fetchQuotations();
        setQuotations(data);
      } catch (err: any) {
        setError(err.message || "Gagal memuat data pelanggan");
      } finally {
        setLoading(false);
      }
    };
    fetchQuotations();
  }, []);

  const filteredData = quotations.filter((item) => {
    const quotation_number = item.quotation_number
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const company_name = item.customers?.company_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const quotation_items = item.items.some((quotationItem) => {
      return quotationItem.item_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
    return quotation_number || company_name || quotation_items;
  });
  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              Quotations
            </h1>
            <p className="text-xs text-zinc-500 font-medium">
              Manage and monitor your quotations
            </p>
          </div>
          <button className="flex items-center gap-2 bg-gold-luxury text-black px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all">
            <Plus className="w-4 h-4" /> Add Quotations
          </button>
        </div>
        <div className="bg-white dark:bg-surface rounded-4xl shadow-sm border border-zinc-100 dark:border-white/5 overflow-hidden">
          <div className="p-4 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 dark:border-white/5">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-all border border-zinc-200/50 dark:border-white/10">
                <Filter className="w-4 h-4" /> Filter
              </button>
              <div className="h-6 w-px bg-zinc-200 dark:bg-white/10 mx-1" />
            </div>

            <div className="relative group flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-gold-luxury transition-colors" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface-light border border-surface rounded-xl text-xs focus:outline-none focus:border-gold-luxury/50 transition-all"
              />
            </div>
          </div>
          {error ? (
            <div className="p-20 text-center text-red-500 font-bold">
              {error}
            </div>
          ) : (
            <TableData
              columns={QuotationsColumns}
              data={filteredData}
              loading={loading}
            />
          )}
        </div>
      </div>
    </>
  );
}
