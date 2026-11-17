import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpeg';
import SiteHeader from '../components/SiteHeader';
import { API_BASE_URL } from '../lib/api';

const currentYear = new Date().getFullYear();

const fallbackCourses = [
  {
    id: 'fallback-web',
    name: 'Web Development',
    level: 'Beginner',
    description: 'Start with HTML, CSS, JavaScript, and practical website projects.'
  },
  {
    id: 'fallback-programming',
    name: 'Programming Fundamentals',
    level: 'Beginner',
    description: 'Learn problem solving, algorithms, and the foundations of modern programming.'
  },
  {
    id: 'fallback-database',
    name: 'Database Management',
    level: 'Intermediate',
    description: 'Work with relational databases, queries, data modeling, and application storage.'
  },
  {
    id: 'fallback-ai',
    name: 'Artificial Intelligence',
    level: 'Expert',
    description: 'Explore applied AI concepts, data workflows, and intelligent software features.'
  }
];

const levelStyles = {
  Beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Intermediate: 'bg-amber-50 text-amber-700 border-amber-200',
  Expert: 'bg-blue-50 text-blue-700 border-blue-200'
};

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCourses = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/courses`);
        const payload = await response.json();

        if (isMounted && response.ok) {
          setCourses(payload.courses || []);
        }
      } catch {
        if (isMounted) {
          setCourses([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleCourses = courses.length > 0 ? courses : fallbackCourses;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <SiteHeader activePage="courses" />

      <header className="bg-[#003366] px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#FFD700]">
            Training Center
          </p>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-5xl">
            Our Courses
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-blue-100 md:text-xl">
            Practical ICT and programming language courses designed for learners who want clear
            skills, guided practice, and a path into real technology work.
          </p>
        </div>
      </header>

      <main>
        <section className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex flex-col gap-4 text-left md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-3xl font-bold text-[#003366]">ICT and Programming Training</h2>
                <p className="mt-3 max-w-2xl text-slate-600">
                  Choose a course by level and enroll when you are ready to begin.
                </p>
              </div>
              {isLoading && (
                <p className="text-sm font-semibold text-slate-500">Loading courses...</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visibleCourses.map((course) => (
                <article
                  key={course.id}
                  className="flex min-h-[260px] flex-col justify-between rounded-lg border border-slate-200 bg-white p-6 text-left shadow-sm"
                >
                  <div>
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <h3 className="text-2xl font-bold leading-snug text-[#003366]">
                        {course.name}
                      </h3>
                      <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold ${levelStyles[course.level] || levelStyles.Beginner}`}>
                        {course.level}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {course.description || 'Hands-on training with guided practice and real project work.'}
                    </p>
                  </div>

                  <Link
                    to="/login"
                    className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-[#FFD700] px-5 py-3 text-sm font-bold text-[#003366] transition-colors hover:bg-[#ffcc00]"
                  >
                    Enroll Me
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="bg-[#003366] text-white py-12 px-6">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-6 flex items-center gap-3">
              <img src={logo} alt="Logo" className="h-12 w-auto rounded-full" />
              <span className="text-xl font-bold">Global Coding Academy Ltd</span>
            </div>
            <p className="max-w-sm text-blue-200">
              Building the future of technology through education, innovation, and community.
            </p>
          </div>
          <div>
            <h4 className="mb-6 text-lg font-bold">Quick Links</h4>
            <ul className="space-y-4 text-blue-200">
              <li><Link to="/" className="transition-colors hover:text-white">Home</Link></li>
              <li><Link to="/services" className="transition-colors hover:text-white">Services</Link></li>
              <li><Link to="/about" className="transition-colors hover:text-white">About Us</Link></li>
              <li><Link to="/dashboard/courses" className="transition-colors hover:text-white">Course Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-6 text-lg font-bold">Connect</h4>
            <ul className="space-y-4 text-blue-200">
              <li><a href="#" className="transition-colors hover:text-white">LinkedIn</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Twitter / X</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Email Us</a></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-6xl border-t border-blue-900 pt-8 text-center text-sm text-blue-300">
          © {currentYear} Global Coding Academy LTD. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default CoursesPage;
