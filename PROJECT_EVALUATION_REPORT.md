# G.I.F.T. — Project Evaluation Report

**Platform:** G.I.F.T. (Green Insights & Financial Transition Platform)  
**Evaluation Role:** Senior Full-Stack Engineer, Banking UI/UX Designer & Project Evaluator  
**Audit Date:** October 26, 2026  

---

## 1. Executive Summary

G.I.F.T. has been built as a connected, explainable green-finance intelligence platform that connects customer spending data with relevant financing options and real-time bank officer engagement tracking. 

The implementation faithfully reflects the design system, palette, typography, visual hierarchy, and functional requirements specified in the reference imagery and master prompt.

---

## 2. Interface Fidelity & Screen Review

| Interface | Status | Implementation Details |
| :--- | :--- | :--- |
| **1. Customer Login** | Complete | Replicated split layout; forest green branding on left with natural artwork; Customer ID, Linked Account, and Password inputs; Remember Me; Forgot Password; seeded demo quick-fill helper. |
| **2. Customer Sign Up** | Complete | Guided 4-step wizard (Personal Details &rarr; Phone OTP Verification &rarr; Bank Account Linking &rarr; Password & Account Creation); branch & location inputs; simulated OTP modal. |
| **3. Officer Access / Login** | Complete | Bank selection, Employee Name, Branch, Location, Employee ID, Password; Authorized Access Only security banner; quick-fill demo officer helper. |
| **4. Customer Home Dashboard** | Complete | Time-of-day greeting ("Good morning, Arun Kumar"); exactly 3 spending percentage cards (Petrol 34%, Electricity 28%, Appliances 20%); Green Insights Overview with 3 product cards (EV Finance, Green Home Loan, Solar Finance); Go Paperless and Carbon Engine excluded from customer portal as instructed. |
| **5. EV Finance** | Complete | Hero section with banner text; annual spending comparison bar graph (₹ 1,68,000 vs ₹ 52,000; 69% reduction); EV Loan Calculator with reducing-balance EMI; Estimated Loan Details panel; "Why Consider an EV" 4-point benefits grid; pre-application inquiry logging. |
| **6. Green Home Loan** | Complete | Matching layout; annual home spending bar graph (₹ 1,44,000 vs ₹ 86,000; 40% reduction); Green Home Loan Calculator; improvement type selection; Estimated Loan Details panel; eco-living visual quote card. |
| **7. Solar Finance** | Complete | Primary reference design match; annual electricity cost comparison graph (₹ 1,32,000 vs ₹ 32,000; 76% reduction); Solar Installation Calculator with kW system sizing; Loan Amount, Monthly EMI, Total Interest, Total Repayment, Solar Generation (4,380 kWh/yr), and Payback Period (~3.0 yrs). |
| **8. Officer Dashboard** | Complete | KPI summary strip (1,248 Customers, 842 Viewed [67%], 516 Started [41%], 228 Completed [18%]); functional filters (Customer Search, Product Type, Status, Date Range, Branch); Customer Engagement Details table with status badges and pagination; Customer History Audit modal; 3 analytics charts matching reference data. |

---

## 3. Financial Calculation & Edge Case Testing

All financial calculations are performed in the backend (`src/server/calculations.ts`) using the standard reducing-balance EMI equation:

$$EMI = \frac{P \cdot r \cdot (1 + r)^n}{(1 + r)^n - 1}$$

### Test Suite Execution Summary (`tests/calculations.test.ts`)
- **Test 1: Standard Positive-Interest Loan:** Verified for ₹ 12,00,000 principal at 7.8% p.a. over 5 years. Monthly EMI computed as ₹ 24,222.
- **Test 2: Zero-Interest Loan:** Verified edge case handling where $r = 0$. Monthly EMI evaluates strictly to $P / n$ (e.g. ₹ 10,000/mo on ₹ 1,20,000 principal), with total interest $= ₹ 0$.
- **Test 3: Zero Down Payment:** Verified loan amount cleanly defaults to full purchase price.
- **Test 4: Down Payment Equal to Cost:** Verified loan amount floors to ₹ 0, monthly EMI $= ₹ 0$, total interest $= ₹ 0$.
- **Test 5: Negative Prices:** Properly rejected with `400 Bad Request` ("Purchase price cannot be negative").
- **Test 6: Down Payment Exceeding Cost:** Properly rejected ("Down payment cannot exceed purchase price").
- **Test 7: Invalid Tenure:** Validated $0 < \text{tenure} \le 35$ years; rejected invalid bounds.
- **Test 8: NaN / Missing Inputs:** Validated numeric integrity.
- **Test 9: Equal Current & Projected Costs:** Savings cleanly reported as ₹ 0 and 0% reduction.
- **Test 10: Projected > Current Costs:** Savings floor safely at ₹ 0 without negative distortions.
- **Test 11: Invalid Solar System Size:** Rejects non-positive kW ratings.
- **Test 12: Solar Generation & Payback:** 3 kW array produces 4,380 kWh/yr with a 3.0-year payback period based on ₹ 1,00,000 annual net bill reduction.

---

## 4. Security, Privacy & RBAC Verification

1. **Password Hashing:** Passwords are never stored in plaintext. Pure JS `bcryptjs` is used with a salt work factor of 10.
2. **Session Security:** Cryptographically secure 256-bit random hex session tokens, HTTP-only cookie support, and 24-hour expiration.
3. **Role-Based Access Control:** Separate API routes and session roles (`customer` and `officer`). Customer routes cannot access branch aggregate datasets.
4. **Spreadsheet Formula Injection Prevention:** CSV export endpoint (`/api/officer/export`) prepends single quotes to values starting with `=`, `+`, `-`, `@`, `\t`, or `\r`.
5. **No Credential Ingestion:** The platform does not prompt for or persist real banking passwords, internet banking credentials, or bank PINs.

---

## 5. End-to-End Customer to Officer Tracking Verification

1. **Step 1:** Customer Arun Kumar (`C10234`) signs in.
2. **Step 2:** Arun views EV Finance or Solar Finance page. An engagement event is automatically posted to `/api/engagement/record` with `status: 'Viewed'`.
3. **Step 3:** Arun adjusts the calculator inputs and calculates an EMI estimate. An event is recorded with `status: 'In Progress'` alongside the loan parameters.
4. **Step 4:** Arun clicks "Submit Pre-Application Inquiry". An event is recorded with `status: 'Completed'`.
5. **Step 5:** Officer signs into the Officer Portal (`EMP-8842`).
6. **Step 6:** In the Customer Engagement Details table, Arun Kumar's record displays status "Completed", with the updated last activity date.
7. **Step 7:** The officer clicks "View" on Arun Kumar to inspect the timeline of viewed and completed events in the Customer History modal.

---

## 6. Assumptions & Prototype Limitations

- **Simulated Spending Baseline:** Customer spending percentages are derived from realistic demo figures representing trailing 12-month expenditure in Indian Rupees (INR).
- **Simulated OTP:** The SMS OTP verification displays a simulated 6-digit code for local testing rather than invoking a live telecommunications gateway.
- **Database Engine:** An embedded SQLite database (`sql.js`) is used for the prototype, saving state to `gift_database.sqlite`. The schema is written using standard SQL DDL, allowing migration to PostgreSQL in production environments.
