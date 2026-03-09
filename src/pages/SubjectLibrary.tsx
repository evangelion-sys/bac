import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, BookOpen, FileText, PenTool, Archive, Download, Eye, Sparkles, CirclePlay, ExternalLink } from 'lucide-react';

const SUBJECT_DATA: Record<string, any> = {
  math: {
    name: 'Mathematics',
    color: 'from-pink-400 to-rose-400',
    icon: '🧮',
    lessons: [
      { id: 'complex_numbers', title: 'الوحدة 01: الأعداد المركبة', status: 'completed' },
      { id: 'sequences', title: 'الوحدة 02: المتتاليات العددية', status: 'in-progress' },
      { id: 'functions', title: 'الوحدة 03: الدوال الأسية واللوغاريتمية', status: 'pending' },
      { id: 'integration', title: 'الوحدة 04: الحساب التكاملي', status: 'pending' },
      { id: 'probability', title: 'الوحدة 05: الاحتمالات', status: 'pending' },
      { id: 'geometry', title: 'الوحدة 06: الهندسة في الفضاء', status: 'pending' },
    ],
    videos: [
      { title: 'الدوال الأسية واللوغاريتمية', url: 'https://youtube.com/playlist?list=PLDx_F4dKxvNKCL8PXWGMdMEPs7kXOXZff&si=6FD7-fgOrOBc1E9e' },
      { title: 'المتتاليات العددية', url: 'https://youtube.com/playlist?list=PLDx_F4dKxvNLKm5B_SjCe9a8YkG5gk5tm&si=cKCdNvHfzfi0M6Zx' },
      { title: 'الاحتمالات', url: 'https://youtube.com/playlist?list=PLDx_F4dKxvNLkyydAhIba3-hbrKHT8vRV&si=ylPI3rUYgQLo69Hq' },
      { title: 'الأعداد المركبة', url: 'https://youtube.com/playlist?list=PLDx_F4dKxvNK4eN_uDzyVGv2gqqNck1YT&si=jgG0a1xT3TH9_6yT' },
      { title: 'الهندسة في الفضاء', url: 'https://youtube.com/playlist?list=PLDx_F4dKxvNLD7-Oc6TfU64Ge1H8_FWtY&si=LCBhVJtmUrTvBCdB' },
      { title: 'الدوال الأصلية والحساب التكاملي', url: 'https://youtube.com/playlist?list=PLDx_F4dKxvNJ6zRap-8g54dhJtZmF3ArJ&si=eztZHI3IPFpEDROp' }
    ]
  },
  physics: {
    name: 'Physics & Chemistry',
    color: 'from-blue-400 to-cyan-400',
    icon: '🧪',
    lessons: [
      { id: 'kinematics', title: 'الوحدة 01: تطور جملة ميكانيكية', status: 'completed' },
      { id: 'rc_rl_circuits', title: 'الوحدة 02: الظواهر الكهربائية (RC/RL)', status: 'pending' },
      { id: 'chemical_kinetics', title: 'الوحدة 03: المتابعة الزمنية لتحول كيميائي', status: 'pending' },
      { id: 'acids_bases', title: 'الوحدة 04: أحماض وأسس', status: 'pending' },
    ],
    videos: [
      { title: 'المتابعة الزمنية لتحول كيميائي', url: 'https://youtube.com/playlist?list=PL2dbR5NDrozD56jVJThvE69d_iR3um89h&si=aqFhuTnNyrTT73tX' },
      { title: 'التحولات النووية', url: 'https://youtube.com/playlist?list=PL2dbR5NDrozBmCPdUkoOfGdiCHeSfOZaj&si=hYeqXc9HksTj4mfi' },
      { title: 'الظواهر الكهربائية', url: 'https://youtube.com/playlist?list=PL2dbR5NDrozBI9pzcH1yrgx54D7QTZaht&si=NC3mFyjHnfY9fzn-' },
      { title: 'تطور جملة كيميائية نحو حالة التوازن', url: 'https://youtube.com/playlist?list=PL2dbR5NDrozDkXDawOM4_rMpmrKfQ2Cab&si=WiodwP8HD7tbepoU' }
    ]
  },
  science: {
    name: 'Natural Sciences',
    color: 'from-emerald-400 to-teal-400',
    icon: '🧬',
    lessons: [
      { id: 'protein_synthesis', title: 'الوحدة 01: تركيب البروتين', status: 'completed' },
      { id: 'enzymes', title: 'الوحدة 02: النشاط الإنزيمي', status: 'pending' },
      { id: 'immunology', title: 'الوحدة 03: المناعة', status: 'in-progress' },
      { id: 'nervous_system', title: 'الوحدة 04: الاتصال العصبي', status: 'pending' },
    ],
    videos: [
      { title: 'دروس العلوم الطبيعية', url: 'https://youtube.com/playlist?list=PLWc7OQydgOX0vF6lBPfDVRmGwwWbrOt6S&si=YImtHMFNycUoe9Wm' }
    ]
  },
  arabic: {
    name: 'Arabic',
    color: 'from-amber-400 to-orange-400',
    icon: '📖',
    lessons: [
      { id: 'poetry', title: 'الشعر التعليمي والمهجري', status: 'completed' },
      { id: 'prose', title: 'النثر العلمي المتأدب', status: 'completed' },
      { id: 'intellectual_construction', title: 'البناء الفكري', status: 'pending' },
      { id: 'linguistic_construction', title: 'البناء اللغوي', status: 'pending' },
    ],
    videos: [
      { title: 'البناء الفكري', url: 'https://youtube.com/playlist?list=PL8H-44Ht8EMV9Ylxsx8bBUswg5-lwWUW5&si=GCnBm3GxJPrz1Zut' },
      { title: 'البناء اللغوي والتقويم النقدي', url: 'https://youtube.com/playlist?list=PL8H-44Ht8EMU68dzGMLvNncooLrsXA6jP&si=gD4Wcq4ohATggNLw' }
    ]
  },
  french: {
    name: 'French',
    color: 'from-indigo-400 to-purple-400',
    icon: '🥐',
    lessons: [
      { id: 'historical_text', title: 'Le texte historique', status: 'completed' },
      { id: 'argumentative', title: 'Le texte argumentatif', status: 'completed' },
      { id: 'exhortative_text', title: "L'appel (Le texte exhortatif)", status: 'pending' },
    ],
    videos: [
      { title: 'دروس اللغة الفرنسية', url: 'https://youtube.com/playlist?list=PLE92Z9cX5ZD2kBZyWPmwuSKbFKwg-Tst-&si=-LqYVGxBygGHlTWb' }
    ]
  },
  english: {
    name: 'English',
    color: 'from-red-400 to-rose-400',
    icon: '☕',
    lessons: [
      { id: 'ethics', title: 'Ethics in Business', status: 'completed' },
      { id: 'astronomy', title: 'Astronomy and the Solar System', status: 'completed' },
      { id: 'grammar', title: 'Grammar Mastery', status: 'pending' },
      { id: 'vocabulary', title: 'Vocabulary Builder', status: 'pending' },
      { id: 'writing', title: 'Writing Skills', status: 'pending' },
    ],
    videos: [
      { title: 'دروس اللغة الإنجليزية 1', url: 'https://youtube.com/playlist?list=PLEKebOVie1QEo0JjMWFw7g11-sfpuvdS9&si=tM7nl0fd5gLVNPmJ' },
      { title: 'دروس اللغة الإنجليزية 2', url: 'https://youtube.com/playlist?list=PLVDGXW4hA4PkDSR9qqsoxfiltn4tMTQI1&si=9GEid15AHa5ytyqk' },
      { title: 'دروس اللغة الإنجليزية 3', url: 'https://youtube.com/playlist?list=PLVDGXW4hA4Pno1C9jwQ9ULdouYIi6L-YC&si=oZQaUA_2YWBlRZDu' }
    ]
  },
  chariaa: {
    name: 'Islamic Education',
    color: 'from-green-400 to-emerald-500',
    icon: '🕌',
    lessons: [
      { id: 'aqida', title: 'العقيدة الإسلامية وأثرها', status: 'completed' },
      { id: 'quran_reason', title: 'العقل في القرآن الكريم', status: 'completed' },
      { id: 'islamic_lessons', title: 'ملخص دروس الشريعة', status: 'pending' },
    ],
    videos: [
      { title: 'دروس الشريعة الإسلامية', url: 'https://youtube.com/playlist?list=PL-6__1IUBau7KI4MG5UVru3ncu8GaLvXP&si=bSVj8HT1KT47eE7M' }
    ]
  },
  philo: {
    name: 'Philosophy',
    color: 'from-purple-400 to-fuchsia-400',
    icon: '🤔',
    lessons: [
      { id: 'scientific_math', title: 'فلسفة الرياضيات', status: 'completed' },
      { id: 'science_results', title: 'نتائج العلوم التجريبية', status: 'completed' },
      { id: 'consciousness', title: 'الشعور واللاشعور', status: 'pending' },
      { id: 'freedom', title: 'الحرية والمسؤولية', status: 'pending' },
    ],
    videos: [
      { title: 'منهجية تحليل نص فلسفي', url: 'https://youtu.be/YswZz9XjPiU?si=hs4rJgfUeFlaWjOC' },
      { title: 'كيفية كتابة مقالة فلسفية', url: 'https://youtu.be/vz3AZViCrKg?si=TImamS6T4fgJSfe7' }
    ]
  },
  histgeo: {
    name: 'History & Geography',
    color: 'from-yellow-400 to-amber-500',
    icon: '🌍',
    lessons: [
      { id: 'cold_war', title: 'بروز الصراع وتشكل العالم', status: 'completed' },
      { id: 'algerian_revolution', title: 'الثورة التحريرية الكبرى', status: 'completed' },
      { id: 'history', title: 'ملخص التاريخ', status: 'pending' },
      { id: 'geography', title: 'ملخص الجغرافيا', status: 'pending' },
    ],
    videos: [
      { title: 'دروس التاريخ', url: 'https://youtube.com/playlist?list=PLvoDc8642ygBi39lZgZ4bqn-fLBrCRz9L&si=Sl3hOHDP2V6VNDhB' },
      { title: 'دروس الجغرافيا', url: 'https://youtube.com/playlist?list=PLvoDc8642ygC0TvOcLNtzqu6n1STJw36p&si=4vlrBt3go4xusRoG' }
    ]
  }
};

