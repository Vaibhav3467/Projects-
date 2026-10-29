'use client';

import { useEffect, useState } from 'react';
import { CalendarCheck2, ClipboardList, Users, BookText } from 'lucide-react';
import { facultySummary } from '@/lib/mock-data';

type PortalUser = {
  name: string;
  role: string;
  email: string;
};

export default function FacultyPage() {
  const [user, setUser] = useState<PortalUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('cms-user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const cards = [
    { label: 'Classes', value: facultySummary.classes, icon: CalendarCheck2 },
    { label: 'Assignments', value: facultySummary.assignments, icon: ClipboardList },
    { label: 'Attendance', value: facultySummary.evaluations, icon: Users },
    { label: 'Courses', value: '6', icon: BookText },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Faculty dashboard</p>
        <h1 className="text-4xl font-bold text-slate-900">Faculty workspace{user ? ` • ${user.name}` : ''}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card p-6">
            <div className="mb-4 inline-flex rounded-xl bg-indigo-100 p-3 text-indigo-700">
              <Icon size={22} />
            </div>
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            <div className="mt-2 text-slate-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-slate-900">Class attendance</h2>
          <div className="mt-6 space-y-4">
            {[
              ['CSE 302', '92%'],
              ['CSE 405', '88%'],
              ['MCA 211', '95%'],
            ].map(([course, score]) => (
              <div key={course} className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">{course}</span>
                  <span className="text-sm font-semibold text-blue-700">{score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-2xl font-bold text-slate-900">Recommended actions</h2>
          <ul className="mt-6 space-y-3 text-slate-600">
            <li>• Review the pending assignments for Semester 6.</li>
            <li>• Update internal marks before the next advisory board review.</li>
            <li>• Schedule mentoring discussions for low-attendance learners.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
