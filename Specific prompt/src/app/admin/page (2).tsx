'use client';

import { useEffect, useState } from 'react';
import { BarChart3, BookOpenCheck, GraduationCap, UsersRound } from 'lucide-react';
import { adminSummary } from '@/lib/mock-data';

type PortalUser = {
  name: string;
  role: string;
  email: string;
};

export default function AdminPage() {
  const [user, setUser] = useState<PortalUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('cms-user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const cards = [
    { label: 'Admissions', value: adminSummary.admissions, icon: GraduationCap },
    { label: 'Students', value: adminSummary.students, icon: UsersRound },
    { label: 'Faculty', value: adminSummary.faculty, icon: BookOpenCheck },
    { label: 'Placements', value: adminSummary.placement, icon: BarChart3 },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Admin dashboard</p>
        <h1 className="text-4xl font-bold text-slate-900">Operations overview{user ? ` • ${user.name}` : ''}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card p-6">
            <div className="mb-4 inline-flex rounded-xl bg-emerald-100 p-3 text-emerald-700">
              <Icon size={22} />
            </div>
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            <div className="mt-2 text-slate-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-slate-900">Recent application activity</h2>
          <div className="mt-6 space-y-4">
            {[
              '12 new UG applications received today',
              'Faculty onboarding documents verified',
              'Fee reconciliation summary published',
            ].map((item) => (
              <div key={item} className="rounded-xl bg-slate-50 p-4 text-slate-700">{item}</div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-2xl font-bold text-slate-900">Priority tasks</h2>
          <ul className="mt-6 space-y-3 text-slate-600">
            <li>• Review scholarship applications for September intake.</li>
            <li>• Finalize departmental annual budget discussions.</li>
            <li>• Publish placement drive schedule for final-year students.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
