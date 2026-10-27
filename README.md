# G.I.F.T. — Green Insights & Financial Transition Platform

An explainable, full-stack sustainable banking intelligence platform developed in accordance with the G.I.F.T. design system and architecture guidelines.

G.I.F.T. bridges the gap between customer household expenditure (fuel, electricity, appliance energy) and transparent green financing options (EV Auto Loans, Green Home Loans, and Solar Rooftop Finance) with verified reducing-balance EMI calculations, explainable recommendation logic, and real-time bank officer engagement tracking.

---

## 🌿 Approved Visual References & Reproductions

The application reproduces all reference interfaces:
1. **Customer Login**: `/` (or switch to Customer Access)
2. **Customer Sign Up (4-Step Guided Flow)**: Personal Information, Phone OTP Verification, Bank Account Linking, Password Creation
3. **Officer Access / Login**: Bank selection, Employee ID, Branch verification, Authorized access boundary
4. **Customer Home Dashboard**: Time-adaptive greeting, exactly 3 spending percentage cards (Petrol 34%, Electricity 28%, Appliances 20%), Green Insights Overview (EV Finance, Green Home Loan, Solar Finance)
5. **EV Finance**: Drive Cleaner, Save Smarter; Petrol vs EV cost comparison bar graph (₹ 1,68,000 vs ₹ 52,000; 69% reduction); EV Loan Calculator; Estimated Loan Details; Environmental & operational benefits
6. **Green Home Loan**: A Greener Home for a Brighter Future; Current vs Green Home spending comparison (₹ 1,44,000 vs ₹ 86,000; 40% reduction); Green Home Loan Calculator; Estimated Loan Details; Energy efficiency benefits
7. **Solar Finance**: Generate Your Own Electricity, Save More; Electricity cost comparison (₹ 1,32,000 vs ₹ 32,000; 76% reduction); Solar Installation Calculator; Estimated Loan Details; Solar generation (4,380 kWh/yr) and Payback Period (~3.0 yrs)
8. **Officer Dashboard**: KPI summary strip (1,248 Customers, 842 Viewed [67%], 516 Started [41%], 228 Completed [18%]); dynamic filter bar; Customer Engagement Details table with export; Customer history audit trail modal; 3 analytics charts (Product breakdown, Status overview donut, Engagement trend lines)

---

## 🔐 Demo Credentials

The platform is pre-seeded with fictional, internally consistent demonstration accounts:

### 1. Customer Demo Account
- **Customer ID**: `C10234`
- **Linked Bank Account**: `987654321012`
- **Password**: `Password@123`
- **Customer Name**: Arun Kumar
- **Authorized Branch**: Lloyds Bank, Guntur Branch

### 2. Branch Officer Demo Account
- **Employee ID**: `EMP-8842`
- **Password**: `Officer@123`
- **Officer Name**: R. Srinivas
- **Authorized Branch**: Lloyds Bank, Guntur Branch

> **Note**: Both login interfaces include "Quick Fill" evaluation helpers, and the top navigation header contains an instant Role Switcher dropdown to facilitate evaluation between Customer and Officer views.

---

## 📐 Architecture & Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide icons, responsive modular layout
- **Backend**: Node.js, Express, TypeScript (`server.ts` entry point)
- **Database**: Embedded SQLite engine (`sql.js`), fully persistent to `gift_database.sqlite` on disk with schemas, foreign key constraints, indices, and audit event tracking
- **Calculation Engine**: Reducing-balance monthly EMI calculation with zero-interest edge cases, percentage reductions, solar capacity modeling, and deterministic explainability
- **Security**: Pure JS bcrypt password hashing, session tokens, HTTP-only session cookies, CSV formula injection sanitization, role-based middleware (`requireCustomer`, `requireOfficer`)

---

## 🚀 Running the Project

### Development
```bash
npm run dev
```
Starts Express with Vite middleware on port 3000.

### Running Automated Calculation Tests
```bash
npx tsx tests/calculations.test.ts
```
Executes all 12 edge case tests verifying reducing-balance EMIs, zero-interest loans, boundary down payments, invalid inputs, and solar payback metrics.

### Building for Production
```bash
npm run build
npm start
```
Compiles client assets with Vite and serves them through the Express backend.
