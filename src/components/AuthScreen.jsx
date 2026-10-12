import React, { useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  FileHeart,
  HeartPulse,
  LogIn,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Eye,
  EyeOff,
  CheckCircle2,
  Quote,
  Lock,
  Mail,
  User,
  Zap
} from 'lucide-react';
import { loginUser, registerUser } from '../utils/auth';

const careQuotes = [
  {
    quote: 'Good care begins with understanding, and grows stronger when families care together.',
    author: 'The MedCheck promise'
  },
  {
    quote: 'The greatest wealth is health.',
    author: 'Virgil'
  },
  {
    quote: 'A little care, shared every day, can make a world of difference.',
    author: 'A reminder for families'
  }
];

function HealthIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-lg" aria-label="Illustration of a health analysis dashboard">
      <div className="absolute -inset-5 rounded-[2.5rem] bg-teal-200/40 blur-2xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-teal-950 via-teal-800 to-cyan-700 p-5 shadow-2xl sm:p-7">
        <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full border border-white/10" />
        <div className="absolute -right-5 -top-9 h-36 w-36 rounded-full border border-white/10" />
        <div className="relative h-40 overflow-hidden rounded-2xl sm:h-48">
          <img
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85"
            alt="A doctor speaking with a patient during a checkup"
            className="h-full w-full object-cover object-center"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-950/90 via-teal-900/50 to-transparent" />
          <div className="absolute inset-y-0 left-0 flex max-w-[70%] flex-col justify-between p-4 text-white sm:p-5">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-bold backdrop-blur">
              <HeartPulse aria-hidden="true" className="h-4 w-4 text-teal-200" />
              Health overview
            </span>
            <div>
              <p className="text-xl font-black leading-tight sm:text-2xl">A clearer picture of your health.</p>
              <p className="mt-1 text-xs text-teal-50 sm:text-sm">Your records, all in one caring place.</p>
            </div>
          </div>
          <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-xl border border-white/70 bg-white/95 p-2 shadow-lg sm:bottom-4 sm:right-4">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=96&h=96&q=80"
              alt=""
              className="h-9 w-9 rounded-lg object-cover"
              loading="lazy"
            />
            <div className="pr-1">
              <p className="text-[11px] font-extrabold text-slate-900">Care, connected</p>
              <p className="flex items-center gap-1 text-[10px] font-semibold text-teal-800">
                <ShieldCheck aria-hidden="true" className="h-3 w-3" /> Doctor-ready
              </p>
            </div>
          </div>
        </div>

        <div className="relative mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-white backdrop-blur">
            <div className="flex items-center justify-between text-teal-100">
              <span className="text-xs font-semibold">Your records</span>
              <FileHeart className="h-4 w-4" />
            </div>
            <p className="mt-3 text-2xl font-black">Together</p>
            <p className="mt-1 text-xs text-teal-100">prescriptions and reports</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-white backdrop-blur">
            <div className="flex items-center justify-between text-teal-100">
              <span className="text-xs font-semibold">At a glance</span>
              <Activity className="h-4 w-4" />
            </div>
            <div className="mt-3 flex h-8 items-end gap-1.5" aria-hidden="true">
              {[12, 19, 15, 25, 20, 30, 26, 34, 28, 38].map((height, index) => (
                <span key={index} style={{ height: `${height}px` }} className="flex-1 rounded-t bg-teal-200/90" />
              ))}
            </div>
            <p className="mt-1 text-xs text-teal-100">simple, clear overview</p>
          </div>
        </div>

        <div className="relative mt-3 rounded-2xl border border-white/15 bg-white/95 p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900">Your records, thoughtfully explained</p>
              <p className="text-xs text-slate-600">Private by design. Always check with your doctor.</p>
            </div>
            <Sparkles className="h-5 w-5 shrink-0 text-amber-500" />
          </div>
          <svg viewBox="0 0 420 74" className="mt-4 h-16 w-full" role="img" aria-label="Illustrative health trend line">
            <defs>
              <linearGradient id="healthArea" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity=".24" />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 58 C32 58 34 42 64 46 S95 58 124 40 S160 44 190 33 S230 47 258 31 S295 36 322 18 S367 28 420 8 V74 H0Z" fill="url(#healthArea)" />
            <path d="M0 58 C32 58 34 42 64 46 S95 58 124 40 S160 44 190 33 S230 47 258 31 S295 36 322 18 S367 28 420 8" fill="none" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <span className="absolute -left-3 top-1/2 hidden -translate-y-1/2 items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2 text-xs font-bold text-teal-950 shadow-xl sm:flex">
        <span className="h-2 w-2 rounded-full bg-emerald-500" /> Family health, together
      </span>
    </div>
  );
}

