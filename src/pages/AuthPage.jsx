import React, { useMemo, useState } from 'react';
import logo from '../assets/logo.jpeg';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://backend.globalcodingacademy.com').replace(/\/$/, '');

const initialLoginForm = {
  login: '',
  password: '',
};

const initialSignupForm = {
  first_name: '',
  last_name: '',
  username: '',
  gender: 'Male',
  phone_number: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false,
};

const readApiMessage = async (response) => {
  const fallback = response.ok ? 'Request completed successfully.' : 'Something went wrong. Please try again.';

  try {
    const payload = await response.json();
    return {
      payload,
      message: payload?.message || fallback,
      errors: payload?.errors || {},
    };
  } catch {
    return {
      payload: null,
      message: fallback,
      errors: {},
    };
  }
};

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [signupForm, setSignupForm] = useState(initialSignupForm);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signupProgress = useMemo(() => `${((step - 1) / 2) * 100}%`, [step]);

  const updateLoginForm = (event) => {
    const { name, value } = event.target;
    setLoginForm((current) => ({ ...current, [name]: value }));
  };

  const updateSignupForm = (event) => {
    const { name, value, type, checked } = event.target;
    setSignupForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetFeedback = () => {
    setStatus({ type: '', message: '' });
    setFieldErrors({});
  };

  const nextStep = () => {
    resetFeedback();
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    resetFeedback();
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    resetFeedback();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login: loginForm.login.trim(),
          password: loginForm.password,
        }),
      });

      const { payload, message, errors } = await readApiMessage(response);

      if (!response.ok) {
        setStatus({ type: 'error', message });
        setFieldErrors(errors);
        return;
      }

      localStorage.setItem('gcaAuthToken', payload.token);
      localStorage.setItem('gcaUser', JSON.stringify(payload.user));
      setStatus({ type: 'success', message });
      setLoginForm(initialLoginForm);
    } catch {
      setStatus({
        type: 'error',
        message: 'Unable to reach the backend. Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    resetFeedback();

    if (signupForm.password !== signupForm.confirmPassword) {
      setFieldErrors({ confirmPassword: 'Passwords must match.' });
      setStatus({ type: 'error', message: 'Please correct the highlighted registration fields.' });
      setStep(3);
      return;
    }

    if (!signupForm.terms) {
      setFieldErrors({ terms: 'Please accept the terms before creating your account.' });
      setStatus({ type: 'error', message: 'Please accept the terms before creating your account.' });
      setStep(3);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: signupForm.first_name.trim(),
          last_name: signupForm.last_name.trim(),
          username: signupForm.username.trim(),
          gender: signupForm.gender,
          phone_number: signupForm.phone_number.trim(),
          email: signupForm.email.trim(),
          password: signupForm.password,
        }),
      });

      const { message, errors } = await readApiMessage(response);

      if (!response.ok) {
        setStatus({ type: 'error', message });
        setFieldErrors(errors);
        if (errors.first_name || errors.last_name || errors.username || errors.email || errors.phone_number) {
          setStep(1);
        } else if (errors.gender) {
          setStep(2);
        } else {
          setStep(3);
        }
        return;
      }

      setSignupForm(initialSignupForm);
      setStep(1);
      setIsLogin(true);
      setStatus({ type: 'success', message: `${message} You can now sign in.` });
    } catch {
      setStatus({
        type: 'error',
        message: 'Unable to reach the backend. Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    resetFeedback();
    setIsLogin((current) => !current);
    setStep(1);
  };

  const inputClassName = 'w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-[#003366] outline-none transition-all text-sm bg-white text-slate-900';
  const loginInputClassName = 'w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-[#003366] outline-none transition-all placeholder:text-slate-400 bg-white text-slate-900';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-6 font-sans">
      <div className={`max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 transition-all duration-500 flex ${isLogin ? 'flex-col md:flex-row' : 'flex-col-reverse md:flex-row'}`}>
        <div className={`w-full md:w-2/5 bg-[#003366] p-8 md:p-12 text-white relative overflow-hidden flex flex-col justify-center items-center ${isLogin ? '' : 'md:order-last'}`}>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-400 rounded-full blur-3xl opacity-20"></div>

          <div className="relative z-10 text-center">
            <img src={logo} alt="Logo" className="h-32 w-32 rounded-full mx-auto mb-6 border-4 border-white shadow-lg object-cover" />
            <h2 className="text-3xl font-extrabold tracking-tight mb-4">
              {isLogin ? 'Welcome Back!' : 'Join the Academy'}
            </h2>
            <p className="text-blue-100 text-base opacity-90 leading-relaxed">
              {isLogin
                ? 'Your journey to mastering code continues here. Sign in to access your learning dashboard.'
                : 'Start building your future with the Global Coding Academy. Empowering the next generation of developers.'}
            </p>
          </div>
        </div>

        <div className={`w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center ${isLogin ? 'md:order-last' : 'md:order-first'}`}>
          {status.message && (
            <div
              className={`mb-5 rounded-xl border px-4 py-3 text-left text-sm font-medium ${
                status.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}
              role="status"
            >
              {status.message}
            </div>
          )}

          {isLogin ? (
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="group text-left">
                  <label htmlFor="login" className="block text-sm font-semibold text-slate-700 mb-1 group-focus-within:text-[#003366] transition-colors">Email or Username</label>
                  <input
                    id="login"
                    name="login"
                    type="text"
                    value={loginForm.login}
                    onChange={updateLoginForm}
                    placeholder="name@example.com"
                    className={loginInputClassName}
                    required
                  />
                </div>
                <div className="group text-left">
                  <label htmlFor="login-password" className="block text-sm font-semibold text-slate-700 mb-1 group-focus-within:text-[#003366] transition-colors">Password</label>
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    value={loginForm.password}
                    onChange={updateLoginForm}
                    placeholder="Password"
                    className={loginInputClassName}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#003366] focus:ring-[#003366]" />
                  Remember me
                </label>
                <button type="button" className="text-[#003366] font-semibold hover:underline">Forgot Password?</button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#003366] text-white font-bold py-4 rounded-xl hover:bg-[#002244] transition-all transform active:scale-[0.98] shadow-lg hover:shadow-blue-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Signing In...' : 'Sign In to Dashboard'}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2 relative mb-8">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 -translate-y-1/2"></div>
                <div
                  className="absolute top-1/2 left-0 h-0.5 bg-[#FFD700] -z-10 -translate-y-1/2 transition-all duration-500"
                  style={{ width: signupProgress }}
                ></div>

                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      step >= i ? 'bg-[#003366] text-white scale-110 shadow-sm' : 'bg-white text-slate-400 border border-slate-200'
                    }`}
                  >
                    {step > i ? '✓' : i}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSignup} className="min-h-[320px] text-left">
                {step === 1 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="text-center mb-2">
                      <h3 className="text-lg font-bold text-slate-800">Basic Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="group">
                        <label htmlFor="first_name" className="block text-xs font-semibold text-slate-700 mb-1">First Name</label>
                        <input id="first_name" name="first_name" type="text" value={signupForm.first_name} onChange={updateSignupForm} placeholder="Enter your first name" className={inputClassName} required />
                        {fieldErrors.first_name && <p className="mt-1 text-xs text-red-600">{fieldErrors.first_name}</p>}
                      </div>
                      <div className="group">
                        <label htmlFor="last_name" className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
                        <input id="last_name" name="last_name" type="text" value={signupForm.last_name} onChange={updateSignupForm} placeholder="Enter your last name" className={inputClassName} required />
                        {fieldErrors.last_name && <p className="mt-1 text-xs text-red-600">{fieldErrors.last_name}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="group">
                        <label htmlFor="username" className="block text-xs font-semibold text-slate-700 mb-1">Username</label>
                        <input id="username" name="username" type="text" value={signupForm.username} onChange={updateSignupForm} placeholder="Enter your username" className={inputClassName} required />
                        {fieldErrors.username && <p className="mt-1 text-xs text-red-600">{fieldErrors.username}</p>}
                      </div>
                      <div className="group">
                        <label htmlFor="phone_number" className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                        <input id="phone_number" name="phone_number" type="tel" value={signupForm.phone_number} onChange={updateSignupForm} placeholder="Enter your phone number" className={inputClassName} required />
                        {fieldErrors.phone_number && <p className="mt-1 text-xs text-red-600">{fieldErrors.phone_number}</p>}
                      </div>
                    </div>
                    <div className="group">
                      <label htmlFor="signup-email" className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                      <input id="signup-email" name="email" type="email" value={signupForm.email} onChange={updateSignupForm} placeholder="Enter your email address" className={inputClassName} required />
                      {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="text-center mb-2">
                      <h3 className="text-lg font-bold text-slate-800">Profile Details</h3>
                    </div>
                    <div className="group">
                      <label htmlFor="gender" className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                      <select id="gender" name="gender" value={signupForm.gender} onChange={updateSignupForm} className={`${inputClassName} bg-white`} required>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {fieldErrors.gender && <p className="mt-1 text-xs text-red-600">{fieldErrors.gender}</p>}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="text-center mb-2">
                      <h3 className="text-lg font-bold text-slate-800">Security</h3>
                    </div>
                    <div className="group">
                      <label htmlFor="signup-password" className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                      <input id="signup-password" name="password" type="password" value={signupForm.password} onChange={updateSignupForm} placeholder="Password" className={inputClassName} required />
                      {fieldErrors.password && <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>}
                    </div>
                    <div className="group">
                      <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
                      <input id="confirmPassword" name="confirmPassword" type="password" value={signupForm.confirmPassword} onChange={updateSignupForm} placeholder="Confirm password" className={inputClassName} required />
                      {fieldErrors.confirmPassword && <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>}
                    </div>
                    <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
                      <input id="terms" name="terms" type="checkbox" checked={signupForm.terms} onChange={updateSignupForm} className="mt-1 w-3 h-3 rounded border-blue-300 text-[#003366] focus:ring-[#003366]" />
                      <label htmlFor="terms" className="text-[10px] text-slate-600 leading-tight">
                        I agree to the <button type="button" className="text-[#003366] font-bold underline">Terms</button> and <button type="button" className="text-[#003366] font-bold underline">Privacy Policy</button>.
                      </label>
                    </div>
                    {fieldErrors.terms && <p className="text-xs text-red-600">{fieldErrors.terms}</p>}
                  </div>
                )}
              </form>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={step === 1 || isSubmitting}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={step === 3 ? handleSignup : nextStep}
                  disabled={isSubmitting}
                  className="bg-[#FFD700] text-[#003366] font-bold px-6 py-2 rounded-lg hover:bg-[#ffcc00] transition-all transform active:scale-95 shadow-sm text-sm disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Creating...' : step === 3 ? 'Complete' : 'Continue'}
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-slate-600 text-xs">
              {isLogin ? 'New to the Academy?' : 'Already have an account?'}
              <button
                type="button"
                onClick={switchMode}
                className="ml-1 text-[#003366] font-bold hover:underline"
              >
                {isLogin ? 'Create an account' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
