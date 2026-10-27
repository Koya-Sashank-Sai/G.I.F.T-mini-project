/**
 * G.I.F.T. Financial and Green Savings Calculation Engine
 * Implements deterministic reducing-balance EMI and transparent cost comparisons.
 */

export interface EmiInput {
  purchasePrice: number;
  downPayment?: number;
  loanTenureYears: number;
  interestRateAnnual: number;
}

export interface EmiResult {
  loanAmount: number;
  monthlyEmi: number;
  totalInterest: number;
  totalRepayment: number;
  numberOfPayments: number;
  annualInterestRate: number;
  monthlyInterestRate: number;
}

export interface ComparisonResult {
  currentAnnualCost: number;
  projectedAnnualCost: number;
  estimatedAnnualSavings: number;
  percentageReduction: number;
  assumptions: string[];
}

export interface SolarMetricsResult {
  systemSizeKw: number;
  estimatedAnnualGenerationKwh: number;
  estimatedMonthlyBillReduction: number;
  estimatedAnnualSavings: number;
  estimatedPaybackYears: number | null;
}

/**
 * Standard reducing-balance EMI calculation with edge case handling
 */
export function calculateReducingBalanceEmi(input: EmiInput): EmiResult {
  const { purchasePrice, downPayment = 0, loanTenureYears, interestRateAnnual } = input;

  // Validation
  if (typeof purchasePrice !== 'number' || isNaN(purchasePrice)) {
    throw new Error('Purchase price must be a valid number');
  }
  if (purchasePrice < 0) {
    throw new Error('Purchase price cannot be negative');
  }

  const cleanDownPayment = typeof downPayment === 'number' && !isNaN(downPayment) ? downPayment : 0;
  if (cleanDownPayment < 0) {
    throw new Error('Down payment cannot be negative');
  }
  if (cleanDownPayment > purchasePrice) {
    throw new Error('Down payment cannot exceed purchase price');
  }

  if (typeof loanTenureYears !== 'number' || isNaN(loanTenureYears) || loanTenureYears <= 0) {
    throw new Error('Loan tenure must be greater than zero');
  }
  if (loanTenureYears > 35) {
    throw new Error('Loan tenure cannot exceed 35 years');
  }

  if (typeof interestRateAnnual !== 'number' || isNaN(interestRateAnnual) || interestRateAnnual < 0) {
    throw new Error('Interest rate must be a non-negative number');
  }

  const loanAmount = Math.max(0, purchasePrice - cleanDownPayment);
  const numberOfPayments = Math.round(loanTenureYears * 12);

  // Edge case: Down payment covers full cost (loanAmount = 0)
  if (loanAmount === 0) {
    return {
      loanAmount: 0,
      monthlyEmi: 0,
      totalInterest: 0,
      totalRepayment: 0,
      numberOfPayments,
      annualInterestRate: interestRateAnnual,
      monthlyInterestRate: 0
    };
  }

  // Edge case: Zero interest loan
  if (interestRateAnnual === 0) {
    const monthlyEmi = Math.round(loanAmount / numberOfPayments);
    const totalRepayment = loanAmount;
    const totalInterest = 0;
    return {
      loanAmount,
      monthlyEmi,
      totalInterest,
      totalRepayment,
      numberOfPayments,
      annualInterestRate: 0,
      monthlyInterestRate: 0
    };
  }

  // Standard reducing-balance EMI formula: [P * r * (1 + r)^n] / [(1 + r)^n - 1]
  const monthlyRate = interestRateAnnual / (12 * 100);
  const factor = Math.pow(1 + monthlyRate, numberOfPayments);
  const exactEmi = (loanAmount * monthlyRate * factor) / (factor - 1);
  const monthlyEmi = Math.round(exactEmi);
  const totalRepayment = Math.round(monthlyEmi * numberOfPayments);
  const totalInterest = Math.max(0, totalRepayment - loanAmount);

  return {
    loanAmount,
    monthlyEmi,
    totalInterest,
    totalRepayment,
    numberOfPayments,
    annualInterestRate: interestRateAnnual,
    monthlyInterestRate: monthlyRate
  };
}

/**
 * Calculates EV vs Petrol vehicle cost comparison and savings percentage
 */
