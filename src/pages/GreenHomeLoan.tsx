import React, { useState, useEffect } from 'react';
import { Calculator, FileText, CheckCircle2, Zap, Leaf, TrendingUp, Award, ShieldAlert, Home } from 'lucide-react';
import { ComparisonBarChart } from '../components/ComparisonBarChart';
import { formatINR } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

export const GreenHomeLoan: React.FC = () => {
  const { user } = useAuth();
  const customerId = user?.id || 'C10234';

  // Calculator inputs
  const [improvementType, setImprovementType] = useState<string>('Comprehensive Energy Efficiency');
  const [projectCost, setProjectCost] = useState<number>(400000);
  const [tenureYears, setTenureYears] = useState<number>(5);
  const [downPayment, setDownPayment] = useState<number>(50000);

  // Calculation output states
  const [loanDetails, setLoanDetails] = useState<{
    loanAmount: number;
    monthlyEmi: number;
    totalInterest: number;
    totalRepayment: number;
  }>({
    loanAmount: 350000,
    monthlyEmi: 7015,
    totalInterest: 70900,
    totalRepayment: 420900
  });

  const [appliedSuccess, setAppliedSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Record 'Viewed' on mount
  useEffect(() => {
    fetch('/api/engagement/record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId,
        productType: 'Green Home Loan',
        status: 'Viewed',
        details: 'Customer viewed Green Home Loan estimates and efficiency options'
      })
    }).catch(console.warn);
  }, [customerId]);

  const handleCalculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/calculate/green-home', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estimatedCost: projectCost,
          downPayment,
          loanTenureYears: tenureYears,
          interestRateAnnual: 7.5,
          improvementType
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Calculation failed. Please verify inputs.');
        setLoading(false);
        return;
      }

      setLoanDetails({
        loanAmount: data.loanAmount,
        monthlyEmi: data.monthlyEmi,
        totalInterest: data.totalInterest,
        totalRepayment: data.totalRepayment
      });

      // Record 'In Progress' engagement
      fetch('/api/engagement/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          productType: 'Green Home Loan',
          status: 'In Progress',
          details: `Calculated Green Home Loan for ₹ ${data.loanAmount.toLocaleString('en-IN')} (${tenureYears} yrs) for ${improvementType}`
        })
      }).catch(console.warn);
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyInterest = async () => {
    setLoading(true);
    try {
      await fetch('/api/engagement/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          productType: 'Green Home Loan',
          status: 'Completed',
          details: `Customer submitted pre-application inquiry for ${improvementType} (Loan: ₹ ${loanDetails.loanAmount.toLocaleString('en-IN')})`
        })
      });
      setAppliedSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-7 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#F6F1E6] via-[#EEE6D7] to-[#E5DEC9] rounded-2xl p-8 border border-[#E0D7C4] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 min-h-[140px]">
        <div className="relative z-10 max-w-xl">
          <span className="text-[11px] font-bold tracking-widest uppercase text-[#546857] block mb-1">
            GREEN HOME LOAN
          </span>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#254D3A] font-serif tracking-tight">
            A Greener Home for a Brighter Future
          </h1>
          <p className="text-sm text-[#5B6A5D] mt-2 leading-relaxed">
            Upgrade to energy-efficient homes with easy and flexible financing options, and reduce your environmental impact.
          </p>
        </div>

        {/* Right side banner badge */}
        <div className="relative z-10 flex items-center justify-end">
          <div className="hidden lg:flex items-center space-x-3 bg-white/75 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-[#DFD6C3] shadow-xs">
            <Home className="w-5 h-5 text-[#254D3A]" />
            <div className="text-xs">
              <span className="font-bold text-[#254D3A] block">Eco Housing Incentive</span>
              <span className="text-[#6D7D70]">7.50% p.a. • Concessional Green Rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Comparison Bar Graph & AI Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left: Current vs Green Home Spending Comparison */}
        <div className="lg:col-span-7">
          <ComparisonBarChart
            title="Your Estimated Annual Home Spending"
            tooltipText="Based on your actual electricity and appliance spending of ₹ 96,000, projected with certified 40% thermal and appliance energy reductions."
            currentLabel="Current Home"
            currentSublabel="(Existing Appliances)"
            currentAmount={144000}
            projectedLabel="Green Home"
            projectedSublabel="(Energy-Efficient Upgrades)"
            projectedAmount={86000}
            savingsAmount={58000}
            savingsPercent={40}
            savingsDescription="lower home energy spending with green upgrades"
            maxScale={200000}
          />
        </div>

        {/* Right: Why Consider a Green Home Loan? */}
        <div className="lg:col-span-5 bg-[#FAF7F0] rounded-2xl p-6 border border-[#E7DFCF] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <Leaf className="w-5 h-5 text-[#254D3A]" />
              <h3 className="text-base font-bold text-[#254D3A] font-serif">
                Why Consider a Green Home Loan?
              </h3>
            </div>
            <p className="text-xs text-[#667568] leading-relaxed mb-4">
              Based on your current home energy spending, upgrading to energy-efficient solutions can help you save money and reduce your carbon footprint.
            </p>

            <div className="space-y-3.5">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#E5ECE6] text-[#254D3A] flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#254D3A] block">Lower Energy Bills</span>
                  <span className="text-xs text-[#5D6B60] leading-snug block">
                    Efficient insulation, appliances and heating/cooling systems reduce your electricity consumption.
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#E5ECE6] text-[#254D3A] flex items-center justify-center shrink-0 mt-0.5">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#254D3A] block">Reduce Emissions</span>
                  <span className="text-xs text-[#5D6B60] leading-snug block">
                    A greener home helps lower your carbon footprint and supports a cleaner environment.
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#E5ECE6] text-[#254D3A] flex items-center justify-center shrink-0 mt-0.5">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#254D3A] block">Increase Home Value</span>
                  <span className="text-xs text-[#5D6B60] leading-snug block">
                    Energy-efficient homes are more valuable and future-ready.
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#E5ECE6] text-[#254D3A] flex items-center justify-center shrink-0 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#254D3A] block">Access to Green Incentives</span>
                  <span className="text-xs text-[#5D6B60] leading-snug block">
                    You may be eligible for special loan rates, subsidies or tax benefits for green home improvements.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Green Home Loan Calculator, Loan Details & Photo Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left: Green Home Loan Calculator Form */}
        <div className="lg:col-span-5 bg-[#FAF7F0] rounded-2xl p-6 border border-[#E7DFCF] shadow-xs">
          <div className="flex items-center space-x-2.5 mb-1.5">
            <Calculator className="w-5 h-5 text-[#254D3A]" />
            <h3 className="text-base font-bold text-[#254D3A] font-serif">Green Home Loan Calculator</h3>
          </div>
          <p className="text-xs text-[#667568] mb-5">
            Enter the details below to estimate your loan and monthly payment.
          </p>

          <form onSubmit={handleCalculate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#445247] mb-1">
                Type of Improvement
              </label>
              <select
                value={improvementType}
                onChange={(e) => setImprovementType(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-[#D5C9B5] rounded-xl text-[#343A35] focus:outline-none focus:border-[#254D3A]"
              >
                <option value="Comprehensive Energy Efficiency">Comprehensive Energy Efficiency Upgrade</option>
                <option value="BEE 5-Star Heat Pump & AC Upgrade">BEE 5-Star Heat Pump &amp; Inverter AC Upgrade</option>
                <option value="Roof & Wall Thermal Insulation">Roof &amp; Wall High-R Thermal Insulation</option>
                <option value="Double-Glazed Low-E Windows">Double-Glazed Low-E Window Replacement</option>
                <option value="Solar Water Heating System">High-Performance Solar Water Heating System</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#445247] mb-1">
                  Estimated Project Cost (₹)
                </label>
                <input
                  type="number"
                  value={projectCost}
                  onChange={(e) => setProjectCost(Number(e.target.value))}
                  placeholder="Enter estimated cost"
                  className="w-full text-xs p-2.5 bg-white border border-[#D5C9B5] rounded-xl text-[#343A35] focus:outline-none focus:border-[#254D3A]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#445247] mb-1">
                  Loan Tenure (years)
                </label>
                <select
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-white border border-[#D5C9B5] rounded-xl text-[#343A35] focus:outline-none focus:border-[#254D3A]"
                >
                  <option value={1}>1 Year</option>
                  <option value={3}>3 Years</option>
                  <option value={5}>5 Years</option>
                  <option value={7}>7 Years</option>
                  <option value={10}>10 Years</option>
                  <option value={15}>15 Years</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#445247] mb-1">
                Down Payment (₹)
              </label>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                placeholder="Enter down payment amount"
                className="w-full text-xs p-2.5 bg-white border border-[#D5C9B5] rounded-xl text-[#343A35] focus:outline-none focus:border-[#254D3A]"
              />
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-lg bg-[#FDEEED] text-[#A6281E] text-xs flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#254D3A] hover:bg-[#1C3E2E] text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-colors shadow-sm"
            >
              <span>{loading ? 'Calculating...' : 'Calculate Loan'}</span>
              <span>&rarr;</span>
            </button>
          </form>
        </div>

        {/* Middle: Estimated Loan Details */}
        <div className="lg:col-span-4 bg-[#FAF7F0] rounded-2xl p-6 border border-[#E7DFCF] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2.5 mb-5">
              <FileText className="w-5 h-5 text-[#254D3A]" />
              <h3 className="text-base font-bold text-[#254D3A] font-serif">Estimated Loan Details</h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#EAE3D4]">
                <span className="text-[#657467] font-medium">Loan Amount</span>
                <span className="font-bold text-sm text-[#254D3A]">{formatINR(loanDetails.loanAmount)}</span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-[#EAE3D4]">
                <span className="text-[#657467] font-medium">Monthly EMI (approx.)</span>
                <span className="font-bold text-sm text-[#254D3A]">{formatINR(loanDetails.monthlyEmi)}</span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-[#EAE3D4]">
                <span className="text-[#657467] font-medium">Total Interest (approx.)</span>
                <span className="font-bold text-sm text-[#254D3A]">{formatINR(loanDetails.totalInterest)}</span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-[#EAE3D4]">
                <span className="text-[#657467] font-medium">Total Payment (approx.)</span>
                <span className="font-bold text-sm text-[#254D3A]">{formatINR(loanDetails.totalRepayment)}</span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-[#F0ECE1] text-[11px] text-[#69796C] leading-relaxed border border-[#E2D9C7] flex items-start space-x-2">
              <div className="w-3.5 h-3.5 rounded-full bg-[#254D3A] text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                i
              </div>
              <span>The calculation is an estimate. Exact amount may vary based on bank terms, interest rates and eligibility.</span>
            </div>
          </div>

          <div className="mt-5">
            {appliedSuccess ? (
              <div className="p-3 bg-[#EAF2EB] text-[#254D3A] rounded-xl text-xs font-semibold flex items-center space-x-2 border border-[#C6DAC9]">
                <CheckCircle2 className="w-4 h-4 text-[#254D3A]" />
                <span>Pre-application inquiry logged with your branch!</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleApplyInterest}
                className="w-full py-2.5 px-4 bg-[#749272] hover:bg-[#254D3A] text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
              >
                Submit Pre-Application Inquiry
              </button>
            )}
          </div>
        </div>

        {/* Right: Visual Artwork Card with Quote */}
        <div className="lg:col-span-3 rounded-2xl overflow-hidden bg-gradient-to-b from-[#2B4E3C] to-[#1C3627] text-white p-6 flex flex-col justify-between shadow-md relative min-h-[300px]">
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />

          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center mb-4">
              <Home className="w-6 h-6 text-[#99C5A8]" />
            </div>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-[#A2C8AF]">
              Sustainable Living
            </span>
          </div>

          <div className="relative z-10 pt-10">
            <div className="w-8 h-0.5 bg-[#75A583] mb-3" />
            <h4 className="text-xl font-serif italic text-[#F6F2E8] leading-snug">
              “A greener home today, a healthier and brighter tomorrow.”
            </h4>
            <span className="text-[10px] text-[#A2C8AF] mt-2 block">G.I.F.T. Eco Living Program</span>
          </div>
        </div>
      </div>
    </div>
  );
};
