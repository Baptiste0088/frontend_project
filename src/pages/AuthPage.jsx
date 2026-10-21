import React, { useState } from 'react';
import logo from '../assets/logo.jpeg';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-6 font-sans">
      <div className={`max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 transition-all duration-500 flex ${isLogin ? 'flex-col md:flex-row' : 'flex-col-reverse md:flex-row'}`}>

        {/* Branding Side Panel */}
        <div className={`w-full md:w-2/5 bg-[#003366] p-8 md:p-12 text-white relative overflow-hidden flex flex-col justify-center items-center ${isLogin ? '' : 'md:order-last'}`}>
          {/* Decorative background circles */}
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

        {/* Form Side Panel */}
        <div className={`w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center ${isLogin ? 'md:order-last' : 'md:order-first'}`}>
          {isLogin ? (
            /* --- LOGIN FORM --- */
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-1 group-focus-within:text-[#003366] transition-colors">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-[#003366] outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-1 group-focus-within:text-[#003366] transition-colors">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-[#003366] outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#003366] focus:ring-[#003366]" />
                  Remember me
                </label>
                <a href="#" className="text-[#003366] font-semibold hover:underline">Forgot Password?</a>
              </div>

              <button className="w-full bg-[#003366] text-white font-bold py-4 rounded-xl hover:bg-[#002244] transition-all transform active:scale-[0.98] shadow-lg hover:shadow-blue-200">
                Sign In to Dashboard
              </button>
            </form>
          ) : (
            /* --- MULTI-STEP SIGNUP FORM --- */
            <div className="space-y-6">
              {/* Progress Indicator - Compact */}
              <div className="flex items-center justify-between px-2 relative mb-8">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 -translate-y-1/2"></div>
                <div
                  className="absolute top-1/2 left-0 h-0.5 bg-[#FFD700] -z-10 -translate-y-1/2 transition-all duration-500"
                  style={{ width: `${((step - 1) / 2) * 100}%` }}
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

              <form onSubmit={(e) => e.preventDefault()} className="min-h-[260px]">
                {step === 1 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="text-center mb-2">
                      <h3 className="text-lg font-bold text-slate-800">Basic Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="group">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">First Name</label>
                        <input type="text" placeholder="John" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-[#003366] outline-none transition-all text-sm" />
                      </div>
                      <div className="group">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
                        <input type="text" placeholder="Doe" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-[#003366] outline-none transition-all text-sm" />
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                      <input type="email" placeholder="john@example.com" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-[#003366] outline-none transition-all text-sm" />
                    </div>
                    <div className="group">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                      <input type="tel" placeholder="(+250) 789271770" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-[#003366] outline-none transition-all text-sm" />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="text-center mb-2">
                      <h3 className="text-lg font-bold text-slate-800">Academic Background</h3>
                    </div>
                    <div className="group">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Education Level</label>
                      <select className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-[#003366] outline-none transition-all bg-white text-sm">
                        <option>High School</option>
                        <option>Undergraduate</option>
                        <option>Graduate</option>
                        <option>Professional/Self-taught</option>
                      </select>
                    </div>
                    <div className="group">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Experience</label>
                      <select className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-[#003366] outline-none transition-all bg-white text-sm">
                        <option>Absolute Beginner</option>
                        <option>A few basics (HTML/CSS)</option>
                        <option>Intermediate (know a language)</option>
                        <option>Advanced (building projects)</option>
                      </select>
                    </div>
                    <div className="group">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Goal</label>
                      <input type="text" placeholder="e.g. Fullstack Dev" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-[#003366] outline-none transition-all text-sm" />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="text-center mb-2">
                      <h3 className="text-lg font-bold text-slate-800">Security</h3>
                    </div>
                    <div className="group">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                      <input type="password" placeholder="••••••••" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-[#003366] outline-none transition-all text-sm" />
                    </div>
                    <div className="group">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
                      <input type="password" placeholder="••••••••" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-[#003366] outline-none transition-all text-sm" />
                    </div>
                    <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
                      <input type="checkbox" className="mt-1 w-3 h-3 rounded border-blue-300 text-[#003366] focus:ring-[#003366]" />
                      <p className="text-[10px] text-slate-600 leading-tight">
                        I agree to the <a href="#" className="text-[#003366] font-bold underline">Terms</a> and <a href="#" className="text-[#003366] font-bold underline">Privacy Policy</a>.
                      </p>
                    </div>
                  </div>
                )}
              </form>

              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={prevStep}
                  disabled={step === 1}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  Back
                </button>
                <button
                  onClick={step === 3 ? () => alert('Registration Successful!') : nextStep}
                  className="bg-[#FFD700] text-[#003366] font-bold px-6 py-2 rounded-lg hover:bg-[#ffcc00] transition-all transform active:scale-95 shadow-sm text-sm"
                >
                  {step === 3 ? 'Complete' : 'Continue'}
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-slate-600 text-xs">
              {isLogin ? "New to the Academy?" : "Already have an account?"}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setStep(1);
                }}
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