export function calculateEvComparison(
  currentAnnualFuelCost = 168000,
  projectedAnnualEvCost = 52000
): ComparisonResult {
  if (currentAnnualFuelCost < 0 || projectedAnnualEvCost < 0) {
    throw new Error('Vehicle running costs cannot be negative');
  }

  const estimatedAnnualSavings = Math.max(0, currentAnnualFuelCost - projectedAnnualEvCost);
  const percentageReduction =
    currentAnnualFuelCost > 0
      ? Math.round((estimatedAnnualSavings / currentAnnualFuelCost) * 100)
      : 0;

  return {
    currentAnnualCost: currentAnnualFuelCost,
    projectedAnnualCost: projectedAnnualEvCost,
    estimatedAnnualSavings,
    percentageReduction,
    assumptions: [
      'Current fuel baseline: Petrol/diesel running at ~23,000 km/yr @ 14 km/L at ~₹102/L',
      'EV running baseline: ~23,000 km/yr @ 7 km/kWh at ~₹8/kWh green/off-peak tariff',
      'Includes estimated regular maintenance differential between ICE and EV'
    ]
  };
}

/**
 * Calculates Green Home energy comparison and savings percentage
 */
export function calculateGreenHomeComparison(
  currentAnnualHomeSpending = 144000,
  projectedAnnualHomeSpending = 86000
): ComparisonResult {
  if (currentAnnualHomeSpending < 0 || projectedAnnualHomeSpending < 0) {
    throw new Error('Home energy spending cannot be negative');
  }

  const estimatedAnnualSavings = Math.max(0, currentAnnualHomeSpending - projectedAnnualHomeSpending);
  const percentageReduction =
    currentAnnualHomeSpending > 0
      ? Math.round((estimatedAnnualSavings / currentAnnualHomeSpending) * 100)
      : 0;

  return {
    currentAnnualCost: currentAnnualHomeSpending,
    projectedAnnualCost: projectedAnnualHomeSpending,
    estimatedAnnualSavings,
    percentageReduction,
    assumptions: [
      'Baseline represents current home heating, cooling, and appliance power consumption',
      'Upgrades include BEE 5-star inverter heat pump/AC, enhanced roof insulation, and LED fixtures',
      'Expected average household energy consumption reduction of ~40%'
    ]
  };
}

/**
 * Calculates Solar electricity cost comparison and savings percentage
 */
export function calculateSolarComparison(
  currentAnnualElectricityCost = 132000,
  projectedAnnualSolarElectricityCost = 32000
): ComparisonResult {
  if (currentAnnualElectricityCost < 0 || projectedAnnualSolarElectricityCost < 0) {
    throw new Error('Electricity costs cannot be negative');
  }

  const estimatedAnnualSavings = Math.max(0, currentAnnualElectricityCost - projectedAnnualSolarElectricityCost);
  const percentageReduction =
    currentAnnualElectricityCost > 0
      ? Math.round((estimatedAnnualSavings / currentAnnualElectricityCost) * 100)
      : 0;

  return {
    currentAnnualCost: currentAnnualElectricityCost,
    projectedAnnualCost: projectedAnnualSolarElectricityCost,
    estimatedAnnualSavings,
    percentageReduction,
    assumptions: [
      'Assumes rooftop solar grid-tied photovoltaic system with net metering where available',
      'Accounts for remaining seasonal and evening grid electricity imports (~24% of baseline)',
      'Solar panels do not completely eliminate grid charges (fixed meter charges apply)'
    ]
  };
}

/**
 * Calculates Solar system technical and financial payback metrics
 */
export function calculateSolarMetrics(
  systemSizeKw: number,
  installationCost: number,
  annualSavings = 100000
): SolarMetricsResult {
  if (systemSizeKw <= 0) {
    throw new Error('System size must be greater than zero');
  }
  if (installationCost < 0) {
    throw new Error('Installation cost cannot be negative');
  }

  // 1 kW solar system produces approx 4 kWh per day in sunny Indian regions = 1,460 kWh/kW/yr
  const estimatedAnnualGenerationKwh = Math.round(systemSizeKw * 4 * 365);
  const estimatedMonthlyBillReduction = Math.round(annualSavings / 12);

  let estimatedPaybackYears: number | null = null;
  if (annualSavings > 0) {
    const rawYears = installationCost / annualSavings;
    estimatedPaybackYears = Math.round(rawYears * 10) / 10; // 1 decimal place e.g. 3.0 years
  }

  return {
    systemSizeKw,
    estimatedAnnualGenerationKwh,
    estimatedMonthlyBillReduction,
    estimatedAnnualSavings: annualSavings,
    estimatedPaybackYears
  };
}
