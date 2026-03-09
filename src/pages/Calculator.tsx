import { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator as CalcIcon } from 'lucide-react';

const SUBJECTS = [
  { id: 'science', name: 'Science', coeff: 6, color: 'emerald' },
  { id: 'math', name: 'Math', coeff: 5, color: 'blue' },
  { id: 'physics', name: 'Physics', coeff: 5, color: 'indigo' },
  { id: 'arabic', name: 'Arabic', coeff: 3, color: 'amber' },
  { id: 'french', name: 'French', coeff: 2, color: 'rose' },
  { id: 'english', name: 'English', coeff: 2, color: 'cyan' },
  { id: 'philo', name: 'Philosophy', coeff: 2, color: 'purple' },
  { id: 'histgeo', name: 'Hist-Geo', coeff: 2, color: 'orange' },
  { id: 'chariaa', name: 'Chariaa', coeff: 2, color: 'teal' },
];

export function Calculator() {
  const [scores, setScores] = useState<Record<string, string>>({});

  const handleScoreChange = (id: string, value: string) => {
    if (value === '' || (Number(value) >= 0 && Number(value) <= 20)) {
      setScores(prev => ({ ...prev, [id]: value }));
    }
  };

  const calculateAverage = () => {
    let totalScore = 0;
    let totalCoeff = 0;
    
    for (const subject of SUBJECTS) {
      const score = Number(scores[subject.id]) || 0;
      totalScore += score * subject.coeff;
      totalCoeff += subject.coeff;
    }
    
    return totalCoeff > 0 ? (totalScore / totalCoeff).toFixed(2) : '0.00';
  };

  const average = calculateAverage();
  const isPassing = Number(average) >= 10;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12"
    >
      <header className="pt-6 pb-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-pink-100 p-2 rounded-2xl">
            <CalcIcon className="w-6 h-6 text-pink-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Moyenne Calculator</h1>
        </div>
        <p className="text-slate-500 text-sm">Calculate your BAC score, Serine! 🎯</p>
      </header>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-100 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-full blur-3xl -mr-10 -mt-10" />
        <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2 z-10">Estimated Score</p>
        <h2 className={`text-6xl font-black z-10 ${isPassing ? 'text-emerald-500' : 'text-slate-800'}`}>
          {average}
        </h2>
        {isPassing && Number(average) > 0 && (
          <motion.p 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-emerald-600 font-medium mt-3 bg-emerald-50 px-4 py-1 rounded-full text-sm z-10"
          >
            You're passing! 🎉
          </motion.p>
        )}
      </div>

      <div className="space-y-3">
        {SUBJECTS.map((subject) => (
          <div key={subject.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full bg-${subject.color}-100 text-${subject.color}-600 flex items-center justify-center font-bold text-xs`}>
                x{subject.coeff}
              </div>
              <span className="font-semibold text-slate-700">{subject.name}</span>
            </div>
            <input
              type="number"
              min="0"
              max="20"
              step="0.25"
              placeholder="0-20"
              value={scores[subject.id] || ''}
              onChange={(e) => handleScoreChange(subject.id, e.target.value)}
              className="w-20 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-center font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
