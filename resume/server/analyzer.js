const JOB_ROLES = [
  {
    title: 'Software Developer',
    description: 'Build feature-rich web and application solutions, improve product quality, and collaborate across teams.',
    requiredSkills: ['Python', 'JavaScript', 'SQL', 'Git', 'Problem Solving', 'Web Development'],
    preferredSkills: ['React', 'Node.js', 'REST APIs', 'Data Structures']
  },
  {
    title: 'Frontend Developer',
    description: 'Create responsive interfaces, improve user experience, and implement accessible, visually polished web pages.',
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'UI/UX', 'Web Development'],
    preferredSkills: ['Responsive Design', 'Git', 'Testing']
  },
  {
    title: 'Data Analyst',
    description: 'Turn raw data into insight, analyze business metrics, and build dashboards or reports for decision-making.',
    requiredSkills: ['SQL', 'Python', 'Excel', 'Statistics', 'Data Visualization'],
    preferredSkills: ['Power BI', 'Tableau', 'Machine Learning']
  },
  {
    title: 'Data Scientist',
    description: 'Use statistical methods and machine learning to extract insight, model patterns, and solve business problems.',
    requiredSkills: ['Python', 'Machine Learning', 'Statistics', 'SQL', 'Data Visualization'],
    preferredSkills: ['Pandas', 'Scikit-learn', 'Research']
  },
  {
    title: 'Full-Stack Developer',
    description: 'Work across frontend and backend systems to ship complete product features and maintain service health.',
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'SQL', 'REST APIs', 'Database Management'],
    preferredSkills: ['Express', 'MongoDB', 'Authentication']
  }
]

const SKILL_LIBRARY = [
  { name: 'Python', category: 'Programming', aliases: ['python', 'py'] },
  { name: 'JavaScript', category: 'Programming', aliases: ['javascript', 'js'] },
  { name: 'Java', category: 'Programming', aliases: ['java'] },
  { name: 'C++', category: 'Programming', aliases: ['c++', 'cpp'] },
  { name: 'SQL', category: 'Databases', aliases: ['sql', 'database queries', 'mysql', 'postgresql'] },
  { name: 'HTML', category: 'Web Development', aliases: ['html', 'hypertext markup language'] },
  { name: 'CSS', category: 'Web Development', aliases: ['css', 'cascading style sheets'] },
  { name: 'React', category: 'Frameworks', aliases: ['react', 'reactjs'] },
  { name: 'Node.js', category: 'Frameworks', aliases: ['node.js', 'nodejs', 'node js'] },
  { name: 'Express', category: 'Frameworks', aliases: ['express', 'express.js'] },
  { name: 'REST APIs', category: 'Web Development', aliases: ['rest api', 'restful api', 'api development'] },
  { name: 'Git', category: 'Tools', aliases: ['git', 'github', 'version control'] },
  { name: 'Power BI', category: 'Data', aliases: ['power bi'] },
  { name: 'Tableau', category: 'Data', aliases: ['tableau'] },
  { name: 'Excel', category: 'Data', aliases: ['excel', 'microsoft excel'] },
  { name: 'Machine Learning', category: 'Data Science', aliases: ['machine learning', 'ml'] },
  { name: 'Pandas', category: 'Data Science', aliases: ['pandas'] },
  { name: 'Data Visualization', category: 'Data Science', aliases: ['data visualization', 'dashboarding'] },
  { name: 'Statistics', category: 'Data Science', aliases: ['statistics', 'statistical analysis'] },
  { name: 'Problem Solving', category: 'Soft Skills', aliases: ['problem solving', 'problem-solving'] },
  { name: 'Communication', category: 'Soft Skills', aliases: ['communication', 'verbal communication', 'written communication'] },
  { name: 'Teamwork', category: 'Soft Skills', aliases: ['teamwork', 'collaboration'] },
  { name: 'Leadership', category: 'Soft Skills', aliases: ['leadership', 'mentoring'] },
  { name: 'UI/UX', category: 'Web Development', aliases: ['ui/ux', 'user interface', 'ux design'] },
  { name: 'Responsive Design', category: 'Web Development', aliases: ['responsive design', 'responsive web design', 'mobile responsiveness'] },
  { name: 'Database Management', category: 'Databases', aliases: ['database management', 'dbms'] },
  { name: 'Web Development', category: 'Web Development', aliases: ['web development', 'frontend development', 'backend development'] },
  { name: 'Data Structures', category: 'Programming', aliases: ['data structures', 'arrays', 'stacks', 'queues'] }
]

