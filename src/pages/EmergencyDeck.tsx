import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, AlertTriangle, ArrowRight, ArrowLeft, Lock, Brain } from 'lucide-react';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';

const EMERGENCY_CARDS = [
  {
    id: 1,
    type: 'trap',
    subject: 'Math',
    title: 'Limites avec ln(x)',
    content: `
**Piège classique:**
Oublier que $\\lim_{x \\to 0^+} x \\ln(x) = 0$

**Astuce:**
Toujours vérifier le domaine de définition avant de calculer la limite.
    `
  },
  {
    id: 2,
    type: 'formula',
    subject: 'Physics',
    title: 'Énergie condensateur',
    content: `
**Formule vitale:**
$$E_C = \\frac{1}{2} C u_C^2 = \\frac{1}{2} \\frac{q^2}{C}$$

**Unité:** Joules (J)
    `
  },
  {
    id: 3,
    type: 'trap',
    subject: 'Science',
    title: 'Synthèse des protéines',
    content: `
**Piège classique:**
Confondre Transcription (Noyau) et Traduction (Cytoplasme).

**Rappel:**
L'ARNm sort par les pores nucléaires *avant* la traduction.
    `
  }
];

export function EmergencyDeck() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const nextCard = () => {
    if (currentIndex < EMERGENCY_CARDS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (!isUnlocked) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-[80vh] flex flex-col items-center justify-center text-center space-y-6 px-6"
      >
        <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-slate-800">Night Before Deck</h1>
        <p className="text-slate-500 font-medium max-w-xs">
          This deck contains only the absolute most critical traps and formulas. 
          Use it only 24 hours before the exam.
        </p>
        <button 
          onClick={() => setIsUnlocked(true)}
          className="mt-8 bg-slate-900 text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-slate-300 hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2"
        >
          <Zap className="w-5 h-5 text-yellow-400" />
          Unlock Emergency Deck
        </button>
      </motion.div>
    );
  }

  const card = EMERGENCY_CARDS[currentIndex];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-[85vh] flex flex-col pb-12"
    >
      <header className="pt-6 pb-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-red-100 p-2 rounded-2xl">
            <Zap className="w-6 h-6 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Emergency</h1>
        </div>
        <div className="bg-slate-100 px-3 py-1 rounded-full text-sm font-bold text-slate-500">
          {currentIndex + 1} / {EMERGENCY_CARDS.length}
        </div>
      </header>

      <div className="flex-1 relative flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute inset-0 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border-2 border-slate-100 p-8 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6">
              {card.type === 'trap' ? (
                <div className="bg-orange-100 text-orange-600 p-2 rounded-xl">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              ) : (
                <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
                  <Brain className="w-6 h-6" />
                </div>
              )}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {card.subject} • {card.type === 'trap' ? 'Common Trap' : 'Critical Formula'}
                </span>
                <h2 className="text-xl font-bold text-slate-800">{card.title}</h2>
              </div>
            </div>

            <div className="flex-1 bg-slate-50 rounded-3xl p-6 border border-slate-100 overflow-y-auto">
              <MarkdownRenderer content={card.content} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-between items-center mt-8 px-4">
        <button 
          onClick={prevCard}
          disabled={currentIndex === 0}
          className="w-14 h-14 rounded-full bg-white text-slate-800 shadow-md flex items-center justify-center disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <button 
          onClick={nextCard}
          disabled={currentIndex === EMERGENCY_CARDS.length - 1}
          className="w-14 h-14 rounded-full bg-slate-900 text-white shadow-xl shadow-slate-300 flex items-center justify-center disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </motion.div>
  );
}
