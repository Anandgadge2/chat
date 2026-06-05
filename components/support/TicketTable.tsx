'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Search, Eye, RefreshCw, Download, 
  ChevronLeft, ChevronRight, Filter, AlertOctagon 
} from 'lucide-react';
import TicketStatusBadge from './TicketStatusBadge';
import PriorityBadge from './PriorityBadge';
import { VALID_CATEGORIES, VALID_STATUSES, VALID_PRIORITIES } from '@/lib/validations';

interface Ticket {
  id: string;
  ticketId: string;
  userName: string;
  userMobile: string;
  userEmail: string | null;
  category: string;
  title: string;
  priority: string;
  status: string;
  assignedTo: string | null;
  createdAt: string | Date;
}

interface TicketTableProps {
  tickets: Ticket[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
  onCategoryFilter: (category: string) => void;
  onStatusFilter: (status: string) => void;
  onPriorityFilter: (priority: string) => void;
  onRefresh: () => void;
  onExportCSV: () => void;
}

export default function TicketTable({
  tickets,
  totalCount,
  currentPage,
  totalPages,
  isLoading,
  onPageChange,
  onSearchChange,
  onCategoryFilter,
  onStatusFilter,
  onPriorityFilter,
  onRefresh,
  onExportCSV
}: TicketTableProps) {
  const [searchVal, setSearchVal] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('');
  const [selectedPriority, setSelectedPriority] = React.useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchVal);
  };

  const clearFilters = () => {
    setSearchVal('');
    setSelectedCategory('');
    setSelectedStatus('');
    setSelectedPriority('');
    onSearchChange('');
    onCategoryFilter('');
    onStatusFilter('');
    onPriorityFilter('');
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 border border-slate-200 rounded-2xl shadow-soft flex flex-wrap items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[280px] max-w-md relative flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by ID, name, email, description..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#0f766e] focus:ring-2 focus:ring-emerald-100 rounded-xl text-xs font-semibold text-slate-700 transition-all outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 bg-[#0f766e] hover:bg-[#115e59] text-white font-bold text-xs rounded-xl shadow-soft active:scale-95 transition-all"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              onCategoryFilter(e.target.value);
            }}
            className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 focus:bg-white outline-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {VALID_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              onStatusFilter(e.target.value);
            }}
            className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 focus:bg-white outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            {VALID_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => {
              setSelectedPriority(e.target.value);
              onPriorityFilter(e.target.value);
            }}
            className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 focus:bg-white outline-none cursor-pointer"
          >
            <option value="">All Priorities</option>
            {VALID_PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <button
            onClick={clearFilters}
            className="text-[10px] font-bold text-slate-400 hover:text-[#0f766e] uppercase tracking-wider px-2 py-1"
          >
            Reset
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1" />

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl border border-slate-200 hover:text-[#0f766e] transition-all active:scale-95 disabled:opacity-50"
            title="Refresh database records"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>

          {/* Export CSV */}
          <button
            onClick={onExportCSV}
            className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl border border-slate-200 hover:text-indigo-600 transition-all active:scale-95 flex items-center gap-1 text-xs font-bold px-2.5"
            title="Export filtered records as CSV"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Main Tickets Table Layout */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-150 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 text-center w-12">Sr.</th>
                <th className="py-3.5 px-4 w-28">Ticket ID</th>
                <th className="py-3.5 px-4">User Name</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 w-60">Issue Title</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-4">Assigned To</th>
                <th className="py-3.5 px-4 text-center w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {isLoading ? (
                // Skeletons
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse bg-slate-50/20">
                    <td className="py-5 px-4"><div className="h-3 bg-slate-200 rounded w-4 mx-auto" /></td>
                    <td className="py-5 px-4"><div className="h-3 bg-slate-200 rounded w-20" /></td>
                    <td className="py-5 px-4"><div className="h-3 bg-slate-200 rounded w-24" /></td>
                    <td className="py-5 px-4">
                      <div className="h-2.5 bg-slate-200 rounded w-24" />
                      <div className="h-2.5 bg-slate-200 rounded w-32 mt-1.5" />
                    </td>
                    <td className="py-5 px-4"><div className="h-3 bg-slate-200 rounded w-20" /></td>
                    <td className="py-5 px-4"><div className="h-3 bg-slate-200 rounded w-40" /></td>
                    <td className="py-5 px-4"><div className="h-5 bg-slate-200 rounded-md w-14" /></td>
                    <td className="py-5 px-4"><div className="h-6 bg-slate-200 rounded-full w-20" /></td>
                    <td className="py-5 px-4"><div className="h-3 bg-slate-200 rounded w-20" /></td>
                    <td className="py-5 px-4"><div className="h-3 bg-slate-200 rounded w-16" /></td>
                    <td className="py-5 px-4"><div className="h-7 bg-slate-200 rounded-lg w-10 mx-auto" /></td>
                  </tr>
                ))
              ) : tickets.length === 0 ? (
                // Empty state
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400 font-bold">
                    <AlertOctagon className="mx-auto text-slate-350 mb-2" size={32} />
                    No tickets found matching current query parameters.
                  </td>
                </tr>
              ) : (
                // Real rows
                tickets.map((t, idx) => {
                  const serialNo = (currentPage - 1) * 10 + idx + 1;
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 text-center text-slate-400 font-medium">{serialNo}</td>
                      <td className="py-3 px-4 font-bold text-slate-800 select-all">{t.ticketId}</td>
                      <td className="py-3 px-4 font-extrabold text-slate-800 select-all">{t.userName}</td>
                      <td className="py-3 px-4 text-[10.5px]">
                        <div className="font-bold text-slate-700 select-all">{t.userMobile}</div>
                        {t.userEmail && <div className="text-slate-400 font-medium select-all">{t.userEmail}</div>}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-extrabold text-[#0f766e] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wider">
                          {t.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700 select-text truncate max-w-xs" title={t.title}>
                        {t.title}
                      </td>
                      <td className="py-3 px-4">
                        <PriorityBadge priority={t.priority} />
                      </td>
                      <td className="py-3 px-4">
                        <TicketStatusBadge status={t.status} />
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-semibold leading-none">
                        {new Date(t.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                        <span className="block text-[10px] text-slate-350 font-medium mt-1">
                          {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-650">
                        {t.assignedTo ? (
                          <span className="text-slate-700">{t.assignedTo}</span>
                        ) : (
                          <span className="text-slate-400 font-medium italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Link
                          href={`/support-dashboard/tickets/${t.ticketId}`}
                          className="inline-flex items-center justify-center p-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-[#0f766e] border border-slate-200 hover:border-emerald-200 rounded-lg transition-colors shadow-soft"
                          title="Open Ticket details"
                        >
                          <Eye size={14} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        {!isLoading && totalPages > 1 && (
          <div className="bg-slate-50 p-3 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap text-xs font-semibold text-slate-500">
            <div>
              Showing <span className="font-extrabold text-slate-700">{(currentPage - 1) * 10 + 1}</span> to{' '}
              <span className="font-extrabold text-slate-700">
                {Math.min(currentPage * 10, totalCount)}
              </span>{' '}
              of <span className="font-extrabold text-slate-700">{totalCount}</span> results
            </div>
            
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-500 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNo = idx + 1;
                return (
                  <button
                    key={pageNo}
                    onClick={() => onPageChange(pageNo)}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold border transition-colors ${
                      currentPage === pageNo
                        ? 'bg-[#0f766e] border-[#0f766e] text-white shadow-soft'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-500'
                    }`}
                  >
                    {pageNo}
                  </button>
                );
              })}

              <button
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-500 disabled:opacity-40 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
