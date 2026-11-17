import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader';
import { API_BASE_URL } from '../lib/api';

const initialCourseForm = {
  name: '',
  level: 'Beginner',
  description: ''
};

const CoursesDashboardPage = () => {
  const [form, setForm] = useState(initialCourseForm);
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const loadCourses = async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/courses`);
      const payload = await response.json();

      if (response.ok) {
        setCourses(payload.courses || []);
      } else {
        setStatus({ type: 'error', message: payload.message || 'Unable to load courses.' });
      }
    } catch {
      setStatus({ type: 'error', message: 'Unable to reach the backend courses endpoint.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    loadCourses(false);
  }, []);

  const submitCourse = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          level: form.level,
          description: form.description.trim()
        })
      });
      const payload = await response.json();

      if (!response.ok) {
        setStatus({ type: 'error', message: payload.message || 'Unable to add course.' });
        setFieldErrors(payload.errors || {});
        return;
      }

      setStatus({ type: 'success', message: payload.message || 'Course created successfully.' });
      setForm(initialCourseForm);
      setCourses((current) => [payload.course, ...current]);
    } catch {
      setStatus({ type: 'error', message: 'Unable to reach the backend courses endpoint.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <SiteHeader activePage="dashboard" />

      <main className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 text-left md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#0055aa]">
                Dashboard
              </p>
              <h1 className="text-4xl font-extrabold text-[#003366]">Add Courses</h1>
              <p className="mt-3 max-w-2xl text-slate-600">
                Add ICT and programming courses here. New courses appear on the public Our Courses page.
              </p>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center justify-center rounded-lg border border-[#003366] px-5 py-3 text-sm font-bold text-[#003366] transition-colors hover:bg-[#003366] hover:text-white"
            >
              View Public Page
            </Link>
          </div>

          {status.message && (
            <div
              className={`mb-6 rounded-lg border px-4 py-3 text-left text-sm font-semibold ${
                status.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}
              role="status"
            >
              {status.message}
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <form onSubmit={submitCourse} className="rounded-lg border border-slate-200 bg-white p-6 text-left shadow-sm">
              <h2 className="mb-5 text-2xl font-bold text-[#003366]">Course Details</h2>

              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="mb-1 block text-sm font-bold text-slate-700">Course Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={updateForm}
                    placeholder="Enter course name"
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all focus:border-[#003366] focus:ring-4 focus:ring-blue-100"
                    required
                  />
                  {fieldErrors.name && <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>}
                </div>

                <div>
                  <label htmlFor="level" className="mb-1 block text-sm font-bold text-slate-700">Level</label>
                  <select
                    id="level"
                    name="level"
                    value={form.level}
                    onChange={updateForm}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all focus:border-[#003366] focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                  </select>
                  {fieldErrors.level && <p className="mt-1 text-xs text-red-600">{fieldErrors.level}</p>}
                </div>

                <div>
                  <label htmlFor="description" className="mb-1 block text-sm font-bold text-slate-700">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={updateForm}
                    placeholder="Enter course description"
                    rows={5}
                    className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all focus:border-[#003366] focus:ring-4 focus:ring-blue-100"
                  />
                  {fieldErrors.description && <p className="mt-1 text-xs text-red-600">{fieldErrors.description}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full rounded-lg bg-[#003366] px-5 py-3 font-bold text-white transition-colors hover:bg-[#002244] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Adding Course...' : 'Add Course'}
              </button>
            </form>

            <section className="rounded-lg border border-slate-200 bg-white p-6 text-left shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-[#003366]">Current Courses</h2>
                {isLoading && <span className="text-sm font-semibold text-slate-500">Loading...</span>}
              </div>

              {courses.length === 0 && !isLoading ? (
                <p className="rounded-lg bg-slate-50 p-5 text-slate-600">
                  No courses have been added yet.
                </p>
              ) : (
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <table className="w-full border-collapse text-sm">
                    <thead className="bg-slate-100 text-left text-slate-700">
                      <tr>
                        <th className="px-4 py-3 font-bold">Course</th>
                        <th className="px-4 py-3 font-bold">Level</th>
                        <th className="px-4 py-3 font-bold">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {courses.map((course) => (
                        <tr key={course.id} className="align-top">
                          <td className="px-4 py-3 font-bold text-[#003366]">{course.name}</td>
                          <td className="px-4 py-3 text-slate-700">{course.level}</td>
                          <td className="px-4 py-3 text-slate-600">{course.description || 'No description added.'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoursesDashboardPage;
