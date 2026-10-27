/**
 * Comprehensive Verification Tests for G.I.F.T. Financial Calculations
 * Tests all required cases from Master Prompt Section 15:
 * 1. Standard positive-interest loan
 * 2. Zero-interest loan
 * 3. Zero down payment
 * 4. Down payment equal to project cost
 * 5. Invalid negative prices
 * 6. Down payment exceeding cost
 * 7. Invalid tenure
 * 8. Missing required inputs
 * 9. Current and projected costs equal
 * 10. Projected costs greater than current costs
 * 11. Insufficient solar-generation information
 * 12. Solar payback and generation calculation
 */

import {
  calculateReducingBalanceEmi,
  calculateEvComparison,
  calculateGreenHomeComparison,
  calculateSolarComparison,
  calculateSolarMetrics
} from '../src/server/calculations';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

function assertThrows(fn: () => void, expectedSubstr: string) {
  let threw = false;
  try {
    fn();
  } catch (err: any) {
    threw = true;
    if (!err.message.includes(expectedSubstr)) {
      throw new Error(`Expected error containing "${expectedSubstr}", got "${err.message}"`);
    }
  }
  if (!threw) {
    throw new Error(`Expected function to throw error containing "${expectedSubstr}", but it succeeded`);
  }
}

export function runAllCalculationTests() {
  console.log('=== Starting G.I.F.T. Financial Calculation Test Suite ===');

  // Test 1: Standard positive-interest loan (₹ 12,00,000 for 5 years at 7.8% p.a.)
  {
    const res = calculateReducingBalanceEmi({
      purchasePrice: 1500000,
      downPayment: 300000,
      loanTenureYears: 5,
      interestRateAnnual: 7.8
    });
    assert(res.loanAmount === 1200000, 'Loan amount should be 12,00,000');
    // EMI around 24,222
    assert(Math.abs(res.monthlyEmi - 24222) <= 10, `Monthly EMI should be approx 24,222, got ${res.monthlyEmi}`);
    assert(res.totalRepayment > res.loanAmount, 'Total repayment should exceed principal');
    assert(res.totalInterest > 0, 'Total interest should be positive');
    console.log('✓ Test 1 Passed: Standard positive-interest loan');
  }

  // Test 2: Zero-interest loan
  {
    const res = calculateReducingBalanceEmi({
      purchasePrice: 120000,
      downPayment: 0,
      loanTenureYears: 1,
      interestRateAnnual: 0
    });
    assert(res.loanAmount === 120000, 'Loan amount should be 1,20,000');
    assert(res.monthlyEmi === 10000, `Zero-interest monthly EMI should be exactly 10,000, got ${res.monthlyEmi}`);
    assert(res.totalInterest === 0, 'Zero-interest total interest should be 0');
    assert(res.totalRepayment === 120000, 'Total repayment equals principal on 0% interest');
    console.log('✓ Test 2 Passed: Zero-interest loan');
  }

  // Test 3: Zero down payment
  {
    const res = calculateReducingBalanceEmi({
      purchasePrice: 500000,
      downPayment: 0,
      loanTenureYears: 5,
      interestRateAnnual: 7.5
    });
    assert(res.loanAmount === 500000, 'With 0 down payment, loanAmount equals purchasePrice');
    console.log('✓ Test 3 Passed: Zero down payment');
  }

  // Test 4: Down payment equal to project cost
  {
    const res = calculateReducingBalanceEmi({
      purchasePrice: 300000,
      downPayment: 300000,
      loanTenureYears: 5,
      interestRateAnnual: 7.2
    });
    assert(res.loanAmount === 0, 'Loan amount should be 0');
    assert(res.monthlyEmi === 0, 'Monthly EMI should be 0');
    assert(res.totalInterest === 0, 'Total interest should be 0');
    assert(res.totalRepayment === 0, 'Total repayment should be 0');
    console.log('✓ Test 4 Passed: Down payment equal to project cost');
  }

  // Test 5: Invalid negative price
  {
    assertThrows(() => {
      calculateReducingBalanceEmi({
        purchasePrice: -50000,
        downPayment: 0,
        loanTenureYears: 5,
        interestRateAnnual: 7.5
      });
    }, 'cannot be negative');
    console.log('✓ Test 5 Passed: Invalid negative price rejection');
  }

  // Test 6: Down payment exceeding cost
  {
    assertThrows(() => {
      calculateReducingBalanceEmi({
        purchasePrice: 100000,
        downPayment: 150000,
        loanTenureYears: 5,
        interestRateAnnual: 7.5
      });
    }, 'cannot exceed purchase price');
    console.log('✓ Test 6 Passed: Down payment exceeding cost rejection');
  }

  // Test 7: Invalid tenure (<= 0 or > 35)
  {
    assertThrows(() => {
      calculateReducingBalanceEmi({
        purchasePrice: 100000,
        downPayment: 10000,
        loanTenureYears: 0,
        interestRateAnnual: 7.5
      });
    }, 'greater than zero');

    assertThrows(() => {
      calculateReducingBalanceEmi({
        purchasePrice: 100000,
        downPayment: 10000,
        loanTenureYears: 40,
        interestRateAnnual: 7.5
      });
    }, 'cannot exceed 35 years');
    console.log('✓ Test 7 Passed: Invalid tenure validation');
  }

  // Test 8: Missing or NaN required inputs
  {
    assertThrows(() => {
      calculateReducingBalanceEmi({
        purchasePrice: NaN,
        loanTenureYears: 5,
        interestRateAnnual: 7.5
      });
    }, 'must be a valid number');
    console.log('✓ Test 8 Passed: NaN / missing input validation');
  }

  // Test 9: Current and projected costs equal (0% savings)
  {
    const comp = calculateEvComparison(100000, 100000);
    assert(comp.estimatedAnnualSavings === 0, 'Savings should be 0 when costs are equal');
    assert(comp.percentageReduction === 0, 'Percentage reduction should be 0');
    console.log('✓ Test 9 Passed: Equal current and projected costs');
  }

  // Test 10: Projected costs greater than current costs (No negative savings reported)
  {
    const comp = calculateGreenHomeComparison(50000, 80000);
    assert(comp.estimatedAnnualSavings === 0, 'Savings should floor at 0');
    assert(comp.percentageReduction === 0, 'Percentage reduction should floor at 0');
    console.log('✓ Test 10 Passed: Projected costs greater than current costs');
  }

  // Test 11: Insufficient / invalid solar generation information
  {
    assertThrows(() => {
      calculateSolarMetrics(0, 300000, 100000);
    }, 'must be greater than zero');
    console.log('✓ Test 11 Passed: Invalid solar system size rejection');
  }

  // Test 12: Verified Solar metrics (3 kW system, ₹ 3,00,000 cost, ₹ 1,00,000 savings)
  {
    const solar = calculateSolarMetrics(3, 300000, 100000);
    assert(solar.estimatedAnnualGenerationKwh === 4380, '3 kW produces 4,380 kWh/yr');
    assert(solar.estimatedMonthlyBillReduction === 8333, 'Monthly reduction should be 8,333');
    assert(solar.estimatedPaybackYears === 3.0, 'Payback period should be exactly 3.0 years');
    console.log('✓ Test 12 Passed: Solar generation & payback metrics');
  }

  console.log('=== ALL 12 FINANCIAL CALCULATION TESTS PASSED SUCCESSFULLY! ===');
}

// Execute tests if run directly with tsx
runAllCalculationTests();
