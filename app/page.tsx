import ChatWindow from '@/components/ChatWindow';

export default function Home() {
  return (
    <main className="w-full max-w-[440px] h-[100dvh] sm:h-[88dvh] sm:max-h-[840px] sm:min-h-[620px] bg-black sm:rounded-[48px] sm:border-[12px] sm:border-neutral-800 sm:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative flex flex-col mx-auto">
      {/* Dynamic Island / Notch Simulation */}
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5.5 bg-black rounded-full z-50 hidden sm:flex items-center justify-center">
        <div className="w-2.5 h-2.5 bg-neutral-900 rounded-full ml-auto mr-3.5 border border-neutral-800/80" />
      </div>
      
      {/* Content wrapper */}
      <div className="flex-1 w-full h-full relative overflow-hidden bg-[#efeae2]">
        <ChatWindow />
      </div>
    </main>
  );
}
