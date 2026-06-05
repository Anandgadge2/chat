'use client';

import React, { useState } from 'react';
import { Send, User, Calendar, MessageSquare } from 'lucide-react';

interface NoteItem {
  id: string;
  note: string;
  addedBy: string | null;
  createdAt: string | Date;
}

interface TicketNotesProps {
  notes: NoteItem[];
  onSubmitNote: (noteText: string) => Promise<boolean>;
}

export default function TicketNotes({ notes, onSubmitNote }: TicketNotesProps) {
  const [newNote, setNewNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setSubmitting(true);
    try {
      const success = await onSubmitNote(newNote);
      if (success) {
        setNewNote('');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <MessageSquare size={14} />
        Internal Staff Notes
      </h3>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Type an internal note... (only visible to support staff)"
          disabled={submitting}
          rows={2}
          className="flex-1 px-3.5 py-2.5 border border-slate-200 focus:border-[#0f766e] focus:ring-2 focus:ring-emerald-100 rounded-xl text-xs bg-slate-50/50 focus:bg-white transition-all disabled:bg-slate-100 resize-none font-semibold text-slate-700"
        />
        <button
          type="submit"
          disabled={submitting || !newNote.trim()}
          className="px-4 bg-[#0f766e] hover:bg-[#115e59] text-white font-bold rounded-xl text-xs flex items-center justify-center shrink-0 disabled:opacity-50 active:scale-95 transition-all shadow-soft"
        >
          {submitting ? '...' : <Send size={15} />}
        </button>
      </form>

      {/* Notes log */}
      {notes.length === 0 ? (
        <div className="p-4 border border-dashed border-slate-200 rounded-xl text-center text-xs font-semibold text-slate-400">
          No internal notes have been recorded for this ticket.
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {notes.map((note) => (
            <div key={note.id} className="bg-amber-50/40 border border-amber-100/60 rounded-xl p-3.5 shadow-soft">
              <p className="text-xs font-semibold text-slate-700 whitespace-pre-wrap leading-relaxed select-text">
                {note.note}
              </p>
              
              <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold mt-3 border-t border-amber-100/30 pt-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <User size={11} className="text-slate-300" />
                  <span>By: {note.addedBy || 'Staff'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={11} className="text-slate-300" />
                  <span>
                    {new Date(note.createdAt).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
