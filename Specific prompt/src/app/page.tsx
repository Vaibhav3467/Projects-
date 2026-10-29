import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpenText, BriefcaseBusiness, Building2, GraduationCap, ShieldCheck, Users } from 'lucide-react';
import { programs } from '@/lib/mock-data';

export default function HomePage() {
  return (
    <main>
      <section className="bg-[radial-gradient(circle_at_top,_#1e3a8a,_#0f172a_52%)] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-2 md:px-6 lg:px-8">
          <div className="flex flex-col justify-center">
            <p className="mb-4 inline-flex w-fit rounded-full border border-blue-300/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
              Academic Excellence • Career Ready
            </p>
            <h1 className="max-w-xl text-4xl font-extrabold tracking-tight md:text-6xl">
              Build a future with a college designed for impact.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-200">
              A comprehensive digital campus experience for learners, educators, parents and administrators—streamlining admissions, academics, administration and student success.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/admissions" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500">
                Apply Now <ArrowRight size={18} />
              </Link>
              <Link href="/portal" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 font-semibold text-white hover:bg-white/10">
                Student Portal
              </Link>
            </div>
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-6 text-left">
              {[
                ['15K+', 'Students'],
                ['300+', 'Faculty'],
                ['95%', 'Placements'],
              ].map(([value, label]) => (
                <div key={label}>
                  <div className="text-2xl font-bold">{value}</div>
                  <div className="text-sm text-slate-300">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="card w-full max-w-xl border-blue-100 bg-white/5 p-6 text-slate-900 backdrop-blur-sm">
              <div className="rounded-2xl bg-white p-6 shadow-xl">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-blue-700">Admissions 2026</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">Open for UG & PG programs</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-100 p-4">
                    <div className="text-sm text-slate-500">Programs</div>
                    <div className="mt-2 text-2xl font-bold text-slate-900">25+</div>
                  </div>
                  <div className="rounded-xl bg-slate-100 p-4">
                    <div className="text-sm text-slate-500">Scholarships</div>
                    <div className="mt-2 text-2xl font-bold text-slate-900">40%</div>
                  </div>
                </div>
                <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-slate-700">
                  Program start: <strong className="text-slate-900">August 2026</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: GraduationCap, label: 'Students Mentored', value: '15,000+' },
            { icon: Building2, label: 'Academic Blocks', value: '42' },
            { icon: BriefcaseBusiness, label: 'Placement Partners', value: '150+' },
            { icon: Users, label: 'Alumni Network', value: '10,000+' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="card p-6">
              <div className="mb-4 inline-flex rounded-xl bg-blue-100 p-3 text-blue-700">
                <Icon size={24} />
              </div>
              <div className="text-3xl font-bold text-slate-900">{value}</div>
              <div className="mt-2 text-slate-600">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="programs" className="bg-slate-100 py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Programs</p>
            <h2 className="section-title">Future-focused learning pathways.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {programs.map((program) => (
              <div key={program.title} className="card p-6">
                <div className="mb-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700">
                  {program.badge}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{program.title}</h3>
                <p className="mt-3 text-slate-600">{program.description}</p>
                <Link href="/admissions" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                  Learn more <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="relative h-[420px] overflow-hidden rounded-3xl shadow-card">
            <Image
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
              alt="Students collaborating on campus"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Why BMSIT</p>
            <h2 className="section-title">A campus culture built on innovation, mentorship and opportunity.</h2>
            <div className="mt-8 space-y-6">
              {[
                { icon: BookOpenText, title: 'Industry-integrated education', text: 'Project-driven courses, labs and internships prepare students for real workflows.' },
                { icon: ShieldCheck, title: 'Student-first support', text: 'Counselling, mentoring and structured academic monitoring create better outcomes.' },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                    <p className="mt-1 text-slate-600">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
