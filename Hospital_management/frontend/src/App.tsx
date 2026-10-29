import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Activity,
  Ambulance,
  BedDouble,
  Bell,
  BriefcaseMedical,
  CalendarRange,
  CheckCircle2,
  Clock3,
  FileText,
  Hospital,
  LogOut,
  Pill,
  Search,
  ShieldCheck,
  Stethoscope,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react'
import './App.css'

const API_URL = 'http://localhost:3001/api'

type User = {
  id: number
  name: string
  email: string
  role: string
  branch: string
}

type DashboardData = {
  summary: {
    totalPatients: number
    newPatientsToday: number
    totalDoctors: number
    availableDoctors: number
    appointmentsToday: number
    completedAppointments: number
    cancelledAppointments: number
    missedAppointments: number
    currentAdmissions: number
    occupiedBeds: number
    emergencyCases: number
    pendingLabReports: number
    loqStockAlerts: number
    revenueToday: number
    outstandingInvoices: number
  }
  alerts: string[]
  recentActivity: Array<{ title: string; detail: string; time: string }>
  chartData: Array<{ label: string; value: number }>
  patients: Array<Record<string, unknown>>
  doctors: Array<Record<string, unknown>>
  appointments: Array<Record<string, unknown>>
  queue: Array<Record<string, unknown>>
  inventory: InventoryItem[]
}

type InventoryItem = {
  id: number
  name: string
  category: string
  batch: string
  stock: number
  reorder_level: number
  expiry: string
  status: string
}

type PatientDetail = {
  patient: Record<string, unknown>
  timeline: Array<{ title: string; type: string; date: string; notes: string }>
  summary: {
    allergies: string
    lastVisit: string
    insurer: string
    status: string
  }
}

const navigationByRole: Record<string, string[]> = {
  admin: ['dashboard', 'patients', 'patient-detail', 'doctors', 'appointments', 'queue', 'inventory', 'billing', 'reports'],
  doctor: ['dashboard', 'patients', 'patient-detail', 'appointments', 'queue', 'records'],
  reception: ['dashboard', 'patients', 'patient-detail', 'appointments', 'queue', 'billing'],
  patient: ['dashboard', 'appointments', 'records', 'billing'],
}

const readSessionCache = <T,>(key: string): T | null => {
  try {
    const cachedValue = sessionStorage.getItem(key)
    return cachedValue ? (JSON.parse(cachedValue) as T) : null
  } catch {
    return null
  }
}

const writeSessionCache = (key: string, value: unknown) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore cache write failures so the app continues to operate.
  }
}

const statusTone: Record<string, string> = {
  Confirmed: 'status-confirmed',
  'Checked In': 'status-in',
  Waiting: 'status-waiting',
  Requested: 'status-requested',
  Completed: 'status-success',
  Cancelled: 'status-cancelled',
  'No-show': 'status-cancelled',
  Available: 'status-confirmed',
  'On Duty': 'status-in',
  'On Leave': 'status-waiting',
  Low: 'status-cancelled',
  Healthy: 'status-confirmed',
  Inactive: 'status-waiting',
}

