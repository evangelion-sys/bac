import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Headphones, RefreshCw } from 'lucide-react';

const FLASHCARDS = [
  {
    id: 1,
    subject: 'History',
    question: 'Quelles sont les causes de la Guerre Froide ?',
    answer: '1. Différences idéologiques (Capitalisme vs Communisme)\n2. La course aux armements\n3. La division de l\'Allemagne\n4. L\'expansionnisme soviétique en Europe de l\'Est',
  },
  {
    id: 2,
    subject: 'Chariaa',
    question: 'Définition du Waqf (الوقف)',
    answer: 'C\'est le fait d\'immobiliser un bien (qui ne peut plus être vendu ou donné) et d\'en consacrer l\'usufruit à une œuvre de charité ou d\'utilité publique.',
  },
  {
    id: 3,
    subject: 'History',
    question: 'Dates clés de la Guerre d\'Algérie',
    answer: '• 1 Nov 1954: Déclenchement\n• 20 Août 1955: Offensives du Nord-Constantinois\n• 20 Août 1956: Congrès de la Soummam\n• 19 Mars 1962: Cessez-le-feu\n• 5 Juillet 1962: Indépendance',
  }
];

export function Flashcards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  
  // Mock audio player functionality
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Simulate progress
      const interval = setInterval(() => {
        setAudioProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return p + 1;
        });
      }, 1000);
      (window as any).audioInterval = interval;
    } else {
      clearInterval((window as any).audioInterval);
    }
  };

  const nextCard = () => {
    if (currentIndex < FLASHCARDS.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
    }
  };

  const currentCard = FLASHCARDS[currentIndex];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12"
    >
      <header className="pt-6 pb-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-pink-100 p-2 rounded-2xl">
            <Headphones className="w-6 h-6 text-pink-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Hifd & Flashcards</h1>
        </div>
        <p className="text-slate-500 text-sm">Listen and memorize, Serine. 🎧</p>
      </header>

      {/* Audio Player */}
      <div className="bg-slate-900 rounded-3xl p-5 text-white shadow-lg shadow-slate-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Now Playing</span>
            <h3 className="font-semibold mt-1">Résumé Histoire - Unité 1</h3>
          </div>
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
            <Headphones className="w-5 h-5 text-pink-300" />
          </div>
        </div>
        
        <div className="w-full bg-white/20 rounded-full h-1.5 mb-4">
          <div 
            className="bg-pink-500 h-1.5 rounded-full transition-all duration-1000 ease-linear" 
            style={{ width: `${audioProgress}%` }}
          />
        </div>
        
        <div className="flex justify-center items-center gap-6">
          <button className="text-slate-400 hover:text-white transition-colors">
            <SkipBack className="w-6 h-6" />
          </button>
          <button 
            onClick={togglePlay}
            className="w-14 h-14 bg-pink-500 rounded-full flex items-center justify-center hover:bg-pink-400 transition-transform active:scale-95 shadow-lg shadow-pink-500/30"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </button>
          <button className="text-slate-400 hover:text-white transition-colors">
            <SkipForward className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Flashcards */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="font-bold text-slate-700">Active Recall</h3>
          <span className="text-sm font-medium text-slate-400">{currentIndex + 1} / {FLASHCARDS.length}</span>
        </div>

        <div className="relative h-80 w-full perspective-1000" onClick={() => setIsFlipped(!isFlipped)}>
          <motion.div
            className="w-full h-full relative preserve-3d cursor-pointer"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {/* Front */}
            <div className="absolute inset-0 backface-hidden bg-white rounded-[2rem] shadow-sm border border-pink-100 p-8 flex flex-col items-center justify-center text-center">
              <span className="absolute top-6 left-6 text-xs font-bold px-3 py-1 bg-pink-50 text-pink-600 rounded-lg uppercase tracking-wider">
                {currentCard.subject}
              </span>
              <h2 className="text-xl font-bold text-slate-800 mt-4">{currentCard.question}</h2>
              <div className="absolute bottom-6 text-slate-400 flex items-center gap-2 text-sm font-medium">
                <RefreshCw className="w-4 h-4" /> Tap to flip
              </div>
            </div>

            {/* Back */}
            <div className="absolute inset-0 backface-hidden bg-pink-500 rounded-[2rem] shadow-lg shadow-pink-200 p-8 flex flex-col items-center justify-center text-center text-white" style={{ transform: 'rotateY(180deg)' }}>
              <span className="absolute top-6 left-6 text-xs font-bold px-3 py-1 bg-white/20 rounded-lg uppercase tracking-wider">
                Answer
              </span>
              <div className="text-lg font-medium whitespace-pre-line mt-4">
                {currentCard.answer}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button 
            onClick={prevCard}
            disabled={currentIndex === 0}
            className="px-6 py-3 rounded-xl bg-white text-slate-700 font-semibold shadow-sm border border-slate-100 disabled:opacity-50 active:scale-95 transition-all"
          >
            Previous
          </button>
          <button 
            onClick={nextCard}
            disabled={currentIndex === FLASHCARDS.length - 1}
            className="px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold shadow-md disabled:opacity-50 active:scale-95 transition-all"
          >
            Next Card
          </button>
        </div>
      </div>
    </motion.div>
  );
}
