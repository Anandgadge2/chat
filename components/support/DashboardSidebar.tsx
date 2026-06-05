'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Ticket,
  BarChart3,
  AlertOctagon,
  HardDrive,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  MessageSquare
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function DashboardSidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const links = [
    { name: 'Overview', href: '/support-dashboard', icon: LayoutDashboard },
    { name: 'Tickets', href: '/support-dashboard/tickets', icon: Ticket },
    { name: 'Analytics', href: '/support-dashboard/analytics', icon: BarChart3 },
    { name: 'Repeated Issues', href: '/support-dashboard/repeated-issues', icon: AlertOctagon },
    { name: 'Hosting Storage', href: '/support-dashboard/storage', icon: HardDrive },
    { name: 'Support Staff', href: '/support-dashboard/settings?tab=staff', icon: Users },
    { name: 'Settings', href: '/support-dashboard/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href.includes('?tab=')) {
      const base = href.split('?')[0];
      return pathname === base && typeof window !== 'undefined' && window.location.search.includes('tab=staff');
    }
    if (href === '/support-dashboard') {
      return pathname === '/support-dashboard';
    }
    return pathname.startsWith(href) && !pathname.includes('settings?tab=staff');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-800">
          <div className="w-8 h-8 rounded-lg bg-[#0f766e] flex items-center justify-center text-white">
            <MessageSquare size={18} />
          </div>
          {(!collapsed || mobileOpen) && (
            <span className="text-base tracking-tight font-extrabold text-[#0f766e]">
              PugArch <span className="text-slate-500 font-normal">FSM</span>
            </span>
          )}
        </Link>
        
        {/* Collapse Button (Desktop Only) */}
        {!mobileOpen && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 hidden md:block"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 overflow-y-auto px-3 space-y-1.5">
        {links.map((link) => {
          const Active = isActive(link.href);
          const LinkIcon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                Active
                  ? 'bg-emerald-50/80 text-[#0f766e] shadow-soft'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LinkIcon
                size={18}
                className={`${
                  Active ? 'text-[#0f766e]' : 'text-slate-400 group-hover:text-slate-600'
                } shrink-0`}
              />
              {(!collapsed || mobileOpen) && <span>{link.name}</span>}
            </Link>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-100">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all group"
        >
          <LogOut size={18} className="text-red-400 group-hover:text-red-600 shrink-0" />
          {(!collapsed || mobileOpen) && <span>Logout</span>}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer (Overlay) */}
      <div
        className={`fixed inset-0 bg-slate-900/40 z-[999] transition-opacity duration-300 md:hidden ${
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      >
        <div
          className={`w-64 h-full transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {sidebarContent}
        </div>
      </div>

      {/* Desktop Sidebar (Persistent) */}
      <aside
        className={`hidden md:block h-screen shrink-0 transition-all duration-300 sticky top-0 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