const RESOURCE_LIBRARY = {
  Python: [{ title: 'Python Official Tutorial', url: 'https://docs.python.org/3/tutorial/' }, { title: 'freeCodeCamp Python Curriculum', url: 'https://www.freecodecamp.org/news/search/?query=python' }],
  JavaScript: [{ title: 'MDN JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide' }, { title: 'freeCodeCamp JavaScript', url: 'https://www.freecodecamp.org/news/tag/javascript/' }],
  React: [{ title: 'React Official Docs', url: 'https://react.dev/' }, { title: 'freeCodeCamp React Guide', url: 'https://www.freecodecamp.org/news/tag/react/' }],
  SQL: [{ title: 'SQLBolt', url: 'https://sqlbolt.com/' }, { title: 'Mode SQL Tutorial', url: 'https://mode.com/sql-tutorial/' }],
  HTML: [{ title: 'MDN HTML Guide', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML' }, { title: 'W3Schools HTML Tutorial', url: 'https://www.w3schools.com/html/' }],
  CSS: [{ title: 'MDN CSS Guide', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS' }, { title: 'W3Schools CSS Tutorial', url: 'https://www.w3schools.com/css/' }],
  'REST APIs': [{ title: 'MDN HTTP Overview', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview' }, { title: 'Postman Learning Center', url: 'https://learning.postman.com/' }],
  Excel: [{ title: 'Microsoft Excel Training', url: 'https://support.microsoft.com/en-us/office/excel-training-9bc05390-e94c-46af-a5b3-d7c22f6990bb' }, { title: 'Excel Easy', url: 'https://www.excel-easy.com/' }],
  'Machine Learning': [{ title: 'scikit-learn Documentation', url: 'https://scikit-learn.org/stable/' }, { title: 'Kaggle Learn', url: 'https://www.kaggle.com/learn' }],
  'Data Visualization': [{ title: 'Tableau Training', url: 'https://www.tableau.com/learn/training' }, { title: 'Power BI Learning', url: 'https://learn.microsoft.com/en-us/training/browse/?products=power-bi' }],
  'Problem Solving': [{ title: 'HackerRank Practice', url: 'https://www.hackerrank.com/' }, { title: 'LeetCode', url: 'https://leetcode.com/' }],
  Git: [{ title: 'Git Documentation', url: 'https://git-scm.com/doc' }, { title: 'GitHub Skills', url: 'https://skills.github.com/' }],
  default: [{ title: 'Coursera', url: 'https://www.coursera.org/' }, { title: 'edX', url: 'https://www.edx.org/' }]
}

function normalizeText(value = '') {
  return String(value).replace(/\s+/g, ' ').trim()
}

function findSkillMatches(text) {
  const normalized = normalizeText(text).toLowerCase()
  const matches = []

  for (const skill of SKILL_LIBRARY) {
    const aliasMatch = skill.aliases.find((alias) => normalized.includes(alias.toLowerCase()))
    if (!aliasMatch) continue

    matches.push({
      name: skill.name,
      category: skill.category,
      evidence: aliasMatch,
      assessment: 'Demonstrated in resume'
    })
  }

  return matches
}

function findSoftSkills(text) {
  const skills = ['Communication', 'Teamwork', 'Problem Solving', 'Leadership']
  const normalized = normalizeText(text).toLowerCase()
  return skills.filter((skill) => {
    const aliases = SKILL_LIBRARY.find((entry) => entry.name === skill)?.aliases ?? []
    return aliases.some((alias) => normalized.includes(alias.toLowerCase()))
  })
}

function summarizeResume(text, skills) {
  const trimmed = normalizeText(text)
  const hasProject = /project|developed|built|created|portfolio|application|website|dashboard|analysis/i.test(trimmed)
  const hasInternship = /intern|internship|experience|worked|engineer|developer|analyst/i.test(trimmed)
  const hasEducation = /b\.tech|btech|be|b\.e|mca|msc|bsc|degree|student|college|university|semester|cgpa/i.test(trimmed)

  const topSkills = skills.slice(0, 4).map((skill) => skill.name)
  const summary = [
    hasEducation ? 'Student with academic training in technology and analytical problem solving' : 'Candidate with relevant technical and project-oriented background',
    topSkills.length ? `with demonstrated skills in ${topSkills.join(', ')}` : 'with a developing foundation in core technical areas',
    hasProject ? 'and practical project experience' : 'and a growing interest in applied learning',
    hasInternship ? 'alongside internship or work exposure' : 'with scope to strengthen professional experience'
  ].join(' ')

  return {
    summary: summary.replace(/\s+/g, ' ').trim(),
    strengths: topSkills.length ? topSkills : ['Problem solving', 'Technical curiosity', 'Learning readiness']
  }
}

function getRoleRecommendation(resumeText, role, matchedSkills) {
  const required = role.requiredSkills
  const matching = required.filter((skill) => matchedSkills.some((item) => item.name.toLowerCase() === skill.toLowerCase()))
  const missing = required.filter((skill) => !matching.includes(skill))
  const matchScore = Math.min(
    96,
    Math.max(
      42,
      Math.round((matching.length / Math.max(required.length, 1)) * 70 + (matchedSkills.length > 0 ? 15 : 0) + (/(project|intern|experience|portfolio|build|develop)/i.test(resumeText) ? 10 : 0))
    )
  )

  return {
    role: role.title,
    description: role.description,
    matchScore,
    reason: `${matching.length} of ${required.length} core skills align with this role, with ${missing.length} areas to strengthen for better alignment.`,
    matchingSkills: matching,
    missingSkills: missing.slice(0, 5),
    learningPriorities: missing.slice(0, 3),
    whyItMatches: matching.length
      ? `The resume shows evidence of ${matching.slice(0, 3).join(', ')} and project-oriented learning relevant to ${role.title.toLowerCase()}.`
      : `This role is a strong career direction based on the candidate's broader technical foundation and interest in applied learning.`
  }
}

function buildLearningSuggestions(skillNames, roleName) {
  return skillNames.map((skill, index) => {
    const resources = RESOURCE_LIBRARY[skill] ?? RESOURCE_LIBRARY.default
    return {
      skill,
      level: index === 0 ? 'Beginner' : index === 1 ? 'Intermediate' : 'Advanced',
      priority: index + 1,
      reason: `This skill is important for ${roleName} and is a common gap to address before interview and project rounds.`,
      project: `Build a small ${roleName.toLowerCase()} project focusing on ${skill.toLowerCase()}.`,
      estimatedDuration: index === 0 ? '2-3 weeks' : index === 1 ? '3-4 weeks' : '4-6 weeks',
      resources: resources.map((resource) => ({ title: resource.title, url: resource.url }))
    }
  })
}

function buildResumeImprovements(text) {
  const suggestions = []
  const lower = text.toLowerCase()

  if (!/education|skills|projects|experience|certification/i.test(lower)) {
    suggestions.push({
      section: 'Structure',
      issue: 'Core sections are not clearly visible in the submitted resume.',
      suggestion: 'Add clear headings for Education, Skills, Projects, Experience, and Certifications.',
      priority: 'High'
    })
  }

  if (!/project|developed|built|created|implemented|designed/i.test(lower)) {
    suggestions.push({
      section: 'Projects',
      issue: 'Project descriptions may need more detail to show practical impact.',
      suggestion: 'Describe the problem, your role, tools used, and the outcome using measurable results where possible.',
      priority: 'High'
    })
  }

  if (!/communication|leadership|teamwork|problem solving|collaboration/i.test(lower)) {
    suggestions.push({
      section: 'Skills / Profile',
      issue: 'Soft skills are not clearly highlighted.',
      suggestion: 'Add a brief statement about teamwork, problem-solving, or communication when supported by projects or coursework.',
      priority: 'Medium'
    })
  }

  suggestions.push({
    section: 'ATS Compatibility',
    issue: 'Formatting may reduce readability for recruiters and ATS systems.',
    suggestion: 'Use standard section headings, avoid excessive tables, and keep a simple, readable font with consistent spacing.',
    priority: 'Medium'
  })

  return suggestions.slice(0, 5)
}

function buildReadinessScore(text, skills, roleRecommendations) {
  const technicalCount = skills.length
  const sectionsPresent = ['education', 'skills', 'projects', 'experience'].filter((section) => text.toLowerCase().includes(section)).length
  const score = Math.min(100, Math.max(45, Math.round(52 + technicalCount * 4 + sectionsPresent * 6 + (roleRecommendations[0]?.matchScore ?? 55) / 3)))

  return {
    score,
    criteria: [
      { name: 'Resume completeness', score: Math.min(100, 45 + sectionsPresent * 15) },
      { name: 'Skills relevance', score: Math.min(100, 40 + technicalCount * 5) },
      { name: 'Role alignment', score: roleRecommendations[0]?.matchScore ?? 60 },
      { name: 'ATS readability', score: Math.min(100, 55 + (text.length > 400 ? 20 : 10)) }
    ],
    limitations: ['This score is a guidance metric derived from resume evidence and should not be treated as an official ATS result or a guarantee of job placement.']
  }
}

export function analyzeResume(resumeText, options = {}) {
  const text = normalizeText(resumeText)
  const skillMatches = findSkillMatches(text)
  const softSkills = findSoftSkills(text)
  const matchedSkills = skillMatches.map((skill) => ({ ...skill }))

  const jobRecommendations = JOB_ROLES.map((role) => getRoleRecommendation(text, role, matchedSkills))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4)

  const topRole = jobRecommendations[0] ?? {
    role: options.targetRole || 'Software Developer',
    missingSkills: ['Problem Solving', 'SQL', 'Git'],
    learningPriorities: ['Problem Solving', 'SQL']
  }

  const missingSkills = jobRecommendations.flatMap((role) =>
    role.missingSkills.map((skill) => ({
      skill,
      relatedRole: role.role,
      importance: role.missingSkills.indexOf(skill) < 2 ? 'High' : 'Medium',
      reason: `${skill} is relevant for ${role.role.toLowerCase()} and is a commonly expected capability for stronger role alignment.`
    }))
  )

  const learningSuggestions = buildLearningSuggestions(
    topRole.missingSkills.length ? topRole.missingSkills : ['Problem Solving', 'SQL', 'Git'],
    topRole.role
  )

  const readiness = buildReadinessScore(text, skillMatches, jobRecommendations)

  const output = {
    mode: 'demo',
    resumeSummary: summarizeResume(text, matchedSkills),
    skillAnalysis: {
      technicalSkills: matchedSkills.length
        ? matchedSkills
        : [{ name: 'Python', category: 'Programming', evidence: 'Not found in the submitted resume', assessment: 'Needs evidence' }],
      softSkills: softSkills.length
        ? softSkills.map((name) => ({ name, category: 'Soft Skills', evidence: 'Likely implied by experience or projects', assessment: 'Needs supporting evidence' }))
        : [{ name: 'Communication', category: 'Soft Skills', evidence: 'Not found in the submitted resume', assessment: 'Needs evidence' }],
      skillsNeedingEvidence: matchedSkills.length ? [] : ['Communication', 'Teamwork', 'Problem Solving']
    },
    jobRecommendations: jobRecommendations.map((role) => ({
      ...role,
      matchingSkills: role.matchingSkills,
      missingSkills: role.missingSkills,
      learningPriorities: role.learningPriorities,
      estimatedMatch: role.matchScore
    })),
    missingSkills,
    learningSuggestions,
    resumeImprovements: buildResumeImprovements(text),
    resumeReadiness: readiness,
    metadata: {
      targetRole: options.targetRole || topRole.role,
      experienceLevel: options.experienceLevel || 'Fresher',
      industry: options.industry || 'Technology',
      location: options.location || 'Open to remote / on-site opportunities',
      generatedAt: new Date().toISOString(),
      disclaimer: 'Demo-mode analysis is generated from resume text patterns and structured heuristics. Use it as a guidance tool and review the suggestions manually.'
    }
  }

  return output
}
