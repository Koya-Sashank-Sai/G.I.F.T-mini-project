import initSqlJs, { Database, SqlJsStatic } from 'sql.js';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_FILE_PATH = path.resolve(process.cwd(), 'gift_database.sqlite');

let sqlJs: SqlJsStatic | null = null;
let db: Database | null = null;

export async function getDb(): Promise<Database> {
  if (db) return db;

  if (!sqlJs) {
    sqlJs = await initSqlJs();
  }

  if (fs.existsSync(DB_FILE_PATH)) {
    try {
      const fileBuffer = fs.readFileSync(DB_FILE_PATH);
      db = new sqlJs.Database(fileBuffer);
      return db;
    } catch (err) {
      console.warn('Failed to load existing database file, creating fresh database:', err);
    }
  }

  db = new sqlJs.Database();
  await initSchemaAndSeed(db);
  persistDb();
  return db;
}

export function persistDb(): void {
  if (!db) return;
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE_PATH, buffer);
  } catch (err) {
    console.error('Error saving SQLite database to disk:', err);
  }
}

async function initSchemaAndSeed(database: Database): Promise<void> {
  // Create tables
  database.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      bank_name TEXT NOT NULL,
      branch TEXT NOT NULL,
      location TEXT NOT NULL,
      linked_account TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS officers (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      name TEXT NOT NULL,
      email TEXT,
      bank_name TEXT NOT NULL,
      branch TEXT NOT NULL,
      location TEXT NOT NULL,
      employee_id TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS customer_spending (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL REFERENCES customers(id),
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      percentage REAL NOT NULL,
      period TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS recommendations (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL REFERENCES customers(id),
      product_type TEXT NOT NULL,
      title TEXT NOT NULL,
      tagline TEXT NOT NULL,
      description TEXT NOT NULL,
      action_text TEXT NOT NULL,
      action_route TEXT NOT NULL,
      potential_benefit TEXT NOT NULL,
      supporting_data TEXT,
      date_recommended TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS customer_engagement (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL REFERENCES customers(id),
      product_type TEXT NOT NULL,
      status TEXT NOT NULL,
      date_recommended TEXT NOT NULL,
      last_activity TEXT,
      branch TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS engagement_events (
      id TEXT PRIMARY KEY,
      engagement_id TEXT NOT NULL REFERENCES customer_engagement(id),
      customer_id TEXT NOT NULL REFERENCES customers(id),
      product_type TEXT NOT NULL,
      status TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      details TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_engagement_cust ON customer_engagement(customer_id);
    CREATE INDEX IF NOT EXISTS idx_engagement_branch ON customer_engagement(branch);
  `);

  // Hash passwords
  const salt = bcrypt.genSaltSync(10);
  const customerPasswordHash = bcrypt.hashSync('Password@123', salt);
  const officerPasswordHash = bcrypt.hashSync('Officer@123', salt);

  // 1. Seed Arun Kumar (Default Demo Customer - C10234)
  database.run(
    `INSERT INTO users (id, username, password_hash, role, name, email, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      'u_c10234',
      'C10234',
      customerPasswordHash,
      'customer',
      'Arun Kumar',
      'arun.kumar@example.com',
      '2026-09-01T10:00:00Z'
    ]
  );

  database.run(
    `INSERT INTO customers (id, user_id, name, email, phone, bank_name, branch, location, linked_account, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'C10234',
      'u_c10234',
      'Arun Kumar',
      'arun.kumar@example.com',
      '+91 98450 12345',
      'Lloyds Bank',
      'Guntur Branch',
      'Guntur, Andhra Pradesh',
      '987654321012',
      '2026-09-01T10:00:00Z'
    ]
  );

  // Seed Arun Kumar spending (Total tracked: ₹ 2,00,000)
  // Petrol: 34% (₹ 68,000)
  // Electricity: 28% (₹ 56,000)
  // Home Appliances: 20% (₹ 40,000)
  // Other: 18% (₹ 36,000)
  const spendings = [
    { cat: 'Petrol Spending', amount: 68000, pct: 34 },
    { cat: 'Electricity Bill', amount: 56000, pct: 28 },
    { cat: 'Home Appliances & Furniture', amount: 40000, pct: 20 },
    { cat: 'Other Spending', amount: 36000, pct: 18 }
  ];

  for (const s of spendings) {
    database.run(
      `INSERT INTO customer_spending (id, customer_id, category, amount, percentage, period)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [`sp_${s.cat.replace(/\s+/g, '_')}_c10234`, 'C10234', s.cat, s.amount, s.pct, 'Trailing 12 Months']
    );
  }

  // Seed Arun Kumar 3 Recommendations
  const recs = [
    {
      id: 'rec_ev_c10234',
      prod: 'EV Finance',
      title: 'Consider EV Finance',
      tagline: 'Drive Cleaner, Save Smarter',
      desc: 'Your petrol spending is high. Explore electric vehicles with lower running costs.',
      actionText: 'Explore EV Finance',
      actionRoute: '/ev-finance',
      benefit: 'Save up to ₹ 1,16,000/yr on fuel',
      date: '12 Oct 2026',
      data: JSON.stringify(['High fuel consumption baseline', 'Daily commute > 40 km', 'Lower cost per km'])
    },
    {
      id: 'rec_gh_c10234',
      prod: 'Green Home Loan',
      title: 'Explore Green Home Loan',
      tagline: 'A Greener Home for a Brighter Future',
      desc: 'Make your home more energy-efficient and reduce your electricity bills.',
      actionText: 'Explore Green Home Loan',
      actionRoute: '/green-home-loan',
      benefit: 'Save up to ₹ 58,000/yr on power',
      date: '10 Oct 2026',
      data: JSON.stringify(['High air-conditioning usage', 'Eligible for BEE 5-star upgrades'])
    },
    {
      id: 'rec_sol_c10234',
      prod: 'Solar Finance',
      title: 'Look into Solar Finance',
      tagline: 'Generate Your Own Electricity, Save More',
      desc: 'Your electricity spending is significant. Solar can help you save and cut emissions.',
      actionText: 'Explore Solar Finance',
      actionRoute: '/solar-finance',
      benefit: 'Save up to ₹ 1,00,000/yr (76% reduction)',
      date: '09 Oct 2026',
      data: JSON.stringify(['Annual power bills > ₹ 1,20,000', 'Unshaded rooftop potential'])
    }
  ];

  for (const r of recs) {
    database.run(
      `INSERT INTO recommendations (id, customer_id, product_type, title, tagline, description, action_text, action_route, potential_benefit, supporting_data, date_recommended)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [r.id, 'C10234', r.prod, r.title, r.tagline, r.desc, r.actionText, r.actionRoute, r.benefit, r.data, r.date]
    );
  }

  // 2. Seed Officer (EMP-8842 - R. Srinivas)
  database.run(
    `INSERT INTO users (id, username, password_hash, role, name, email, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      'u_emp8842',
      'EMP-8842',
      officerPasswordHash,
      'officer',
      'R. Srinivas',
      'srinivas.r@lloydsbank.example',
      '2026-08-01T09:00:00Z'
    ]
  );

  database.run(
    `INSERT INTO officers (id, user_id, name, email, bank_name, branch, location, employee_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'EMP-8842',
      'u_emp8842',
      'R. Srinivas',
      'srinivas.r@lloydsbank.example',
      'Lloyds Bank',
      'Guntur Branch',
      'Guntur',
      'EMP-8842'
    ]
  );

  // 3. Seed other demo customers exactly matching Officer Dashboard image 16297063
  const demoCustomers = [
    { id: 'C10456', name: 'Sneha Reddy', email: 'sneha.r@example.com', product: 'Green Home Loan', dateRec: '10 Oct 2026', status: 'In Progress', lastAct: '18 Oct 2026', branch: 'Guntur Branch' },
    { id: 'C10789', name: 'Rohit Sharma', email: 'rohit.s@example.com', product: 'Solar Finance', dateRec: '09 Oct 2026', status: 'Viewed', lastAct: '15 Oct 2026', branch: 'Guntur Branch' },
    { id: 'C10987', name: 'Priya Nair', email: 'priya.n@example.com', product: 'Go Paperless', dateRec: '08 Oct 2026', status: 'Not Started', lastAct: '-', branch: 'Guntur Branch' },
    { id: 'C11345', name: 'Kiran Babu', email: 'kiran.b@example.com', product: 'EV Finance', dateRec: '07 Oct 2026', status: 'In Progress', lastAct: '17 Oct 2026', branch: 'Guntur Branch' },
    { id: 'C11876', name: 'Neha Gupta', email: 'neha.g@example.com', product: 'Green Home Loan', dateRec: '05 Oct 2026', status: 'Viewed', lastAct: '14 Oct 2026', branch: 'Guntur Branch' },
    { id: 'C12098', name: 'Vikram Singh', email: 'vikram.s@example.com', product: 'Solar Finance', dateRec: '02 Oct 2026', status: 'Not Started', lastAct: '-', branch: 'Guntur Branch' },
    { id: 'C12654', name: 'Aditi Rao', email: 'aditi.r@example.com', product: 'EV Finance', dateRec: '01 Oct 2026', status: 'Completed', lastAct: '12 Oct 2026', branch: 'Guntur Branch' },
    // Additional realistic records for other branches & pagination
    { id: 'C13012', name: 'Manoj Kumar', email: 'manoj.k@example.com', product: 'EV Finance', dateRec: '28 Sep 2026', status: 'Completed', lastAct: '11 Oct 2026', branch: 'Vijayawada Branch' },
    { id: 'C13450', name: 'Kavita Das', email: 'kavita.d@example.com', product: 'Solar Finance', dateRec: '25 Sep 2026', status: 'In Progress', lastAct: '10 Oct 2026', branch: 'Hyderabad Main' },
    { id: 'C13890', name: 'Rajesh Varma', email: 'rajesh.v@example.com', product: 'Green Home Loan', dateRec: '22 Sep 2026', status: 'Viewed', lastAct: '08 Oct 2026', branch: 'Guntur Branch' },
    { id: 'C14102', name: 'Deepa Krishnan', email: 'deepa.k@example.com', product: 'EV Finance', dateRec: '20 Sep 2026', status: 'Completed', lastAct: '05 Oct 2026', branch: 'Bangalore Branch' },
    { id: 'C14555', name: 'Sanjay Patel', email: 'sanjay.p@example.com', product: 'Solar Finance', dateRec: '18 Sep 2026', status: 'Not Started', lastAct: '-', branch: 'Guntur Branch' }
  ];

  // Insert Arun Kumar engagement first (Row 1)
  database.run(
    `INSERT INTO customer_engagement (id, customer_id, product_type, status, date_recommended, last_activity, branch, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ['eng_c10234_ev', 'C10234', 'EV Finance', 'Completed', '12 Oct 2026', '20 Oct 2026', 'Guntur Branch', '2026-10-12T09:00:00Z']
  );

  database.run(
    `INSERT INTO engagement_events (id, engagement_id, customer_id, product_type, status, timestamp, details)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ['ev_1', 'eng_c10234_ev', 'C10234', 'EV Finance', 'Viewed', '12 Oct 2026 10:14 AM', 'Viewed EV recommendations and cost comparison graph']
  );
  database.run(
    `INSERT INTO engagement_events (id, engagement_id, customer_id, product_type, status, timestamp, details)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ['ev_2', 'eng_c10234_ev', 'C10234', 'EV Finance', 'In Progress', '16 Oct 2026 03:22 PM', 'Calculated EV Loan estimate for ₹ 12,00,000']
  );
  database.run(
    `INSERT INTO engagement_events (id, engagement_id, customer_id, product_type, status, timestamp, details)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ['ev_3', 'eng_c10234_ev', 'C10234', 'EV Finance', 'Completed', '20 Oct 2026 04:45 PM', 'Completed green vehicle pre-application inquiry']
  );

  for (const c of demoCustomers) {
    const userId = `u_${c.id.toLowerCase()}`;
    database.run(
      `INSERT INTO users (id, username, password_hash, role, name, email, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, c.id, customerPasswordHash, 'customer', c.name, c.email, '2026-09-10T10:00:00Z']
    );

    database.run(
      `INSERT INTO customers (id, user_id, name, email, phone, bank_name, branch, location, linked_account, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [c.id, userId, c.name, c.email, '+91 98000 00000', 'Lloyds Bank', c.branch, 'Andhra Pradesh', '123456789012', '2026-09-10T10:00:00Z']
    );

    const engId = `eng_${c.id.toLowerCase()}_${c.product.toLowerCase().replace(/\s+/g, '_')}`;
    database.run(
      `INSERT INTO customer_engagement (id, customer_id, product_type, status, date_recommended, last_activity, branch, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [engId, c.id, c.product, c.status, c.dateRec, c.lastAct, c.branch, '2026-09-15T10:00:00Z']
    );

    if (c.status !== 'Not Started') {
      database.run(
        `INSERT INTO engagement_events (id, engagement_id, customer_id, product_type, status, timestamp, details)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [`ev_${c.id}_1`, engId, c.id, c.product, 'Viewed', `${c.dateRec} 11:00 AM`, `Customer viewed ${c.product} recommendation`]
      );
    }
    if (c.status === 'In Progress' || c.status === 'Completed') {
      database.run(
        `INSERT INTO engagement_events (id, engagement_id, customer_id, product_type, status, timestamp, details)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [`ev_${c.id}_2`, engId, c.id, c.product, 'In Progress', `${c.lastAct} 02:30 PM`, `Customer started ${c.product} financing calculator`]
      );
    }
    if (c.status === 'Completed') {
      database.run(
        `INSERT INTO engagement_events (id, engagement_id, customer_id, product_type, status, timestamp, details)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [`ev_${c.id}_3`, engId, c.id, c.product, 'Completed', `${c.lastAct} 05:15 PM`, `Customer submitted interest for ${c.product}`]
      );
    }
  }

  console.log('G.I.F.T. Database initialized and seeded successfully.');
}