function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('hm-user')
    return saved ? (JSON.parse(saved) as User) : null
  })
  const [token, setToken] = useState<string>(localStorage.getItem('hm-token') || '')
  const [screen, setScreen] = useState('dashboard')
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [patients, setPatients] = useState<Array<Record<string, unknown>>>([])
  const [doctors, setDoctors] = useState<Array<Record<string, unknown>>>([])
  const [appointments, setAppointments] = useState<Array<Record<string, unknown>>>([])
  const [queue, setQueue] = useState<Array<Record<string, unknown>>>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<PatientDetail | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showWebsite, setShowWebsite] = useState(false)

  const [loginForm, setLoginForm] = useState({
    email: 'admin@northfield.com',
    password: 'admin123',
  })

  const [patientForm, setPatientForm] = useState({
    name: '',
    mrn: 'MRN-' + Math.floor(1000 + Math.random() * 9000),
    age: '28',
    sex: 'Female',
    phone: '',
    email: '',
    blood_group: 'O+',
    allergies: 'None',
    city: 'Bengaluru',
  })

  const [appointmentForm, setAppointmentForm] = useState({
    patientId: '1',
    doctorId: '1',
    department: 'Cardiology',
    date: '2026-10-29',
    slot: '10:00 AM',
    type: 'In-person',
    reason: 'Follow-up review',
    fee: '1200',
  })

  const navItems = useMemo(
    () => navigationByRole[user?.role || 'admin'] || navigationByRole.admin,
    [user?.role],
  )

  const request = useCallback(
    async (path: string, options: RequestInit = {}) => {
      const headers = new Headers(options.headers || {})
      headers.set('Content-Type', 'application/json')
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }

      const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload.error || 'Request failed')
      }

      return payload
    },
    [token],
  )

  const loadAllData = useCallback(async () => {
    if (!user || !token) {
      return
    }

    const cachedDashboard = readSessionCache<DashboardData>('hm-dashboard')
    const cachedPatients = readSessionCache<Array<Record<string, unknown>>>('hm-patients')
    const cachedDoctors = readSessionCache<Array<Record<string, unknown>>>('hm-doctors')
    const cachedAppointments = readSessionCache<Array<Record<string, unknown>>>('hm-appointments')
    const cachedQueue = readSessionCache<Array<Record<string, unknown>>>('hm-queue')
    const cachedInventory = readSessionCache<InventoryItem[]>('hm-inventory')

    if (cachedDashboard) setDashboard(cachedDashboard)
    if (cachedPatients) setPatients(cachedPatients)
    if (cachedDoctors) setDoctors(cachedDoctors)
    if (cachedAppointments) setAppointments(cachedAppointments)
    if (cachedQueue) setQueue(cachedQueue)
    if (cachedInventory) setInventory(cachedInventory)

    setLoading(true)
    setError('')

    try {
      const [dashboardData, patientRows, doctorRows, appointmentRows, queueRows, inventoryRows] = await Promise.all([
        request('/dashboard'),
        request('/patients'),
        request('/doctors'),
        request('/appointments'),
        request('/queue'),
        request('/inventory'),
      ])

      setDashboard(dashboardData)
      setPatients(patientRows)
      setDoctors(doctorRows)
      setAppointments(appointmentRows)
      setQueue(queueRows)
      setInventory(inventoryRows)

      writeSessionCache('hm-dashboard', dashboardData)
      writeSessionCache('hm-patients', patientRows)
      writeSessionCache('hm-doctors', doctorRows)
      writeSessionCache('hm-appointments', appointmentRows)
      writeSessionCache('hm-queue', queueRows)
      writeSessionCache('hm-inventory', inventoryRows)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load system data')
    } finally {
      setLoading(false)
    }
  }, [request, token, user])

  const fetchPatientDetail = useCallback(async (patientId: number) => {
    try {
      const data = await request(`/patients/${patientId}`)
      setSelectedPatient(data)
    } catch (patientError) {
      setError(patientError instanceof Error ? patientError.message : 'Unable to load patient record')
    }
  }, [request])

  useEffect(() => {
    if (user && token) {
      void loadAllData()
    }
  }, [loadAllData, token, user])

  useEffect(() => {
    if (selectedPatientId && user && token) {
      void fetchPatientDetail(selectedPatientId)
    }
  }, [fetchPatientDetail, selectedPatientId, token, user])

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    try {
      const payload = await request('/login', {
        method: 'POST',
        body: JSON.stringify(loginForm),
      })

      localStorage.setItem('hm-token', payload.token)
      localStorage.setItem('hm-user', JSON.stringify(payload.user))
      setToken(payload.token)
      setUser(payload.user)
      setScreen('dashboard')
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Login failed')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('hm-token')
    localStorage.removeItem('hm-user')
    setToken('')
    setUser(null)
    setScreen('dashboard')
    setSelectedPatient(null)
  }

  const handlePatientSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      await request('/patients', {
        method: 'POST',
        body: JSON.stringify({
          ...patientForm,
          age: Number(patientForm.age),
        }),
      })
      setPatientForm({
        ...patientForm,
        name: '',
        phone: '',
        email: '',
        mrn: 'MRN-' + Math.floor(1000 + Math.random() * 9000),
      })
      await loadAllData()
    } catch (patientError) {
      setError(patientError instanceof Error ? patientError.message : 'Patient registration failed')
    }
  }

  const handleAppointmentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      await request('/appointments', {
        method: 'POST',
        body: JSON.stringify({
          patientId: Number(appointmentForm.patientId),
          doctorId: Number(appointmentForm.doctorId),
          department: appointmentForm.department,
          date: appointmentForm.date,
          slot: appointmentForm.slot,
          type: appointmentForm.type,
          reason: appointmentForm.reason,
          fee: Number(appointmentForm.fee),
        }),
      })
      await loadAllData()
    } catch (appointmentError) {
      setError(appointmentError instanceof Error ? appointmentError.message : 'Appointment booking failed')
    }
  }

  const openPatientDetail = (patientId: number) => {
    setSelectedPatientId(patientId)
    setScreen('patient-detail')
  }

  const renderDashboard = () => {
    if (!dashboard) {
      return <div className="empty-state">Loading dashboard…</div>
    }

    const upcomingAppointments = (dashboard.appointments || []).slice(0, 4)
    const lowStockItems = (dashboard.inventory || []).filter((item: InventoryItem) => Number(item.stock) <= Number(item.reorder_level)).slice(0, 3)
    const waitingQueue = (dashboard.queue || []).slice(0, 3)
    const departments = [
      { name: 'Cardiology', value: (dashboard.appointments || []).filter((item) => String(item.department || '').includes('Cardio')).length || 2 },
      { name: 'Neurology', value: (dashboard.appointments || []).filter((item) => String(item.department || '').includes('Neuro')).length || 1 },
      { name: 'General', value: (dashboard.appointments || []).filter((item) => String(item.department || '').includes('General')).length || 2 },
      { name: 'Pediatrics', value: (dashboard.appointments || []).filter((item) => String(item.department || '').includes('Pedi')).length || 0 },
    ]

    return (
      <>
        <div className="summary-grid">
          <div className="summary-card">
            <div className="icon-wrap blue"><Users size={18} /></div>
            <div>
              <span>Total Patients</span>
              <strong>{dashboard.summary.totalPatients}</strong>
            </div>
          </div>
          <div className="summary-card">
            <div className="icon-wrap teal"><CalendarRange size={18} /></div>
            <div>
              <span>Appointments Today</span>
              <strong>{dashboard.summary.appointmentsToday}</strong>
            </div>
          </div>
          <div className="summary-card">
            <div className="icon-wrap gold"><Stethoscope size={18} /></div>
            <div>
              <span>Available Doctors</span>
              <strong>{dashboard.summary.availableDoctors}</strong>
            </div>
          </div>
          <div className="summary-card">
            <div className="icon-wrap rose"><BedDouble size={18} /></div>
            <div>
              <span>Occupied Beds</span>
              <strong>{dashboard.summary.occupiedBeds}</strong>
            </div>
          </div>
        </div>

        <div className="quick-action-row">
          <button type="button" className="action-button" onClick={() => setScreen('appointments')}>
            <CalendarRange size={16} /> Book visit
          </button>
          <button type="button" className="action-button secondary" onClick={() => setScreen('patients')}>
            <UserPlus size={16} /> Add patient
          </button>
          <button type="button" className="action-button secondary" onClick={() => setScreen('inventory')}>
            <Pill size={16} /> Inventory check
          </button>
        </div>

        <div className="dashboard-utility-grid">
          <section className="panel">
            <div className="panel-header">
              <h3>Today’s appointments</h3>
              <span>{upcomingAppointments.length} scheduled</span>
            </div>
            <div className="mini-list">
              {upcomingAppointments.map((item) => (
                <div key={String(item.id)} className="mini-item">
                  <div>
                    <strong>{String(item.patient_name)}</strong>
                    <p>{String(item.doctor_name)} · {String(item.appointment_date)}</p>
                  </div>
                  <span className={`status-pill ${statusTone[String(item.status)] || 'status-confirmed'}`}>
                    {String(item.status)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h3>Priority queue</h3>
              <span>{waitingQueue.length} active</span>
            </div>
            <div className="mini-list">
              {waitingQueue.map((item) => (
                <div key={String(item.id)} className="mini-item">
                  <div>
                    <strong>{String(item.patient_name)}</strong>
                    <p>Queue #{String(item.queue_no)} · {String(item.doctor_name)}</p>
                  </div>
                  <span className="tag-badge">{String(item.priority)}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="content-grid two-column">
          <section className="panel chart-panel">
            <div className="panel-header">
              <h3>Care volume</h3>
              <span>Past 7 days</span>
            </div>
            <div className="chart-bars" aria-label="Weekly appointment trend">
              {dashboard.chartData.map((point) => (
                <div key={point.label} className="bar-column">
                  <span className="bar" style={{ height: `${point.value}%` }} />
                  <small>{point.label}</small>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h3>Critical alerts</h3>
              <span>{dashboard.alerts.length} active</span>
            </div>
            <ul className="alert-list">
              {dashboard.alerts.map((alert) => (
                <li key={alert}>
                  <ShieldCheck size={16} />
                  <span>{alert}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="content-grid two-column">
          <section className="panel">
            <div className="panel-header">
              <h3>Department load</h3>
              <span>Current distribution</span>
            </div>
            <div className="department-list">
              {departments.map((department) => (
                <div key={department.name} className="department-row">
                  <div className="department-label">
                    <span>{department.name}</span>
                    <strong>{department.value}</strong>
                  </div>
                  <div className="progress-track">
                    <span style={{ width: `${Math.min((department.value / 4) * 100, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h3>Inventory watchlist</h3>
              <span>{lowStockItems.length} items</span>
            </div>
            <div className="mini-list">
              {lowStockItems.length ? lowStockItems.map((item: InventoryItem) => (
                <div key={item.id} className="mini-item">
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.batch} · Stock {item.stock}</p>
                  </div>
                  <span className="tag-badge warning">Low</span>
                </div>
              )) : <div className="empty-mini">No critical inventory alerts.</div>}
            </div>
          </section>
        </div>

        <div className="content-grid two-column">
          <section className="panel">
            <div className="panel-header">
              <h3>Recent activity</h3>
              <span>Live log</span>
            </div>
            <ul className="activity-list">
              {dashboard.recentActivity.map((item) => (
                <li key={item.title}>
                  <div className="dot" />
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.detail}</p>
                  </div>
                  <small>{item.time}</small>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h3>Operational snapshot</h3>
              <span>Today</span>
            </div>
            <div className="mini-stats">
              <div>
                <span>Revenue</span>
                <strong>₹{dashboard.summary.revenueToday.toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <span>Pending labs</span>
                <strong>{dashboard.summary.pendingLabReports}</strong>
              </div>
              <div>
                <span>Emergency</span>
                <strong>{dashboard.summary.emergencyCases}</strong>
              </div>
              <div>
                <span>Outstanding</span>
                <strong>₹{dashboard.summary.outstandingInvoices.toLocaleString('en-IN')}</strong>
              </div>
            </div>
          </section>
        </div>
      </>
    )
  }

  const renderPatients = () => (
    <div className="split-layout">
      <section className="panel">
        <div className="panel-header">
          <h3>Patient registry</h3>
          <span>{patients.length} records</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>MRN</th>
                <th>Name</th>
                <th>Age</th>
                <th>City</th>
                <th>Blood</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={String(patient.id)}>
                  <td>{String(patient.mrn)}</td>
                  <td><button type="button" className="table-link" onClick={() => openPatientDetail(Number(patient.id))}>{String(patient.name)}</button></td>
                  <td>{String(patient.age)}</td>
                  <td>{String(patient.city)}</td>
                  <td>{String(patient.blood_group || 'N/A')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel form-panel">
        <div className="panel-header">
          <h3>New patient</h3>
          <span>Registration</span>
        </div>
        <form onSubmit={handlePatientSubmit} className="form-grid">
          <label>
            Full name
            <input value={patientForm.name} onChange={(event) => setPatientForm({ ...patientForm, name: event.target.value })} />
          </label>
          <label>
            MRN
            <input value={patientForm.mrn} onChange={(event) => setPatientForm({ ...patientForm, mrn: event.target.value })} />
          </label>
          <label>
            Age
            <input type="number" value={patientForm.age} onChange={(event) => setPatientForm({ ...patientForm, age: event.target.value })} />
          </label>
          <label>
            Sex
            <select value={patientForm.sex} onChange={(event) => setPatientForm({ ...patientForm, sex: event.target.value })}>
              <option>Female</option>
              <option>Male</option>
              <option>Other</option>
            </select>
          </label>
          <label>
            Phone
            <input value={patientForm.phone} onChange={(event) => setPatientForm({ ...patientForm, phone: event.target.value })} />
          </label>
          <label>
            Email
            <input value={patientForm.email} onChange={(event) => setPatientForm({ ...patientForm, email: event.target.value })} />
          </label>
          <label>
            Blood group
            <input value={patientForm.blood_group} onChange={(event) => setPatientForm({ ...patientForm, blood_group: event.target.value })} />
          </label>
          <label>
            City
            <input value={patientForm.city} onChange={(event) => setPatientForm({ ...patientForm, city: event.target.value })} />
          </label>
          <label className="full-width">
            Allergies
            <input value={patientForm.allergies} onChange={(event) => setPatientForm({ ...patientForm, allergies: event.target.value })} />
          </label>
          <button type="submit" className="primary-button">
            <UserPlus size={16} /> Register patient
          </button>
        </form>
      </section>
    </div>
  )

  const renderPatientDetail = () => {
    if (!selectedPatient) {
      return <div className="empty-state">Loading patient record…</div>
    }

    const patient = selectedPatient.patient as Record<string, string | number | null>

    return (
      <div className="detail-layout">
        <section className="panel detail-top-panel">
          <div className="patient-topbar">
            <div className="avatar-box large">{String(patient.name).charAt(0)}</div>
            <div>
              <p className="eyebrow">Medical record</p>
              <h3>{String(patient.name)}</h3>
              <p>{String(patient.mrn)} • {String(patient.sex)} • {String(patient.age)} years</p>
            </div>
            <button type="button" className="secondary-button" onClick={() => setScreen('patients')}>
              Back to registry
            </button>
          </div>

          <div className="detail-card-grid">
            <div className="metric-box">
              <span>Allergies</span>
              <strong>{String(selectedPatient.summary.allergies)}</strong>
            </div>
            <div className="metric-box">
              <span>Last visit</span>
              <strong>{selectedPatient.summary.lastVisit}</strong>
            </div>
            <div className="metric-box">
              <span>Insurance</span>
              <strong>{selectedPatient.summary.insurer}</strong>
            </div>
            <div className="metric-box">
              <span>Status</span>
              <strong>{selectedPatient.summary.status}</strong>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3>Clinical timeline</h3>
            <span>Visit history</span>
          </div>
          <div className="timeline">
            {selectedPatient.timeline.map((entry) => (
              <div key={`${entry.title}-${entry.date}`} className="timeline-item">
                <div className="timeline-marker" />
                <div className="timeline-content">
                  <div className="timeline-meta">
                    <strong>{entry.title}</strong>
                    <span>{entry.type}</span>
                  </div>
                  <p>{entry.notes}</p>
                  <small>{entry.date}</small>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    )
  }

  const renderDoctors = () => (
    <section className="panel">
      <div className="panel-header">
        <h3>Doctor directory</h3>
        <span>{doctors.length} specialists</span>
      </div>
      <div className="doctor-grid">
        {doctors.map((doctor) => (
          <article className="doctor-card" key={String(doctor.id)}>
            <div className="doctor-header">
              <div className="avatar-box">{String(doctor.name).charAt(0)}</div>
              <div>
                <h4>{String(doctor.name)}</h4>
                <span>{String(doctor.specialty)}</span>
              </div>
            </div>
            <ul>
              <li>Department: {String(doctor.department)}</li>
              <li>Branch: {String(doctor.branch)}</li>
              <li>Status: <span className={`status-pill ${statusTone[String(doctor.availability)] || 'status-confirmed'}`}>{String(doctor.availability)}</span></li>
              <li>Consultation fee: ₹{Number(doctor.fee).toLocaleString('en-IN')}</li>
            </ul>
          </article>
        ))}
      </div>
    </section>
  )

  const renderAppointments = () => (
    <div className="split-layout">
      <section className="panel">
        <div className="panel-header">
          <h3>Appointments</h3>
          <span>{appointments.length} visits</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>When</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={String(appointment.id)}>
                  <td>{String(appointment.appointment_id)}</td>
                  <td>{String(appointment.patient_name)}</td>
                  <td>{String(appointment.doctor_name)}</td>
                  <td>{String(appointment.appointment_date)} · {String(appointment.slot)}</td>
                  <td><span className={`status-pill ${statusTone[String(appointment.status)] || 'status-confirmed'}`}>{String(appointment.status)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel form-panel">
        <div className="panel-header">
          <h3>Book visit</h3>
          <span>Schedule</span>
        </div>
        <form onSubmit={handleAppointmentSubmit} className="form-grid">
          <label>
            Patient ID
            <input type="number" value={appointmentForm.patientId} onChange={(event) => setAppointmentForm({ ...appointmentForm, patientId: event.target.value })} />
          </label>
          <label>
            Doctor ID
            <input type="number" value={appointmentForm.doctorId} onChange={(event) => setAppointmentForm({ ...appointmentForm, doctorId: event.target.value })} />
          </label>
          <label>
            Department
            <input value={appointmentForm.department} onChange={(event) => setAppointmentForm({ ...appointmentForm, department: event.target.value })} />
          </label>
          <label>
            Visit type
            <select value={appointmentForm.type} onChange={(event) => setAppointmentForm({ ...appointmentForm, type: event.target.value })}>
              <option>In-person</option>
              <option>Telehealth</option>
            </select>
          </label>
          <label>
            Date
            <input type="date" value={appointmentForm.date} onChange={(event) => setAppointmentForm({ ...appointmentForm, date: event.target.value })} />
          </label>
          <label>
            Slot
            <input value={appointmentForm.slot} onChange={(event) => setAppointmentForm({ ...appointmentForm, slot: event.target.value })} />
          </label>
          <label>
            Fee
            <input type="number" value={appointmentForm.fee} onChange={(event) => setAppointmentForm({ ...appointmentForm, fee: event.target.value })} />
          </label>
          <label className="full-width">
            Reason
            <input value={appointmentForm.reason} onChange={(event) => setAppointmentForm({ ...appointmentForm, reason: event.target.value })} />
          </label>
          <button type="submit" className="primary-button">
            <CalendarRange size={16} /> Confirm booking
          </button>
        </form>
      </section>
    </div>
  )

  const renderQueue = () => (
    <section className="panel">
      <div className="panel-header">
        <h3>Queue management</h3>
        <span>{queue.length} waiting</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Queue #</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Wait</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((entry) => (
              <tr key={String(entry.id)}>
                <td>{String(entry.queue_no)}</td>
                <td>{String(entry.patient_name)}</td>
                <td>{String(entry.doctor_name)}</td>
                <td>{String(entry.priority)}</td>
                <td><span className={`status-pill ${statusTone[String(entry.status)] || 'status-confirmed'}`}>{String(entry.status)}</span></td>
                <td>{String(entry.wait_minutes)} mins</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )

  const renderInventory = () => (
    <section className="panel">
      <div className="panel-header">
        <h3>Pharmacy inventory</h3>
        <span>{inventory.length} SKUs</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Category</th>
              <th>Batch</th>
              <th>Stock</th>
              <th>Reorder</th>
              <th>Expiry</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.batch}</td>
                <td>{item.stock}</td>
                <td>{item.reorder_level}</td>
                <td>{item.expiry}</td>
                <td><span className={`status-pill ${statusTone[item.status] || 'status-confirmed'}`}>{item.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )

  const renderRecords = () => (
    <div className="cards-grid">
      <section className="panel">
        <div className="panel-header">
          <h3>Clinical records</h3>
          <span>EMR access</span>
        </div>
        <ul className="record-list">
          <li><FileText size={16} /> Patient history summary</li>
          <li><Pill size={16} /> Current medications</li>
          <li><Activity size={16} /> Vital sign trend</li>
          <li><BriefcaseMedical size={16} /> Treatment plan</li>
        </ul>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>Billing overview</h3>
          <span>Payments</span>
        </div>
        <ul className="record-list">
          <li><Wallet size={16} /> Paid invoices: 18</li>
          <li><CheckCircle2 size={16} /> Insurance claims: 4</li>
          <li><Clock3 size={16} /> Outstanding: ₹18,650</li>
        </ul>
      </section>
    </div>
  )

  const renderWebsitePage = () => (
    <div className="website-page">
      <header className="website-header">
        <div className="website-brand">
          <div className="brand-icon"><Hospital size={22} /></div>
          <div>
            <strong>Northfield</strong>
            <span>Health Center</span>
          </div>
        </div>

        <nav className="website-nav">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#doctors">Doctors</a>
          <a href="#contact">Contact</a>
        </nav>

        <button type="button" className="primary-button" onClick={() => setShowWebsite(false)}>
          Login to dashboard
        </button>
      </header>

      <main className="website-main">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow dark">Care that feels personal</p>
            <h1>Smarter, calmer healthcare for every family.</h1>
            <p className="hero-text">
              From preventive care and specialist visits to diagnostics and follow-ups, we bring modern patient experiences together in one connected hospital platform.
            </p>
            <div className="hero-actions">
              <button type="button" className="primary-button" onClick={() => setShowWebsite(false)}>
                Book an appointment
              </button>
              <button type="button" className="secondary-website-button" onClick={() => setShowWebsite(false)}>
                View demo sign in
              </button>
            </div>
            <div className="hero-metrics">
              <div>
                <strong>18k+</strong>
                <span>Patients treated</span>
              </div>
              <div>
                <strong>96%</strong>
                <span>Patient satisfaction</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>Emergency support</span>
              </div>
            </div>
          </div>

          <div className="hero-card">
            <div className="mini-stat-card">
              <span>Appointments today</span>
              <strong>142</strong>
            </div>
            <div className="mini-stat-card success">
              <span>Available doctors</span>
              <strong>28</strong>
            </div>
            <div className="mini-stat-card accent">
              <span>ICU occupancy</span>
              <strong>68%</strong>
            </div>
          </div>
        </section>

        <section id="services" className="content-strip">
          <div className="section-heading">
            <p className="eyebrow dark">Our services</p>
            <h2>Healthcare designed around the patient.</h2>
          </div>

          <div className="service-grid">
            <article className="service-card">
              <BriefcaseMedical size={22} />
              <h3>Primary care</h3>
              <p>Preventive consultations, wellness plans, routine checkups, and chronic care support.</p>
            </article>
            <article className="service-card">
              <Stethoscope size={22} />
              <h3>Specialist care</h3>
              <p>Cardiology, neurology, pediatrics, and multidisciplinary treatment pathways.</p>
            </article>
            <article className="service-card">
              <Activity size={22} />
              <h3>Diagnostics</h3>
              <p>Modern imaging, laboratory support, and fast turnaround for critical decision-making.</p>
            </article>
          </div>
        </section>

        <section id="doctors" className="content-strip alt-strip">
          <div className="section-heading">
            <p className="eyebrow dark">Medical experts</p>
            <h2>Trusted specialists with a human touch.</h2>
          </div>

          <div className="doctor-showcase">
            <div className="doctor-box">
              <div className="avatar-box large">R</div>
              <h3>Dr. Rahul Sen</h3>
              <p>Cardiologist</p>
            </div>
            <div className="doctor-box">
              <div className="avatar-box large">A</div>
              <h3>Dr. Ananya Iyer</h3>
              <p>Neurologist</p>
            </div>
            <div className="doctor-box">
              <div className="avatar-box large">S</div>
              <h3>Dr. Sara Joseph</h3>
              <p>Pediatrician</p>
            </div>
          </div>
        </section>

        <section id="about" className="content-strip about-strip">
          <div className="about-card">
            <p className="eyebrow dark">Why Northfield</p>
            <h2>Technology that supports better clinical outcomes.</h2>
            <p>
              Our hospital platform helps staff coordinate appointments, tracking, lab updates, and pharmacy workflows while keeping patients informed with clear communication and care transparency.
            </p>
          </div>
        </section>
      </main>

      <footer id="contact" className="website-footer">
        <div>
          <strong>Northfield Health</strong>
          <p>24/7 patient care support</p>
        </div>
        <div>
          <p>Call: +91 80 4567 8900</p>
          <p>Email: care@northfieldhealth.com</p>
        </div>
      </footer>
    </div>
  )

  let mainContent = renderDashboard()
  if (screen === 'patients') mainContent = renderPatients()
  if (screen === 'patient-detail') mainContent = renderPatientDetail()
  if (screen === 'doctors') mainContent = renderDoctors()
  if (screen === 'appointments') mainContent = renderAppointments()
  if (screen === 'queue') mainContent = renderQueue()
  if (screen === 'inventory') mainContent = renderInventory()
  if (screen === 'records' || screen === 'billing' || screen === 'reports') mainContent = renderRecords()

  if (!user) {
    return showWebsite ? renderWebsitePage() : (
      <div className="login-page">
        <div className="login-card">
          <div className="brand-block">
            <div className="brand-icon"><Hospital size={24} /></div>
            <div>
              <p className="eyebrow">Northfield Health</p>
              <h1>Hospital Management System</h1>
            </div>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <label>
              Email address
              <input
                type="email"
                value={loginForm.email}
                onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
              />
            </label>
            {error ? <div className="error-box">{error}</div> : null}
            <div className="login-button-row">
              <button type="submit" className="primary-button primary-wide">
                Sign in
              </button>
              <button type="button" className="secondary-website-button full-width" onClick={() => setShowWebsite(true)}>
                View website
              </button>
            </div>
          </form>

          <div className="demo-box">
            <strong>Demo accounts</strong>
            <ul>
              <li>Admin: admin@northfield.com / admin123</li>
              <li>Doctor: doctor@northfield.com / doctor123</li>
              <li>Reception: reception@northfield.com / reception123</li>
              <li>Patient: patient@northfield.com / patient123</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-row">
          <div className="brand-icon"><Hospital size={24} /></div>
          <div>
            <strong>Northfield</strong>
            <span>Care Network</span>
          </div>
        </div>

        <nav className="navigation">
          {navItems.map((item) => (
            <button
              key={item}
              type="button"
              className={screen === item ? 'nav-item active' : 'nav-item'}
              onClick={() => {
                if (item === 'patient-detail') {
                  if (selectedPatientId) {
                    setScreen('patient-detail')
                  } else {
                    setScreen('patients')
                  }
                  return
                }
                setScreen(item)
              }}
            >
              {item === 'patient-detail' ? 'Patient Detail' : item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="profile-card">
            <div className="avatar-box small">{user.name.charAt(0)}</div>
            <div>
              <strong>{user.name}</strong>
              <span>{user.role}</span>
            </div>
          </div>
          <button type="button" className="logout-button" onClick={handleLogout}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div className="topbar-search">
            <Search size={16} />
            <input placeholder="Search patients, records, billing..." />
          </div>
          <div className="topbar-actions">
            <div className="topbar-pill">
              <Bell size={16} />
              <span>3 alerts</span>
            </div>
            <div className="topbar-pill">
              <Ambulance size={16} />
              <span>{user.branch}</span>
            </div>
          </div>
        </header>

        <div className="page-header">
          <div>
            <p className="eyebrow">Welcome back</p>
            <h2>{user.role === 'admin' ? 'Administrator dashboard' : user.role === 'doctor' ? 'Doctor overview' : 'Operations center'}</h2>
          </div>
          <div className="page-meta">
            <span><Clock3 size={14} /> 28 Oct 2026</span>
            <span><Activity size={14} /> System online</span>
          </div>
        </div>

        {error ? <div className="error-box">{error}</div> : null}
        {loading ? <div className="empty-state">Syncing hospital data…</div> : mainContent}
      </main>
    </div>
  )
}

export default App
