'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, MessageSquare, Globe, ArrowLeft, 
  CheckCircle2, User, Phone, Mail, AlertTriangle, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { VALID_CATEGORIES, VALID_PRIORITIES } from '@/lib/validations';
import { VALID_LANGUAGES } from '@/lib/validators';

interface Message {
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

type Step = 
  | 'language'
  | 'name'
  | 'mobile'
  | 'email'
  | 'category'
  | 'title'
  | 'description'
  | 'priority'
  | 'screenshot'
  | 'confirm'
  | 'success';

export default function ChatSupportPage() {
  const [step, setStep] = useState<Step>('language');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Collected fields
  const [language, setLanguage] = useState('en');
  const [userName, setUserName] = useState('');
  const [userMobile, setUserMobile] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [generatedTicketId, setGeneratedTicketId] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, step]);

  // Initial bot welcome message
  useEffect(() => {
    const welcomeText = 
      "Hello! Welcome to PugArch FSM Support Assistant. 👋\n" +
      "I will help you raise a support ticket. First, please select your preferred language below:";
    setMessages([
      { sender: 'bot', text: welcomeText, timestamp: new Date() }
    ]);
  }, []);

  const addBotMessage = (text: string) => {
    setMessages(prev => [...prev, { sender: 'bot', text, timestamp: new Date() }]);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, { sender: 'user', text, timestamp: new Date() }]);
  };

  const handleLanguageSelect = (lang: string) => {
    setLanguage(lang);
    addUserMessage(lang.toUpperCase());
    setStep('name');
    addBotMessage("Got it! Please type your full name:");
  };

  const handleTextSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanVal = inputValue.trim();
    if (!cleanVal) return;

    setError(null);
    setInputValue('');
    addUserMessage(cleanVal);

    if (step === 'name') {
      if (cleanVal.length < 2 || cleanVal.length > 100) {
        setError('Name must be between 2 and 100 characters.');
        addBotMessage('Oops! That name seems too short or long. Please enter your full name:');
        return;
      }
      setUserName(cleanVal);
      setStep('mobile');
      addBotMessage('Perfect. Now please enter your contact mobile number (10 to 13 digits):');
      
    } else if (step === 'mobile') {
      const digits = cleanVal.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 13) {
        setError('Invalid mobile number format.');
        addBotMessage('Please enter a valid mobile number with 10 to 13 digits:');
        return;
      }
      setUserMobile(cleanVal);
      setStep('email');
      addBotMessage('Got it. What is your email address? (You can type "skip" if you prefer not to share it):');
      
    } else if (step === 'email') {
      const isSkip = cleanVal.toLowerCase() === 'skip';
      if (!isSkip) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cleanVal)) {
          setError('Invalid email address format.');
          addBotMessage('Hmm, that email doesn\'t look right. Please enter a valid email or type "skip":');
          return;
        }
        setUserEmail(cleanVal);
      } else {
        setUserEmail('');
      }
      setStep('category');
      addBotMessage('Understood. Please select the category that best describes your issue from the list below:');
      
    } else if (step === 'title') {
      if (cleanVal.length < 4 || cleanVal.length > 150) {
        setError('Title must be between 4 and 150 characters.');
        addBotMessage('Please enter a brief issue title (between 4 and 150 characters):');
        return;
      }
      setTitle(cleanVal);
      setStep('description');
      addBotMessage('Please type a detailed description of your issue (at least 10 characters):');
      
    } else if (step === 'description') {
      if (cleanVal.length < 10 || cleanVal.length > 3000) {
        setError('Description must be at least 10 characters.');
        addBotMessage('Please describe the issue in detail (at least 10 characters):');
        return;
      }
      setDescription(cleanVal);
      setStep('priority');
      addBotMessage('Understood. What is the priority level of this issue? Select from the options below:');
      
    } else if (step === 'screenshot') {
      const isSkip = cleanVal.toLowerCase() === 'skip';
      if (!isSkip) {
        if (!cleanVal.startsWith('http://') && !cleanVal.startsWith('https://')) {
          setError('URL must start with http:// or https://');
          addBotMessage('Please enter a valid screenshot image URL starting with http/https, or type "skip":');
          return;
        }
        setScreenshotUrl(cleanVal);
      } else {
        setScreenshotUrl('');
      }
      setStep('confirm');
      addBotMessage('Excellent. Please review your details below and click "Confirm and Submit Ticket" to proceed.');
    }
  };

  const handleCategorySelect = (cat: string) => {
    setCategory(cat);
    addUserMessage(cat);
    setStep('title');
    addBotMessage('Please enter a brief title/summary for your issue:');
  };

  const handlePrioritySelect = (prio: string) => {
    setPriority(prio);
    addUserMessage(prio.toUpperCase());
    setStep('screenshot');
    addBotMessage('If you have an uploaded screenshot URL, paste it here, otherwise type "skip":');
  };

  const handleConfirmSubmit = async () => {
    setLoading(true);
    setError(null);

    // Build the transcript JSON
    const chatTranscript = messages.map(msg => ({
      sender: msg.sender,
      content: msg.text,
      timestamp: msg.timestamp
    }));

    try {
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          userMobile,
          userEmail: userEmail || null,
          category,
          title,
          description,
          priority,
          language,
          screenshotUrl: screenshotUrl || null,
          chatTranscript
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit support ticket.');
      }

      setGeneratedTicketId(data.data.ticketId);
      addUserMessage('CONFIRM DETAILS AND SUBMIT');
      setStep('success');
      addBotMessage(data.message);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error occurred.';
      setError(msg);
      addBotMessage(`Sorry, submission failed: ${msg}. Please try confirming again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] h-[100dvh] sm:h-[90dvh] sm:max-h-[860px] sm:min-h-[620px] bg-white sm:rounded-[30px] sm:border sm:border-slate-200/80 sm:shadow-[0_20px_60px_rgba(15,118,110,0.12),0_8px_24px_rgba(0,0,0,0.06)] overflow-hidden relative flex flex-col mx-auto my-auto select-none">
      
      {/* Bot Chat Header */}
      <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between shrink-0 z-[200] sm:pt-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white">
            <ArrowLeft size={20} />
          </Link>
          <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-base font-bold shadow-soft ring-1 ring-white/20">
            <span>PA</span>
          </div>
          <div>
            <h2 className="font-bold text-sm leading-tight">PugArch Support Care</h2>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1.5 mt-0.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online Ticket Agent
            </span>
          </div>
        </div>
        
        {/* Globe indicator */}
        <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full text-[10.5px] font-bold">
          <Globe size={12} />
          <span className="uppercase">{language}</span>
        </div>
      </div>

      {/* Messages Scrolling Container */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 min-h-0 overflow-y-auto whatsapp-bg chat-scrollbar px-4 py-4 space-y-3"
      >
        {messages.map((msg, index) => {
          const isBot = msg.sender === 'bot';
          return (
            <div key={index} className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs font-semibold leading-relaxed shadow-soft
                ${isBot 
                  ? 'bg-white text-slate-700 rounded-tl-none border border-slate-150 bubble-in' 
                  : 'bg-[#dcf8c6] text-slate-800 rounded-tr-none bubble-out'
                }
              `}>
                <p className="whitespace-pre-wrap select-text">{msg.text}</p>
                <span className="block text-[8px] font-bold text-slate-400 text-right mt-1.5">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {/* Input Validation Error */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-650 text-xs font-bold flex items-start gap-2 animate-[fadeIn_0.2s_ease-out]">
            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={14} />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-soft border border-slate-100 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0f766e] dot-bounce-1" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#0f766e] dot-bounce-2" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#0f766e] dot-bounce-3" />
            </div>
          </div>
        )}

        {/* Interactive Step selectors */}
        {!loading && (
          <div className="py-2.5 w-full shrink-0">
            
            {/* Step 1: Language selection */}
            {step === 'language' && (
              <div className="grid grid-cols-3 gap-2 bg-white/70 p-3 rounded-2xl border border-slate-200 shadow-soft">
                {VALID_LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageSelect(lang)}
                    className="py-2 px-1 bg-white hover:bg-emerald-50 hover:text-[#0f766e] text-slate-600 font-bold border border-slate-200 hover:border-emerald-200 rounded-xl text-center text-xs transition-all active:scale-95 shadow-soft"
                  >
                    {lang === 'en' ? 'English' : 
                     lang === 'hi' ? 'हिन्दी' : 
                     lang === 'mr' ? 'मराठी' : 
                     lang === 'gu' ? 'ગુજરાતી' :
                     lang === 'bn' ? 'বাংলা' :
                     lang === 'ta' ? 'தமிழ்' :
                     lang === 'te' ? 'తెలుగు' :
                     lang === 'kn' ? 'ಕನ್ನಡ' : 'Other'}
                  </button>
                ))}
              </div>
            )}

            {/* Step 5: Category Selection */}
            {step === 'category' && (
              <div className="grid grid-cols-2 gap-2 bg-white/70 p-3 rounded-2xl border border-slate-200 shadow-soft max-h-56 overflow-y-auto chat-scrollbar">
                {VALID_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className="p-2.5 bg-white hover:bg-emerald-50 hover:text-[#0f766e] text-slate-700 font-bold border border-slate-200 hover:border-emerald-200 rounded-xl text-left text-xs transition-all active:scale-95 shadow-soft truncate"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Step 8: Priority Selection */}
            {step === 'priority' && (
              <div className="grid grid-cols-2 gap-2 bg-white/70 p-3 rounded-2xl border border-slate-200 shadow-soft">
                {VALID_PRIORITIES.map((prio) => (
                  <button
                    key={prio}
                    onClick={() => handlePrioritySelect(prio)}
                    className={`p-2.5 font-bold border rounded-xl text-center text-xs transition-all active:scale-95 shadow-soft
                      ${prio === 'Critical' ? 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200' : ''}
                      ${prio === 'High' ? 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200' : ''}
                      ${prio === 'Medium' ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200' : ''}
                      ${prio === 'Low' ? 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200' : ''}
                    `}
                  >
                    {prio}
                  </button>
                ))}
              </div>
            )}

            {/* Step 10: Confirmation details card */}
            {step === 'confirm' && (
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card space-y-3 animate-[slideInUp_0.25s_cubic-bezier(0.1,0.8,0.3,1)]">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  Confirm Details
                </h4>
                
                <div className="space-y-1.5 text-[11px] font-semibold text-slate-500 max-h-48 overflow-y-auto pr-1">
                  <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-400">Name:</span> <span className="text-slate-800 font-bold">{userName}</span></div>
                  <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-400">Mobile:</span> <span className="text-slate-800 font-bold">{userMobile}</span></div>
                  {userEmail && <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-400">Email:</span> <span className="text-slate-800 font-bold">{userEmail}</span></div>}
                  <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-400">Category:</span> <span className="text-slate-800 font-bold">{category}</span></div>
                  <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-400">Title:</span> <span className="text-slate-850 font-bold truncate max-w-[200px]">{title}</span></div>
                  <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-400">Priority:</span> <span className={`font-bold ${priority === 'Critical' ? 'text-red-600' : priority === 'High' ? 'text-orange-600' : 'text-slate-800'}`}>{priority}</span></div>
                  {screenshotUrl && <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-400">Screenshot:</span> <span className="text-indigo-600 font-bold truncate max-w-[150px]">{screenshotUrl}</span></div>}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleConfirmSubmit}
                    className="flex-1 py-2.5 bg-[#0f766e] hover:bg-[#115e59] text-white font-bold rounded-full shadow-soft text-xs active:scale-95 transition-all"
                  >
                    Confirm and Submit
                  </button>
                  <button
                    onClick={() => {
                      addUserMessage('RESTART WIZARD');
                      setStep('name');
                      addBotMessage('Restarting support agent. Please enter your name:');
                    }}
                    className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-full text-xs active:scale-95 transition-all"
                  >
                    Restart
                  </button>
                </div>
              </div>
            )}

            {/* Step 11: Success confirmation panel */}
            {step === 'success' && (
              <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl text-center space-y-3 animate-[slideInUp_0.25s_cubic-bezier(0.1,0.8,0.3,1)]">
                <CheckCircle2 className="text-emerald-500 mx-auto" size={32} />
                <h4 className="text-sm font-extrabold text-emerald-950">Ticket Generated!</h4>
                <div className="bg-white border border-emerald-100/60 p-2.5 rounded-xl text-xs font-black text-slate-800 select-all shadow-inner">
                  {generatedTicketId}
                </div>
                <p className="text-[10.5px] text-emerald-700 font-semibold leading-relaxed">
                  Your ticket has been logged into the database. A support representative will email or call you shortly.
                </p>
                <button
                  onClick={() => {
                    setStep('language');
                    setMessages([{ sender: 'bot', text: 'Hello! First, select your preferred language:', timestamp: new Date() }]);
                    setUserName('');
                    setUserMobile('');
                    setUserEmail('');
                    setCategory('');
                    setTitle('');
                    setDescription('');
                    setScreenshotUrl('');
                  }}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-soft transition-all active:scale-95"
                >
                  Start Another Chat
                </button>
              </div>
            )}

          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Text Input Form */}
      {(step === 'name' || step === 'mobile' || step === 'email' || step === 'title' || step === 'description' || step === 'screenshot') && (
        <form 
          onSubmit={handleTextSubmit}
          className="shrink-0 bg-white border-t border-slate-100 pb-3 pt-2 px-3.5 flex gap-2 items-center"
        >
          <input
            type="text"
            placeholder={
              step === 'name' ? 'Enter full name...' :
              step === 'mobile' ? 'Enter mobile number...' :
              step === 'email' ? 'Enter email address (or "skip")...' :
              step === 'title' ? 'Enter brief title...' :
              step === 'description' ? 'Enter detailed description...' :
              'Enter screenshot URL (or "skip")...'
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#0f766e] focus:ring-2 focus:ring-emerald-100 rounded-full text-xs font-semibold text-slate-700 transition-all outline-none"
          />
          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            className="w-9 h-9 rounded-full bg-[#0f766e] hover:bg-[#115e59] text-white flex items-center justify-center shrink-0 shadow-soft active:scale-90 transition-all disabled:opacity-50"
          >
            <Send size={15} className="ml-0.5" />
          </button>
        </form>
      )}

    </div>
  );
}
