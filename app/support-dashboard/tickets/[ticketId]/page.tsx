'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import TicketDetailView from '@/components/support/TicketDetailView';
import TicketNotes from '@/components/support/TicketNotes';
import StatusTimeline from '@/components/support/StatusTimeline';

export default function SupportTicketDetailPage({
  params,
}: {
  params: { ticketId: string };
}) {
  const { ticketId } = params;
  const [ticket, setTicket] = useState<any>(null);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTicketDetails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/support/tickets/${ticketId}`);
      const data = await res.json();
      
      if (data.success && data.data) {
        setTicket(data.data);
        setStaffList(data.staff || []);
      } else {
        throw new Error(data.error || 'Ticket not found.');
      }
    } catch (err) {
      console.error('Error fetching ticket details:', err);
      setError('Failed to retrieve ticket details. Check if the Ticket ID is correct.');
    } finally {
      setIsLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchTicketDetails();
  }, [fetchTicketDetails]);

  const handleUpdateTicket = async (updateData: any) => {
    try {
      const res = await fetch(`/api/support/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updateData,
          changedBy: 'Administrator', // Mocking changing user for demo
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Refetch to reload timeline and ticket info
        await fetchTicketDetails();
        return true;
      } else {
        throw new Error(data.error || 'Failed to update ticket.');
      }
    } catch (err) {
      console.error('Error updating ticket details:', err);
      alert(err instanceof Error ? err.message : 'Error updating ticket');
      return false;
    }
  };

  const handleSubmitNote = async (noteText: string) => {
    try {
      const res = await fetch(`/api/support/tickets/${ticketId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          note: noteText,
          addedBy: 'Administrator',
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Refetch to reload notes log
        await fetchTicketDetails();
        return true;
      } else {
        throw new Error(data.error || 'Failed to submit internal note.');
      }
    } catch (err) {
      console.error('Error adding internal note:', err);
      alert(err instanceof Error ? err.message : 'Error adding internal note');
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-24 bg-slate-200 animate-pulse rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
          <div className="lg:col-span-2 h-96 bg-slate-100 rounded-2xl" />
          <div className="h-96 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="space-y-6">
        <Link 
          href="/support-dashboard/tickets" 
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#0f766e] bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-soft transition-colors"
        >
          <ArrowLeft size={14} /> Back to Tickets
        </Link>
        <div className="p-5 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-bold flex items-start gap-2.5">
          <AlertCircle className="shrink-0 mt-0.5" />
          <div>
            <h4 className="font-extrabold font-sans">Error Loading Detail</h4>
            <p className="mt-0.5 font-medium text-red-650">{error || 'Ticket details not found.'}</p>
            <button 
              onClick={fetchTicketDetails}
              className="mt-3 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-[10.5px] transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Back button and page actions */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link 
          href="/support-dashboard/tickets" 
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-xl px-3.5 py-2 shadow-soft transition-all active:scale-95"
        >
          <ArrowLeft size={14} /> Back to Tickets List
        </Link>
        <button
          onClick={fetchTicketDetails}
          className="p-2 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 text-slate-500 active:scale-95 shadow-soft transition-all"
          title="Reload ticket details"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Detail Grid */}
      <TicketDetailView
        ticket={ticket}
        staffList={staffList}
        onUpdateTicket={handleUpdateTicket}
      />

      {/* History and Notes Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-soft">
          <TicketNotes notes={ticket.notes || []} onSubmitNote={handleSubmitNote} />
        </div>
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-soft">
          <StatusTimeline history={ticket.statusHistory || []} />
        </div>
      </div>

    </div>
  );
}
