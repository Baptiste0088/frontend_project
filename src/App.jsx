import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AuthPage from './pages/AuthPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import CoursesPage from './pages/CoursesPage';
import CoursesDashboardPage from './pages/CoursesDashboardPage';
import LearnerDashboardPage from './pages/LearnerDashboardPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/dashboard/courses" element={<CoursesDashboardPage />} />
        <Route path="/dashboard/learner" element={<LearnerDashboardPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}

export default App;
