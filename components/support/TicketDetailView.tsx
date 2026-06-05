'use client';

import React, { useState } from 'react';
import { 
  User, Phone, Mail, Globe, Clock, Calendar, 
  UserCheck, Shield, BookOpen, MessageSquare, AlertCircle, Edit, Check
} from 'lucide-react';
import TicketStatusBadge from './TicketStatusBadge';
import PriorityBadge from './PriorityBadge';
import { VALID_STATUSES, VALID_PRIORITIES } from '@/lib/validations';

interface SupportStaff {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

interface SupportTicket {
  id: string;
  ticketId: string;
  userName: string;
  userMobile: string;
  userEmail: string | null;
  category: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  language: string | null;
  assignedTo: string | null;
  chatTranscript: string | null;
  screenshotUrl: string | null;
  repeatedGroup: string | null;
  resolutionComment: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  resolvedAt: string | Date | null;
}

interface TicketDetailViewProps {
  ticket: SupportTicket;
  staffList: SupportStaff[];
  onUpdateTicket: (update: {
    status?: string;
    priority?: string;
    assignedTo?: string | null;
    resolutionComment?: string | null;
  }) => Promise<boolean>;
}

export default function TicketDetailView({ ticket, staffList, onUpdateTicket }: TicketDetailViewProps) {
  const [status, setStatus] = useState(ticket.status);
  const [priority, setPriority] = useState(ticket.priority);
  const [assignedTo, setAssignedTo] = useState(ticket.assignedTo || '');
  const [resComment, setResComment] = useState(ticket.resolutionComment || '');
  const [editingComment, setEditingComment] = useState(false);
  const [saving, setSaving] = useState(false);

  // Parse chat transcript
  let parsedTranscript: any[] = [];
  if (ticket.chatTranscript) {
    try {
      parsedTranscript = JSON.parse(ticket.chatTranscript);
      if (!Array.isArray(parsedTranscript)) {
        parsedTranscript = [];
      }
    } catch (e) {
      console.warn('Could not parse chat transcript JSON:', e);
    }
  }

  const handleUpdate = async (fields: {
    status?: string;
    priority?: string;
    assignedTo?: string | null;
    resolutionComment?: string | null;
  }) => {
    setSaving(true);
    try {
      const success = await onUpdateTicket(fields);
      if (success) {
        if (fields.status) setStatus(fields.status);
        if (fields.priority) setPriority(fields.priority);
        if (fields.assignedTo !== undefined) setAssignedTo(fields.assignedTo || '');
        if (fields.resolutionComment !== undefined) {
          setResComment(fields.resolutionComment || '');
          setEditingComment(false);
        }
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Col 1 & 2: Ticket Info & Transcript */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Ticket Description Area */}
        <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-soft">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-2">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Support Ticket</span>
              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight mt-0.5">{ticket.ticketId}</h2>
            </div>
            <div className="flex items-center gap-2">
              <PriorityBadge priority={priority} />
              <TicketStatusBadge status={status} />
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <span className="text-[10px] font-extrabold text-[#0f766e] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wider">
                {ticket.category}
              </span>
              <h3 className="text-base font-extrabold text-slate-800 mt-2 tracking-tight select-text">{ticket.title}</h3>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs font-semibold text-slate-700 whitespace-pre-wrap leading-relaxed select-text shadow-inner">
              {ticket.description}
            </div>

            {ticket.screenshotUrl && (
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">Attached Screenshot</span>
                <a 
                  href={ticket.screenshotUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block border border-slate-200 hover:border-indigo-300 rounded-xl overflow-hidden p-1 bg-slate-50 transition-all hover:shadow-soft group"
                >
                  <img 
                    src={ticket.screenshotUrl} 
                    alt="Ticket screenshot" 
                    className="max-h-64 object-contain rounded-lg group-hover:scale-[1.01] transition-transform duration-200"
                  />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Chat Transcript Panel */}
        {parsedTranscript.length > 0 && (
          <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-soft">
            <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <MessageSquare size={16} className="text-emerald-600" />
              Chat Support Assistant Transcript
            </h3>
            
            <div className="mt-4 border border-slate-150 rounded-2xl overflow-hidden shadow-inner bg-slate-50 max-h-[400px] overflow-y-auto p-4 space-y-3 chat-scrollbar">
              {parsedTranscript.map((msg, index) => {
                const isBot = msg.type === 'assistant' || msg.sender === 'assistant';
                return (
                  <div key={index} className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-xs font-semibold leading-relaxed shadow-soft
                      ${isBot 
                        ? 'bg-white text-slate-700 rounded-tl-none border border-slate-150' 
                        : 'bg-[#dcf8c6] text-slate-800 rounded-tr-none'
                      }
                    `}>
                      <p className="whitespace-pre-wrap select-text">{msg.content || msg.text}</p>
                      <span className="block text-[8px] font-bold text-slate-400 text-right mt-1">
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Col 3: Actions & Details sidebar */}
      <div className="space-y-6">
        
        {/* Ticket Operations Form */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-soft space-y-4">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <UserCheck size={14} />
            Ticket Actions
          </h3>

          {/* Status Select */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Ticket Status</label>
            <select
              value={status}
              disabled={saving}
              onChange={(e) => handleUpdate({ status: e.target.value })}
              className="w-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:bg-white focus:border-[#0f766e] focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
            >
              {VALID_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Priority Select */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Priority Level</label>
            <select
              value={priority}
              disabled={saving}
              onChange={(e) => handleUpdate({ priority: e.target.value })}
              className="w-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:bg-white focus:border-[#0f766e] focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
            >
              {VALID_PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Assignee Select */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Assigned Support Staff</label>
            <select
              value={assignedTo}
              disabled={saving}
              onChange={(e) => handleUpdate({ assignedTo: e.target.value || null })}
              className="w-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:bg-white focus:border-[#0f766e] focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
            >
              <option value="">Unassigned</option>
              {staffList.filter(s => s.active).map((staff) => (
                <option key={staff.id} value={staff.name}>{staff.name} ({staff.role})</option>
              ))}
            </select>
          </div>

          {/* Quick Mark Resolved Button */}
          {status !== 'Resolved' && status !== 'Closed' && (
            <button
              onClick={() => handleUpdate({ status: 'Resolved' })}
              disabled={saving}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-soft active:scale-[0.98] disabled:opacity-50"
            >
              <Check size={14} />
              Mark as Resolved
            </button>
          )}
        </div>

        {/* Resolution Comment Area */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-soft space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <BookOpen size={14} />
              Resolution Note
            </h3>
            <button
              onClick={() => setEditingComment(!editingComment)}
              className="text-[#0f766e] hover:text-[#115e59] text-[10px] font-bold uppercase tracking-wider flex items-center gap-0.5"
            >
              <Edit size={10} />
              {editingComment ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {editingComment ? (
            <div className="space-y-2">
              <textarea
                value={resComment}
                onChange={(e) => setResComment(e.target.value)}
                placeholder="Enter what resolved this issue..."
                rows={3}
                disabled={saving}
                className="w-full px-3 py-2.5 border border-slate-200 focus:border-[#0f766e] focus:ring-2 focus:ring-emerald-100 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 focus:bg-white transition-all disabled:bg-slate-100 resize-none"
              />
              <button
                onClick={() => handleUpdate({ resolutionComment: resComment.trim() || null })}
                disabled={saving}
                className="w-full py-2 bg-[#0f766e] hover:bg-[#115e59] text-white font-bold text-xs rounded-xl shadow-soft transition-all active:scale-[0.98]"
              >
                Save Resolution Note
              </button>
            </div>
          ) : (
            <div className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-100 p-3 rounded-xl min-h-[50px] whitespace-pre-wrap leading-relaxed select-text shadow-inner">
              {resComment ? resComment : <em className="text-slate-400">No resolution description entered yet.</em>}
            </div>
          )}
        </div>

        {/* Customer Contact Details */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-soft space-y-4">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <Shield size={14} />
            Customer Info
          </h3>

          <div className="space-y-3 text-xs font-semibold text-slate-700">
            {/* User Name */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-teal-55 text-[#0f766e] flex items-center justify-center shrink-0">
                <User size={13} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Full Name</p>
                <p className="text-slate-800 font-bold truncate mt-1 select-all">{ticket.userName}</p>
              </div>
            </div>

            {/* User Mobile */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-55 text-indigo-700 flex items-center justify-center shrink-0">
                <Phone size={13} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Mobile</p>
                <p className="text-slate-850 font-bold truncate mt-1 select-all">{ticket.userMobile}</p>
              </div>
            </div>

            {/* User Email */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-sky-55 text-sky-700 flex items-center justify-center shrink-0">
                <Mail size={13} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Email Address</p>
                <p className="text-slate-800 font-bold truncate mt-1 select-all">{ticket.userEmail || <em className="text-slate-350 font-medium">N/A</em>}</p>
              </div>
            </div>

            {/* Language */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-55 text-amber-700 flex items-center justify-center shrink-0">
                <Globe size={13} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Language</p>
                <p className="text-slate-800 font-bold uppercase truncate mt-1">{ticket.language || 'en'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timestamps Card */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-soft text-[10px] font-bold text-slate-400 uppercase tracking-wider space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Calendar size={12} className="text-slate-350" />
              Created
            </span>
            <span className="text-slate-600 font-extrabold normal-case">
              {new Date(ticket.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-slate-350" />
              Last Updated
            </span>
            <span className="text-slate-600 font-extrabold normal-case">
              {new Date(ticket.updatedAt).toLocaleString()}
            </span>
          </div>
          {ticket.resolvedAt && (
            <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-emerald-600">
              <span className="flex items-center gap-1">
                <Check size={12} className="text-emerald-500" />
                Resolved
              </span>
              <span className="font-extrabold normal-case text-emerald-700">
                {new Date(ticket.resolvedAt).toLocaleString()}
              </span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
