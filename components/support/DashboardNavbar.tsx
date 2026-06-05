'use client';

import React, { useEffect, useState } from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';

interface NavbarProps {
  setMobileOpen: (open: boolean) => void;
}

export default function DashboardNavbar({ setMobileOpen }: NavbarProps) {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    setCurrentDate(new Date().toLocaleDateString('en-US', options));
  }, []);

  return (
    <header className="h-16 border-b border-slate-200 bg-white sticky top-0 z-40 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-slate-700 md:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Dashboard Title */}
        <div className="hidden sm:block">
          <h1 className="text-lg font-bold text-slate-800 leading-none">Support Dashboard</h1>
          <p className="text-[10.5px] text-slate-500 font-medium mt-1">
            Monitor user issues, repeated complaints, and staff performance
          </p>
        </div>
      </div>

      {/* Right Navbar Controls */}
      <div className="flex items-center gap-4">
        {/* Date Display */}
        <div className="hidden lg:block text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-100 rounded-full px-3 py-1">
          📅 {currentDate || 'Loading date...'}
        </div>

        {/* Notification Icon */}
        <button className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 relative transition-all">
          <Bell size={18} />
          {/* Notification Badge */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 border border-white rounded-full" />
        </button>

        {/* User profile */}
        <div className="flex items-center gap-2 border-l border-slate-100 pl-4">
          <div className="w-8 h-8 rounded-full bg-teal-100 text-[#0f766e] flex items-center justify-center font-bold text-xs shadow-soft ring-2 ring-emerald-50">
            <User size={14} />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-none">Administrator</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
