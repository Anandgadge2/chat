'use client';

import React, { useEffect, useState, useCallback } from 'react';
import TicketTable from '@/components/support/TicketTable';
import { AlertCircle } from 'lucide-react';

export default function SupportDashboardTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: String(currentPage),
        limit: '10',
        search,
        category,
        status,
        priority
      });

      const res = await fetch(`/api/support/tickets?${queryParams.toString()}`);
      const data = await res.json();

      if (data.success) {
        setTickets(data.tickets);
        setTotalCount(data.total);
        setTotalPages(data.totalPages);
      } else {
        throw new Error(data.error || 'Failed to retrieve tickets.');
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Could not retrieve tickets list. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, search, category, status, priority]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Handle filter/search resets to page 1
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (val: string) => {
    setCategory(val);
    setCurrentPage(1);
  };

  const handleStatusFilter = (val: string) => {
    setStatus(val);
    setCurrentPage(1);
  };

  const handlePriorityFilter = (val: string) => {
    setPriority(val);
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const queryParams = new URLSearchParams({
      search,
      category,
      status,
      priority
    });
    // Trigger download by routing browser to export route
    window.location.href = `/api/support/export?${queryParams.toString()}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Support Tickets</h2>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Search, assign, and update statuses of user-submitted complaints
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-bold flex items-start gap-2.5">
          <AlertCircle className="shrink-0 mt-0.5" />
          <div>
            <h4 className="font-extrabold font-sans">Sync Error</h4>
            <p className="mt-0.5 font-medium text-red-650">{error}</p>
          </div>
        </div>
      )}

      {/* Reusable Data Table */}
      <TicketTable
        tickets={tickets}
        totalCount={totalCount}
        currentPage={currentPage}
        totalPages={totalPages}
        isLoading={isLoading}
        onPageChange={setCurrentPage}
        onSearchChange={handleSearchChange}
        onCategoryFilter={handleCategoryFilter}
        onStatusFilter={handleStatusFilter}
        onPriorityFilter={handlePriorityFilter}
        onRefresh={fetchTickets}
        onExportCSV={handleExportCSV}
      />

    </div>
  );
}
