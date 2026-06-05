'use client';

import React from 'react';
import { AlertCircle, ArrowUpRight } from 'lucide-react';
import PriorityBadge from './PriorityBadge';

interface RepeatedIssue {
  groupName: string;
  category: string;
  count: number;
  lastReported: string | Date;
  priority: string;
  suggestedAction: string;
}

interface RepeatedIssuesTableProps {
  issues: RepeatedIssue[];
  isLoading?: boolean;
}

export default function RepeatedIssuesTable({ issues, isLoading = false }: RepeatedIssuesTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="h-16 bg-slate-50 border border-slate-200 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <div className="bg-white p-8 border border-slate-200 rounded-2xl shadow-soft text-center">
        <AlertCircle className="mx-auto text-slate-300 mb-2" size={32} />
        <h4 className="text-sm font-bold text-slate-700">No Repeated Issues Logged</h4>
        <p className="text-xs text-slate-400 font-medium mt-1">
          When multiple users submit tickets with similar keywords, they will be auto-grouped here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-soft overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Issue Group</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4 text-center">Reports</th>
              <th className="py-3.5 px-4">Last Reported</th>
              <th className="py-3.5 px-4">Max Priority</th>
              <th className="py-3.5 px-4">Suggested Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
            {issues.map((issue) => (
              <tr key={issue.groupName} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-800 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full shrink-0 
                    ${issue.count > 30 ? 'bg-red-500 animate-ping' : ''}
                    ${issue.count <= 30 && issue.count > 15 ? 'bg-orange-500' : ''}
                    ${issue.count <= 15 ? 'bg-amber-400' : ''}
                  `} />
                  {issue.groupName}
                </td>
                <td className="py-3.5 px-4 text-slate-500">{issue.category}</td>
                <td className="py-3.5 px-4 text-center">
                  <span className={`px-2.5 py-1 rounded-full font-extrabold text-[11px] 
                    ${issue.count > 30 ? 'bg-red-50 text-red-700 border border-red-100' : ''}
                    ${issue.count <= 30 && issue.count > 15 ? 'bg-orange-50 text-orange-700 border border-orange-100' : ''}
                    ${issue.count <= 15 ? 'bg-slate-100 text-slate-600' : ''}
                  `}>
                    {issue.count} Reports
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-400 font-medium">
                  {new Date(issue.lastReported).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td className="py-3.5 px-4">
                  <PriorityBadge priority={issue.priority} />
                </td>
                <td className="py-3.5 px-4 text-[10.5px] text-slate-500 font-medium max-w-xs leading-relaxed">
                  {issue.suggestedAction}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
