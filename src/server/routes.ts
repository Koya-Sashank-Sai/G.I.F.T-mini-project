import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { getDb, persistDb } from './db';
import { createSession, destroySession, requireAuth, requireRole } from './auth';
import {
  calculateReducingBalanceEmi,
  calculateEvComparison,
  calculateGreenHomeComparison,
  calculateSolarComparison,
  calculateSolarMetrics
} from './calculations';
import {
  generateExplainableRecommendations,
  getGroundedAiExplanation
} from './recommendationEngine';
import { CustomerSpendingSummary, ProductType, EngagementStatus } from '../types';

export const apiRouter = Router();

// ==========================================
// 1. AUTHENTICATION ENDPOINTS
// ==========================================

// Customer Login
apiRouter.post('/auth/customer/login', async (req: Request, res: Response) => {
  try {
    const { customerId, linkedAccount, password } = req.body;

    if (!customerId || !password) {
      res.status(400).json({ error: 'Customer ID and password are required' });
      return;
    }

    const db = await getDb();
    const userStmt = db.prepare('SELECT * FROM users WHERE username = ? AND role = "customer"');
    userStmt.bind([customerId.trim()]);

    let user: any = null;
    if (userStmt.step()) {
      user = userStmt.getAsObject();
    }
    userStmt.free();

    if (!user) {
      res.status(401).json({ error: 'Invalid Customer ID or credentials' });
      return;
    }

    const passwordMatch = bcrypt.compareSync(password, user.password_hash);
    if (!passwordMatch) {
      res.status(401).json({ error: 'Invalid Customer ID or credentials' });
      return;
    }

    // Get customer profile
    const custStmt = db.prepare('SELECT * FROM customers WHERE id = ?');
    custStmt.bind([customerId.trim()]);
    let customer: any = null;
    if (custStmt.step()) {
      customer = custStmt.getAsObject();
    }
    custStmt.free();

    // If linked account provided, optionally verify
    if (linkedAccount && customer && customer.linked_account) {
      if (customer.linked_account !== linkedAccount.trim()) {
        res.status(401).json({ error: 'Linked bank account number does not match registered profile' });
        return;
      }
    }

    const sessionId = createSession(user.id, user.username, 'customer', user.name, customer?.branch);

    res.cookie('gift_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      token: sessionId,
      user: {
        id: customer?.id || user.username,
        username: user.username,
        name: user.name,
        email: user.email,
        role: 'customer',
        bankName: customer?.bank_name || 'Lloyds Bank',
        branch: customer?.branch || 'Guntur Branch',
        linkedAccount: customer?.linked_account || '987654321012'
      }
    });
  } catch (err: any) {
    console.error('Customer login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Customer Sign Up (Guided Registration)
apiRouter.post('/auth/customer/register', async (req: Request, res: Response) => {
  try {
    const { fullName, phone, email, bankName, branch, location, password } = req.body;

    if (!fullName || !phone || !email || !password) {
      res.status(400).json({ error: 'Missing required registration details' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long' });
      return;
    }

    const db = await getDb();

    // Generate random Customer ID e.g. C19842
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newCustomerId = `C${randomNum}`;
    const newUserId = `u_c${randomNum}`;
    const generatedAccount = `${Math.floor(100000000000 + Math.random() * 900000000000)}`;

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const now = new Date().toISOString();

    db.run(
      `INSERT INTO users (id, username, password_hash, role, name, email, created_at)
       VALUES (?, ?, ?, 'customer', ?, ?, ?)`,
      [newUserId, newCustomerId, passwordHash, fullName, email, now]
    );

    db.run(
      `INSERT INTO customers (id, user_id, name, email, phone, bank_name, branch, location, linked_account, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newCustomerId,
        newUserId,
        fullName,
        email,
        phone,
        bankName || 'Lloyds Bank',
        branch || 'Guntur Branch',
        location || 'Guntur',
        generatedAccount,
        now
      ]
    );

    // Seed default baseline spending for new customer
    const spendings = [
      { cat: 'Petrol Spending', amount: 68000, pct: 34 },
      { cat: 'Electricity Bill', amount: 56000, pct: 28 },
      { cat: 'Home Appliances & Furniture', amount: 40000, pct: 20 },
      { cat: 'Other Spending', amount: 36000, pct: 18 }
    ];
    for (const s of spendings) {
      db.run(
        `INSERT INTO customer_spending (id, customer_id, category, amount, percentage, period)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [`sp_${s.cat.replace(/\s+/g, '_')}_${newCustomerId}`, newCustomerId, s.cat, s.amount, s.pct, 'Trailing 12 Months']
      );
    }

    // Initialize 3 recommendations
    const recTypes: ProductType[] = ['EV Finance', 'Green Home Loan', 'Solar Finance'];
    for (const p of recTypes) {
      const engId = `eng_${newCustomerId.toLowerCase()}_${p.toLowerCase().replace(/\s+/g, '_')}`;
      db.run(
        `INSERT INTO customer_engagement (id, customer_id, product_type, status, date_recommended, last_activity, branch, created_at)
         VALUES (?, ?, ?, 'Not Started', ?, '-', ?, ?)`,
        [engId, newCustomerId, p, '26 Oct 2026', branch || 'Guntur Branch', now]
      );
    }

    persistDb();

    const sessionId = createSession(newUserId, newCustomerId, 'customer', fullName, branch || 'Guntur Branch');

    res.cookie('gift_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      success: true,
      token: sessionId,
      customerId: newCustomerId,
      linkedAccount: generatedAccount,
      user: {
        id: newCustomerId,
        username: newCustomerId,
        name: fullName,
        email,
        role: 'customer',
        bankName: bankName || 'Lloyds Bank',
        branch: branch || 'Guntur Branch',
        linkedAccount: generatedAccount
      }
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Failed to complete registration' });
  }
});

// Officer Login
apiRouter.post('/auth/officer/login', async (req: Request, res: Response) => {
  try {
    const { employeeId, password, bankName, branch } = req.body;

    if (!employeeId || !password) {
      res.status(400).json({ error: 'Employee ID and password are required' });
      return;
    }

    const db = await getDb();
    const userStmt = db.prepare('SELECT * FROM users WHERE username = ? AND role = "officer"');
    userStmt.bind([employeeId.trim()]);

    let user: any = null;
    if (userStmt.step()) {
      user = userStmt.getAsObject();
    }
    userStmt.free();

    if (!user) {
      res.status(401).json({ error: 'Invalid Employee ID or credentials' });
      return;
    }

    const passwordMatch = bcrypt.compareSync(password, user.password_hash);
    if (!passwordMatch) {
      res.status(401).json({ error: 'Invalid Employee ID or credentials' });
      return;
    }

    const offStmt = db.prepare('SELECT * FROM officers WHERE employee_id = ?');
    offStmt.bind([employeeId.trim()]);
    let officer: any = null;
    if (offStmt.step()) {
      officer = offStmt.getAsObject();
    }
    offStmt.free();

    const authorizedBranch = officer?.branch || branch || 'Guntur Branch';
    const authorizedBank = officer?.bank_name || bankName || 'Lloyds Bank';

    const sessionId = createSession(user.id, user.username, 'officer', user.name, authorizedBranch);

    res.cookie('gift_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      token: sessionId,
      user: {
        id: officer?.id || user.username,
        employeeId: officer?.employee_id || user.username,
        name: officer?.name || user.name,
        email: officer?.email || user.email,
        role: 'officer',
        bankName: authorizedBank,
        branch: authorizedBranch,
        location: officer?.location || 'Guntur'
      }
    });
  } catch (err: any) {
    console.error('Officer login error:', err);
    res.status(500).json({ error: 'Server error during officer login' });
  }
});

// Logout
apiRouter.post('/auth/logout', (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.gift_session;
  if (token) {
    destroySession(token);
  }
  res.clearCookie('gift_session');
  res.json({ success: true, message: 'Logged out successfully' });
});

// Get Current Profile Session
apiRouter.get('/auth/me', async (req: Request, res: Response) => {
  if (!req.userSession) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const db = await getDb();
  if (req.userSession.role === 'customer') {
    const custStmt = db.prepare('SELECT * FROM customers WHERE id = ?');
    custStmt.bind([req.userSession.username]);
    let cust: any = null;
    if (custStmt.step()) cust = custStmt.getAsObject();
    custStmt.free();

    res.json({
      user: {
        id: cust?.id || req.userSession.username,
        username: req.userSession.username,
        name: cust?.name || req.userSession.name,
        email: cust?.email,
        role: 'customer',
        bankName: cust?.bank_name || 'Lloyds Bank',
        branch: cust?.branch || 'Guntur Branch',
        linkedAccount: cust?.linked_account || '987654321012'
      }
    });
  } else {
    const offStmt = db.prepare('SELECT * FROM officers WHERE employee_id = ?');
    offStmt.bind([req.userSession.username]);
    let off: any = null;
    if (offStmt.step()) off = offStmt.getAsObject();
    offStmt.free();

    res.json({
      user: {
        id: off?.id || req.userSession.username,
        employeeId: off?.employee_id || req.userSession.username,
        name: off?.name || req.userSession.name,
        email: off?.email,
        role: 'officer',
        bankName: off?.bank_name || 'Lloyds Bank',
        branch: off?.branch || 'Guntur Branch',
        location: off?.location || 'Guntur'
      }
    });
  }
});

// ==========================================
// 2. CUSTOMER DASHBOARD & SPENDING
// ==========================================

apiRouter.get('/customer/spending', async (req: Request, res: Response) => {
  try {
    const customerId = req.query.customerId as string || req.userSession?.username || 'C10234';

    const db = await getDb();
    const stmt = db.prepare('SELECT * FROM customer_spending WHERE customer_id = ?');
    stmt.bind([customerId]);

    const categories: any[] = [];
    let totalTracked = 0;

    while (stmt.step()) {
      const row = stmt.getAsObject();
      const catName = String(row.category || '');
      categories.push({
        category: catName,
        label: catName,
        amount: Number(row.amount),
        percentage: Number(row.percentage),
        icon: catName.includes('Petrol')
          ? 'fuel'
          : catName.includes('Electricity')
          ? 'bolt'
          : catName.includes('Appliances')
          ? 'home'
          : 'other',
        color: catName.includes('Petrol')
          ? '#254D3A'
          : catName.includes('Electricity')
          ? '#789078'
          : '#D9CDB9'
      });
      totalTracked += Number(row.amount);
    }
    stmt.free();

    // Fallback if brand-new customer with no spending seeded yet
    if (categories.length === 0) {
      categories.push(
        { category: 'Petrol Spending', label: 'Petrol Spending', amount: 68000, percentage: 34, icon: 'fuel', color: '#254D3A' },
        { category: 'Electricity Bill', label: 'Electricity Bill', amount: 56000, percentage: 28, icon: 'bolt', color: '#789078' },
        { category: 'Home Appliances & Furniture', label: 'Home Appliances & Furniture', amount: 40000, percentage: 20, icon: 'home', color: '#D9CDB9' }
      );
      totalTracked = 200000;
    }

    const summary: CustomerSpendingSummary = {
      customerId,
      period: 'Annual (Trailing 12 Months)',
      totalTrackedSpending: totalTracked,
      currency: 'INR',
      categories,
      isDemoData: true
    };

    res.json(summary);
  } catch (err: any) {
    console.error('Error fetching spending:', err);
    res.status(500).json({ error: 'Failed to fetch spending data' });
  }
});

// Recommendations Overview (Home Dashboard)
apiRouter.get('/customer/recommendations', async (req: Request, res: Response) => {
  try {
    const customerId = req.query.customerId as string || req.userSession?.username || 'C10234';

    const summary: CustomerSpendingSummary = {
      customerId,
      period: 'Trailing 12 Months',
      totalTrackedSpending: 200000,
      currency: 'INR',
      categories: [
        { category: 'Petrol Spending', label: 'Petrol Spending', amount: 68000, percentage: 34, icon: 'fuel', color: '#254D3A' },
        { category: 'Electricity Bill', label: 'Electricity Bill', amount: 56000, percentage: 28, icon: 'bolt', color: '#789078' },
        { category: 'Home Appliances & Furniture', label: 'Home Appliances & Furniture', amount: 40000, percentage: 20, icon: 'home', color: '#D9CDB9' }
      ],
      isDemoData: true
    };

    const recs = generateExplainableRecommendations({
      customerId,
      customerName: 'Arun Kumar',
      spendingSummary: summary
    });

    res.json(recs);
  } catch (err: any) {
    console.error('Error fetching recommendations:', err);
    res.status(500).json({ error: 'Failed to load recommendations' });
  }
});

// ==========================================
// 3. FINANCIAL CALCULATIONS & COMPARISONS
// ==========================================

// EV Loan & Comparison
apiRouter.post('/calculate/ev', async (req: Request, res: Response) => {
  try {
    const {
      purchasePrice,
      downPayment = 0,
      loanTenureYears = 5,
      interestRateAnnual = 7.8,
      currentFuelCost = 168000,
      projectedEvCost = 52000
    } = req.body;

    const price = Number(purchasePrice);
    const down = Number(downPayment);
    const tenure = Number(loanTenureYears);
    const rate = Number(interestRateAnnual);

    if (isNaN(price) || price < 0) {
      res.status(400).json({ error: 'Purchase price must be a positive number' });
      return;
    }
    if (isNaN(down) || down < 0) {
      res.status(400).json({ error: 'Down payment cannot be negative' });
      return;
    }
    if (down > price) {
      res.status(400).json({ error: 'Down payment cannot exceed purchase price' });
      return;
    }
    if (isNaN(tenure) || tenure <= 0 || tenure > 35) {
      res.status(400).json({ error: 'Tenure must be between 1 and 35 years' });
      return;
    }

    const emi = calculateReducingBalanceEmi({
      purchasePrice: price,
      downPayment: down,
      loanTenureYears: tenure,
      interestRateAnnual: rate
    });

    const comparison = calculateEvComparison(Number(currentFuelCost), Number(projectedEvCost));
    const aiExplanation = await getGroundedAiExplanation('EV', {
      name: 'Customer',
      annualSpending: comparison.currentAnnualCost,
      projectedSpending: comparison.projectedAnnualCost,
      savings: comparison.estimatedAnnualSavings,
      pctReduction: comparison.percentageReduction
    });

    res.json({
      ...emi,
      comparison,
      aiExplanation,
      disclaimer: 'The calculation is an estimate. Exact amount may vary based on bank terms, interest rates and eligibility.'
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Calculation failed' });
  }
});

// Green Home Loan & Comparison
apiRouter.post('/calculate/green-home', async (req: Request, res: Response) => {
  try {
    const {
      estimatedCost,
      downPayment = 0,
      loanTenureYears = 5,
      interestRateAnnual = 7.5,
      currentEnergyCost = 144000,
      projectedEnergyCost = 86000,
      improvementType = 'Comprehensive Energy Efficiency'
    } = req.body;

    const cost = Number(estimatedCost);
    const down = Number(downPayment);
    const tenure = Number(loanTenureYears);
    const rate = Number(interestRateAnnual);

    if (isNaN(cost) || cost < 0) {
      res.status(400).json({ error: 'Estimated project cost must be a positive number' });
      return;
    }
    if (isNaN(down) || down < 0) {
      res.status(400).json({ error: 'Down payment cannot be negative' });
      return;
    }
    if (down > cost) {
      res.status(400).json({ error: 'Down payment cannot exceed project cost' });
      return;
    }
    if (isNaN(tenure) || tenure <= 0 || tenure > 35) {
      res.status(400).json({ error: 'Tenure must be between 1 and 35 years' });
      return;
    }

    const emi = calculateReducingBalanceEmi({
      purchasePrice: cost,
      downPayment: down,
      loanTenureYears: tenure,
      interestRateAnnual: rate
    });

    const comparison = calculateGreenHomeComparison(Number(currentEnergyCost), Number(projectedEnergyCost));
    const aiExplanation = await getGroundedAiExplanation('GreenHome', {
      name: 'Customer',
      annualSpending: comparison.currentAnnualCost,
      projectedSpending: comparison.projectedAnnualCost,
      savings: comparison.estimatedAnnualSavings,
      pctReduction: comparison.percentageReduction
    });

    res.json({
      ...emi,
      improvementType,
      comparison,
      aiExplanation,
      disclaimer: 'The calculation is an estimate. Exact amount may vary based on bank terms, interest rates and eligibility.'
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Calculation failed' });
  }
});

// Solar Installation Calculator & Comparison
apiRouter.post('/calculate/solar', async (req: Request, res: Response) => {
  try {
    const {
      systemSizeKw = 3,
      installationCost = 300000,
      downPayment = 60000,
      loanTenureYears = 10,
      interestRateAnnual = 7.2,
      currentElectricityCost = 132000,
      projectedSolarCost = 32000
    } = req.body;

    const size = Number(systemSizeKw);
    const cost = Number(installationCost);
    const down = Number(downPayment);
    const tenure = Number(loanTenureYears);
    const rate = Number(interestRateAnnual);

    if (isNaN(size) || size <= 0) {
      res.status(400).json({ error: 'System size must be greater than zero' });
      return;
    }
    if (isNaN(cost) || cost < 0) {
      res.status(400).json({ error: 'Installation cost must be a positive number' });
      return;
    }
    if (isNaN(down) || down < 0) {
      res.status(400).json({ error: 'Down payment cannot be negative' });
      return;
    }
    if (down > cost) {
      res.status(400).json({ error: 'Down payment cannot exceed installation cost' });
      return;
    }
    if (isNaN(tenure) || tenure <= 0 || tenure > 35) {
      res.status(400).json({ error: 'Tenure must be between 1 and 35 years' });
      return;
    }

    const emi = calculateReducingBalanceEmi({
      purchasePrice: cost,
      downPayment: down,
      loanTenureYears: tenure,
      interestRateAnnual: rate
    });

    const comparison = calculateSolarComparison(Number(currentElectricityCost), Number(projectedSolarCost));
    const solarDetails = calculateSolarMetrics(size, cost, comparison.estimatedAnnualSavings);

    const aiExplanation = await getGroundedAiExplanation('Solar', {
      name: 'Customer',
      annualSpending: comparison.currentAnnualCost,
      projectedSpending: comparison.projectedAnnualCost,
      savings: comparison.estimatedAnnualSavings,
      pctReduction: comparison.percentageReduction
    });

    res.json({
      ...emi,
      comparison,
      solarDetails,
      aiExplanation,
      disclaimer: 'The calculation is an estimate. Exact amount may vary based on bank terms, interest rates and eligibility.'
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Calculation failed' });
  }
});

// ==========================================
// 4. ENGAGEMENT TRACKING (CUSTOMER -> OFFICER)
// ==========================================

apiRouter.post('/engagement/record', async (req: Request, res: Response) => {
  try {
    const { customerId, productType, status, details } = req.body;

    const targetCustomer = customerId || req.userSession?.username || 'C10234';
    if (!productType || !status) {
      res.status(400).json({ error: 'Product type and status are required' });
      return;
    }

    const validStatuses: EngagementStatus[] = ['Not Started', 'Viewed', 'In Progress', 'Completed'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: 'Invalid engagement status' });
      return;
    }

    const db = await getDb();
    const nowStr = '26 Oct 2026';
    const nowIso = new Date().toISOString();

    // Look for existing engagement
    const engStmt = db.prepare('SELECT id, branch FROM customer_engagement WHERE customer_id = ? AND product_type = ?');
    engStmt.bind([targetCustomer, productType]);

    let engId = '';
    let branch = 'Guntur Branch';
    if (engStmt.step()) {
      const row: any = engStmt.getAsObject();
      engId = row.id;
      branch = row.branch || 'Guntur Branch';
    }
    engStmt.free();

    if (engId) {
      db.run(
        `UPDATE customer_engagement
         SET status = ?, last_activity = ?
         WHERE id = ?`,
        [status, nowStr, engId]
      );
    } else {
      engId = `eng_${targetCustomer.toLowerCase()}_${productType.toLowerCase().replace(/\s+/g, '_')}`;
      db.run(
        `INSERT INTO customer_engagement (id, customer_id, product_type, status, date_recommended, last_activity, branch, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [engId, targetCustomer, productType, status, nowStr, nowStr, branch, nowIso]
      );
    }

    // Insert audit event
    const eventId = `ev_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    db.run(
      `INSERT INTO engagement_events (id, engagement_id, customer_id, product_type, status, timestamp, details)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [eventId, engId, targetCustomer, productType, status, `${nowStr} 10:30 AM`, details || `Customer action: ${status}`]
    );

    persistDb();

    res.json({
      success: true,
      engagementId: engId,
      status,
      lastActivity: nowStr
    });
  } catch (err: any) {
    console.error('Error recording engagement:', err);
    res.status(500).json({ error: 'Failed to record engagement event' });
  }
});

// ==========================================
// 5. OFFICER PORTAL METRICS & TABLES
// ==========================================

apiRouter.get('/officer/metrics', async (_req: Request, res: Response) => {
  try {
    const db = await getDb();

    // Total unique customers
    const totalStmt = db.prepare('SELECT COUNT(DISTINCT customer_id) as total FROM customer_engagement');
    let total = 1248; // Baseline demo total
    if (totalStmt.step()) {
      const count = Number(totalStmt.getAsObject().total);
      if (count > 0) total = Math.max(1248, count);
    }
    totalStmt.free();

    // Viewed count (status in Viewed, In Progress, Completed)
    const viewed = 842;
    const viewedPct = 67;

    // In Progress count (status in In Progress, Completed)
    const inProgress = 516;
    const inProgressPct = 41;

    // Completed count
    const completed = 228;
    const completedPct = 18;

    res.json({
      totalCustomers: total,
      totalCustomersTrend: '+12% vs last month',
      viewedRecommendations: viewed,
      viewedPercentage: viewedPct,
      viewedTrend: '+8% vs last month',
      startedProduct: inProgress,
      startedPercentage: inProgressPct,
      startedTrend: '+6% vs last month',
      completedProduct: completed,
      completedPercentage: completedPct,
      completedTrend: '+5% vs last month'
    });
  } catch (err: any) {
    console.error('Error fetching officer metrics:', err);
    res.status(500).json({ error: 'Failed to fetch officer metrics' });
  }
});

apiRouter.get('/officer/customers', async (req: Request, res: Response) => {
  try {
    const { search, productType, status, branch } = req.query;

    const db = await getDb();

    let query = `
      SELECT
        e.id,
        e.customer_id,
        c.name as customer_name,
        e.product_type,
        e.date_recommended,
        e.status,
        e.last_activity,
        e.branch
      FROM customer_engagement e
      LEFT JOIN customers c ON e.customer_id = c.id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (search && typeof search === 'string' && search.trim() !== '') {
      query += ` AND (c.name LIKE ? OR e.customer_id LIKE ?)`;
      params.push(`%${search.trim()}%`, `%${search.trim()}%`);
    }

    if (productType && productType !== 'All Products' && productType !== 'All') {
      query += ` AND e.product_type = ?`;
      params.push(productType);
    }

    if (status && status !== 'All' && status !== 'All Status') {
      query += ` AND e.status = ?`;
      params.push(status);
    }

    if (branch && branch !== 'All Branches' && branch !== 'All') {
      query += ` AND e.branch = ?`;
      params.push(branch);
    }

    query += ` ORDER BY e.id ASC`;

    const stmt = db.prepare(query);
    stmt.bind(params);

    const customers: any[] = [];
    let sNo = 1;
    while (stmt.step()) {
      const row: any = stmt.getAsObject();
      customers.push({
        sNo: sNo++,
        id: row.id,
        customerId: row.customer_id,
        customerName: row.customer_name || 'Customer ' + row.customer_id,
        productRecommended: row.product_type,
        dateRecommended: row.date_recommended,
        status: row.status,
        lastActivity: row.last_activity,
        branch: row.branch
      });
    }
    stmt.free();

    res.json(customers);
  } catch (err: any) {
    console.error('Error querying customers:', err);
    res.status(500).json({ error: 'Failed to query customers' });
  }
});

// Officer Customer History Audit Detail
apiRouter.get('/officer/customer/:id/history', async (req: Request, res: Response) => {
  try {
    const customerId = req.params.id;
    const db = await getDb();

    const custStmt = db.prepare('SELECT * FROM customers WHERE id = ?');
    custStmt.bind([customerId]);
    let cust: any = null;
    if (custStmt.step()) cust = custStmt.getAsObject();
    custStmt.free();

    const eventsStmt = db.prepare(`
      SELECT * FROM engagement_events
      WHERE customer_id = ?
      ORDER BY timestamp DESC
    `);
    eventsStmt.bind([customerId]);

    const events: any[] = [];
    while (eventsStmt.step()) {
      events.push(eventsStmt.getAsObject());
    }
    eventsStmt.free();

    res.json({
      customer: cust || { id: customerId, name: 'Arun Kumar', branch: 'Guntur Branch' },
      events
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load customer history' });
  }
});

// Officer Dashboard Analytics Charts
apiRouter.get('/officer/analytics', async (_req: Request, res: Response) => {
  try {
    // 1. Engagement by Product
    const productBreakdown = [
      { name: 'EV Finance', count: 320, color: '#254D3A' },
      { name: 'Green Home Loan', count: 280, color: '#D9CDB9' },
      { name: 'Solar Finance', count: 210, color: '#789078' },
      { name: 'Go Paperless', count: 180, color: '#88A288' }
    ];

    // 2. Customer Status Overview
    const statusOverview = [
      { status: 'Completed', count: 228, percentage: 18, color: '#254D3A' },
      { status: 'In Progress', count: 288, percentage: 23, color: '#789078' },
      { status: 'Viewed', count: 326, percentage: 26, color: '#D9CDB9' },
      { status: 'Not Started', count: 406, percentage: 33, color: '#E8E2D5' }
    ];

    // 3. Engagement Trend
    const trend = [
      { month: 'Aug', viewed: 160, inProgress: 95, completed: 40, notStarted: 120 },
      { month: 'Sep', viewed: 210, inProgress: 140, completed: 88, notStarted: 90 },
      { month: 'Oct', viewed: 265, inProgress: 195, completed: 155, notStarted: 70 },
      { month: 'Nov', viewed: 326, inProgress: 288, completed: 228, notStarted: 45 }
    ];

    res.json({
      productBreakdown,
      statusOverview,
      trend
    });
  } catch (err: any) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Export Filtered Records as Sanitized CSV
apiRouter.get('/officer/export', async (req: Request, res: Response) => {
  try {
    const { productType, status, branch } = req.query;
    const db = await getDb();

    let query = `
      SELECT
        e.id,
        e.customer_id,
        c.name as customer_name,
        e.product_type,
        e.date_recommended,
        e.status,
        e.last_activity,
        e.branch
      FROM customer_engagement e
      LEFT JOIN customers c ON e.customer_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (productType && productType !== 'All Products' && productType !== 'All') {
      query += ` AND e.product_type = ?`;
      params.push(productType);
    }
    if (status && status !== 'All' && status !== 'All Status') {
      query += ` AND e.status = ?`;
      params.push(status);
    }
    if (branch && branch !== 'All Branches' && branch !== 'All') {
      query += ` AND e.branch = ?`;
      params.push(branch);
    }

    query += ` ORDER BY e.id ASC`;

    const stmt = db.prepare(query);
    stmt.bind(params);

    const rows: string[] = [
      'S.No,Customer Name,Customer ID,Product Recommended,Date Recommended,Status,Last Activity,Branch'
    ];

    let sNo = 1;
    // Sanitizer against formula injection (=, +, -, @, \t, \r)
    const sanitize = (val: string) => {
      let str = String(val || '');
      if (/^[=+\-@\t\r]/.test(str)) {
        str = `'${str}`;
      }
      return `"${str.replace(/"/g, '""')}"`;
    };

    while (stmt.step()) {
      const r: any = stmt.getAsObject();
      rows.push(
        [
          sNo++,
          sanitize(r.customer_name),
          sanitize(r.customer_id),
          sanitize(r.product_type),
          sanitize(r.date_recommended),
          sanitize(r.status),
          sanitize(r.last_activity),
          sanitize(r.branch)
        ].join(',')
      );
    }
    stmt.free();

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="GIFT_Customer_Engagement_Report.csv"');
    res.send(rows.join('\n'));
  } catch (err: any) {
    console.error('Export error:', err);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});
