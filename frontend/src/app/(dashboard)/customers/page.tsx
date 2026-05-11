"use client";

import { useState, useEffect } from "react";
import { Filter, Search, Plus } from "lucide-react";
import TableData from "@/components/ui/TableData";
import { customerService } from "@/service/customerService";
import { Customer } from "@/types/customer";
import { CustomersColumns } from "@/constants/DataTable";
import ModalCustomer from "@/components/ui/modals/ModalCustomer";
import ConfirmModal from "@/components/ui/modals/ConfirmModal";
import FilterPanel, {
  FilterValues,
} from "@/components/ui/dashboard/customer/FilterPanel";
import { toast } from "sonner";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [showFilter, setShowFilter] = useState(false);

  const handleApplyFilter = (filters: FilterValues) => {
    console.log("Applying Filters:", filters);
    setShowFilter(false);
  };

  const handleDeleteClick = (id: number, name: string) => {
    setSelectedCustomer({ id, name });
    setIsDeleteModalOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (!selectedCustomer) return;

    try {
      setIsDeleting(true);
      await customerService.deleteCustomer(selectedCustomer.id);

      toast.success("Customer Deleted", {
        description: `${selectedCustomer.name} has been removed.`,
      });

      setIsDeleteModalOpen(false);
    } catch (error: any) {
      toast.error("Error", { description: error.message });
    } finally {
      setIsDeleting(false);
    }
  };
  const columns = CustomersColumns(handleDeleteClick);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await customerService.fetchCustomers();
        setCustomers(data);
      } catch (err: any) {
        setError(err.message || "Gagal memuat data pelanggan");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);
  const handleSuccess = () => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await customerService.fetchCustomers();
        setCustomers(data);
      } catch (err: any) {
        setError(err.message || "Gagal memuat data pelanggan");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  };
  const filteredData = customers.filter(
    (item) =>
      item.pic_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            CUSTOMERS
          </h1>
          <p className="text-xs text-zinc-500 font-medium">
            Manage and monitor your business partners
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gold-luxury cursor-pointer text-black px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Customer
        </button>
        <ModalCustomer
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
        />
      </div>
      <div className="bg-white dark:bg-surface rounded-4xl shadow-sm border border-zinc-100 dark:border-white/5 overflow-hidden">
        <div className="p-4 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 dark:border-white/5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-bold transition-all border rounded-xl 
              ${
                showFilter
                  ? "bg-gold-luxury text-black border-gold-luxury shadow-lg shadow-gold-luxury/20"
                  : "text-zinc-500 hover:bg-white/5 border-white/10"
              }`}
            >
              <Filter className="w-4 h-4" /> Filter
            </button>
            {showFilter && (
              <>
                <div
                  className="fixed inset-0 z- bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                  onClick={() => setShowFilter(false)}
                />
                <div className="fixed inset-0 z- flex items-center justify-center pointer-events-none">
                  <div className="pointer-events-auto">
                    <FilterPanel
                      onApply={handleApplyFilter}
                      onReset={() => {
                        setShowFilter(false);
                      }}
                    />
                  </div>
                </div>
              </>
            )}
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
          <ConfirmModal
            isOpen={isDeleteModalOpen}
            isLoading={isDeleting}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            title="Delete Customer"
            message={`Are you sure you want to delete ${selectedCustomer?.name}? This action cannot be undone.`}
          />
        </div>
        {error ? (
          <div className="p-20 text-center text-red-500 font-bold">{error}</div>
        ) : (
          <TableData columns={columns} data={filteredData} loading={loading} />
        )}
      </div>
    </div>
  );
}
