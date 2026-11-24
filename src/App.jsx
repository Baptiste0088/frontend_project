import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import CodeRunnerPage from './pages/CodeRunnerPage';
import WordPracticePage from './pages/WordPracticePage';
import './App.css';

function AcademyHome() {
  const [params] = useSearchParams();
  return params.get('course') === 'word-practice' ? <WordPracticePage /> : <LandingPage />;
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
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
