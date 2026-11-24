import { useEffect, useState } from 'react';
import logo from '../assets/logo.jpeg';
import { API_BASE_URL } from '../lib/api';

const initialForm = {
  learner_type: '', full_name: '', student_id_type: 'SDMS', student_id_number: '', student_id_confirmation: '',
  occupation_id: '', level_id: '', trade_id: '', user_uuid: '',
};

const enrollmentSteps = ['Learner type', 'Full name', 'Occupation', 'Level', 'Trade', 'Login number', 'Confirm number'];

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const fieldError = payload.errors && Object.values(payload.errors)[0];
    throw new Error(fieldError || payload.message || 'The request could not be completed.');
  }
  return payload;
}

export default function EnrollmentGate({ initialName = '', onEnrolled, onClose }) {
  const [mode, setMode] = useState('choose');
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ ...initialForm, full_name: initialName });
  const [loginStep, setLoginStep] = useState(0);
  const [loginForm, setLoginForm] = useState({ login: '', name: '' });
  const [occupations, setOccupations] = useState([]);
  const [levels, setLevels] = useState([]);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const selectedOccupation = occupations.find((item) => item.id === form.occupation_id);
  const requiresIndexNumber = /\b(REB|TVET)\b/i.test(selectedOccupation?.name || '');
  const isNonStudent = form.learner_type === 'NON_STUDENT';
  const identifierName = isNonStudent ? 'phone number' : (requiresIndexNumber ? 'index number' : 'SDMS number');

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
    const studentIdType = form.learner_type === 'NON_STUDENT' ? 'PHONE' : (/\b(REB|TVET)\b/i.test(occupation?.name || '') ? 'INDEX' : 'SDMS');
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

  const validateStep = () => {
    if (step === 0 && !form.learner_type) return 'Choose whether you are a student.';
    if (step === 1 && form.full_name.trim().length < 2) return 'Enter your full name.';
    if (step === 2 && !form.occupation_id) return 'Select your occupation.';
    if (step === 3 && !form.level_id) return 'Select your level.';
    if (step === 4 && !form.trade_id) return 'Select your trade.';
    if (step === 5 && form.student_id_number.trim().length < 2) return `Enter your ${identifierName}.`;
    const normalizeIdentifier = (value) => isNonStudent ? value.replace(/\D/g, '') : value.trim().toUpperCase();
    if (step === 6 && normalizeIdentifier(form.student_id_confirmation) !== normalizeIdentifier(form.student_id_number)) return 'The two numbers must match.';
    return '';
  };

  const goNext = () => {
    const validationError = validateStep();
    if (validationError) { setError(validationError); return; }
    setError('');
    setStep((current) => Math.min(current + 1, enrollmentSteps.length - 1));
  };

  const submitEnrollment = async (event) => {
    event.preventDefault();
    const validationError = validateStep();
    if (validationError) { setError(validationError); return; }
    setSubmitting(true);
    setError('');
    try {
      const payload = await apiRequest('/api/enrollments', { method: 'POST', body: JSON.stringify(form) });
      localStorage.setItem('gcaEnrollment', JSON.stringify(payload.enrollment));
      if (payload.token) localStorage.setItem('gcaAuthToken', payload.token);
      if (payload.user) localStorage.setItem('gcaUser', JSON.stringify(payload.user));
      onEnrolled(payload.enrollment, payload.user || null);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const submitLogin = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (loginStep === 0) {
        await apiRequest('/api/enrollments/identify', { method: 'POST', body: JSON.stringify({ login: loginForm.login }) });
        setLoginStep(1);
        return;
      }
      const payload = await apiRequest('/api/enrollments/login', { method: 'POST', body: JSON.stringify(loginForm) });
      const needsEnrollment = payload.requires_enrollment || (payload.user && (!payload.user.occupation_id || !payload.user.level_id || !payload.user.trade_id));
      if (needsEnrollment && payload.user?.uuid) {
        const verifiedName = payload.user.full_name || [payload.user.first_name, payload.user.last_name].filter((value) => value && value !== '-').join(' ');
        setForm({ ...initialForm, user_uuid: payload.user.uuid, full_name: verifiedName });
        setMode('enroll');
        setStep(0);
        setLoginStep(0);
        return;
      }
      if (!payload.user) throw new Error('The learner account could not be loaded. Please try again.');
      const enrollment = {
        user_uuid: payload.user.uuid,
        full_name: [payload.user.first_name, payload.user.last_name].filter((value) => value && value !== '-').join(' '),
        occupation_id: payload.user.occupation_id, occupation_name: payload.user.occupation_name, occupation_code: payload.user.occupation_code,
        level_id: payload.user.level_id, level_name: payload.user.level_name, level_code: payload.user.level_code,
        trade_id: payload.user.trade_id, trade_name: payload.user.trade_name, trade_code: payload.user.trade_code,
        learner_type: payload.user.learner_type, student_id_type: payload.user.student_id_type, student_id_number: payload.user.student_id_number,
      };
      localStorage.setItem('gcaAuthToken', payload.token);
      localStorage.setItem('gcaUser', JSON.stringify(payload.user));
      localStorage.setItem('gcaEnrollment', JSON.stringify(enrollment));
      onEnrolled(enrollment);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const chooseMode = (nextMode) => { setMode(nextMode); setStep(0); setLoginStep(0); setLoginForm({ login: '', name: '' }); setError(''); };
  const goBack = () => {
    setError('');
    if (step === 0) setMode('choose');
    else setStep((current) => current - 1);
  };

  const enrollmentField = () => {
    const inputClass = 'w-full rounded-lg border border-slate-300 px-4 py-3.5 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100';
    if (step === 0) return <fieldset className="grid gap-3"><legend className="mb-2 text-sm font-bold text-slate-700">Are you currently a student?</legend>{[['STUDENT', 'I am a student', 'Use your Index or SDMS number.'], ['NON_STUDENT', 'I am not a student', 'Use your phone number.']].map(([value, title, description]) => <button autoFocus={value === 'STUDENT'} key={value} type="button" onClick={() => setForm((current) => ({ ...current, learner_type: value, student_id_type: value === 'NON_STUDENT' ? 'PHONE' : (requiresIndexNumber ? 'INDEX' : 'SDMS'), student_id_number: '', student_id_confirmation: '' }))} className={`rounded-xl border-2 p-4 text-left transition ${form.learner_type === value ? 'border-blue-700 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}><strong className="block text-[#082f55]">{title}</strong><span className="mt-1 block text-sm font-normal text-slate-500">{description}</span></button>)}</fieldset>;
    if (step === 1) return <label className="grid gap-2 text-sm font-bold text-slate-700">What is your full name?<input autoFocus className={inputClass} value={form.full_name} onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))} placeholder="Enter your full name" /></label>;
    if (step === 2) return <label className="grid gap-2 text-sm font-bold text-slate-700">What is your occupation?<select autoFocus className={inputClass} value={form.occupation_id} onChange={(event) => selectOccupation(event.target.value)}><option value="">Select occupation</option>{occupations.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>;
    if (step === 3) return <label className="grid gap-2 text-sm font-bold text-slate-700">What is your level?<select autoFocus className={inputClass} value={form.level_id} onChange={(event) => selectLevel(event.target.value)} disabled={loadingOptions}><option value="">Select level</option>{levels.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>;
    if (step === 4) return <label className="grid gap-2 text-sm font-bold text-slate-700">What is your trade?<select autoFocus className={inputClass} value={form.trade_id} onChange={(event) => setForm((current) => ({ ...current, trade_id: event.target.value }))} disabled={loadingOptions}><option value="">Select trade</option>{trades.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>;
    if (step === 5) return <label className="grid gap-2 text-sm font-bold text-slate-700">Enter your {identifierName}<input autoFocus type={isNonStudent ? 'tel' : 'text'} className={`${inputClass} ${isNonStudent ? '' : 'uppercase'}`} value={form.student_id_number} onChange={(event) => setForm((current) => ({ ...current, student_id_number: isNonStudent ? event.target.value : event.target.value.toUpperCase() }))} placeholder={`Enter ${identifierName}`} /><span className="text-xs font-normal text-slate-500">You will use this number to log in.</span></label>;
    return <label className="grid gap-2 text-sm font-bold text-slate-700">Enter your {identifierName} again<input autoFocus type={isNonStudent ? 'tel' : 'password'} className={inputClass} value={form.student_id_confirmation} onChange={(event) => setForm((current) => ({ ...current, student_id_confirmation: isNonStudent ? event.target.value : event.target.value.toUpperCase() }))} placeholder="Enter the same number again" /><span className="text-xs font-normal text-slate-500">This confirms your login number.</span></label>;
  };

  return (
    <main className="fixed inset-0 z-50 overflow-y-auto bg-[#082f55]/65 px-4 py-8 text-left text-slate-900 backdrop-blur-sm sm:px-6">
      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-5xl overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-xl lg:grid-cols-[0.82fr_1.18fr]">
        <section className="hidden flex-col justify-between bg-[#082f55] p-7 text-white sm:p-10 lg:flex">
          <div><div className="flex items-center gap-3"><img src={logo} alt="Global Coding Academy" className="h-14 w-14 rounded-full border-2 border-white object-cover" /><div><strong className="block text-lg">Global Coding Academy</strong><span className="text-sm text-blue-200">Official eLearning</span></div></div><p className="mt-14 text-xs font-bold uppercase tracking-[0.18em] text-[#ffd700]">Start learning</p><h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">{mode === 'login' ? 'Welcome back.' : 'Learn one step at a time.'}</h1><p className="mt-5 max-w-md leading-7 text-blue-100">{mode === 'login' ? 'Sign in with your existing learner account.' : 'New learners enroll once. Returning learners use the separate login form.'}</p></div>
          <p className="mt-12 text-sm text-blue-200">Login with your username, email, Index number, SDMS number, or phone number.</p>
        </section>
        <section className="relative flex flex-col justify-center p-6 sm:p-10">
          {onClose && <button type="button" className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-xl text-slate-600 hover:bg-slate-200" onClick={onClose} aria-label="Close" title="Back to sample lesson">×</button>}
          {mode === 'choose' && <div className="mx-auto w-full max-w-md"><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Choose an option</p><h2 className="mt-2 text-2xl font-black text-[#082f55]">How would you like to continue?</h2><div className="mt-8 grid gap-4"><button type="button" onClick={() => chooseMode('enroll')} className="rounded-xl bg-[#ffd700] px-5 py-4 text-left font-black text-[#082f55]">Enroll as a new learner <span className="float-right">→</span></button><button type="button" onClick={() => chooseMode('login')} className="rounded-xl border-2 border-[#082f55] px-5 py-4 text-left font-black text-[#082f55]">Login to my account <span className="float-right">→</span></button></div></div>}
          {mode === 'login' && <form className="mx-auto grid w-full max-w-md gap-5" onSubmit={submitLogin}><div><button type="button" onClick={() => { if (loginStep === 1) { setLoginStep(0); setError(''); } else chooseMode('choose'); }} className="mb-5 text-sm font-bold text-blue-700">← Back</button><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Learner login</p><h2 className="mt-2 text-2xl font-black text-[#082f55]">{loginStep === 0 ? 'Enter your login' : 'Confirm one of your names'}</h2><p className="mt-2 text-sm text-slate-500">{loginStep === 0 ? 'Use your username, email, Index number, SDMS number, or phone number.' : 'Enter either your first name or last name exactly as it appears in your enrollment.'}</p></div>{error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div>}{loginStep === 0 ? <label className="grid gap-2 text-sm font-bold text-slate-700">Username, email, student number, or phone number<input autoFocus className="rounded-lg border border-slate-300 px-4 py-3.5 font-normal outline-none focus:border-blue-600" value={loginForm.login} onChange={(event) => setLoginForm((current) => ({ ...current, login: event.target.value }))} placeholder="Username, email, Index, SDMS, or phone" required /></label> : <label className="grid gap-2 text-sm font-bold text-slate-700">First name or last name<input autoFocus className="rounded-lg border border-slate-300 px-4 py-3.5 font-normal outline-none focus:border-blue-600" value={loginForm.name} onChange={(event) => setLoginForm((current) => ({ ...current, name: event.target.value }))} placeholder="Enter one name" required /></label>}<button type="submit" disabled={submitting} className="rounded-lg bg-[#082f55] px-5 py-3.5 font-black text-white disabled:opacity-60">{submitting ? 'Checking…' : (loginStep === 0 ? 'Continue' : 'Login')}</button></form>}
          {mode === 'enroll' && <form className="mx-auto w-full max-w-md" onSubmit={submitEnrollment}><div className="mb-7"><div className="mb-4 flex items-center justify-between text-xs font-bold text-slate-500"><span>Step {step + 1} of {enrollmentSteps.length}</span><span>{enrollmentSteps[step]}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#ffd700] transition-all" style={{ width: `${((step + 1) / enrollmentSteps.length) * 100}%` }} /></div><h2 className="mt-6 text-2xl font-black text-[#082f55]">Complete your enrollment</h2></div>{error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div>}{loading ? <p className="rounded-lg bg-slate-50 p-5 text-slate-600">Loading…</p> : enrollmentField()}<div className="mt-8 flex gap-3"><button type="button" onClick={goBack} className="rounded-lg border border-slate-300 px-5 py-3 font-bold text-slate-700">← Back</button>{step < enrollmentSteps.length - 1 ? <button type="button" onClick={goNext} disabled={loadingOptions} className="ml-auto rounded-lg bg-[#ffd700] px-6 py-3 font-black text-[#082f55] disabled:opacity-60">Next →</button> : <button type="submit" disabled={submitting} className="ml-auto rounded-lg bg-[#ffd700] px-6 py-3 font-black text-[#082f55] disabled:opacity-60">{submitting ? 'Enrolling…' : 'Enroll and start'}</button>}</div></form>}
        </section>
      </div>
    </main>
  );
}
