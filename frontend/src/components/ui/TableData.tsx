"use client";

import React, { ReactNode } from "react";

interface Column<T> {
  header: ReactNode;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface TableDataProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
}

export default function TableData<T extends { id: string | number }>({
  columns,
  data,
  loading,
}: TableDataProps<T>) {
  return (
    <div className="w-full overflow-x-auto pb-4">
      <table className="w-full text-left border-separate border-spacing-y-0">
        <thead>
          <tr className="border-b border-surface">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`px-6 py-4 text-zinc-400 text-xs font-semibold bg-surface-light first:rounded-tl-2xl last:rounded-tr-2xl ${
                  col.className || ""
                }`}
              >
                <div className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors">
                  {col.header}
                  <span className="text-[10px]">▼</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface">
          {loading ? (
            <tr>
              <td colSpan={columns.length + 1} className="py-20 text-center">
                <div className="flex justify-center text-gold-luxury animate-pulse font-bold">
                  Loading data...
                </div>
              </td>
            </tr>
          ) : data.length > 0 ? (
            data.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <tr
                  key={item.id}
                  className={`group transition-all hover:opacity-80 ${
                    isEven ? "bg-surface-accent" : "bg-transparent"
                  }`}
                >
                  {columns.map((col, idx) => (
                    <td
                      key={idx}
                      className={`px-6 py-4 text-sm text-foreground/80 font-medium ${
                        col.className || ""
                      }`}
                    >
                      {typeof col.accessor === "function"
                        ? col.accessor(item)
                        : (item[col.accessor] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="py-20 text-center text-zinc-500"
              >
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
