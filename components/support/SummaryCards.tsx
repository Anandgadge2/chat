import React from 'react';
import {
  Ticket,
  MessageSquare,
  RefreshCw,
  Hourglass,
  CheckCircle2,
  Lock,
  AlertTriangle,
  Calendar,
  AlertOctagon,
  Clock
} from 'lucide-react';

interface StatsData {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  pendingTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  highPriorityTickets: number;
  todayTickets: number;
  repeatedIssues: number;
  averageResolutionTime: string;
}

interface SummaryCardsProps {
  stats: StatsData;
  isLoading?: boolean;
}

export default function SummaryCards({ stats, isLoading = false }: SummaryCardsProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, idx) => (
          <div key={idx} className="h-[92px] bg-slate-100 border border-slate-200 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Tickets',
      value: stats.totalTickets ?? 0,
      description: 'Overall issues raised',
      icon: Ticket,
      color: 'border-l-blue-500 text-blue-600 bg-blue-50/50',
    },
    {
      title: 'Open Tickets',
      value: stats.openTickets ?? 0,
      description: 'Awaiting first response',
      icon: MessageSquare,
      color: 'border-l-sky-500 text-sky-600 bg-sky-50/50',
    },
    {
      title: 'In Progress',
      value: stats.inProgressTickets ?? 0,
      description: 'Actively being handled',
      icon: RefreshCw,
      color: 'border-l-indigo-500 text-indigo-600 bg-indigo-50/50 icon-spin',
    },
    {
      title: 'Pending Tickets',
      value: stats.pendingTickets ?? 0,
      description: 'Waiting on user input',
      icon: Hourglass,
      color: 'border-l-amber-500 text-amber-600 bg-amber-50/50',
    },
    {
      title: 'Resolved Tickets',
      value: stats.resolvedTickets ?? 0,
      description: 'Issues fixed successfully',
      icon: CheckCircle2,
      color: 'border-l-emerald-500 text-emerald-600 bg-emerald-50/50',
    },
    {
      title: 'Closed Tickets',
      value: stats.closedTickets ?? 0,
      description: 'Tickets archived/completed',
      icon: Lock,
      color: 'border-l-slate-400 text-slate-600 bg-slate-50/50',
    },
    {
      title: 'High Priority',
      value: stats.highPriorityTickets ?? 0,
      description: 'High & Critical tasks',
      icon: AlertTriangle,
      color: 'border-l-red-500 text-red-600 bg-red-50/50',
    },
    {
      title: 'Today\'s Tickets',
      value: stats.todayTickets ?? 0,
      description: 'Tickets created today',
      icon: Calendar,
      color: 'border-l-teal-500 text-teal-600 bg-teal-50/50',
    },
    {
      title: 'Repeated Issues',
      value: stats.repeatedIssues ?? 0,
      description: 'Detected common patterns',
      icon: AlertOctagon,
      color: 'border-l-rose-500 text-rose-600 bg-rose-50/50',
    },
    {
      title: 'Avg. Resolution Time',
      value: stats.averageResolutionTime ?? '0m',
      description: 'Mean resolution speed',
      icon: Clock,
      color: 'border-l-violet-500 text-violet-600 bg-violet-50/50',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`p-4 border-l-4 border bg-white border-slate-200 rounded-2xl shadow-soft hover:shadow-card transition-all duration-200 flex flex-col justify-between ${card.color.split(' ')[0]}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-1.5 rounded-lg ${card.color.split(' ').slice(1).join(' ')}`}>
                <Icon size={15} />
              </div>
            </div>
            <div className="mt-2.5">
              <p className="text-xl font-extrabold text-slate-800 tracking-tight leading-none">
                {card.value}
              </p>
              <p className="text-[10px] text-slate-400 font-medium mt-1">
                {card.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
