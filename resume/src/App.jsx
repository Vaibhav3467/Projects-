import { useMemo, useState } from 'react'
import { ArrowRight, Briefcase, BrainCircuit, CheckCircle2, Download, FileText, GraduationCap, LayoutDashboard, Lightbulb, LoaderCircle, Sparkles, Target, TrendingUp } from 'lucide-react'
import { jsPDF } from 'jspdf'
import './App.css'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002'

const sampleResume = `
Education
B.Tech in Computer Science and Engineering, 2025

Skills
Python, JavaScript, SQL, HTML, CSS, React, Git, Problem Solving, Teamwork

Projects
1. Smart Attendance Tracker
Built a web app using React and Node.js to automate attendance data capture and visualize daily trends.

2. E-commerce Dashboard
Created a dashboard using Python and SQL to analyze product sales and generate actionable insights.

Experience
Intern - Software Engineering Intern, TechNova Solutions
Worked on frontend features, bug fixes, and collaborating with a team to ship product updates.
`

const navItems = ['Dashboard', 'Analyze Resume', 'Skill Analysis', 'Job Recommendations', 'Learning Roadmap', 'Resume History', 'Settings']

function App() {
  const [resumeText, setResumeText] = useState(sampleResume)
  const [targetRole, setTargetRole] = useState('')
  const [industry, setIndustry] = useState('Technology')
  const [experienceLevel, setExperienceLevel] = useState('Fresher')
  const [location, setLocation] = useState('')
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [analysis, setAnalysis] = useState(null)

  const currentSummary = analysis?.resumeSummary?.summary || 'A polished resume can improve clarity, job alignment, and recruiter confidence.'
  const skillCards = analysis?.skillAnalysis?.technicalSkills || []
  const jobCards = analysis?.jobRecommendations || []
  const learningCards = analysis?.learningSuggestions || []
  const improvementCards = analysis?.resumeImprovements || []

  const readinessScore = analysis?.resumeReadiness?.score || 72

  const stats = useMemo(() => [
    { label: 'Readiness', value: `${readinessScore}/100`, tone: 'green' },
    { label: 'Roles', value: String(jobCards.length || 4), tone: 'blue' },
    { label: 'Skills', value: String(skillCards.length || 6), tone: 'amber' },
    { label: 'Gaps', value: String(analysis?.missingSkills?.length || 3), tone: 'red' }
  ], [jobCards.length, readinessScore, skillCards.length, analysis?.missingSkills?.length])

  async function handleUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const validTypes = ['pdf', 'docx', 'txt']
    const extension = file.name.split('.').pop()?.toLowerCase()

    if (!validTypes.includes(extension)) {
      setError('Unsupported file type. Please upload a PDF, DOCX, or TXT file.')
      return
    }

    setFileName(file.name)
    setError('')

    try {
      const formData = new FormData()
      formData.append('resumeFile', file)
      const response = await fetch(`${API_BASE}/api/upload`, { method: 'POST', body: formData })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.message || 'The document could not be processed.')
      }

      setResumeText(payload.text)
    } catch (uploadError) {
      setError(uploadError.message || 'Failed to read the uploaded file.')
    }
  }

  async function handleAnalyze() {
    if (!resumeText.trim()) {
      setError('Please enter or upload some resume content before running analysis.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          targetRole,
          industry,
          experienceLevel,
          location
        })
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.message || 'The analysis request failed.')
      }

      setAnalysis(payload)
    } catch (analysisError) {
      setError(analysisError.message || 'Something went wrong while analyzing the resume.')
    } finally {
      setLoading(false)
    }
  }

  function handleDownload() {
    if (!analysis) return

    const doc = new jsPDF()
    const lines = [
      'AI Resume Analyzer Report',
      '',
      'Summary',
      analysis.resumeSummary?.summary || '',
      '',
      'Skills',
      ...(analysis.skillAnalysis?.technicalSkills || []).map((skill) => `- ${skill.name}: ${skill.category}`),
      '',
      'Recommended Job Roles',
      ...(analysis.jobRecommendations || []).map((role) => `- ${role.role}: ${role.matchScore}% match`),
      '',
      'Resume Readiness Score',
      `${analysis.resumeReadiness?.score || 0}/100`,
      '',
      'Disclaimer',
      'This is a demo analysis intended for guidance and should be reviewed manually.'
    ]

    let y = 20
    lines.forEach((line) => {
      const text = String(line)
      const split = doc.splitTextToSize(text, 180)
      doc.text(split, 14, y)
      y += split.length * 7
      if (y > 280) {
        doc.addPage()
        y = 20
      }
    })

    doc.save('resume-analysis-report.pdf')
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-icon"><Sparkles size={20} /></div>
          <div>
            <p className="eyebrow">Placement Cell</p>
            <h1>ResumeInsight AI</h1>
          </div>
        </div>

        <nav className="nav" aria-label="Main navigation">
          {navItems.map((item, index) => (
            <button key={item} type="button" className={index === 0 ? 'nav-item active' : 'nav-item'}>
              {item}
            </button>
          ))}
        </nav>
      </header>

      <main className="app-layout">
        <aside className="sidebar card">
          <div className="sidebar-header">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </div>

          <div className="side-panel-block">
            <p className="panel-label">Resume Summary</p>
            <p className="panel-value">{currentSummary}</p>
          </div>

          <div className="side-panel-block">
            <p className="panel-label">Latest analysis</p>
            <div className="mini-stack">
              {stats.map((stat) => (
                <div key={stat.label} className={`mini-stat ${stat.tone}`}>
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="content-area">
          <div className="hero-banner card">
            <div>
              <p className="eyebrow green">AI-powered career readiness</p>
              <h2>Analyze resumes, discover strong job fits, and unlock a smarter career roadmap.</h2>
            </div>
            <button type="button" className="primary-btn">
              Analyze Your Resume <ArrowRight size={16} />
            </button>
          </div>

          <div className="form-grid card">
            <div className="field-block wide">
              <label htmlFor="resumeText">Resume content</label>
              <textarea id="resumeText" value={resumeText} onChange={(e) => setResumeText(e.target.value)} rows={12} placeholder="Paste your resume here..." />
            </div>

            <div className="upload-row">
              <label className="upload-box" htmlFor="resumeUpload">
                <FileText size={18} />
                <span>{fileName || 'Upload PDF / DOCX / TXT'}</span>
                <input id="resumeUpload" type="file" accept=".pdf,.docx,.txt" onChange={handleUpload} />
              </label>
              <button type="button" className="secondary-btn" onClick={() => setResumeText('')}>
                Clear
              </button>
            </div>

            <div className="meta-grid">
              <div className="field-block">
                <label htmlFor="targetRole">Target role</label>
                <input id="targetRole" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="e.g. Data Analyst" />
              </div>
              <div className="field-block">
                <label htmlFor="industry">Preferred industry</label>
                <input id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Technology" />
              </div>
              <div className="field-block">
                <label htmlFor="experienceLevel">Experience level</label>
                <select id="experienceLevel" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
                  <option>Student</option>
                  <option>Fresher</option>
                  <option>Intern</option>
                  <option>Experienced</option>
                </select>
              </div>
              <div className="field-block">
                <label htmlFor="location">Preferred work location</label>
                <input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Remote / Bangalore" />
              </div>
            </div>

            <div className="action-row">
              <button type="button" className="primary-btn" onClick={handleAnalyze} disabled={loading}>
                {loading ? <><LoaderCircle className="spin" size={16} /> Processing...</> : <>Analyze My Resume</>}
              </button>
              {analysis && (
                <button type="button" className="secondary-btn" onClick={handleDownload}>
                  <Download size={16} /> Download Report
                </button>
              )}
            </div>

            {error && <div className="error-box">{error}</div>}
          </div>

          {analysis && (
            <>
              <div className="summary-grid">
                <div className="card summary-card">
                  <div className="section-heading">
                    <Target size={18} />
                    <h3>Resume Summary</h3>
                  </div>
                  <p>{analysis.resumeSummary?.summary}</p>
                  <div className="tag-row">
                    {(analysis.resumeSummary?.strengths || []).map((strength) => (
                      <span key={strength} className="pill green">{strength}</span>
                    ))}
                  </div>
                </div>

                <div className="card score-card">
                  <p className="panel-label">Resume readiness</p>
                  <div className="score-ring" style={{ '--score': `${readinessScore}%` }}>
                    <strong>{readinessScore}</strong>
                  </div>
                  <p className="score-note">Guidance metric based on structure, skills, and job alignment.</p>
                </div>
              </div>

              <div className="card section-card">
                <div className="section-heading">
                  <BrainCircuit size={18} />
                  <h3>Skill Analysis</h3>
                </div>
                <div className="chip-grid">
                  {(analysis.skillAnalysis?.technicalSkills || []).map((skill) => (
                    <div key={skill.name} className="skill-chip">
                      <span>{skill.name}</span>
                      <small>{skill.category}</small>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card section-card">
                <div className="section-heading">
                  <Briefcase size={18} />
                  <h3>Job Recommendations</h3>
                </div>
                <div className="job-list">
                  {jobCards.map((job) => (
                    <div key={job.role} className="job-card">
                      <div className="job-meta">
                        <h4>{job.role}</h4>
                        <span>{job.matchScore}% match</span>
                      </div>
                      <p>{job.reason}</p>
                      <div className="tag-row">
                        {(job.matchingSkills || []).map((skill) => (
                          <span key={skill} className="pill blue">{skill}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="two-col-grid">
                <div className="card section-card">
                  <div className="section-heading">
                    <Lightbulb size={18} />
                    <h3>Missing Skills</h3>
                  </div>
                  <ul className="list-block">
                    {(analysis.missingSkills || []).slice(0, 5).map((item) => (
                      <li key={`${item.relatedRole}-${item.skill}`}>
                        <strong>{item.skill}</strong>
                        <span>{item.relatedRole}</span>
                        <small>{item.reason}</small>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card section-card">
                  <div className="section-heading">
                    <GraduationCap size={18} />
                    <h3>Learning Roadmap</h3>
                  </div>
                  <div className="roadmap-list">
                    {learningCards.map((item) => (
                      <div key={item.skill} className="roadmap-item">
                        <span>{item.priority}</span>
                        <div>
                          <h4>{item.skill}</h4>
                          <p>{item.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card section-card">
                <div className="section-heading">
                  <TrendingUp size={18} />
                  <h3>Resume Improvements</h3>
                </div>
                <div className="improvement-list">
                  {(improvementCards || []).map((item) => (
                    <div key={`${item.section}-${item.issue}`} className="improvement-item">
                      <CheckCircle2 size={18} />
                      <div>
                        <h4>{item.section}</h4>
                        <p><strong>Issue:</strong> {item.issue}</p>
                        <p><strong>Suggestion:</strong> {item.suggestion}</p>
                        <span className="priority-badge">{item.priority}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
