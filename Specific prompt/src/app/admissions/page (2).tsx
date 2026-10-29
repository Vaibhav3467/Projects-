'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';

const schema = z.object({
  fullName: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  program: z.string().min(1, 'Select a program'),
  course: z.string().min(1, 'Select a preferred course'),
  message: z.string().min(10, 'Please share a brief statement about your interest'),
});

type FormValues = z.infer<typeof schema>;

export default function AdmissionsPage() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormValues) => {
    const current = JSON.parse(localStorage.getItem('cms-applications') || '[]');
    localStorage.setItem('cms-applications', JSON.stringify([...current, { ...data, createdAt: new Date().toISOString() }]));
    setSubmitted(true);
    reset();
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 md:px-6 lg:px-8">
      <div className="mb-8 max-w-2xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Admissions</p>
        <h1 className="section-title">Apply to a program that matches your ambitions.</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit(onSubmit)} className="card p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
              <input {...register('fullName')} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none ring-0 focus:border-blue-500" />
              {errors.fullName && <p className="mt-2 text-sm text-red-600">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input type="email" {...register('email')} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none ring-0 focus:border-blue-500" />
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Phone</label>
              <input {...register('phone')} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none ring-0 focus:border-blue-500" />
              {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Program</label>
              <select {...register('program')} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-blue-500">
                <option value="">Select</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="MBA">MBA</option>
              </select>
              {errors.program && <p className="mt-2 text-sm text-red-600">{errors.program.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">Preferred course</label>
              <input {...register('course')} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none ring-0 focus:border-blue-500" placeholder="e.g. B.Tech in Computer Science" />
              {errors.course && <p className="mt-2 text-sm text-red-600">{errors.course.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">Tell us why you want to join</label>
              <textarea rows={5} {...register('message')} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-blue-500" />
              {errors.message && <p className="mt-2 text-sm text-red-600">{errors.message.message}</p>}
            </div>
          </div>

          <button type="submit" className="mt-8 rounded-full bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500">
            Submit Application
          </button>

          {submitted && (
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              Your application was successfully registered. The admissions team will contact you shortly.
            </div>
          )}
        </form>

        <aside className="space-y-6">
          <div className="card p-6">
            <h3 className="text-xl font-bold text-slate-900">Quick facts</h3>
            <ul className="mt-4 space-y-3 text-slate-600">
              <li>• Admission cycle opens: August 2026</li>
              <li>• Scholarship support up to 40%</li>
              <li>• Easy online application process</li>
              <li>• Personalized counselling</li>
            </ul>
          </div>
          <div className="card bg-slate-900 p-6 text-white">
            <p className="text-sm uppercase tracking-[0.18em] text-blue-200">Need help?</p>
            <h3 className="mt-3 text-2xl font-bold">Contact Admissions</h3>
            <div className="mt-6 space-y-2 text-slate-200">
              <p>admissions@bmsit.ac.in</p>
              <p>+91 80 1234 5678</p>
              <p>Yelahanka, Bengaluru</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
