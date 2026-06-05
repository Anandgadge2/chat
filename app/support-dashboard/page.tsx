'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Ticket, AlertCircle, Eye, ArrowRight, ShieldAlert, HardDrive } from 'lucide-react';
import SummaryCards from '@/components/support/SummaryCards';
import TicketStatusBadge from '@/components/support/TicketStatusBadge';
import PriorityBadge from '@/components/support/PriorityBadge';
import StorageCharts from '@/components/support/StorageCharts';
import AnalyticsCharts from '@/components/support/AnalyticsCharts';

export default function SupportDashboardOverview() {
  const [stats, setStats] = useState<any>(null);
  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [storage, setStorage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch stats, recent tickets (limit 5), and storage details
      const [statsRes, ticketsRes, storageRes] = await Promise.all([
        fetch('/api/support/stats'),
        fetch('/api/support/tickets?limit=5'),
        fetch('/api/support/storage')
      ]);

      const statsData = await statsRes.json();
      const ticketsData = await ticketsRes.json();
      const storageData = await storageRes.json();

      if (statsData.success) setStats(statsData.data);
      if (ticketsData.success) setRecentTickets(ticketsData.tickets);
      if (storageData.success) setStorage(storageData.latest);
    } catch (err) {
      console.error('Error fetching dashboard details:', err);
      setError('Failed to load dashboard data. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Title block */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Overview Dashboard</h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Real-time analytics and ticket performance auditing
          </p>
        </div>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-[#0f766e] hover:bg-[#115e59] text-white text-xs font-bold rounded-xl shadow-soft transition-all active:scale-95"
        >
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-bold flex items-start gap-2.5">
          <AlertCircle className="shrink-0 mt-0.5" />
          <div>
            <h4 className="font-extrabold">Data Sync Error</h4>
            <p className="mt-0.5 font-medium text-red-650">{error}</p>
          </div>
        </div>
      )}

      {/* KPI Cards section */}
      <SummaryCards stats={stats} isLoading={loading} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Analytics Trend Graphs */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-soft">
            <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Activity & Volume Trends</span>
              <Link href="/support-dashboard/analytics" className="text-xs text-[#0f766e] hover:underline flex items-center gap-0.5">
                View Full Analytics <ArrowRight size={12} />
              </Link>
            </h3>
            <div className="mt-4">
              {stats ? (
                <AnalyticsCharts 
                  data={{
                    categoryCounts: stats.categoryCounts,
                    statusCounts: stats.statusCounts,
                    priorityCounts: stats.priorityCounts,
                    dailyTrend: stats.dailyTrend,
                    repeatedIssues: [] // Pass empty since overview doesn't need repeated chart here
                  }} 
                  isLoading={loading} 
                />
              ) : (
                <div className="h-64 bg-slate-50 border border-slate-200 animate-pulse rounded-xl" />
              )}
            </div>
          </div>
        </div>

        {/* Recent Tickets sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-soft flex flex-col h-full">
            <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Recent Tickets</span>
              <Link href="/support-dashboard/tickets" className="text-xs text-[#0f766e] hover:underline flex items-center gap-0.5">
                Manage All <ArrowRight size={12} />
              </Link>
            </h3>

            <div className="mt-4 flex-1 space-y-3">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="h-16 bg-slate-50 border border-slate-200 animate-pulse rounded-xl" />
                ))
              ) : recentTickets.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-slate-400 font-bold text-xs">
                  <Ticket size={24} className="text-slate-300 mb-1" />
                  No tickets logged yet
                </div>
              ) : (
                recentTickets.map((t) => (
                  <div 
                    key={t.id} 
                    className="p-3 border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl transition-all flex items-start justify-between gap-3 shadow-soft"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-extrabold text-slate-800 text-xs select-all">{t.ticketId}</span>
                        <PriorityBadge priority={t.priority} />
                      </div>
                      <p className="text-xs font-bold text-slate-700 truncate mt-1.5">{t.userName}</p>
                      <p className="text-[10px] font-semibold text-slate-400 truncate mt-0.5">{t.title}</p>
                    </div>
                    <div className="flex flex-col items-end shrink-0 gap-1.5">
                      <TicketStatusBadge status={t.status} />
                      <Link
                        href={`/support-dashboard/tickets/${t.ticketId}`}
                        className="p-1 hover:bg-[#0f766e]/10 text-slate-400 hover:text-[#0f766e] rounded-lg transition-colors border border-slate-200 hover:border-[#0f766e]/20"
                      >
                        <Eye size={12} />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Storage summary footer row */}
      {storage && (
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-soft">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <HardDrive size={16} className="text-[#0f766e]" />
              Hosting Disk Storage Summary
            </h3>
            <Link href="/support-dashboard/storage" className="text-xs text-[#0f766e] hover:underline flex items-center gap-0.5 font-bold">
              Check cPanel Logs <ArrowRight size={12} />
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <StorageCharts latestRecord={storage} />
            </div>
            
            {/* Warning block */}
            <div className="bg-slate-50 border border-slate-150 p-5 rounded-2xl flex flex-col justify-center h-full space-y-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="text-rose-500 shrink-0" size={20} />
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Storage Status</h4>
              </div>
              <div className="text-2xl font-black text-slate-800 leading-none">
                {((storage.usedStorageGb / storage.totalStorageGb) * 100).toFixed(1)}% <span className="text-xs text-slate-400 font-bold">Used</span>
              </div>
              <p className="text-[10.5px] font-semibold text-slate-500 leading-relaxed">
                Currently utilizing {storage.usedStorageGb.toFixed(1)} GB out of total {storage.totalStorageGb.toFixed(0)} GB space. 
                {storage.usedStorageGb / storage.totalStorageGb > 0.8 
                  ? ' Disk is running out of capacity! Audit logs and backups.' 
                  : ' Disk usage is within healthy limits.'}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
