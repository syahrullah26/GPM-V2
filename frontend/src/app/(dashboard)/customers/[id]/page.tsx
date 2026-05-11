"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  User,
  MapPin,
  Phone,
  Calendar,
  FileText,
  Package,
  Loader2,
} from "lucide-react";
import { customerService } from "@/service/customerService";
import { Customer } from "@/types/customer";
import { toast } from "sonner";
import { formatRupiah } from "@/utils/helper";

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  const recentTransactions = customer?.recent_transactions || [];

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id || id === "undefined") return;
      try {
        setLoading(true);
        const data = await customerService.fetchCustomer(id);
        setCustomer(data);
      } catch (err: any) {
        toast.error("Gagal memuat detail pelanggan", {
          description: err.message,
        });
        router.push("/customers");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-gold-luxury" />
      </div>
    );
  }

  if (!customer) return null;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gold-luxury hover:text-foreground cursor-pointer transition-colors group"
        >
          <div className="p-2 rounded-full group-hover:bg-white/5 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest">
            Back
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface border border-foreground/30 rounded-3xl p-8 overflow-hidden relative shadow-2xl">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-gold-luxury/10 blur-[80px] rounded-full" />

            <div className="relative space-y-6">
              <div className="w-16 h-16 bg-gold-luxury/10 border border-gold-luxury/20 rounded-2xl flex items-center justify-center">
                <Building2 className="w-8 h-8 text-gold-luxury" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight leading-tight">
                  {customer.company_name}
                </h1>
                <div className="flex items-center gap-2 mt-2 text-zinc-400">
                  <User className="w-3 h-3" />
                  <span className="text-sm font-semibold italic">
                    {customer.pic_name}
                  </span>
                </div>
              </div>

              <div className="pt-6 border-t border-surface-light space-y-4">
                <div className="flex gap-4">
                  <div className="p-2 bg-surface-accent rounded-lg h-fit">
                    <MapPin className="w-4 h-4 text-zinc-500" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-fore tracking-tighter">
                      Address
                    </p>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {customer.contact?.address}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="p-2 bg-surface-accent rounded-lg h-fit">
                    <Phone className="w-4 h-4 text-zinc-500" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-zinc-600 tracking-tighter">
                      Phone Number
                    </p>
                    <p className="text-sm font-mono text-gold-luxury">
                      {customer.contact?.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface border border-foreground/30 p-6 rounded-3xl shadow-2xl flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-2xl">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {customer.quotations_count || 0}
                </p>
                <p className="text-xs text-zinc-500 font-medium">
                  Total Quotations
                </p>
              </div>
            </div>

            <div className="bg-surface border border-foreground/30 p-6 rounded-3xl flex items-center gap-4 shadow-2xl">
              <div className="p-3 bg-emerald-500/10 rounded-2xl">
                <Package className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {customer.orders_count || 0}
                </p>
                <p className="text-xs text-zinc-500 font-medium">
                  Active Orders
                </p>
              </div>
            </div>
          </div>
          <div className="bg-surface border border-white/5 rounded-3xl p-6 min-h-75">
            <h3 className="text-sm font-bold flex items-center gap-2 mb-6">
              <Calendar className="w-4 h-4 text-gold-luxury" />
              Recent Transactions
            </h3>

            {recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {recentTransactions.map((tx) => (
                  <div
                    key={`${tx.type}-${tx.id}`}
                    className="flex items-center justify-between p-4 rounded-2xl bg-surface border border-foreground/30 hover:bg-surface-light shadow-lg  transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-xl ${
                          tx.type === "Quotation"
                            ? "bg-blue-500/10 text-blue-500"
                            : "bg-emerald-500/10 text-emerald-500"
                        }`}
                      >
                        {tx.type === "Quotation" ? (
                          <FileText className="w-4 h-4" />
                        ) : (
                          <Package className="w-4 h-4" />
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-bold text-foreground leading-none">
                          {tx.number}
                        </p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
                          {tx.type}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">
                        {tx.type === "Order"
                          ? formatRupiah(Number(tx.grand_total ?? 0))
                          : "-"}
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-1">
                        {tx.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-zinc-600">
                <p className="text-xs italic">
                  Belum ada transaksi tercatat untuk customer ini.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
