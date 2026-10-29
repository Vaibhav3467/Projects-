'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, BookOpen, Briefcase, CreditCard, User } from 'lucide-react';
import { notices, studentSummary } from '@/lib/mock-data';

type PortalUser = {
  name: string;
  role: string;
  email: string;
};

export default function StudentPage() {
  const [user, setUser] = useState<PortalUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('cms-user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Attendance', value: studentSummary.attendance, icon: BookOpen },
      { label: 'Credits', value: studentSummary.credits, icon: Briefcase },
      { label: 'Fees', value: studentSummary.fees, icon: CreditCard },
      { label: 'Mentor', value: studentSummary.mentor, icon: User },
    ],
    []
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Student portal</p>
          <h1 className="text-4xl font-bold text-slate-900">Welcome back{user ? `, ${user.name}` : ''}</h1>
        </div>
        <div className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white">Semester 6</div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card p-6">
            <div className="mb-4 inline-flex rounded-xl bg-blue-100 p-3 text-blue-700">
              <Icon size={20} />
            </div>
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            <div className="mt-2 text-slate-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-slate-900">Academic progress</h2>
          <div className="mt-6 space-y-5">
            {[
              { label: 'Data Structures', score: '92%' },
              { label: 'Database Systems', score: '89%' },
              { label: 'Operating Systems', score: '94%' },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>{item.label}</span>
                  <strong>{item.score}</strong>
                </div>
                <div className="h-2.5 rounded-full bg-slate-200">
                  <div className="h-2.5 rounded-full bg-blue-600" style={{ width: item.score }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-2xl font-bold text-slate-900">Notices</h2>
          <ul className="mt-6 space-y-4 text-sm text-slate-600">
            {notices.map((notice) => (
              <li key={notice} className="flex gap-3 rounded-xl bg-slate-50 p-3">
                <ArrowUpRight className="mt-0.5 text-blue-700" size={16} />
                <span>{notice}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
