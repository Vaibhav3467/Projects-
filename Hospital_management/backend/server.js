const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

const db = new sqlite3.Database(path.join(__dirname, 'hospital.db'));

const run = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function (err) {
    if (err) return reject(err);
    resolve({ id: this.lastID, changes: this.changes });
  });
});

const get = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => {
    if (err) return reject(err);
    resolve(row);
  });
});

const all = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) return reject(err);
    resolve(rows);
  });
});

async function seedDatabase() {
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      branch TEXT,
      status TEXT DEFAULT 'active'
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS doctors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      specialty TEXT NOT NULL,
      department TEXT NOT NULL,
      availability TEXT DEFAULT 'Available',
      phone TEXT,
      fee INTEGER DEFAULT 0,
      branch TEXT
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mrn TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      age INTEGER,
      sex TEXT,
      phone TEXT,
      email TEXT,
      blood_group TEXT,
      allergies TEXT,
      city TEXT,
      status TEXT DEFAULT 'active'
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      appointment_id TEXT UNIQUE NOT NULL,
      patient_id INTEGER NOT NULL,
      doctor_id INTEGER NOT NULL,
      department TEXT NOT NULL,
      appointment_date TEXT NOT NULL,
      slot TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
      reason TEXT,
      fee INTEGER DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      doctor_id INTEGER NOT NULL,
      queue_no INTEGER NOT NULL,
      status TEXT NOT NULL,
      wait_minutes INTEGER DEFAULT 0,
      priority TEXT DEFAULT 'Routine'
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      batch TEXT NOT NULL,
      stock INTEGER DEFAULT 0,
      reorder_level INTEGER DEFAULT 10,
      expiry TEXT,
      status TEXT DEFAULT 'Healthy'
    )
  `);

  const adminHash = await bcrypt.hash('admin123', 10);
  const doctorHash = await bcrypt.hash('doctor123', 10);
  const receptionistHash = await bcrypt.hash('reception123', 10);
  const patientHash = await bcrypt.hash('patient123', 10);

  await run(`
    INSERT OR IGNORE INTO users (id, name, email, password_hash, role, branch, status)
    VALUES
      (1, 'Aisha Patel', 'admin@northfield.com', ?, 'admin', 'Main Campus', 'active'),
      (2, 'Dr. Rahul Sen', 'doctor@northfield.com', ?, 'doctor', 'Main Campus', 'active'),
      (3, 'Nina George', 'reception@northfield.com', ?, 'reception', 'Main Campus', 'active'),
      (4, 'Rohan Mehta', 'patient@northfield.com', ?, 'patient', 'Main Campus', 'active')
  `, [adminHash, doctorHash, receptionistHash, patientHash]);

  await run(`
    INSERT OR IGNORE INTO doctors (id, name, specialty, department, availability, phone, fee, branch)
    VALUES
      (1, 'Dr. Rahul Sen', 'Cardiology', 'Cardiology', 'Available', '+91 98765 43210', 1200, 'Main Campus'),
      (2, 'Dr. Ananya Iyer', 'Neurology', 'Neurology', 'On Duty', '+91 91234 56789', 1100, 'Main Campus'),
      (3, 'Dr. Mehul Rao', 'General Medicine', 'General Medicine', 'Available', '+91 90000 11122', 900, 'Downtown Branch'),
      (4, 'Dr. Sara Joseph', 'Pediatrics', 'Pediatrics', 'On Leave', '+91 98888 44556', 850, 'Main Campus')
  `);

  await run(`
    INSERT OR IGNORE INTO patients (id, mrn, name, age, sex, phone, email, blood_group, allergies, city, status)
    VALUES
      (1, 'MRN-1001', 'Priya Nair', 29, 'Female', '+91 98765 1001', 'priya.nair@example.com', 'O+', 'Penicillin', 'Bengaluru', 'active'),
      (2, 'MRN-1002', 'Arjun Kumar', 41, 'Male', '+91 98765 1002', 'arjun.kumar@example.com', 'A+', 'None', 'Mysuru', 'active'),
      (3, 'MRN-1003', 'Sneha R', 34, 'Female', '+91 98765 1003', 'sneha.r@example.com', 'B-', 'Dust', 'Hyderabad', 'active'),
      (4, 'MRN-1004', 'Karthik Rao', 52, 'Male', '+91 98765 1004', 'karthik.rao@example.com', 'AB+', 'No known allergies', 'Chennai', 'active')
  `);

  await run(`
    INSERT OR IGNORE INTO appointments (id, appointment_id, patient_id, doctor_id, department, appointment_date, slot, type, status, reason, fee, created_at)
    VALUES
      (1, 'APT-1001', 1, 1, 'Cardiology', '2026-10-28', '09:00 AM', 'In-person', 'Confirmed', 'Chest discomfort review', 1200, '2026-10-28 08:30:00'),
      (2, 'APT-1002', 2, 2, 'Neurology', '2026-10-28', '11:30 AM', 'Telehealth', 'Checked In', 'Headache follow-up', 1100, '2026-10-28 09:00:00'),
      (3, 'APT-1003', 3, 3, 'General Medicine', '2026-10-28', '02:00 PM', 'In-person', 'Waiting', 'Routine blood pressure review', 900, '2026-10-28 10:15:00'),
      (4, 'APT-1004', 4, 1, 'Cardiology', '2026-10-29', '10:00 AM', 'In-person', 'Requested', 'ECG follow-up', 1200, '2026-10-28 12:00:00')
  `);

  await run(`
    INSERT OR IGNORE INTO queue (id, patient_id, doctor_id, queue_no, status, wait_minutes, priority)
    VALUES
      (1, 1, 1, 12, 'Waiting', 18, 'High'),
      (2, 3, 3, 19, 'Consulting', 8, 'Routine'),
      (3, 4, 1, 14, 'Waiting', 22, 'Routine')
  `);

  await run(`
    INSERT OR IGNORE INTO inventory (id, name, category, batch, stock, reorder_level, expiry, status)
    VALUES
      (1, 'Paracetamol 500mg', 'Analgesic', 'PAR-2209', 220, 50, '2027-06-30', 'Healthy'),
      (2, 'Atorvastatin 20mg', 'Cardiology', 'ATV-1124', 28, 60, '2026-12-15', 'Low'),
      (3, 'Amoxicillin 250mg', 'Antibiotic', 'AMX-9901', 150, 40, '2027-04-20', 'Healthy'),
      (4, 'Insulin Glargine', 'Diabetes', 'INS-3407', 12, 20, '2026-11-08', 'Low')
  `);
}

async function getDashboardData(role = 'admin') {
  const patients = await all('SELECT * FROM patients');
  const doctors = await all('SELECT * FROM doctors');
  const appointments = await all('SELECT * FROM appointments');
  const queue = await all('SELECT q.*, p.name as patient_name, d.name as doctor_name FROM queue q JOIN patients p ON p.id = q.patient_id JOIN doctors d ON d.id = q.doctor_id');
  const inventory = await all('SELECT * FROM inventory');

  const summary = {
    totalPatients: patients.length,
    newPatientsToday: 12,
    totalDoctors: doctors.length,
    availableDoctors: doctors.filter((d) => d.availability === 'Available').length,
    appointmentsToday: appointments.filter((a) => a.appointment_date === '2026-10-28').length,
    completedAppointments: appointments.filter((a) => a.status === 'Completed').length,
    cancelledAppointments: appointments.filter((a) => a.status === 'Cancelled').length,
    missedAppointments: appointments.filter((a) => a.status === 'No-show').length,
    currentAdmissions: 24,
    occupiedBeds: 19,
    emergencyCases: queue.filter((q) => q.priority === 'High').length,
    pendingLabReports: 8,
    loqStockAlerts: inventory.filter((item) => item.stock <= item.reorder_level).length,
    revenueToday: 34200,
    outstandingInvoices: 18650,
  };

  const alerts = [
    '3 critical lab results require clinician review.',
    '12 medication batches are nearing expiry.',
    'Ward B occupancy has crossed 85%.',
  ];

  const recentActivity = [
    { title: 'New admission registered', detail: 'Ward A - Room 205', time: '8 mins ago' },
    { title: 'Lab report released', detail: 'CBC review for MRN-1001', time: '16 mins ago' },
    { title: 'Payment received', detail: 'Invoice INV-4008', time: '35 mins ago' },
  ];

  const chartData = [
    { label: 'Mon', value: 40 },
    { label: 'Tue', value: 58 },
    { label: 'Wed', value: 46 },
    { label: 'Thu', value: 72 },
    { label: 'Fri', value: 66 },
    { label: 'Sat', value: 80 },
    { label: 'Sun', value: 71 },
  ];

  return {
    role,
    summary,
    alerts,
    recentActivity,
    chartData,
    patients,
    doctors,
    appointments,
    queue,
    inventory,
  };
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
}

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'hospital-management-api' });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role, branch: user.branch },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/me', authenticate, async (req, res) => {
  const user = await get('SELECT id, name, email, role, branch, status FROM users WHERE id = ?', [req.user.id]);
  res.json({ user });
});

app.get('/api/dashboard', authenticate, async (req, res) => {
  try {
    const data = await getDashboardData(req.user.role);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Unable to load dashboard data' });
  }
});

app.get('/api/patients', authenticate, async (req, res) => {
  const rows = await all('SELECT * FROM patients ORDER BY id DESC');
  res.json(rows);
});

app.get('/api/patients/:id', authenticate, async (req, res) => {
  const patient = await get('SELECT * FROM patients WHERE id = ?', [req.params.id]);

  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const timeline = [
    {
      title: 'Consultation',
      type: 'Visit',
      date: '2026-10-28',
      notes: 'Reviewed chest discomfort, blood pressure trend, and advised ECG follow-up. Medication review completed.',
    },
    {
      title: 'Prescription action',
      type: 'Medication',
      date: '2026-10-20',
      notes: 'Metoprolol 25 mg prescribed twice daily with dosage reminders and ongoing follow-up.',
    },
    {
      title: 'Diagnostic order',
      type: 'Lab',
      date: '2026-10-12',
      notes: 'CBC, fasting glucose, thyroid panel and chest x-ray order released by the physician.',
    },
  ];

  return res.json({
    patient,
    summary: {
      allergies: patient.allergies || 'No known allergies',
      lastVisit: '2026-10-28',
      insurer: 'Arogya Health Plus',
      status: patient.status || 'active',
    },
    timeline,
  });
});

app.post('/api/patients', authenticate, async (req, res) => {
  const { name, mrn, age, sex, phone, email, blood_group, allergies, city } = req.body || {};

  if (!name || !mrn) {
    return res.status(400).json({ error: 'Name and MRN are required' });
  }

  try {
    const result = await run(
      `INSERT INTO patients (mrn, name, age, sex, phone, email, blood_group, allergies, city, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [mrn, name, age || null, sex || null, phone || null, email || null, blood_group || null, allergies || null, city || null]
    );

    const patient = await get('SELECT * FROM patients WHERE id = ?', [result.id]);
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ error: 'Patient could not be created', details: error.message });
  }
});

