import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Calculator } from './pages/Calculator';
import { FocusMode } from './pages/FocusMode';
import { MistakeBook } from './pages/MistakeBook';
import { FormulaHub } from './pages/FormulaHub';
import { EmergencyDeck } from './pages/EmergencyDeck';
import { Flashcards } from './pages/Flashcards';
import { Settings } from './pages/Settings';
import { SubjectLibrary } from './pages/SubjectLibrary';
import { LessonReader } from './pages/LessonReader';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="subject/:id" element={<SubjectLibrary />} />
          <Route path="subject/:id/lesson/:lessonId" element={<LessonReader />} />
          <Route path="calculator" element={<Calculator />} />
          <Route path="focus" element={<FocusMode />} />
          <Route path="mistakes" element={<MistakeBook />} />
          <Route path="formulas" element={<FormulaHub />} />
          <Route path="emergency" element={<EmergencyDeck />} />
          <Route path="flashcards" element={<Flashcards />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
