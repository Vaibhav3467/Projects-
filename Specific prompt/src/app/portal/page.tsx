'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const roles = ['Student', 'Faculty', 'Admin', 'Parent'];

export default function PortalPage() {
  const router = useRouter();
  const [role, setRole] = useState('Student');
  const [email, setEmail] = useState('student@bmsit.ac.in');
  const [password, setPassword] = useState('college123');
  const [error, setError] = useState('');

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password) {
      setError('Please complete both email and password fields.');
      return;
    }

    localStorage.setItem('cms-user', JSON.stringify({ role, email, name: email.split('@')[0] }));
    setError('');

    if (role === 'Student') router.push('/student');
    if (role === 'Faculty') router.push('/faculty');
    if (role === 'Admin') router.push('/admin');
    if (role === 'Parent') router.push('/student');
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 md:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="card p-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Portal Access</p>
          <h1 className="text-4xl font-bold text-slate-900">College management dashboard</h1>
          <p className="mt-4 text-slate-600">
            Sign in to your role-specific portal for academic updates, attendance, admissions insights and administration tools.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {roles.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setRole(option)}
                className={`rounded-xl border px-4 py-3 text-left font-medium ${
                  role === option ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleLogin} className="card p-8">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3" />
            </div>
            {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            <button type="submit" className="w-full rounded-full bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800">
              Sign in to {role} Portal
            </button>
            <div className="rounded-xl bg-slate-100 p-3 text-sm text-slate-600">
              Demo credentials: <strong className="text-slate-900">student@bmsit.ac.in / college123</strong>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
