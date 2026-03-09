import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight, ChevronLeft, BookOpen, Sparkles } from 'lucide-react';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';

const SUBJECT_NAMES: Record<string, string> = {
  math: 'Mathematics',
  physics: 'Physics & Chemistry',
  science: 'Natural Sciences',
  arabic: 'Arabic',
  french: 'French',
  english: 'English',
  chariaa: 'Islamic Education',
  philo: 'Philosophy',
  histgeo: 'History & Geography',
};

export function LessonReader() {
  const { id, lessonId } = useParams<{ id: string, lessonId: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const subjectName = id ? SUBJECT_NAMES[id] : 'Subject';
  const lessonName = lessonId ? lessonId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Lesson';

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/content/${id}/${lessonId}.md`);
        if (response.ok) {
          const text = await response.text();
          // Vite returns index.html for missing files in SPA mode
          if (text.trim().toLowerCase().startsWith('<!doctype html>') || text.trim().toLowerCase().startsWith('<html')) {
            setContent(`# 🌸 Oops!\n\nIt seems this magical scroll hasn't been written yet. Check back soon, Serine!`);
          } else {
            setContent(text);
          }
        } else {
          setContent(`# 🌸 Oops!\n\nIt seems this magical scroll hasn't been written yet. Check back soon, Serine!`);
        }
      } catch (error) {
        setContent(`# 🌸 Oops!\n\nFailed to load the magical scroll. Please check your connection.`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [id, lessonId]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="space-y-6 pb-12"
    >
      {/* Breadcrumbs */}
      <nav className="pt-4 flex items-center flex-wrap gap-2 text-xs font-bold text-[#301934]/50 dark:text-slate-400 uppercase tracking-wider">
        <Link to="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to={`/subject/${id}`} className="hover:text-[#D4AF37] transition-colors">{subjectName}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#301934] dark:text-slate-200 truncate max-w-[150px]">{lessonName}</span>
      </nav>

      <header className="flex items-center gap-4">
        <button 
          onClick={() => navigate(`/subject/${id}`)}
          className="w-10 h-10 glass-panel rounded-full flex items-center justify-center text-[#301934] dark:text-slate-200 hover:scale-105 transition-transform shrink-0"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="bg-[#FCE4EC] p-2 rounded-xl">
            <BookOpen className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <h1 className="font-display text-3xl font-bold text-[#301934] dark:text-white tracking-tight leading-tight flex items-center gap-2">
            {lessonName} <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          </h1>
        </div>
      </header>

      {/* Reader Content */}
      <div className="glass-panel rounded-[2.5rem] p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/30 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Sparkles className="w-8 h-8 text-[#D4AF37] animate-sparkle" />
          </div>
        ) : (
          <div className="relative z-10 prose prose-pink max-w-none dark:prose-invert
            prose-headings:font-display prose-headings:text-[#301934] prose-headings:font-bold
            prose-h1:text-4xl prose-h1:text-[#D4AF37] prose-h1:border-b prose-h1:border-[#FCE4EC] prose-h1:pb-4
            prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
            prose-p:text-[#301934]/90 prose-p:leading-relaxed
            prose-strong:text-[#D81B60] prose-strong:font-bold
            prose-blockquote:border-l-4 prose-blockquote:border-[#D4AF37] prose-blockquote:bg-gradient-to-r prose-blockquote:from-[#FCE4EC]/50 prose-blockquote:to-transparent prose-blockquote:p-5 prose-blockquote:rounded-r-2xl prose-blockquote:italic prose-blockquote:shadow-sm prose-blockquote:text-[#301934]/80
            prose-li:marker:text-[#D4AF37]
            prose-details:bg-white/60 prose-details:p-5 prose-details:rounded-2xl prose-details:border prose-details:border-[#FCE4EC] prose-details:shadow-sm prose-details:mt-4
            prose-summary:font-bold prose-summary:text-[#D81B60] prose-summary:cursor-pointer prose-summary:list-none prose-summary:outline-none
          ">
            <MarkdownRenderer content={content} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
