import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Plus, Trash2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function MistakeBook() {
  const { mistakes, addMistake, removeMistake } = useAppStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newMistake, setNewMistake] = useState({ subject: 'Math', topic: '', description: '', solution: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMistake.topic || !newMistake.description) return;
    
    addMistake(newMistake);
    setIsAdding(false);
    setNewMistake({ subject: 'Math', topic: '', description: '', solution: '' });
  };

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
              <BookOpen className="w-6 h-6 text-pink-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Mistake Book</h1>
          </div>
          <p className="text-slate-500 text-sm">Learn from your errors, Serine. 📓</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-slate-800 text-white p-3 rounded-2xl shadow-md hover:bg-slate-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd}
            className="bg-white p-5 rounded-3xl shadow-sm border border-pink-100 space-y-4 overflow-hidden"
          >
            <h3 className="font-semibold text-slate-800">Log a new mistake</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <select 
                value={newMistake.subject}
                onChange={e => setNewMistake({...newMistake, subject: e.target.value})}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <option value="Math">Math</option>
                <option value="Physics">Physics</option>
                <option value="Science">Science</option>
              </select>
              <input 
                type="text" 
                placeholder="Topic (e.g., Suites)"
                value={newMistake.topic}
                onChange={e => setNewMistake({...newMistake, topic: e.target.value})}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              />
            </div>
            
            <textarea 
              placeholder="What was the mistake?"
              value={newMistake.description}
              onChange={e => setNewMistake({...newMistake, description: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 min-h-[80px]"
              required
            />
            
            <textarea 
              placeholder="Correct solution / Note to self"
              value={newMistake.solution}
              onChange={e => setNewMistake({...newMistake, solution: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 min-h-[80px]"
            />
            
            <div className="flex justify-end gap-2 pt-2">
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 text-sm font-medium bg-pink-500 text-white rounded-xl shadow-md shadow-pink-200 hover:bg-pink-600 transition-colors"
              >
                Save Mistake
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {mistakes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">No mistakes logged yet.</p>
            <p className="text-sm text-slate-400 mt-1">You're doing great, Serine!</p>
          </div>
        ) : (
          mistakes.sort((a, b) => b.date - a.date).map((mistake) => (
            <motion.div 
              key={mistake.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 relative group"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg uppercase tracking-wider ${
                    mistake.subject === 'Math' ? 'bg-blue-100 text-blue-600' :
                    mistake.subject === 'Physics' ? 'bg-indigo-100 text-indigo-600' :
                    'bg-emerald-100 text-emerald-600'
                  }`}>
                    {mistake.subject}
                  </span>
                  <span className="text-sm font-semibold text-slate-700">{mistake.topic}</span>
                </div>
                <button 
                  onClick={() => removeMistake(mistake.id)}
                  className="text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="bg-red-50 p-3 rounded-2xl border border-red-100">
                  <p className="text-sm text-red-800 font-medium">❌ {mistake.description}</p>
                </div>
                {mistake.solution && (
                  <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                    <p className="text-sm text-emerald-800 font-medium">✅ {mistake.solution}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
