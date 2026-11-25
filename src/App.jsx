import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import CodeRunnerPage from './pages/CodeRunnerPage';
import WordPracticePage from './pages/WordPracticePage';
import OfficeCompilerPage from './pages/OfficeCompilerPage';
import './App.css';

function AcademyHome() {
  const [params] = useSearchParams();
  if (params.get('course') === 'word-practice') return <WordPracticePage />;
  if (params.get('course') === 'compiler') return <OfficeCompilerPage />;
  return <LandingPage />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AcademyHome />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/code-runner" element={<CodeRunnerPage />} />
        <Route path="/word-practice" element={<WordPracticePage />} />
        <Route path="/compiler" element={<OfficeCompilerPage />} />
        <Route path="/compiler/index.html" element={<OfficeCompilerPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
