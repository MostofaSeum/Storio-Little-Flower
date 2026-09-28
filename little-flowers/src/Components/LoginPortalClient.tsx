'use client';

import React, { useState } from 'react';
import { StorioAuthLoginResponse, StorioUserSession } from '@/data/storioExtendedTypes';

interface LoginPortalClientProps {
  tenantHost: string;
  isStandalone: boolean;
  siteTitle: string;
}

export default function LoginPortalClient({
  tenantHost,
  isStandalone,
  siteTitle,
}: LoginPortalClientProps) {
  const [activeRole, setActiveRole] = useState<'parent' | 'staff'>('parent');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [session, setSession] = useState<StorioUserSession | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setErrorMsg('Please enter both your registered email and password.');
      return;
    }

    setLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.storio.cloud';
      const response = await fetch(`${baseUrl}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-host': tenantHost,
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password: password,
        }),
      });

      const data: StorioAuthLoginResponse = await response.json().catch(() => ({}));

      if (response.ok && (data.key || data.token || data.access || response.status === 200)) {
        const userSession: StorioUserSession = {
          email: trimmedEmail,
          name:
            data.user?.name ||
            data.user?.first_name ||
            (activeRole === 'parent' ? 'Parent User' : 'Faculty Member'),
          role: activeRole,
          token: data.key || data.token || data.access || 'demo_token',
        };

        setSession(userSession);
        if (typeof window !== 'undefined') {
          localStorage.setItem('storio_user_session', JSON.stringify(userSession));
        }
      } else {
        // Backend returns non_field_errors or field-specific arrays
        let extractedError =
          data.non_field_errors?.[0] ||
          data.detail ||
          data.message ||
          data.email?.[0] ||
          data.password?.[0];

        // In Standalone Preview mode (localhost with demo host), allow demo preview login
        if (isStandalone && !extractedError) {
          const userSession: StorioUserSession = {
            email: trimmedEmail,
            name: activeRole === 'parent' ? 'Mrs. Sarah Anderson' : 'Teacher Elizabeth Vance',
            role: activeRole,
            token: 'demo_session_token_' + Date.now(),
          };
          setSession(userSession);
          if (typeof window !== 'undefined') {
            localStorage.setItem('storio_user_session', JSON.stringify(userSession));
          }
          return;
        }

        setErrorMsg(
          extractedError || 'Invalid email or password. Please verify your credentials.'
        );
      }
    } catch {
      // In offline / standalone preview mode fallback
      if (isStandalone) {
        const userSession: StorioUserSession = {
          email: trimmedEmail,
          name: activeRole === 'parent' ? 'Mrs. Sarah Anderson' : 'Teacher Elizabeth Vance',
          role: activeRole,
          token: 'demo_session_token_' + Date.now(),
        };
        setSession(userSession);
        if (typeof window !== 'undefined') {
          localStorage.setItem('storio_user_session', JSON.stringify(userSession));
        }
      } else {
        setErrorMsg('Unable to connect to the authentication server. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setSession(null);
    setPassword('');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('storio_user_session');
    }
  };

  const fillDemoCredentials = (role: 'parent' | 'staff') => {
    setActiveRole(role);
    setErrorMsg(null);
    if (role === 'parent') {
      setEmail('parent@littleflowers.edu');
      setPassword('parent1234');
    } else {
      setEmail('staff@littleflowers.edu');
      setPassword('staff1234');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logged In Dashboard Card State */}
      {session ? (
        <div className="bg-white rounded-3xl p-8 border-2 border-purple-100 shadow-xl text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-accent-green text-white flex items-center justify-center shadow-md">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-accent-green bg-lime-100 px-3.5 py-1 rounded-full">
              Authenticated Session
            </span>
            <h2 className="text-2xl font-black text-primary-color mt-3 font-fredoka">
              Welcome back, {session.name}!
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm mt-1.5 font-medium">
              You are signed in as a{' '}
              <strong className="text-secondary-color capitalize">{session.role}</strong> ({session.email}).
            </p>
          </div>

          {/* Quick Dashboard Links */}
          <div className="p-5 rounded-2xl bg-pastel-purple border border-purple-100 text-left space-y-2.5 text-xs text-gray-700">
            <p className="font-bold text-gray-900 border-b border-purple-100 pb-2 flex items-center justify-between">
              <span>{session.role === 'parent' ? 'Parent Portal Access' : 'Staff Workspace'}</span>
              <span className="text-[10px] font-mono text-gray-400">Active</span>
            </p>
            {session.role === 'parent' ? (
              <ul className="space-y-2 pt-1 font-medium">
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-color" />
                  <span>Student Daily Attendance & Activity Logs</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-color" />
                  <span>Term Progress Reports & Evaluation</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-pink" />
                  <span>Tuition & Fee Receipts</span>
                </li>
              </ul>
            ) : (
              <ul className="space-y-2 pt-1 font-medium">
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-color" />
                  <span>Class Attendance Register</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-color" />
                  <span>Curriculum Planner & Weekly Schedules</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-pink" />
                  <span>Broadcast Direct Notice to Parents</span>
                </li>
              </ul>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href="/"
              className="w-full sm:w-auto px-6 py-3 bg-primary-color hover:opacity-95 text-white font-extrabold text-xs rounded-full shadow-md transition-all text-center"
            >
              Go to Homepage
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-full shadow-xs transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      ) : (
        /* Login Card */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-purple-100 shadow-xl relative overflow-hidden">
          {/* Subtle decorative background tints */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-soft-amber rounded-full blur-2xl opacity-60 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-soft-pink rounded-full blur-2xl opacity-60 pointer-events-none" />

          {/* Header Title */}
          <div className="relative z-10 text-center mb-6">
            <div className="inline-block p-3 rounded-2xl bg-pastel-purple border border-purple-100 shadow-xs mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-300 via-pink-400 to-sky-400 p-1.5 flex items-center justify-center">
                <img
                  src="/icons/school.png"
                  alt="School Logo"
                  className="w-full h-full object-contain brightness-0 invert drop-shadow-xs"
                />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-primary-color font-fredoka">
              Sign In to {siteTitle}
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1 font-medium">
              Access child progress, attendance, reports, and notices.
            </p>
          </div>

          {/* Role Switcher Pill Tabs */}
          <div className="relative z-10 mb-6 bg-pastel-purple p-1 rounded-2xl border border-purple-100 grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => {
                setActiveRole('parent');
                setErrorMsg(null);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeRole === 'parent'
                  ? 'bg-white text-primary-color shadow-sm ring-1 ring-purple-100'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Parent / Guardian</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveRole('staff');
                setErrorMsg(null);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeRole === 'staff'
                  ? 'bg-white text-primary-color shadow-sm ring-1 ring-purple-100'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Staff & Teacher</span>
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="relative z-10 mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <svg className="w-4 h-4 shrink-0 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {activeRole === 'parent' ? 'Parent Email Address' : 'Staff Email Address'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    activeRole === 'parent'
                      ? 'e.g. guardian@gmail.com'
                      : 'e.g. teacher@littleflowers.edu'
                  }
                  required
                  className="w-full px-4 py-3 pl-10 rounded-2xl border border-gray-200 focus:border-primary-color focus:ring-4 focus:ring-purple-100 text-xs sm:text-sm outline-none transition-all"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Please contact the administration office at Little Flowers to reset your portal password.')}
                  className="text-[11px] font-bold text-secondary-color hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 pl-10 pr-10 rounded-2xl border border-gray-200 focus:border-primary-color focus:ring-4 focus:ring-purple-100 text-xs sm:text-sm outline-none transition-all"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-gray-600 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-primary-color focus:ring-primary-color"
                />
                <span>Remember on this browser</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary-color hover:opacity-95 text-white font-extrabold text-sm rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? 'Authenticating...' : `Sign In as ${activeRole === 'parent' ? 'Parent' : 'Staff'}`}
            </button>
          </form>

          {/* Quick Demo Credentials Assistant (helpful for testers / previewers) */}
          <div className="relative z-10 mt-6 pt-4 border-t border-purple-100 text-center">
            <span className="text-[11px] font-semibold text-gray-400 block mb-2">
              Preview Demo Credentials:
            </span>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('parent')}
                className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-secondary-color text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
              >
                Auto-fill Parent
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('staff')}
                className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-primary-color text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
              >
                Auto-fill Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
