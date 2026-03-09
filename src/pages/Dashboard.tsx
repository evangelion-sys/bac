import { motion } from 'motion/react';
import { differenceInDays } from 'date-fns';
import { Link } from 'react-router-dom';
import { Timer, Flame, BookOpen, ChevronRight, Sparkles } from 'lucide-react';

export function Dashboard() {
  const examDate = new Date('2026-06-07'); // Approximate date for June 2026 BAC
  const daysLeft = differenceInDays(examDate, new Date());

  // Mock recent mistakes
  const recentMistakes = [
    { id: '1', subject: 'Mathematics', topic: 'Complex Numbers', date: 'Today' },
    { id: '2', subject: 'Physics', topic: 'RC Circuits', date: 'Yesterday' },
    { id: '3', subject: 'Science', topic: 'Enzymes', date: '2 days ago' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", staggerChildren: 0.1 }}
      className="space-y-8 pb-8"
    >
      {/* The Royal Welcome Box */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-[2rem] p-8 relative overflow-hidden animate-sparkle"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/40 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FCE4EC]/40 rounded-full blur-2xl -ml-10 -mb-10" />
        
        <div className="relative z-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[#D4AF37] mb-4 drop-shadow-sm flex items-center gap-3">
            <Sparkles className="w-8 h-8" />
            Hello, Serine 🌸
          </h1>
          <p className="text-lg leading-relaxed text-[#301934]/90 font-medium italic">
            "Welcome to your personal Kingdom, my lovely Serine! I built this magic guide exclusively for you. Take a deep breath, trust your brilliance, and let's crush the 2026 Scientific BAC together. I am so proud of you. You are capable of amazing things."
          </p>
        </div>
      </motion.div>

      {/* The "Magic Mirror" Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Countdown */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-3xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#FCE4EC]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <p className="text-[#301934]/60 text-xs font-bold uppercase tracking-widest mb-2">The Royal Ball</p>
          <h2 className="text-5xl font-black text-[#D4AF37] drop-shadow-sm">{daysLeft}</h2>
          <p className="text-[#301934]/80 font-medium mt-1">days until BAC 2026</p>
        </motion.div>

        {/* Focus Timer */}
        <Link 
          to="/focus"
          className="glass-panel rounded-3xl p-6 flex flex-col items-center justify-center text-center animate-breathe hover:scale-105 transition-transform duration-300"
        >
          <Timer className="w-10 h-10 text-[#D4AF37] mb-3" />
          <h3 className="font-bold text-[#301934] text-lg">Zen Mode</h3>
          <p className="text-[#301934]/60 text-sm mt-1">Start a focus session</p>
        </Link>

        {/* Daily Streak */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-3xl p-6 flex flex-col items-center justify-center text-center"
        >
          <div className="relative">
            <Flame className="w-12 h-12 text-[#D4AF37] mb-2 drop-shadow-md" />
            <div className="absolute inset-0 bg-[#D4AF37] blur-xl opacity-20 rounded-full" />
          </div>
          <h3 className="font-bold text-[#301934] text-2xl">12 Days</h3>
          <p className="text-[#301934]/60 text-sm mt-1">Magic Streak</p>
        </motion.div>
      </div>

      {/* The "Mistake Book" Snippet */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-3xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-[#FCE4EC] p-2 rounded-xl">
              <BookOpen className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <h2 className="font-bold text-[#301934] text-xl">Recent Spells (Mistakes)</h2>
          </div>
          <Link to="/mistakes" className="text-[#301934]/60 hover:text-[#D4AF37] text-sm font-bold flex items-center gap-1 transition-colors">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {recentMistakes.map((mistake) => (
            <Link 
              key={mistake.id}
              to="/mistakes"
              className="flex items-center justify-between p-4 rounded-2xl bg-white/40 hover:bg-white/60 border border-white/50 transition-colors group"
            >
              <div>
                <h4 className="font-bold text-[#301934] group-hover:text-[#D4AF37] transition-colors">{mistake.topic}</h4>
                <p className="text-xs text-[#301934]/60 font-medium mt-1">{mistake.subject}</p>
              </div>
              <span className="text-xs text-[#301934]/40 font-medium bg-white/50 px-3 py-1 rounded-full">
                {mistake.date}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
