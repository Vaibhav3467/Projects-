import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'BMS College Management System',
  description: 'Modern college website and student management system for admissions, academics and administration.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-200 bg-slate-950 text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-3 font-semibold">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold">BMS</span>
              <span>
                <span className="block text-lg leading-none">BMS Institute</span>
                <span className="block text-xs text-slate-300">of Technology & Management</span>
              </span>
            </Link>
            <nav className="hidden items-center gap-6 text-sm md:flex">
              <Link href="/">Home</Link>
              <Link href="/#programs">Programs</Link>
              <Link href="/admissions">Admissions</Link>
              <Link href="/portal">Portal</Link>
              <Link href="/student">Student</Link>
              <Link href="/faculty">Faculty</Link>
              <Link href="/admin">Admin</Link>
            </nav>
            <Link href="/portal" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">
              Login Portal
            </Link>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
