'use client';

import React, { useEffect, useState } from 'react';
import { AlertOctagon, RefreshCw, AlertCircle } from 'lucide-react';
import RepeatedIssuesTable from '@/components/support/RepeatedIssuesTable';

export default function RepeatedIssuesPage() {
  const [issues, setIssues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIssues = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/support/repeated-issues');
      const data = await res.json();

      if (data.success && data.data) {
        setIssues(data.data);
      } else {
        throw new Error(data.error || 'Failed to retrieve repeated issues.');
      }
    } catch (err) {
      console.error('Error fetching repeated issues:', err);
      setError('Could not retrieve repeated issues data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <AlertOctagon size={22} className="text-rose-500" />
            Repeated Issues Tracker
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Auto-grouped common complaint patterns detected via keyword analysis
          </p>
        </div>
        <button
          onClick={fetchIssues}
          disabled={isLoading}
          className="p-2 bg-white hover:bg-slate-50 text-slate-500 rounded-xl border border-slate-200 active:scale-95 shadow-soft transition-all"
          title="Refresh repeated issues"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-bold flex items-start gap-2.5">
          <AlertCircle className="shrink-0 mt-0.5" size={16} />
          <div>
            <h4 className="font-extrabold">Data Sync Error</h4>
            <p className="mt-0.5 font-medium">{error}</p>
          </div>
        </div>
      )}

      <RepeatedIssuesTable issues={issues} isLoading={isLoading} />
    </div>
  );
}
