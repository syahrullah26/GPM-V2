"use client";

import { useParams, useRouter } from "next/navigation";
import { customerService } from "@/service/customerService";
import { CustomerRequest } from "@/types/customer";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Save, Building2 } from "lucide-react";

export default function EditCustomerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Inisialisasi form kosong terlebih dahulu
  const [formData, setFormData] = useState<CustomerRequest>({
    pic_name: "",
    company_name: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!id || id === "undefined") return;
      try {
        setLoading(true);
        const data = await customerService.fetchCustomer(id);

        // Isi form dengan data yang didapat dari API
        setFormData({
          pic_name: data.pic_name,
          company_name: data.company_name,
          address: data.contact?.address || "",
          phone: data.contact?.phone || "",
        });
      } catch (err: any) {
        toast.error("Gagal memuat data pelanggan", {
          description: err.message,
        });
        router.push("/customers");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await customerService.updateCustomer(id, formData);

      toast.success("Perubahan Disimpan", {
        description: `${formData.company_name} telah diperbarui.`,
      });
      router.push("/customers");
    } catch (err: any) {
      toast.error("Gagal memperbarui data", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-gold-luxury" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gold-luxury cursor-pointer hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-bold uppercase cursor-pointer  tracking-widest">
            Back
          </span>
        </button>
      </div>

      <div className="bg-surface border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 flex items-center gap-4">
          <div className="p-3 bg-gold-luxury/10 rounded-2xl">
            <Building2 className="w-6 h-6 text-gold-luxury" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Edit Customer</h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">
                Nama Perusahaan
              </label>
              <input
                required
                className="w-full bg-surface-accent border border-surface-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-luxury/50 transition-all text-foreground"
                value={formData.company_name}
                onChange={(e) =>
                  setFormData({ ...formData, company_name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">
                Nama PIC
              </label>
              <input
                required
                className="w-full bg-surface-accent border border-surface-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-luxury/50 transition-all text-foreground"
                value={formData.pic_name}
                onChange={(e) =>
                  setFormData({ ...formData, pic_name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">
                No. Telepon / WhatsApp
              </label>
              <input
                required
                className="w-full bg-surface-accent border border-surface-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-luxury/50 transition-all text-foreground"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">
                Alamat
              </label>
              <input
                required
                className="w-full bg-surface-accent border border-surface-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-luxury/50 transition-all text-foreground"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button
              disabled={submitting}
              type="submit"
              className="flex items-center gap-2 bg-gold-luxury text-black px-8 py-3 rounded-xl font-bold text-xs hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-gold-luxury/10"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
