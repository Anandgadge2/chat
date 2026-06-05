'use client';

import React, { useEffect, useState } from 'react';
import { HardDrive, RefreshCw, AlertCircle, Save } from 'lucide-react';
import StorageCharts from '@/components/support/StorageCharts';
import StorageUsageCards from '@/components/support/StorageUsageCards';
import StorageChecklist from '@/components/support/StorageChecklist';

export default function StoragePage() {
  const [latestRecord, setLatestRecord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form fields
  const [totalStorageGb, setTotalStorageGb] = useState('');
  const [usedStorageGb, setUsedStorageGb] = useState('');
  const [publicHtmlSizeGb, setPublicHtmlSizeGb] = useState('');
  const [databaseSizeGb, setDatabaseSizeGb] = useState('');
  const [emailStorageGb, setEmailStorageGb] = useState('');
  const [backupSizeGb, setBackupSizeGb] = useState('');
  const [logsSizeGb, setLogsSizeGb] = useState('');
  const [temporaryFilesSizeGb, setTemporaryFilesSizeGb] = useState('');
  const [lastCheckedAt, setLastCheckedAt] = useState('');

  const fetchStorage = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/support/storage');
      const data = await res.json();
      if (data.success) {
        setLatestRecord(data.latest);
        // Pre-fill form with latest values if available
        if (data.latest) {
          setTotalStorageGb(String(data.latest.totalStorageGb || ''));
          setUsedStorageGb(String(data.latest.usedStorageGb || ''));
          setPublicHtmlSizeGb(String(data.latest.publicHtmlSizeGb || ''));
          setDatabaseSizeGb(String(data.latest.databaseSizeGb || ''));
          setEmailStorageGb(String(data.latest.emailStorageGb || ''));
          setBackupSizeGb(String(data.latest.backupSizeGb || ''));
          setLogsSizeGb(String(data.latest.logsSizeGb || ''));
          setTemporaryFilesSizeGb(String(data.latest.temporaryFilesSizeGb || ''));
        }
      }
    } catch (err) {
      console.error('Error fetching storage:', err);
      setError('Could not retrieve storage data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStorage();
  }, []);

  const handleSaveStorage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const res = await fetch('/api/support/storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalStorageGb: parseFloat(totalStorageGb) || 0,
          usedStorageGb: parseFloat(usedStorageGb) || 0,
          publicHtmlSizeGb: parseFloat(publicHtmlSizeGb) || 0,
          databaseSizeGb: parseFloat(databaseSizeGb) || 0,
          emailStorageGb: parseFloat(emailStorageGb) || 0,
          backupSizeGb: parseFloat(backupSizeGb) || 0,
          logsSizeGb: parseFloat(logsSizeGb) || 0,
          temporaryFilesSizeGb: parseFloat(temporaryFilesSizeGb) || 0,
          lastCheckedAt: lastCheckedAt ? new Date(lastCheckedAt).toISOString() : new Date().toISOString(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        await fetchStorage();
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        throw new Error(data.error || 'Failed to save storage record.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save storage record.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#0f766e] focus:ring-2 focus:ring-emerald-100 rounded-xl text-xs font-semibold text-slate-700 transition-all outline-none";
  const labelClass = "text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <HardDrive size={22} className="text-[#0f766e]" />
            Hosting Storage Monitor
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Manually enter cPanel disk usage metrics and track storage warnings
          </p>
        </div>
        <button
          onClick={fetchStorage}
          disabled={isLoading}
          className="p-2 bg-white hover:bg-slate-50 text-slate-500 rounded-xl border border-slate-200 active:scale-95 shadow-soft transition-all"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-bold flex items-start gap-2.5">
          <AlertCircle className="shrink-0 mt-0.5" size={16} />
          <span>{error}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-xs font-bold flex items-start gap-2.5 animate-[fadeIn_0.2s_ease-out]">
          <Save className="shrink-0 mt-0.5" size={16} />
          <span>Storage record saved successfully!</span>
        </div>
      )}

      {/* Charts */}
      <StorageCharts latestRecord={latestRecord} />

      {/* Warnings */}
      <StorageUsageCards latestRecord={latestRecord} />

      {/* Manual Input Form */}
      <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-soft">
        <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Save size={16} className="text-[#0f766e]" />
          Enter Storage Readings
        </h3>

        <form onSubmit={handleSaveStorage} className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Total Storage (GB)</label>
            <input type="number" step="0.01" value={totalStorageGb} onChange={(e) => setTotalStorageGb(e.target.value)} className={inputClass} placeholder="e.g. 50" required />
          </div>
          <div>
            <label className={labelClass}>Used Storage (GB)</label>
            <input type="number" step="0.01" value={usedStorageGb} onChange={(e) => setUsedStorageGb(e.target.value)} className={inputClass} placeholder="e.g. 32.5" required />
          </div>
          <div>
            <label className={labelClass}>public_html Size (GB)</label>
            <input type="number" step="0.01" value={publicHtmlSizeGb} onChange={(e) => setPublicHtmlSizeGb(e.target.value)} className={inputClass} placeholder="e.g. 18.2" />
          </div>
          <div>
            <label className={labelClass}>Database Size (GB)</label>
            <input type="number" step="0.01" value={databaseSizeGb} onChange={(e) => setDatabaseSizeGb(e.target.value)} className={inputClass} placeholder="e.g. 2.1" />
          </div>
          <div>
            <label className={labelClass}>Email Storage (GB)</label>
            <input type="number" step="0.01" value={emailStorageGb} onChange={(e) => setEmailStorageGb(e.target.value)} className={inputClass} placeholder="e.g. 4.5" />
          </div>
          <div>
            <label className={labelClass}>Backup Size (GB)</label>
            <input type="number" step="0.01" value={backupSizeGb} onChange={(e) => setBackupSizeGb(e.target.value)} className={inputClass} placeholder="e.g. 6.0" />
          </div>
          <div>
            <label className={labelClass}>Logs Size (GB)</label>
            <input type="number" step="0.01" value={logsSizeGb} onChange={(e) => setLogsSizeGb(e.target.value)} className={inputClass} placeholder="e.g. 1.2" />
          </div>
          <div>
            <label className={labelClass}>Temporary Files (GB)</label>
            <input type="number" step="0.01" value={temporaryFilesSizeGb} onChange={(e) => setTemporaryFilesSizeGb(e.target.value)} className={inputClass} placeholder="e.g. 0.5" />
          </div>
          <div>
            <label className={labelClass}>Last Checked Date</label>
            <input type="datetime-local" value={lastCheckedAt} onChange={(e) => setLastCheckedAt(e.target.value)} className={inputClass} />
          </div>

          <div className="sm:col-span-2 lg:col-span-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#0f766e] hover:bg-[#115e59] text-white font-bold text-xs rounded-xl shadow-soft transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save size={14} />
              {saving ? 'Saving...' : 'Save Storage Record'}
            </button>
          </div>
        </form>
      </div>

      {/* Checklist */}
      <StorageChecklist />
    </div>
  );
}
