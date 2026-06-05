'use client';

import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

interface StorageRecord {
  totalStorageGb: number;
  usedStorageGb: number;
  availableStorageGb: number;
  publicHtmlSizeGb: number;
  databaseSizeGb: number;
  emailStorageGb: number;
  backupSizeGb: number;
  logsSizeGb: number;
  temporaryFilesSizeGb: number;
}

interface StorageChartsProps {
  latestRecord: StorageRecord | null;
}

export default function StorageCharts({ latestRecord }: StorageChartsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !latestRecord) {
    return (
      <div className="h-64 bg-slate-50 border border-slate-200 animate-pulse rounded-2xl flex items-center justify-center text-slate-400 font-semibold text-xs">
        Preparing storage charts...
      </div>
    );
  }

  const {
    totalStorageGb,
    usedStorageGb,
    availableStorageGb,
    publicHtmlSizeGb,
    databaseSizeGb,
    emailStorageGb,
    backupSizeGb,
    logsSizeGb,
    temporaryFilesSizeGb
  } = latestRecord;

  // Donut data
  const donutData = [
    { name: 'Used Storage', value: Number(usedStorageGb.toFixed(2)) },
    { name: 'Available Storage', value: Number(availableStorageGb.toFixed(2)) }
  ];

  const donutColors = [
    usedStorageGb / totalStorageGb > 0.8 ? '#ef4444' : '#0f766e', // red if critical, teal if fine
    '#ccfbf1' // soft green
  ];

  // Breakdown data
  const breakdownData = [
    { name: 'public_html', size: Number(publicHtmlSizeGb.toFixed(2)) },
    { name: 'MySQL DB', size: Number(databaseSizeGb.toFixed(2)) },
    { name: 'Email Account', size: Number(emailStorageGb.toFixed(2)) },
    { name: 'Backups Dmp', size: Number(backupSizeGb.toFixed(2)) },
    { name: 'Access Logs', size: Number(logsSizeGb.toFixed(2)) },
    { name: 'Temp Files', size: Number(temporaryFilesSizeGb.toFixed(2)) }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Donut Chart: Used vs Available */}
      <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-soft">
        <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-3">
          Storage Used vs Available
        </h3>
        <div className="h-64 mt-4 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {donutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={donutColors[index % donutColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} GB`} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-10px]">
            <span className="text-xl font-black text-slate-700">
              {((usedStorageGb / totalStorageGb) * 100).toFixed(0)}%
            </span>
            <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">
              Used of {totalStorageGb.toFixed(0)} GB
            </span>
          </div>
        </div>
      </div>

      {/* Bar Chart: Storage Breakdown */}
      <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-soft">
        <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-3">
          Storage Breakdown (GB)
        </h3>
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={breakdownData}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value) => `${value} GB`} />
              <Bar dataKey="size" fill="#0ea5e9" radius={[4, 4, 0, 0]}>
                {breakdownData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? '#0ea5e9' : index === 1 ? '#8b5cf6' : index === 2 ? '#ec4899' : index === 3 ? '#f59e0b' : index === 4 ? '#64748b' : '#ef4444'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
