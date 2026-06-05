'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, RefreshCw, BarChart2 } from 'lucide-react';
import AnalyticsCharts from '@/components/support/AnalyticsCharts';

export default function SupportDashboardAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/support/stats');
      const data = await res.json();
      
      if (data.success && data.data) {
        setStats(data.data);
      } else {
        throw new Error(data.error || 'Failed to retrieve analytics stats.');
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Could not retrieve analytics data. Check if your API endpoint is functioning.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <BarChart2 size={22} className="text-[#0f766e]" />
            Support Analytics & Reports
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Track category volume, daily trends, priority levels, and status ratios
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={isLoading}
          className="p-2 bg-white hover:bg-slate-50 text-slate-500 rounded-xl border border-slate-200 active:scale-95 shadow-soft transition-all"
          title="Reload statistics data"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
        </button>
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

      {/* Analytics Charts Component */}
      {stats ? (
        <AnalyticsCharts
          data={{
            categoryCounts: stats.categoryCounts,
            statusCounts: stats.statusCounts,
            priorityCounts: stats.priorityCounts,
            dailyTrend: stats.dailyTrend,
            repeatedIssues: [] // Can remain empty since stats.repeatedIssues is handled elsewhere
          }}
          isLoading={isLoading}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-72 bg-slate-100 border border-slate-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      )}

    </div>
  );
}
