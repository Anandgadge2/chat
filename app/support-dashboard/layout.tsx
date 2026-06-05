'use client';

import React, { useState } from 'react';
import DashboardSidebar from '@/components/support/DashboardSidebar';
import DashboardNavbar from '@/components/support/DashboardNavbar';

export default function SupportDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-800 antialiased">
      {/* Admin navigation sidebar */}
      <DashboardSidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      {/* Main dashboard content layout */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Navbar */}
        <DashboardNavbar setMobileOpen={setMobileSidebarOpen} />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
