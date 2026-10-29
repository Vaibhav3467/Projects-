import express from 'express'
import cors from 'cors'
import multer from 'multer'
import mammoth from 'mammoth'
import { fileURLToPath } from 'url'
import path from 'path'
import { analyzeResume } from './analyzer.js'

const app = express()
const port = Number(process.env.PORT || 3002)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (_, file, callback) => {
    const allowed = ['pdf', 'docx', 'txt']
    const extension = file.originalname.split('.').pop()?.toLowerCase()
    if (!allowed.includes(extension)) {
      callback(new Error('Unsupported file type. Please upload a PDF, DOCX, or TXT file.'))
      return
    }
    callback(null, true)
  }
})

async function extractPdfText(buffer) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
  pdfjs.GlobalWorkerOptions.workerSrc = path.join(__dirname, '../node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs')

  const loadingTask = pdfjs.getDocument({ data: buffer })
  const pdf = await loadingTask.promise
  const pages = []

  for (let index = 1; index <= pdf.numPages; index += 1) {
    const page = await pdf.getPage(index)
    const content = await page.getTextContent()
    const pageText = content.items.map((item) => item.str).join(' ')
    pages.push(pageText)
  }

  return pages.join('\n')
}

async function extractFileText(file) {
  const extension = file.originalname.split('.').pop()?.toLowerCase()

  if (extension === 'txt') {
    return file.buffer.toString('utf-8')
  }

  if (extension === 'docx') {
    const result = await mammoth.extractRawText({ buffer: file.buffer })
    return result.value || ''
  }

  if (extension === 'pdf') {
    return extractPdfText(file.buffer)
  }

  throw new Error('Unsupported resume document type.')
}

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', message: 'Resume Analyzer API is running' })
})

app.post('/api/upload', upload.single('resumeFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file was uploaded.' })
    }

    const text = await extractFileText(req.file)
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'The uploaded file could not be read or contains no usable text.' })
    }

    return res.json({ text, fileName: req.file.originalname })
  } catch (error) {
    return res.status(400).json({ message: error.message || 'The uploaded document could not be processed.' })
  }
})

app.post('/api/analyze', (req, res) => {
  try {
    const { resumeText, targetRole, industry, experienceLevel, location } = req.body || {}
    const text = String(resumeText || '').trim()

    if (!text) {
      return res.status(400).json({ message: 'Please provide resume text or upload a document before analysis.' })
    }

    const analysis = analyzeResume(text, { targetRole, industry, experienceLevel, location })
    return res.json(analysis)
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Analysis failed because the server could not process the resume.' })
  }
})

app.listen(port, () => {
  console.log(`Resume analyzer backend running on http://localhost:${port}`)
})
