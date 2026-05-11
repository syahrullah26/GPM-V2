"use client";

import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { CustomerRequest } from "@/types/customer";
import { customerService } from "@/service/customerService";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CustomerModal({ isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CustomerRequest>({
    pic_name: "",
    company_name: "",
    address: "",
    phone: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await customerService.createCustomer(formData);
      toast.success("Customer Created", {
        description: `${formData.company_name} has been added successfully.`,
      });
      onSuccess();
      onClose();
      setFormData({ pic_name: "", company_name: "", address: "", phone: "" }); // Reset
    } catch (error: any) {
      toast.error("Failed to Create Customer", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-surface/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <h3 className="text-lg font-bold text-gold-luxury">
            Add New Customer
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-400 cursor-pointer hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-foreground tracking-widest">
              Company Name
            </label>
            <input
              required
              className="w-full bg-surface-light border border-surface/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-luxury/50 transition-all"
              placeholder="e.g. PT. Global Persada Mandiri"
              value={formData.company_name}
              onChange={(e) =>
                setFormData({ ...formData, company_name: e.target.value })
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-foreground tracking-widest">
              PIC Name
            </label>
            <input
              required
              className="w-full bg-surface-light border border-surface rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-luxury/50 transition-all"
              placeholder="Full name of contact person"
              value={formData.pic_name}
              onChange={(e) =>
                setFormData({ ...formData, pic_name: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-foreground tracking-widest">
                Phone
              </label>
              <input
                required
                type="tel"
                className="w-full bg-surface-light border border-surface rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-luxury/50 transition-all"
                placeholder="0812..."
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-foreground tracking-widest">
                Address
              </label>
              <input
                required
                className="w-full bg-surface-light border border-surface/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-luxury/50 transition-all"
                placeholder="City, Province"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-gold-luxury text-black font-bold py-3 rounded-xl mt-4 flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Save Customer
          </button>
        </form>
      </div>
    </div>
  );
}
