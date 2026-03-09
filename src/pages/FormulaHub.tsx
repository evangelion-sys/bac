import { useState } from 'react';
import { motion } from 'motion/react';
import { Brain, Search, Wind } from 'lucide-react';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';

const FORMULAS = [
  {
    id: 'math-suites',
    subject: 'Math',
    topic: 'Suites Arithmétiques',
    content: `
**Terme général:**
$$u_n = u_p + (n - p)r$$

**Somme des termes:**
$$S_n = \\frac{n}{2}(u_0 + u_{n-1})$$
    `
  },
  {
    id: 'math-suites-geo',
    subject: 'Math',
    topic: 'Suites Géométriques',
    content: `
**Terme général:**
$$u_n = u_p \\times q^{n-p}$$

**Somme des termes ($q \\neq 1$):**
$$S_n = u_0 \\times \\frac{1 - q^n}{1 - q}$$
    `
  },
  {
    id: 'phys-rc',
    subject: 'Physics',
    topic: 'Circuit RC',
    content: `
**Équation différentielle (Charge):**
$$RC \\frac{du_C}{dt} + u_C = E$$

**Solution:**
$$u_C(t) = E(1 - e^{-\\frac{t}{\\tau}})$$
avec $\\tau = RC$
    `
  },
  {
    id: 'phys-rl',
    subject: 'Physics',
    topic: 'Circuit RL',
    content: `
**Équation différentielle (Établissement du courant):**
$$\\frac{L}{R} \\frac{di}{dt} + i = \\frac{E}{R}$$

**Constante de temps:**
$$\\tau = \\frac{L}{R}$$
    `
  }
];

export function FormulaHub() {
  const [search, setSearch] = useState('');
  const [isZenMode, setIsZenMode] = useState(false);
  const [breathState, setBreathState] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  const filteredFormulas = FORMULAS.filter(f => 
    f.topic.toLowerCase().includes(search.toLowerCase()) || 
    f.subject.toLowerCase().includes(search.toLowerCase())
  );

  const startZenMode = () => {
    setIsZenMode(true);
    // Simple 4-7-8 breathing simulation
    const cycle = () => {
      setBreathState('inhale'); // 4s
      setTimeout(() => {
        setBreathState('hold'); // 7s
        setTimeout(() => {
          setBreathState('exhale'); // 8s
          setTimeout(cycle, 8000);
        }, 7000);
      }, 4000);
    };
    cycle();
  };

  if (isZenMode) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center text-white"
      >
        <button 
          onClick={() => setIsZenMode(false)}
          className="absolute top-8 right-8 text-slate-400 hover:text-white"
        >
          Close
        </button>
        
        <h2 className="text-3xl font-light mb-16 tracking-widest">Zen Mode</h2>
        
        <div className="relative w-64 h-64 flex items-center justify-center">
          <motion.div
            animate={{
              scale: breathState === 'inhale' ? 1.5 : breathState === 'hold' ? 1.5 : 1,
              opacity: breathState === 'hold' ? 0.8 : 0.4
            }}
            transition={{
              duration: breathState === 'inhale' ? 4 : breathState === 'hold' ? 7 : 8,
              ease: "easeInOut"
            }}
            className="absolute w-32 h-32 bg-pink-500 rounded-full blur-2xl"
          />
          <motion.div
            animate={{
              scale: breathState === 'inhale' ? 1.2 : breathState === 'hold' ? 1.2 : 1,
            }}
            transition={{
              duration: breathState === 'inhale' ? 4 : breathState === 'hold' ? 7 : 8,
              ease: "easeInOut"
            }}
            className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center z-10"
          >
            <span className="text-xl font-medium uppercase tracking-widest">
              {breathState}
            </span>
          </motion.div>
        </div>
        
        <p className="mt-16 text-slate-400 font-light text-center max-w-xs">
          Breathe in for 4s, hold for 7s, exhale for 8s. <br/> You are prepared, Serine.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12"
    >
      <header className="pt-6 pb-2 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-pink-100 p-2 rounded-2xl">
              <Brain className="w-6 h-6 text-pink-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Formula Hub</h1>
          </div>
          <p className="text-slate-500 text-sm">All your essential formulas. 🧠</p>
        </div>
        <button 
          onClick={startZenMode}
          className="bg-emerald-100 text-emerald-600 p-3 rounded-2xl shadow-sm hover:bg-emerald-200 transition-colors flex items-center gap-2"
        >
          <Wind className="w-5 h-5" />
        </button>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search formulas (e.g., Suites, RC)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm"
        />
      </div>

      <div className="grid gap-4">
        {filteredFormulas.map((formula) => (
          <motion.div 
            key={formula.id}
            layout
            className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs font-bold px-2 py-1 rounded-lg uppercase tracking-wider ${
                formula.subject === 'Math' ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'
              }`}>
                {formula.subject}
              </span>
              <h3 className="font-semibold text-slate-700">{formula.topic}</h3>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <MarkdownRenderer content={formula.content} />
            </div>
          </motion.div>
        ))}
        {filteredFormulas.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No formulas found for "{search}"
          </div>
        )}
      </div>
    </motion.div>
  );
}