app.get('/api/doctors', authenticate, async (req, res) => {
  const rows = await all('SELECT * FROM doctors ORDER BY id ASC');
  res.json(rows);
});

app.get('/api/appointments', authenticate, async (req, res) => {
  const rows = await all(`
    SELECT a.*, p.name as patient_name, d.name as doctor_name
    FROM appointments a
    JOIN patients p ON p.id = a.patient_id
    JOIN doctors d ON d.id = a.doctor_id
    ORDER BY a.appointment_date DESC, a.slot ASC
  `);
  res.json(rows);
});

app.post('/api/appointments', authenticate, async (req, res) => {
  const { patientId, doctorId, department, date, slot, type, reason, fee } = req.body || {};

  if (!patientId || !doctorId || !date || !slot) {
    return res.status(400).json({ error: 'Patient, doctor, date and slot are required' });
  }

  const appointmentId = `APT-${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    const result = await run(
      `INSERT INTO appointments (appointment_id, patient_id, doctor_id, department, appointment_date, slot, type, status, reason, fee, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Confirmed', ?, ?, datetime('now'))`,
      [appointmentId, patientId, doctorId, department || 'General Medicine', date, slot, type || 'In-person', reason || 'New consultation', fee || 0]
    );

    const appointment = await get('SELECT * FROM appointments WHERE id = ?', [result.id]);
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ error: 'Appointment could not be booked', details: error.message });
  }
});

app.get('/api/queue', authenticate, async (req, res) => {
  const rows = await all(`
    SELECT q.*, p.name as patient_name, d.name as doctor_name
    FROM queue q
    JOIN patients p ON p.id = q.patient_id
    JOIN doctors d ON d.id = q.doctor_id
    ORDER BY q.queue_no ASC
  `);
  res.json(rows);
});

app.get('/api/inventory', authenticate, async (req, res) => {
  const rows = await all('SELECT * FROM inventory ORDER BY stock ASC');
  res.json(rows);
});

app.listen(PORT, async () => {
  await seedDatabase();
  console.log(`Hospital management API running on http://localhost:${PORT}`);
});
