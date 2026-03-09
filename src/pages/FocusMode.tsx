import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Timer as TimerIcon, Play, Pause, RotateCcw, Coffee } from 'lucide-react';
import { useWakeLock } from '@/hooks/useDeviceFeatures';

type TimerMode = 'pomodoro' | 'math' | 'science';

const MODES = {
  pomodoro: { name: 'Pomodoro', duration: 25 * 60, color: 'pink' },
  math: { name: 'Math Marathon', duration: 3.5 * 60 * 60, color: 'blue' },
  science: { name: 'Science Marathon', duration: 4.5 * 60 * 60, color: 'emerald' },
};

export function FocusMode() {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(MODES[mode].duration);
  const [isActive, setIsActive] = useState(false);

  // Keep screen awake while in Focus Mode
  useWakeLock();

  useEffect(() => {
    let interval: number | null = null;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      // Trigger haptics if supported
      if ('vibrate' in navigator) {
        // Vibrate pattern: 3 pulses
        navigator.vibrate([500, 200, 500, 200, 500]);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(MODES[mode].duration);
  };

  const changeMode = (newMode: TimerMode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(MODES[newMode].duration);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((MODES[mode].duration - timeLeft) / MODES[mode].duration) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12"
    >
      <header className="pt-6 pb-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-2xl">
            <TimerIcon className="w-6 h-6 text-pink-500 dark:text-pink-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Focus Mode</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Deep work time, Serine. You got this! ⏳</p>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {(Object.keys(MODES) as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => changeMode(m)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              mode === m 
                ? `bg-${MODES[m].color}-500 text-white shadow-md shadow-${MODES[m].color}-200 dark:shadow-none` 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {MODES[m].name}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-8 shadow-sm border border-pink-100 dark:border-slate-700 flex flex-col items-center justify-center relative mt-8">
        {/* Circular Progress */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              className="text-slate-100 dark:text-slate-700"
              strokeWidth="4"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={mode === 'pomodoro' ? '#ec4899' : mode === 'math' ? '#3b82f6' : '#10b981'}
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ strokeDasharray: "283", strokeDashoffset: "283" }}
              animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter">
              {formatTime(timeLeft)}
            </span>
            <span className="text-sm font-medium text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-widest">
              {isActive ? 'Focusing...' : 'Paused'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-10">
          <button
            onClick={resetTimer}
            className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          
          <button
            onClick={toggleTimer}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-transform hover:scale-105 active:scale-95 ${
              mode === 'pomodoro' ? 'bg-pink-500 shadow-pink-200 dark:shadow-none' : 
              mode === 'math' ? 'bg-blue-500 shadow-blue-200 dark:shadow-none' : 'bg-emerald-500 shadow-emerald-200 dark:shadow-none'
            }`}
          >
            {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-2" />}
          </button>

          <button
            className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <Coffee className="w-6 h-6" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
