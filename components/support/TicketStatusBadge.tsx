import React from 'react';

interface TicketStatusBadgeProps {
  status: string;
}

export default function TicketStatusBadge({ status }: TicketStatusBadgeProps) {
  let bgClass = 'bg-gray-100 text-gray-800 border-gray-200';
  
  switch (status) {
    case 'Open':
      bgClass = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
    case 'In Progress':
      bgClass = 'bg-indigo-50 text-indigo-700 border-indigo-200';
      break;
    case 'Pending':
      bgClass = 'bg-amber-50 text-amber-700 border-amber-200';
      break;
    case 'Resolved':
      bgClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
    case 'Closed':
      bgClass = 'bg-gray-50 text-gray-600 border-gray-200';
      break;
    case 'Archived':
      bgClass = 'bg-slate-50 text-slate-600 border-slate-200';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${bgClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 
        ${status === 'Open' ? 'bg-blue-500' : ''}
        ${status === 'In Progress' ? 'bg-indigo-500 animate-pulse' : ''}
        ${status === 'Pending' ? 'bg-amber-500' : ''}
        ${status === 'Resolved' ? 'bg-emerald-500' : ''}
        ${status === 'Closed' ? 'bg-gray-400' : ''}
        ${status === 'Archived' ? 'bg-slate-400' : ''}
      `} />
      {status}
    </span>
  );
}
