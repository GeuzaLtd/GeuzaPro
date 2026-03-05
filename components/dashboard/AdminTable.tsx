'use client';

import { useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineSearch, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
}

interface AdminTableProps<T extends { id: string | number }> {
  columns: Column<T>[];
  data: T[];
  searchKeys?: (keyof T)[];
  pageSize?: number;
  actions?: (row: T) => ReactNode;
}

export default function AdminTable<T extends { id: string | number }>({
  columns,
  data,
  searchKeys = [],
  pageSize = 8,
  actions,
}: AdminTableProps<T>) {
  const [query, setQuery]   = useState('');
  const [page, setPage]     = useState(1);
  const [sortKey, setSortKey]   = useState<string | null>(null);
  const [sortAsc, setSortAsc]   = useState(true);

  /* ── Filter ── */
  const filtered = data.filter((row) => {
    if (!query) return true;
    return searchKeys.some((k) => {
      const val = row[k];
      return String(val ?? '').toLowerCase().includes(query.toLowerCase());
    });
  });

  /* ── Sort ── */
  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const av = String((a as Record<string, unknown>)[sortKey] ?? '');
        const bv = String((b as Record<string, unknown>)[sortKey] ?? '');
        return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
      })
    : filtered;

  /* ── Paginate ── */
  const total  = sorted.length;
  const pages  = Math.max(1, Math.ceil(total / pageSize));
  const slice  = sorted.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
    setPage(1);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Search bar */}
      {searchKeys.length > 0 && (
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-100 flex-1 max-w-xs focus-within:border-[#0F9E59]/40 focus-within:ring-2 focus-within:ring-[#0F9E59]/10 transition-all">
            <HiOutlineSearch size={14} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search…"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              className="bg-transparent text-sm text-gray-600 placeholder-gray-400 focus:outline-none w-full"
            />
          </div>
          <p className="text-xs text-gray-400 ml-auto">
            {total} result{total !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && toggleSort(col.key)}
                  className={`px-5 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap ${
                    col.sortable ? 'cursor-pointer select-none hover:text-gray-700 transition-colors' : ''
                  }`}
                >
                  {col.label}
                  {col.sortable && sortKey === col.key && (
                    <span className="ml-1 text-[#0F9E59]">{sortAsc ? '↑' : '↓'}</span>
                  )}
                </th>
              ))}
              {actions && (
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {slice.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-5 py-12 text-center text-sm text-gray-400"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              slice.map((row, i) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                  className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-4 text-gray-700">
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? '—')}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">{actions(row)}</div>
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <HiChevronLeft size={14} />
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                  p === page
                    ? 'bg-[#0F9E59] text-white shadow-sm'
                    : 'border border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === pages}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <HiChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
