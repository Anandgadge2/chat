import React from 'react';

interface PriorityBadgeProps {
  priority: string;
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  let bgClass = 'bg-gray-100 text-gray-700 border-gray-200';
  
  switch (priority) {
    case 'Low':
      bgClass = 'bg-slate-50 text-slate-600 border-slate-200';
      break;
    case 'Medium':
      bgClass = 'bg-amber-50 text-amber-700 border-amber-200';
      break;
    case 'High':
      bgClass = 'bg-orange-50 text-orange-700 border-orange-200';
      break;
    case 'Critical':
      bgClass = 'bg-red-50 text-red-700 border-red-200 animate-pulse';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${bgClass}`}>
      {priority}
    </span>
  );
}
