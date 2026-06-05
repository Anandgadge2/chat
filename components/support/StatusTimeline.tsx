import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface HistoryItem {
  id: string;
  oldStatus: string | null;
  newStatus: string;
  changedBy: string | null;
  createdAt: string | Date;
}

interface StatusTimelineProps {
  history: HistoryItem[];
}

export default function StatusTimeline({ history }: StatusTimelineProps) {
  if (!history || history.length === 0) {
    return (
      <div className="p-4 border border-slate-100 bg-slate-50 text-slate-400 rounded-xl text-center text-xs font-semibold">
        No status history recorded.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
        Ticket Timeline
      </h3>
      <div className="relative border-l border-slate-150 pl-4 ml-2.5 space-y-5">
        {history.map((item, index) => {
          const isCreation = !item.oldStatus;
          return (
            <div key={item.id} className="relative">
              {/* Stepper Dot */}
              <span className={`absolute left-[-21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white ring-4 
                ${isCreation ? 'bg-blue-500 ring-blue-100' : ''}
                ${item.newStatus === 'Resolved' ? 'bg-emerald-500 ring-emerald-100' : ''}
                ${item.newStatus === 'Closed' ? 'bg-gray-400 ring-gray-100' : ''}
                ${!isCreation && item.newStatus !== 'Resolved' && item.newStatus !== 'Closed' ? 'bg-indigo-500 ring-indigo-100' : ''}
              `} />

              {/* Step Details */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 shadow-soft text-xs leading-normal">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 flex-wrap">
                  {isCreation ? (
                    <span className="text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                      Ticket Created
                    </span>
                  ) : (
                    <>
                      <span className="text-slate-500 font-semibold">{item.oldStatus}</span>
                      <ArrowRight size={10} className="text-slate-400 shrink-0" />
                      <span className="text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                        {item.newStatus}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-4 text-[10.5px] text-slate-400 font-semibold mt-2.5">
                  <div className="flex items-center gap-1">
                    <User size={12} className="text-slate-300" />
                    <span>By: {item.changedBy || 'System'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={12} className="text-slate-300" />
                    <span>
                      {new Date(item.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
