import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader';
import { API_BASE_URL } from '../lib/api';

const LearnerDashboardPage = () => {
  const [user] = useState(() => {
    const storedUser = localStorage.getItem('gcaUser');

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  });
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

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <SiteHeader activePage="dashboard" />

      <main className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <section className="mb-8 rounded-lg bg-[#003366] p-8 text-left text-white">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#FFD700]">
              Learner Dashboard
            </p>
            <h1 className="text-3xl font-extrabold md:text-4xl">
              Welcome{user?.first_name ? `, ${user.first_name}` : ''}.
            </h1>
            <p className="mt-4 max-w-3xl text-blue-100">
              Explore available ICT and programming courses, then choose the course you want to start.
            </p>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 text-left shadow-sm">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#003366]">Available Courses</h2>
                <p className="mt-2 text-slate-600">Courses added by the academy team appear here.</p>
              </div>
              <Link
                to="/courses"
                className="inline-flex items-center justify-center rounded-lg bg-[#FFD700] px-5 py-3 text-sm font-bold text-[#003366] transition-colors hover:bg-[#ffcc00]"
              >
                View Public Courses
              </Link>
            </div>

            {isLoading ? (
              <p className="rounded-lg bg-slate-50 p-5 text-slate-600">Loading courses...</p>
            ) : courses.length === 0 ? (
              <p className="rounded-lg bg-slate-50 p-5 text-slate-600">No courses are available yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {courses.map((course) => (
                  <article key={course.id} className="rounded-lg border border-slate-200 p-5">
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <h3 className="text-xl font-bold text-[#003366]">{course.name}</h3>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#003366]">
                        {course.level}
                      </span>
                    </div>
                    <p className="text-slate-600">
                      {course.description || 'Hands-on training with practical exercises and course support.'}
                    </p>
                    <Link
                      to="/login"
                      className="mt-5 inline-flex rounded-lg border border-[#003366] px-4 py-2 text-sm font-bold text-[#003366] transition-colors hover:bg-[#003366] hover:text-white"
                    >
                      Enroll Me
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default LearnerDashboardPage;