type TabType = 'cours' | 'resumes' | 'exercices' | 'annales' | 'videos';

export function SubjectLibrary() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('cours');
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  const subject = id ? SUBJECT_DATA[id] : null;

  if (!subject) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-[#301934] mb-2">Subject not found</h2>
        <button onClick={() => navigate('/')} className="text-[#D4AF37] hover:underline">Return to Sanctuary</button>
      </div>
    );
  }

  const toggleSolution = (exId: string) => {
    setRevealedSolutions(prev => ({ ...prev, [exId]: !prev[exId] }));
  };

  const tabs = [
    { id: 'cours', label: 'Les Cours', icon: BookOpen },
    { id: 'videos', label: 'Vidéos', icon: CirclePlay },
    { id: 'resumes', label: 'Résumés', icon: FileText },
    { id: 'exercices', label: 'Exercices', icon: PenTool },
    { id: 'annales', label: 'Annales', icon: Archive },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 pb-12"
    >
      {/* Header */}
      <header className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/')}
          className="w-12 h-12 glass-panel rounded-full flex items-center justify-center text-[#301934] hover:scale-105 transition-transform shrink-0"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="font-display text-4xl font-bold text-[#301934] flex items-center gap-3">
            {subject.icon} {subject.name}
          </h1>
          <p className="text-[#301934]/60 font-medium ml-1">Master this realm, Serine 🌸</p>
        </div>
      </header>

      {/* Custom Tabs */}
      <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`relative px-6 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${
                isActive 
                  ? 'text-[#301934] shadow-sm' 
                  : 'text-[#301934]/50 hover:text-[#301934] hover:bg-white/30'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {tab.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          {activeTab === 'cours' && (
            <div className="space-y-4">
              {subject.lessons.map((lesson: any) => (
                <div key={lesson.id} className="glass-panel rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:shadow-[0_8px_30px_rgba(252,228,236,0.8)] transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      lesson.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                      lesson.status === 'in-progress' ? 'bg-[#FCE4EC] text-[#D4AF37]' :
                      'bg-white/50 text-[#301934]/40'
                    }`}>
                      {lesson.status === 'completed' ? <Sparkles className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#301934] text-lg group-hover:text-[#D4AF37] transition-colors" dir="rtl">{lesson.title}</h3>
                      <p className="text-xs text-[#301934]/50 font-medium mt-1 uppercase tracking-wider">
                        {lesson.status === 'completed' ? 'Mastered ✨' : lesson.status === 'in-progress' ? 'In Progress 🌸' : 'Not Started'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/50 hover:bg-white/80 px-4 py-2.5 rounded-xl text-sm font-bold text-[#301934]/70 transition-colors border border-white/60">
                      <Download className="w-4 h-4" /> PDF
                    </button>
                    <Link 
                      to={`/subject/${id}/lesson/${lesson.id}`}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-[#FCE4EC] to-[#F3E5F5] hover:from-[#F3E5F5] hover:to-[#FCE4EC] px-6 py-2.5 rounded-xl text-sm font-bold text-[#301934] shadow-sm border border-white/80 transition-all"
                    >
                      <Eye className="w-4 h-4" /> Read
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="space-y-4">
              {subject.videos && subject.videos.length > 0 ? (
                subject.videos.map((video: any, index: number) => (
                  <div key={index} className="glass-panel rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:shadow-[0_8px_30px_rgba(252,228,236,0.8)] transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-red-50 text-red-500">
                        <CirclePlay className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#301934] text-lg group-hover:text-red-500 transition-colors" dir="rtl">{video.title}</h3>
                        <p className="text-xs text-[#301934]/50 font-medium mt-1 uppercase tracking-wider">
                          YouTube Playlist
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <a 
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 px-6 py-2.5 rounded-xl text-sm font-bold text-red-600 shadow-sm border border-red-200/50 transition-all"
                      >
                        <ExternalLink className="w-4 h-4" /> Watch
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass-panel rounded-3xl p-12 text-center">
                  <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CirclePlay className="w-10 h-10 text-[#301934]/40" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[#301934] mb-2">No Videos Yet</h3>
                  <p className="text-[#301934]/60 max-w-sm mx-auto">
                    Video sources for this subject will be added soon.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'exercices' && (
            <div className="space-y-6">
              {[1, 2].map((ex) => (
                <div key={ex} className="glass-panel rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[#301934] text-lg flex items-center gap-2">
                      <PenTool className="w-5 h-5 text-[#D4AF37]" />
                      Exercise {ex}: BAC 2023 (Mathématiques)
                    </h3>
                    <span className="bg-[#FCE4EC] text-[#301934] text-xs font-bold px-3 py-1 rounded-full">5 Points</span>
                  </div>
                  
                  {/* Mock Exercise Content */}
                  <div className="bg-white/40 rounded-2xl p-5 mb-5 text-sm text-[#301934]/90 font-medium border border-white/50">
                    Soit la متتالية $(U_n)$ définie par $U_0 = 2$ et $U_{"{n+1}"} = \frac{1}{2}U_n + 3$.
                    <br/><br/>
                    1. برهن بالتراجع أنه من أجل كل عدد طبيعي $n \in \mathbb{"{N}"}$، $U_n &lt; 6$.
                  </div>

                  <button 
                    onClick={() => toggleSolution(`ex${ex}`)}
                    className="w-full flex items-center justify-center gap-2 bg-[#FCE4EC]/50 py-3 rounded-2xl text-sm font-bold text-[#301934] hover:bg-[#FCE4EC] transition-colors border border-white/60"
                  >
                    {revealedSolutions[`ex${ex}`] ? 'Hide Magic Solution ✨' : 'Reveal Magic Solution ✨'}
                  </button>

                  <AnimatePresence>
                    {revealedSolutions[`ex${ex}`] && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 bg-emerald-50/80 rounded-2xl p-5 border border-emerald-200/50 text-sm text-emerald-900" dir="rtl">
                          <p className="font-bold mb-3 text-emerald-700">Solution Magique :</p>
                          <p className="mb-2"><strong>التحقق (Initialisation) :</strong> من أجل $n=0$، لدينا $U_0 = 2 &lt; 6$. محققة.</p>
                          <p className="mb-2"><strong>الفرضية (Hérédité) :</strong> نفرض أن $U_n &lt; 6$ صحيحة.</p>
                          <p>$\frac{1}{2}U_n &lt; 3 \implies \frac{1}{2}U_n + 3 &lt; 6 \implies U_{"{n+1}"} &lt; 6$.</p>
                          <p className="mt-3 text-emerald-600 italic">Bravo Serine ! Tu vois, c'est facile ! 🌸</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}

          {(activeTab === 'resumes' || activeTab === 'annales') && (
            <div className="glass-panel rounded-3xl p-12 text-center">
              <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-4 animate-breathe">
                <Sparkles className="w-10 h-10 text-[#D4AF37]" />
              </div>
              <h3 className="font-display text-3xl font-bold text-[#301934] mb-2">Coming Soon, Princess!</h3>
              <p className="text-[#301934]/60 max-w-sm mx-auto">
                I am currently weaving the magic for the {activeTab === 'resumes' ? 'Summaries' : 'Archives'}. They will appear here shortly! ✨
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
