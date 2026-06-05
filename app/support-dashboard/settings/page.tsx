'use client';

import React, { useEffect, useState } from 'react';
import { Settings, Users, Mail, AlertCircle, Save, Plus, Trash2, CheckCircle } from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

export default function SettingsPage() {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New staff form
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Support');

  // SMTP test fields (display only — these are read from env vars on server)
  const smtpHost = process.env.NEXT_PUBLIC_SMTP_HOST || '(not set)';
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_ALERT_EMAIL || '(not set)';

  // Fetch staff list on mount — since we don't have a dedicated API, we simulate with local state
  // In production, connect this to a real /api/support/staff endpoint
  useEffect(() => {
    // Load from localStorage as a quick demo persistence
    const saved = localStorage.getItem('fsm_support_staff');
    if (saved) {
      try {
        setStaffList(JSON.parse(saved));
      } catch { /* ignore */ }
    }
  }, []);

  const saveStaff = (list: StaffMember[]) => {
    setStaffList(list);
    localStorage.setItem('fsm_support_staff', JSON.stringify(list));
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newMember: StaffMember = {
      id: `staff-${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
      active: true,
    };

    const updated = [...staffList, newMember];
    saveStaff(updated);
    setNewName('');
    setNewEmail('');
    setNewRole('Support');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleToggleActive = (id: string) => {
    const updated = staffList.map((s) =>
      s.id === id ? { ...s, active: !s.active } : s
    );
    saveStaff(updated);
  };

  const handleRemove = (id: string) => {
    if (!confirm('Remove this staff member?')) return;
    const updated = staffList.filter((s) => s.id !== id);
    saveStaff(updated);
  };

  const inputClass = "w-full px-3 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#0f766e] focus:ring-2 focus:ring-emerald-100 rounded-xl text-xs font-semibold text-slate-700 transition-all outline-none";
  const labelClass = "text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <Settings size={22} className="text-[#0f766e]" />
          Dashboard Settings
        </h2>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Manage support staff, email alerts configuration, and system preferences
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-xs font-bold flex items-center gap-2 animate-[fadeIn_0.2s_ease-out]">
          <CheckCircle size={14} />
          Changes saved successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Support Staff Management */}
        <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-soft space-y-5">
          <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Users size={16} className="text-indigo-500" />
            Support Staff
          </h3>

          {/* Add Staff Form */}
          <form onSubmit={handleAddStaff} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Rohit Kumar"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. rohit@company.com"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className={inputClass}
                >
                  <option value="Support">Support</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0f766e] hover:bg-[#115e59] text-white font-bold text-xs rounded-xl shadow-soft transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Plus size={14} />
              Add Staff Member
            </button>
          </form>

          {/* Staff List */}
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {staffList.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs font-bold border border-dashed border-slate-200 rounded-xl">
                No support staff added yet. Use the form above to add team members.
              </div>
            ) : (
              staffList.map((staff) => (
                <div
                  key={staff.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    staff.active
                      ? 'bg-white border-slate-200 hover:border-slate-300'
                      : 'bg-slate-50 border-slate-100 opacity-60'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${staff.active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      <span className="text-xs font-extrabold text-slate-800">{staff.name}</span>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{staff.role}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1 ml-4">{staff.email}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleToggleActive(staff.id)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                        staff.active
                          ? 'text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100'
                          : 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      {staff.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleRemove(staff.id)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200 transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Email Alert Configuration */}
        <div className="space-y-6">
          <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-soft space-y-5">
            <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Mail size={16} className="text-sky-500" />
              Email Alert Configuration
            </h3>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 text-[10.5px] text-amber-800 font-semibold leading-relaxed flex items-start gap-2">
              <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
              <span>
                SMTP settings are configured via environment variables in your <code className="bg-amber-100 px-1 py-0.5 rounded">.env</code> file. 
                They are <strong>never exposed</strong> on the frontend for security.
              </span>
            </div>

            <div className="space-y-3 text-xs font-semibold text-slate-600">
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">SMTP_HOST</span>
                <span className="font-bold text-slate-700">{smtpHost}</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">SMTP_PORT</span>
                <span className="font-bold text-slate-700">587</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">SMTP_USER</span>
                <span className="font-bold text-slate-500 italic">Configured in .env</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">SMTP_PASS</span>
                <span className="font-bold text-slate-500 italic">••••••••</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">SUPPORT_ALERT_EMAIL</span>
                <span className="font-bold text-slate-700">{supportEmail}</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              To update SMTP settings, modify the variables in your <code>.env</code> file and restart the server.
              The email service is used to send ticket creation alerts to the support email address above.
            </p>
          </div>

          {/* Quick Links */}
          <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-soft space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Settings size={16} className="text-[#0f766e]" />
              Quick Links
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <a href="/chat-support" target="_blank" className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-xl text-xs font-bold text-emerald-800 transition-all">
                🔗 Open Chat Support Portal (Customer-Facing)
              </a>
              <a href="/support-dashboard/tickets" className="p-3 bg-sky-50 hover:bg-sky-100 border border-sky-100 rounded-xl text-xs font-bold text-sky-800 transition-all">
                📋 Manage All Tickets
              </a>
              <a href="/support-dashboard/analytics" className="p-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl text-xs font-bold text-indigo-800 transition-all">
                📊 View Analytics Dashboard
              </a>
              <a href="/" className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 transition-all">
                💬 Go to Original Chatbot
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
