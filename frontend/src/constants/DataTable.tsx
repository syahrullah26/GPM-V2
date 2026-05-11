import { Customer } from "@/types/customer";
// import { customerService } from "@/service/customerService";
import { Order } from "@/types/order";
import { Quotation } from "@/types/quotation";
import { MoreHorizontal, FileText, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const CustomersColumns = (
  onDelete: (id: number, name: string) => void,
) => [
  {
    header: "PIC Name",
    accessor: (item: Customer) => (
      <div className="flex flex-col">
        <span className="font-semibold text-foreground">{item.pic_name}</span>
        <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-tighter">
          ID: {item.id}
        </span>
      </div>
    ),
  },
  {
    header: "Company",
    accessor: (item: Customer) => (
      <span className="text-gold-luxury font-bold  ">{item.company_name}</span>
    ),
  },
  {
    header: "Address",
    accessor: (item: Customer) => (
      <p className="text-xs text-zinc-500 max-w-62.5 truncate">
        {item.contact.address}
      </p>
    ),
  },
  {
    header: "Phone",
    accessor: (item: Customer) => (
      <span className="text-xs font-mono bg-surface px-2 py-1 rounded-lg">
        {item.contact.phone}
      </span>
    ),
  },
  {
    header: <MoreHorizontal className="w-4 h-4 text-zinc-400" />,
    accessor: (item: Customer) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors outline-none">
            <MoreHorizontal className="w-4 h-4 text-zinc-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href={`/customers/${item.id}`}>
              <FileText className="mr-2 h-4 w-4" /> View Detail
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={`/customers/${item.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => onDelete(item.id, item.company_name)}
            className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export const OrdersColumns = [
  {
    header: "Order & Invoice",
    accessor: (item: Order) => (
      <div className="flex flex-col min-w-35">
        <span className="font-bold text-foreground tracking-tight">
          {item.order_number}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] bg-zinc-100 dark:bg-white/5 text-zinc-500 px-1.5 py-0.5 rounded font-black tracking-tighter">
            INV:
          </span>
          <span className="text-[10px] text-zinc-400 font-medium">
            {item.invoices?.invoice_number || "Draft"}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Customer",
    accessor: (item: Order) => (
      <div className="max-w-45">
        <span className="text-gold-luxury font-bold text-xs block truncate">
          {item.customers.company_name}
        </span>
        <span className="text-[10px] text-zinc-400 font-mono italic">
          {item.order_date}
        </span>
      </div>
    ),
  },
  {
    header: "Order Items",
    accessor: (order: Order) => (
      <div className="flex flex-col gap-1.5 min-w-60 max-h-32.5 overflow-y-auto pr-2 custom-scrollbar">
        {order.items.map((item, idx) => (
          <div
            key={item.id || idx}
            className="group/item py-2 border-b border-zinc-100/50 dark:border-white/5 last:border-0"
          >
            <div className="flex justify-between items-start mb-1.5">
              <p className="font-bold text-foreground text-[11px] uppercase tracking-tight leading-none">
                {item.item_name}
              </p>
              <span className="text-[10px] font-black px-1.5 py-0.5 bg-zinc-100 dark:bg-white/5 rounded text-zinc-500">
                x{item.quantity}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] font-black text-emerald-600/50 uppercase tracking-tighter">
                  SELL
                </span>
                <span className="text-[10px] text-emerald-600 font-bold font-mono">
                  {item.price.formatted_selling_price}
                </span>
              </div>

              <div className="w-px h-2.5 bg-zinc-200 dark:bg-white/10" />

              <div className="flex items-center gap-1.5">
                <span className="text-[8px] font-black text-zinc-400 uppercase tracking-tighter">
                  COST
                </span>
                <span className="text-[10px] text-zinc-400 font-medium font-mono">
                  {item.price.formatted_cost_price}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    header: "Financials",
    accessor: (item: Order) => {
      return (
        <div className="flex flex-col gap-1 min-w-40 bg-surface-accent p-2 rounded-xl border border-zinc-100 dark:border-white/5">
          <div className="flex justify-between text-[9px]">
            <span className="text-zinc-400 font-bold uppercase">Subtotal</span>
            <span className="text-zinc-600 font-mono">
              {item.invoices?.formated_subtotal || "-"}
            </span>
          </div>
          <div className="flex justify-between text-[9px]">
            <span className="text-zinc-400 font-bold uppercase">Tax</span>
            <span className="text-emerald-600 font-mono">
              {item.invoices?.formated_tax_amount || "-"}
            </span>
          </div>
          <div className="h-px bg-zinc-200/50 dark:bg-white/10 my-0.5" />
          <div className="flex justify-between text-[10px]">
            <span className="text-zinc-500 font-black uppercase tracking-tighter">
              Total
            </span>
            <span className="text-amber-600 font-bold font-mono italic">
              {item.invoices?.formated_grand_total || "-"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    header: "Status",
    accessor: (item: Order) => {
      const isPending = item.status.toLowerCase() === "pending";
      return (
        <div className="flex justify-center">
          <span
            className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all
            ${
              isPending
                ? "bg-orange-500/10 text-orange-500 border-orange-500/20 shadow-[0_0_12px_rgba(249,115,22,0.1)]"
                : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.1)]"
            }`}
          >
            {item.status}
          </span>
        </div>
      );
    },
  },
  {
    header: <MoreHorizontal className="w-4 h-4 text-zinc-400" />,
    accessor: (item: Order) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors">
            <MoreHorizontal className="h-4 w-4 text-zinc-400 hover:cursor-pointer" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/orders/${item.id}/view`}>
              <FileText className="mr-2 h-4 w-4" /> View Detail
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/orders/${item.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-500/10 hover:bg-red-500/10">
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export const QuotationsColumns = [
  {
    header: "Quotation",
    accessor: (item: Quotation) => (
      <div className="flex flex-col min-w-35">
        <span className="font-bold text-foreground tracking-tight">
          {item.quotation_number}
        </span>
      </div>
    ),
  },
  {
    header: "Company",
    accessor: (item: Quotation) => (
      <div className="max-w-45">
        <span className="text-gold-luxury font-bold text-xs block truncate">
          {item.customers.company_name}
        </span>
        <span className="text-[10px] text-zinc-800 font-mono italic block turncate">
          {item.customers.pic_name || "PIC Name"}
        </span>
        <span className="text-[10px] text-zinc-400 font-mono italic">
          {item.customers.contact.address || "No Address"}
        </span>
        <span className="text-[10px] text-zinc-400 font-mono font-bold italic">
          {" "}
          ({item.customers.contact.phone || "No Phone Number"})
        </span>
      </div>
    ),
  },
  {
    header: "Date",
    accessor: (item: Quotation) => (
      <span className="text-[10px] text-zinc-400 font-mono">{item.date}</span>
    ),
  },
  {
    header: "Details Items",
    accessor: (quotation: Quotation) => (
      <div className="flex flex-col gap-1.5 min-w-60 max-h-32.5 overflow-y-auto pr-2 custom-scrollbar">
        {quotation.items.map((item, idx) => (
          <div
            key={item.id || idx}
            className="group/item py-2 border-b border-zinc-100/50 dark:border-white/5 last:border-0"
          >
            <div className="flex justify-between items-start mb-1.5">
              <p className="font-bold text-foreground text-[11px] uppercase tracking-tight leading-none">
                {item.item_name}
              </p>
              <span className="text-[10px] font-black px-1.5 py-0.5 bg-zinc-100 dark:bg-white/5 rounded text-zinc-500">
                x{item.quantity} {item.unit}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] font-black text-emerald-600/50 uppercase tracking-tighter">
                  SELL
                </span>
                <span className="text-[10px] text-emerald-600 font-bold font-mono">
                  {item.formatted_price}
                </span>
              </div>

              <div className="w-px h-2.5 bg-foreground/50" />

              <div className="flex items-center gap-1.5">
                <span className="text-[8px] font-black text-zinc-400 uppercase tracking-tighter">
                  COST
                </span>
                <span className="text-[10px] text-zinc-400 font-medium font-mono">
                  {item.formatted_cost_price}
                </span>
              </div>
            </div>
            <hr className="my-2 border border-foreground/10"></hr>
            <div className="flex flex-row justify-end items-center gap-1.5">
              <span className="text-[8px] font-black text-gold-luxury uppercase tracking-tighter">
                TOTAL
              </span>
              <span className="text-[10px] text-gold-luxury font-medium font-mono">
                {item.formatted_subtotal}
              </span>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  // {
  //   header: "Subtotal",
  //   accessor: (item: Quotation) => (
  //     <span className="text-[10px] text-zinc-400 font-mono">
  //       {item.formatted_subtotal}
  //     </span>
  //   ),
  // },
  {
    header: "Status",
    accessor: (item: Quotation) => {
      const isPending = item.status.toLowerCase() === "pending";
      return (
        <div className="flex justify-center">
          <span
            className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all
            ${
              isPending
                ? "bg-orange-500/10 text-orange-500 border-orange-500/20 shadow-[0_0_12px_rgba(249,115,22,0.1)]"
                : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.1)]"
            }`}
          >
            {item.status}
          </span>
        </div>
      );
    },
  },
  {
    header: <MoreHorizontal className="w-4 h-4 text-zinc-400 " />,
    accessor: (item: Quotation) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors">
            <MoreHorizontal className="h-4 w-4 text-zinc-400 hover:cursor-pointer" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/quotations/${item.id}/view`}>
              <FileText className="mr-2 h-4 w-4" /> View Detail
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/quotations/${item.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-500/10 hover:bg-red-500/10">
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
