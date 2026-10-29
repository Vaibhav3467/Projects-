# Hospital Management System

A modern hospital management prototype built with a React frontend and an Express + SQLite backend.

## Architecture

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express
- Database: SQLite (demo-friendly and easy to run locally)
- Auth: JWT-based login with role-aware access
- Core modules: dashboard, patient management, appointments, queue, doctors, and EMR overview

## Quick start

1. Open a terminal in the `frontend` folder and run:
   npm install
   npm run dev -- --host 0.0.0.0

2. Open a second terminal in the `backend` folder and run:
   npm install
   node server.js

3. Open the frontend in the browser and sign in with a seeded demo account:
   - Admin: admin@northfield.com / admin123
   - Doctor: doctor@northfield.com / doctor123
   - Reception: reception@northfield.com / reception123
   - Patient: patient@northfield.com / patient123

## Notes

- The app uses demo data and synthetic records for local development.
- The backend is designed for extension to PostgreSQL/Prisma in production when deployment requirements grow.