export default function AuthScreen({
  currentLang = 'en',
  setCurrentLang = () => {},
  onAuthenticated,
  onCancel,
  initialMode = 'login',
  initialError = ''
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(initialError);
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeQuote, setActiveQuote] = useState(0);

  const isRegister = mode === 'register';

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address (e.g., user@domain.com).');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (isRegister && !fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = isRegister
        ? await registerUser(fullName, email, password)
        : await loginUser(email, password);

      if (!res.success) {
        setError(res.error || (isRegister ? 'Failed to create account.' : 'Invalid email or password.'));
        return;
      }

      setSuccess(isRegister
        ? '✓ Account created successfully! Logging you in...'
        : res.offlineDemo
          ? '✓ Database unavailable — opening the demo with sample records.'
          : '✓ Login successful! Opening dashboard...');
      setTimeout(() => onAuthenticated(res.user), isRegister ? 1000 : 600);
    } catch (error) {
      console.error('Authentication request failed:', error);
      setError('Unable to complete sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick 1-click Demo Login
  const handleQuickDemo = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      const res = await loginUser('demo@medcheck.org', 'demo123');
      if (!res.success) {
        setError(res.error || 'Unable to open demo mode.');
        return;
      }
      setSuccess(res.offlineDemo
        ? '✓ Database unavailable — opening the demo with sample records.'
        : '✓ Entering the MedCheck demo...');
      setTimeout(() => onAuthenticated(res.user), 500);
    } catch (error) {
      console.error('Demo sign in failed:', error);
      setError('Unable to open demo mode. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--color-canvas)] px-4 py-6 sm:px-6 sm:py-10">
      {/* Background Decorative Blur Spheres */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-cyan-200/35 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-teal-200/40 blur-3xl" />
      
      <div className="relative mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        
        {/* Left Side: Hero Section with Branding & Graphic */}
        <section className="space-y-7 py-3 sm:space-y-9" aria-label="Welcome to MedCheck">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-800 text-white shadow-lg shadow-teal-900/20">
              <Activity aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="text-2xl font-black tracking-tight text-slate-950">
                MedCheck<span className="text-teal-700"> AI</span>
              </p>
              <p className="text-sm font-semibold text-slate-600">Family health, made clearer</p>
            </div>

            {/* Language Switcher */}
            <div className="ml-auto">
              <select
                id="welcome-language"
                value={currentLang}
                onChange={(event) => setCurrentLang(event.target.value)}
                className="min-h-11 max-w-36 rounded-xl border border-slate-300 bg-white px-2 text-sm font-bold text-slate-900 shadow-sm transition-colors hover:border-teal-600 focus:border-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-700/10 sm:max-w-44"
                aria-label="Select language"
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="ml">മലയാളം (Malayalam)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
              </select>
            </div>
          </div>

          <div className="max-w-xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/70 px-3 py-1.5 text-sm font-bold text-teal-950 shadow-sm">
              <Sparkles className="h-4 w-4 text-teal-700" /> A calmer way to care
            </span>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
              Your family’s health story, <span className="text-teal-800">all in one place.</span>
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-slate-700">
              Understand health records, keep track of important details, and feel more prepared for the next doctor visit.
            </p>
          </div>

          {/* Graphical Illustration Card */}
          <HealthIllustration />

          <div className="max-w-lg rounded-2xl border border-teal-100 bg-white/80 p-4 shadow-sm sm:p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-800">
                <Quote aria-hidden="true" className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <blockquote aria-live="polite" className="text-sm font-semibold leading-relaxed text-slate-800 sm:text-base">
                  “{careQuotes[activeQuote].quote}”
                </blockquote>
                <p className="mt-2 text-xs font-bold text-teal-800">{careQuotes[activeQuote].author}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => setActiveQuote((activeQuote - 1 + careQuotes.length) % careQuotes.length)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-teal-50 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-700"
                  aria-label="Show previous health quote"
                >
                  <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveQuote((activeQuote + 1) % careQuotes.length)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-teal-50 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-700"
                  aria-label="Show next health quote"
                >
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-3 flex justify-center gap-1.5" aria-label="Quote selection">
              {careQuotes.map((item, index) => (
                <button
                  key={item.author}
                  type="button"
                  onClick={() => setActiveQuote(index)}
                  aria-label={`Show quote ${index + 1}`}
                  aria-current={activeQuote === index ? 'true' : undefined}
                  className={`h-1.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 ${
                    activeQuote === index ? 'w-6 bg-teal-700' : 'w-1.5 bg-teal-200 hover:bg-teal-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Right Side: Auth Form Card */}
        <section className="glass-card mx-auto w-full max-w-lg space-y-5 rounded-3xl p-5 shadow-xl shadow-slate-900/5 sm:p-8" aria-labelledby="auth-heading">
          <div className="flex items-center justify-between">
            <div>
              <h2 id="auth-heading" className="text-2xl font-black text-slate-950">
                {isRegister ? 'Create your account' : 'Sign in to MedCheck'}
              </h2>
              <p className="mt-1 text-base text-slate-700">
                {isRegister ? 'Begin keeping your family health story in one place.' : 'Sign in to access your health records and review tools.'}
              </p>
            </div>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                ✕ Dashboard
              </button>
            )}
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5" role="tablist" aria-label="Choose sign in or sign up">
            <button
              type="button"
              role="tab"
              aria-selected={!isRegister}
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 font-bold transition-all duration-200 cursor-pointer ${
                !isRegister 
                  ? 'bg-white text-teal-950 shadow-md' 
                  : 'text-slate-600 hover:bg-white/70 hover:text-slate-950'
              }`}
            >
              <LogIn aria-hidden="true" className="h-4 w-4" /> Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isRegister}
              onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
              className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 font-bold transition-all duration-200 cursor-pointer ${
                isRegister 
                  ? 'bg-white text-teal-950 shadow-md' 
                  : 'text-slate-600 hover:bg-white/70 hover:text-slate-950'
              }`}
            >
              <UserPlus aria-hidden="true" className="h-4 w-4" /> Create account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name (Sign Up only) */}
            {isRegister && (
              <label className="block space-y-1.5 text-base font-semibold text-slate-900">
                <span>Full name</span>
                <div className="relative">
                  <input
                    autoComplete="name"
                    minLength={2}
                    maxLength={100}
                    required
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="e.g., Ramesh Sharma"
                    className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3 font-normal transition-colors hover:border-teal-500 focus:border-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-700/10"
                  />
                </div>
              </label>
            )}

            {/* Email Address */}
            <label className="block space-y-1.5 text-base font-semibold text-slate-900">
              <span>Email address</span>
              <input
                autoComplete="email"
                type="email"
                maxLength={254}
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3 font-normal transition-colors hover:border-teal-500 focus:border-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-700/10"
              />
            </label>

            {/* Password with Show/Hide toggle */}
            <label className="block space-y-1.5 text-base font-semibold text-slate-900">
              <span>Password</span>
              <div className="relative">
                <input
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  type={showPassword ? 'text' : 'password'}
                  minLength={6}
                  maxLength={72}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 6 characters"
                  className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3 pr-10 font-normal transition-colors hover:border-teal-500 focus:border-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-700/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {isRegister && (
                <span className="block text-sm font-normal text-slate-600">
                  Must be at least 6 characters
                </span>
              )}
            </label>

            {/* Success Message Banner */}
            {success && (
              <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-950 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{success}</span>
              </div>
            )}

            {/* Error Message Banner */}
            {error && (
              <p role="alert" className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-sm text-rose-950">
                {error}
              </p>
            )}

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal-800 px-4 text-base font-bold text-white shadow-md shadow-teal-900/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-900 hover:shadow-lg disabled:translate-y-0 disabled:opacity-60 cursor-pointer"
            >
              {isRegister ? <UserPlus aria-hidden="true" className="h-5 w-5" /> : <LogIn aria-hidden="true" className="h-5 w-5" />}
              <span>{isSubmitting ? 'Please wait...' : isRegister ? 'Create account' : 'Sign in'}</span>
              {!isSubmitting && <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleQuickDemo}
              disabled={isSubmitting}
              className="w-full min-h-11 rounded-xl border border-teal-200 bg-teal-50/70 hover:bg-teal-100/70 text-teal-950 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs disabled:opacity-60"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Explore Demo as Caregiver (demo@medcheck.org)</span>
            </button>
          </div>

          {/* Safety & Educational Notice */}
          <p className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm leading-relaxed text-amber-950" role="note">
            <ShieldCheck aria-hidden="true" className="mr-1 inline h-4 w-4 align-[-3px] text-amber-700" />
            Educational and organizational tool. MedCheck does not provide medical diagnoses or replace consultations with licensed doctors. Your health information is stored securely in your private browser account.
          </p>
        </section>

      </div>
    </main>
  );
}
