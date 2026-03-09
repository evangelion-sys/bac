import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, Calculator, Timer, BookOpen, Settings as SettingsIcon, ChevronRight, Sparkles, Bot, Copy, ExternalLink } from 'lucide-react';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { useAppStore } from '@/store/useAppStore';
import { useDeviceFeatures, useAutoBackup } from '@/hooks/useDeviceFeatures';

const SIDEBAR_CATEGORIES = [
  {
    title: '🧪 The Core Sciences',
    items: [
      { id: 'math', name: 'Mathematics', coeff: 5 },
      { id: 'physics', name: 'Physics & Chemistry', coeff: 5 },
      { id: 'science', name: 'Natural Sciences', coeff: 6 },
    ]
  },
  {
    title: '🗣️ The Languages',
    items: [
      { id: 'arabic', name: 'Arabic', coeff: 3 },
      { id: 'french', name: 'French', coeff: 2 },
      { id: 'english', name: 'English', coeff: 2 },
    ]
  },
  {
    title: '📚 Humanities & Memory',
    items: [
      { id: 'chariaa', name: 'Islamic Education', coeff: 2 },
      { id: 'philo', name: 'Philosophy', coeff: 2 },
      { id: 'histgeo', name: 'History & Geography', coeff: 2 },
    ]
  },
  {
    title: '✨ Magic Tools',
    items: [
      { path: '/calculator', name: 'BAC Calculator', icon: Calculator },
      { path: '/focus', name: 'Zen Mode', icon: Timer },
      { path: '/mistakes', name: 'Mistake Book', icon: BookOpen },
      { path: '/settings', name: 'Data Vault', icon: SettingsIcon },
    ]
  }
];

const AI_PROMPT = "Agis comme un professeur expert pour le BAC Algérien (Filière Sciences Expérimentales). Je m'appelle Serine. Ton but est de m'aider à réviser. Sois clair, concis et encourageant !";

export function Layout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { settings } = useAppStore();

  useDeviceFeatures();
  useAutoBackup();

  useEffect(() => {
    if (settings.theme === 'midnight') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  const handleCopy = () => {
    navigator.clipboard.writeText(AI_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <MotionConfig reducedMotion={settings.lowBatteryMode ? "always" : "user"}>
      <div className={cn(
        "min-h-screen font-sans selection:bg-[#FCE4EC] transition-colors duration-500 flex",
        settings.theme === 'midnight' ? 'bg-slate-900 text-slate-200' : 'bg-[#F3E5F5] text-[#301934]',
        settings.highLegibility && 'font-medium tracking-wide'
      )}>
        
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 glass-panel z-40 flex items-center justify-between px-4">
          <Link to="/" className="font-display text-2xl font-bold text-[#D4AF37] flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> Serine's Guide
          </Link>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-[#301934] dark:text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Sidebar Overlay (Mobile) */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
              className="fixed inset-0 bg-[#301934]/20 backdrop-blur-sm z-50 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar (The Royal Archive) */}
        <motion.aside
          className={cn(
            "fixed top-0 left-0 bottom-0 w-72 glass-panel z-50 overflow-y-auto border-r border-white/60 dark:border-slate-700 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <Link to="/" onClick={closeSidebar} className="font-display text-3xl font-bold text-[#D4AF37] flex items-center gap-2 drop-shadow-sm">
                <Sparkles className="w-6 h-6" /> Serine
              </Link>
              <button onClick={closeSidebar} className="lg:hidden p-2 text-[#301934]/50 dark:text-white/50">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-8">
              {SIDEBAR_CATEGORIES.map((category) => (
                <div key={category.title}>
                  <h3 className="text-xs font-bold text-[#301934]/50 dark:text-slate-400 uppercase tracking-widest mb-3 px-2">
                    {category.title}
                  </h3>
                  <div className="space-y-1">
                    {category.items.map((item: any) => {
                      const path = item.path || `/subject/${item.id}`;
                      const isActive = location.pathname === path;
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.name}
                          to={path}
                          onClick={closeSidebar}
                          className={cn(
                            "flex items-center justify-between px-3 py-2.5 rounded-2xl transition-all duration-300",
                            isActive 
                              ? "bg-[#FCE4EC] dark:bg-pink-900/30 text-[#301934] dark:text-pink-300 font-bold shadow-sm" 
                              : "text-[#301934]/70 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-[#301934] dark:hover:text-white"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            {Icon && <Icon className="w-4 h-4" />}
                            <span className="text-sm">{item.name}</span>
                          </div>
                          {item.coeff && (
                            <span className="text-[10px] font-bold bg-white/60 dark:bg-slate-800 px-2 py-1 rounded-full text-[#301934]/50 dark:text-slate-400">
                              x{item.coeff}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <main className="flex-1 max-w-4xl mx-auto p-4 lg:p-8 pt-20 lg:pt-8 min-h-screen relative">
          <Outlet />
        </main>

        {/* AI Tutor Floating Button (Magic Mirror) */}
        <div className="fixed bottom-6 right-6 z-40">
          <AnimatePresence>
            {isAIOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                className="absolute bottom-16 right-0 w-72 glass-panel rounded-3xl p-5 mb-2"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-[#301934] dark:text-white flex items-center gap-2">
                    <Bot className="w-5 h-5 text-[#D4AF37]" />
                    Magic Tutors
                  </h3>
                  <button onClick={() => setIsAIOpen(false)} className="text-[#301934]/50 hover:text-[#301934] dark:hover:text-slate-200">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="bg-white/40 dark:bg-slate-900/50 p-3 rounded-2xl border border-white/50 dark:border-slate-700 mb-4">
                  <p className="text-xs text-[#301934]/70 dark:text-slate-400 italic mb-2 line-clamp-3">"{AI_PROMPT}"</p>
                  <button 
                    onClick={handleCopy}
                    className="w-full flex items-center justify-center gap-2 bg-[#FCE4EC] dark:bg-pink-900/30 text-[#301934] dark:text-pink-400 py-2 rounded-xl text-xs font-bold hover:bg-[#FCE4EC]/80 transition-colors"
                  >
                    {copied ? 'Copied!' : <><Copy className="w-3 h-3" /> Copy Spell</>}
                  </button>
                </div>

                <div className="space-y-2">
                  <a 
                    href="https://chatgpt.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between bg-white/50 dark:bg-slate-800 border border-white/40 dark:border-slate-700 p-3 rounded-xl hover:bg-white/80 transition-colors"
                  >
                    <span className="text-sm font-semibold text-[#301934] dark:text-slate-200">ChatGPT</span>
                    <ExternalLink className="w-4 h-4 text-[#301934]/40" />
                  </a>
                  <a 
                    href="https://gemini.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between bg-white/50 dark:bg-slate-800 border border-white/40 dark:border-slate-700 p-3 rounded-xl hover:bg-white/80 transition-colors"
                  >
                    <span className="text-sm font-semibold text-[#301934] dark:text-slate-200">Gemini</span>
                    <ExternalLink className="w-4 h-4 text-[#301934]/40" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsAIOpen(!isAIOpen)}
            className="w-14 h-14 bg-gradient-to-br from-[#FCE4EC] to-[#F3E5F5] dark:from-pink-600 dark:to-purple-600 text-[#301934] dark:text-white rounded-full shadow-[0_8px_20px_rgba(252,228,236,0.8)] dark:shadow-pink-900/20 flex items-center justify-center hover:scale-105 transition-transform active:scale-95 border border-white/60"
          >
            <Sparkles className="w-6 h-6 text-[#D4AF37]" />
          </button>
        </div>
      </div>
    </MotionConfig>
  );
}
