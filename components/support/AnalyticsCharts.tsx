'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface AnalyticsData {
  categoryCounts: Record<string, number>;
  statusCounts: Record<string, number>;
  priorityCounts: Record<string, number>;
  dailyTrend: { date: string; count: number }[];
  repeatedIssues: { groupName: string; count: number }[];
}

interface AnalyticsChartsProps {
  data: AnalyticsData;
  isLoading?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  'Open': '#3b82f6',        // Blue
  'In Progress': '#6366f1', // Indigo
  'Pending': '#f59e0b',     // Amber
  'Resolved': '#10b981',    // Emerald
  'Closed': '#94a3b8',      // Gray
  'Archived': '#64748b',    // Slate
};

const PRIORITY_COLORS: Record<string, string> = {
  'Low': '#94a3b8',      // Gray
  'Medium': '#f59e0b',   // Yellow
  'High': '#f97316',     // Orange
  'Critical': '#ef4444', // Red
};

export default function AnalyticsCharts({ data, isLoading = false }: AnalyticsChartsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isLoading || !mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="h-72 bg-slate-50 border border-slate-200 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  // Format Category Data
  const categoryChartData = Object.entries(data.categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .filter(item => item.count > 0);

  // Format Status Data
  const statusChartData = Object.entries(data.statusCounts)
    .map(([name, count]) => ({ name, value: count }))
    .filter(item => item.value > 0);

  // Format Priority Data
  const priorityChartData = Object.entries(data.priorityCounts)
    .map(([name, count]) => ({ name, value: count }))
    .filter(item => item.value > 0);

  // Format Repeated Issues Data
  const repeatedChartData = data.repeatedIssues
    .slice(0, 5)
    .map(item => ({ name: item.groupName, count: item.count }));

  return (
    <div className="space-y-6">
      {/* Top row: Trend & Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Issue Trend */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-soft">
          <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-3">
            Daily Ticket Creation Trend
          </h3>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.dailyTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#0f766e"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Issues by Category */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-soft">
          <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-3">
            Tickets by Category
          </h3>
          <div className="h-64 mt-4">
            {categoryChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs font-semibold text-slate-400">
                No tickets filed yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 600, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0f766e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Middle row: Status & Priority */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issues by Status Donut */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-soft">
          <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-3">
            Tickets Status Distribution
          </h3>
          <div className="h-64 mt-4">
            {statusChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs font-semibold text-slate-400">
                No tickets filed yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Priority Wise Donut */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-soft">
          <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-3">
            Tickets Priority Breakdown
          </h3>
          <div className="h-64 mt-4">
            {priorityChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs font-semibold text-slate-400">
                No tickets filed yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {priorityChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name] || '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Bottom row: Top Repeated Issues */}
      <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-soft">
        <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-3">
          Top 5 Repeated Complaints (Count)
        </h3>
        <div className="h-64 mt-4">
          {repeatedChartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs font-semibold text-slate-400">
              No repeated issues detected
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={repeatedChartData}
                layout="vertical"
                margin={{ top: 10, right: 10, left: 20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fontWeight: 600, fill: '#1e293b' }} axisLine={false} tickLine={false} width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#ec4899" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
