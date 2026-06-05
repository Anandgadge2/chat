import ChatWindow from '@/components/ChatWindow';
import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#eef2f1] p-0 sm:p-4">
      <main className="w-full max-w-[440px] h-[100dvh] sm:h-[90dvh] sm:max-h-[860px] sm:min-h-[620px] bg-white sm:rounded-[40px] sm:border sm:border-slate-200/80 sm:shadow-[0_20px_60px_rgba(15,118,110,0.14),0_8px_24px_rgba(0,0,0,0.08)] overflow-hidden relative flex flex-col">
        {/* Dynamic Island / Notch Simulation */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5.5 bg-neutral-900 rounded-full z-50 hidden sm:flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-neutral-800 rounded-full ml-auto mr-3.5 border border-neutral-700/80" />
        </div>
        
        {/* Content wrapper — allows full scroll */}
        <div className="flex-1 w-full h-full relative flex flex-col overflow-hidden bg-[#f3f4ef]">
          <ChatWindow />
        </div>
      </main>

      {/* Floating Access Dashboard Button */}
      <Link 
        href="/support-dashboard"
        className="fixed bottom-6 right-6 z-50 bg-[#0f766e] hover:bg-[#0d645d] text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 font-bold text-sm transition-all hover:scale-105 active:scale-95 border border-teal-500/20"
      >
        <LayoutDashboard size={18} />
        <span>Access Dashboard</span>
      </Link>
    </div>
  );
}
