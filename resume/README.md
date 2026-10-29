# AI-Powered Resume Analyzer and Career Recommendation System

A responsive student-focused web app for resume analysis, career matching, learning roadmap generation, and resume improvement suggestions.

## Features

- Resume text entry and upload support for PDF, DOCX, and TXT files
- Automated skill extraction and role matching
- Personalized learning suggestions and missing-skill analysis
- Resume improvement guidance and readiness scoring
- PDF download for final analysis report
- Demo-mode analysis for environments without an external LLM key

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Resume parsing: `mammoth` and `pdfjs-dist`
- Report export: `jspdf`

## Local setup

1. Install dependencies:

   npm install

2. Copy the representative environment file:

   cp .env.example .env

3. Start the app in development mode:

   npm run dev

4. Open the frontend at:

   http://localhost:5173

5. The API runs at:

   http://localhost:3002/api/health

## Configuration

Set the following entries if you want to enable a real AI integration later:

- `OPENAI_API_KEY`
- `AI_MODE=live`
- `VITE_API_BASE_URL`

## Security notes

- Keep secrets out of the browser.
- Store only consented resume data when required.
- Review AI-generated output before relying on it for final decisions.

## Demo mode

This project ships with a heuristic demo-analysis engine to work even without an external API key. The code is structured so a real LLM integration can replace the demo logic in the backend.
