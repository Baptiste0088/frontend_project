import { useEffect, useState } from 'react';
import logo from '../assets/logo.jpeg';
import { API_BASE_URL } from '../lib/api';

const initialForm = {
  full_name: '',
  student_id_type: 'SDMS',
  student_id_number: '',
  student_id_confirmation: '',
  occupation_id: '',
  level_id: '',
  trade_id: '',
};

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const fieldError = payload.errors && Object.values(payload.errors)[0];
    throw new Error(fieldError || payload.message || 'The request could not be completed.');
  }
  return payload;
}

export default function EnrollmentGate({ initialName = '', onEnrolled, onClose }) {
  const [form, setForm] = useState({ ...initialForm, full_name: initialName });
  const [occupations, setOccupations] = useState([]);
  const [levels, setLevels] = useState([]);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const selectedOccupation = occupations.find((item) => item.id === form.occupation_id);
  const requiresIndexNumber = /\b(REB|TVET)\b/i.test(selectedOccupation?.name || '');

  useEffect(() => {
    let cancelled = false;
    apiRequest('/api/occupations')
      .then((payload) => { if (!cancelled) setOccupations(payload.occupations || []); })
      .catch((requestError) => { if (!cancelled) setError(requestError.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const selectOccupation = async (occupationId) => {
    const occupation = occupations.find((item) => item.id === occupationId);
    const studentIdType = /\b(REB|TVET)\b/i.test(occupation?.name || '') ? 'INDEX' : 'SDMS';
    setForm((current) => ({ ...current, occupation_id: occupationId, level_id: '', trade_id: '', student_id_type: studentIdType, student_id_number: '', student_id_confirmation: '' }));
    setLevels([]);
    setTrades([]);
    setError('');
    if (!occupationId) return;
    setLoadingOptions(true);
    try {
      const payload = await apiRequest(`/api/occupations/${occupationId}/levels`);
      setLevels(payload.levels || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoadingOptions(false);
    }
  };

  const selectLevel = async (levelId) => {
    setForm((current) => ({ ...current, level_id: levelId, trade_id: '' }));
    setTrades([]);
    setError('');
    if (!levelId) return;
    setLoadingOptions(true);
    try {
      const payload = await apiRequest(`/api/levels/${levelId}/trades`);
      setTrades(payload.trades || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoadingOptions(false);
    }
  };

  const submitEnrollment = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = await apiRequest('/api/enrollments', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      localStorage.setItem('gcaEnrollment', JSON.stringify(payload.enrollment));
      onEnrolled(payload.enrollment);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="fixed inset-0 z-50 overflow-y-auto bg-[#082f55]/65 px-4 py-8 text-left text-slate-900 backdrop-blur-sm sm:px-6">
      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-5xl overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-xl lg:grid-cols-[0.82fr_1.18fr]">
        <section className="flex flex-col justify-between bg-[#082f55] p-7 text-white sm:p-10">
          <div>
            <div className="flex items-center gap-3">
              <img src={logo} alt="Global Coding Academy" className="h-14 w-14 rounded-full border-2 border-white object-cover" />
              <div><strong className="block text-lg">Global Coding Academy</strong><span className="text-sm text-blue-200">Official eLearning</span></div>
            </div>
            <p className="mt-14 text-xs font-bold uppercase tracking-[0.18em] text-[#ffd700]">Enrollment required</p>
            <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">Enroll before starting your learning.</h1>
            <p className="mt-5 max-w-md leading-7 text-blue-100">Your occupation, level, and trade determine the learning package shown to you.</p>
          </div>
          <p className="mt-12 text-sm text-blue-200">REB and TVET students use their index number. Other learners use their SDMS number.</p>
        </section>

        <section className="relative p-6 sm:p-10">
          {onClose && <button type="button" className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-xl text-slate-600 hover:bg-slate-200" onClick={onClose} aria-label="Close enrollment" title="Back to sample lesson">×</button>}
          <div className="mb-7"><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Student details</p><h2 className="mt-2 text-2xl font-black text-[#082f55]">Complete your enrollment</h2></div>
          {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700" role="alert">{error}</div>}
          {loading ? <p className="rounded-lg bg-slate-50 p-5 text-slate-600">Loading occupations…</p> : (
            <form className="grid gap-5" onSubmit={submitEnrollment}>
              <label className="grid gap-2 text-sm font-bold text-slate-700">Full name
                <input className="rounded-lg border border-slate-300 px-4 py-3 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" value={form.full_name} onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))} placeholder="Enter your full name" required />
              </label>

              <label className="grid gap-2 text-sm font-bold text-slate-700">Occupation
                <select className="rounded-lg border border-slate-300 px-4 py-3 font-normal outline-none focus:border-blue-600" value={form.occupation_id} onChange={(event) => selectOccupation(event.target.value)} required>
                  <option value="">Select occupation</option>{occupations.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
                </select>
              </label>

              <label className="grid gap-2 text-sm font-bold text-slate-700">{requiresIndexNumber ? 'Index number (login username)' : 'SDMS number (login username)'}
                <input className="rounded-lg border border-slate-300 px-4 py-3 font-normal uppercase outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" value={form.student_id_number} onChange={(event) => setForm((current) => ({ ...current, student_id_number: event.target.value.toUpperCase() }))} placeholder={form.student_id_type === 'SDMS' ? 'Enter SDMS number' : 'Enter index number'} required />
                <span className="text-xs font-normal text-slate-500">This number will be your login username.</span>
              </label>

              <label className="grid gap-2 text-sm font-bold text-slate-700">{requiresIndexNumber ? 'Enter index number again (initial password)' : 'Enter SDMS number again (initial password)'}
                <input type="password" className="rounded-lg border border-slate-300 px-4 py-3 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" value={form.student_id_confirmation} onChange={(event) => setForm((current) => ({ ...current, student_id_confirmation: event.target.value.toUpperCase() }))} placeholder="Enter the same number again" required />
                <span className="text-xs font-normal text-slate-500">The two numbers must match. You can use this number as your initial password.</span>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-slate-700">Level
                  <select className="min-w-0 rounded-lg border border-slate-300 px-3 py-3 font-normal outline-none focus:border-blue-600" value={form.level_id} onChange={(event) => selectLevel(event.target.value)} disabled={!form.occupation_id || loadingOptions} required>
                    <option value="">Select level</option>{levels.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-bold text-slate-700">Trade
                  <select className="min-w-0 rounded-lg border border-slate-300 px-3 py-3 font-normal outline-none focus:border-blue-600" value={form.trade_id} onChange={(event) => setForm((current) => ({ ...current, trade_id: event.target.value }))} disabled={!form.level_id || loadingOptions} required>
                    <option value="">Select trade</option>{trades.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
                  </select>
                </label>
              </div>

              <button type="submit" className="mt-2 rounded-lg bg-[#ffd700] px-5 py-3.5 font-black text-[#082f55] transition hover:bg-[#f5ca00] disabled:cursor-wait disabled:opacity-60" disabled={submitting || loadingOptions}>{submitting ? 'Enrolling…' : 'Enroll and start learning'}</button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
