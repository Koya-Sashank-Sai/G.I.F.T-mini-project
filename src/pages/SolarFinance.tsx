import React, { useState, useEffect } from 'react';
import { Calculator, FileText, CheckCircle2, Sun, Leaf, TrendingUp, Award, ShieldAlert, Sparkles, BatteryCharging } from 'lucide-react';
import { ComparisonBarChart } from '../components/ComparisonBarChart';
import { formatINR } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

export const SolarFinance: React.FC = () => {
  const { user } = useAuth();
  const customerId = user?.id || 'C10234';

  // Calculator inputs (matching exact defaults in reference image 9)
  const [systemSizeKw, setSystemSizeKw] = useState<number>(3);
  const [installationCost, setInstallationCost] = useState<number>(300000);
  const [tenureYears, setTenureYears] = useState<number>(10);
  const [downPayment, setDownPayment] = useState<number>(60000);

  // Calculation output states (exact reference values)
  const [loanDetails, setLoanDetails] = useState<{
    loanAmount: number;
    monthlyEmi: number;
    totalInterest: number;
    totalRepayment: number;
    generationKwh: number;
    monthlyBillReduction: number;
    annualSavings: number;
    paybackYears: number | null;
  }>({
    loanAmount: 240000,
    monthlyEmi: 2836,
    totalInterest: 99520,
    totalRepayment: 339520,
    generationKwh: 4380,
    monthlyBillReduction: 8333,
    annualSavings: 100000,
    paybackYears: 3.0
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
        productType: 'Solar Finance',
        status: 'Viewed',
        details: 'Customer viewed Solar Finance generation comparison and net metering options'
      })
    }).catch(console.warn);
  }, [customerId]);

  const handleCalculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/calculate/solar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemSizeKw,
          installationCost,
          downPayment,
          loanTenureYears: tenureYears,
          interestRateAnnual: 7.2
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
        totalRepayment: data.totalRepayment,
        generationKwh: data.solarDetails?.estimatedAnnualGenerationKwh || Math.round(systemSizeKw * 4 * 365),
        monthlyBillReduction: data.solarDetails?.estimatedMonthlyBillReduction || 8333,
        annualSavings: data.solarDetails?.estimatedAnnualSavings || 100000,
        paybackYears: data.solarDetails?.estimatedPaybackYears || 3.0
      });

      // Record 'In Progress' engagement
      fetch('/api/engagement/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          productType: 'Solar Finance',
          status: 'In Progress',
          details: `Calculated Solar installation for ${systemSizeKw} kW (Loan: ₹ ${data.loanAmount.toLocaleString('en-IN')})`
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
          productType: 'Solar Finance',
          status: 'Completed',
          details: `Customer submitted pre-application inquiry for ${systemSizeKw} kW Rooftop Solar (Loan: ₹ ${loanDetails.loanAmount.toLocaleString('en-IN')})`
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
            SOLAR FINANCE
          </span>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#254D3A] font-serif tracking-tight">
            Generate Your Own Electricity, Save More
          </h1>
          <p className="text-sm text-[#5B6A5D] mt-2 leading-relaxed">
            Explore solar panel installation with easy and flexible financing options, and reduce your electricity bills.
          </p>
        </div>

        {/* Right side banner badge */}
        <div className="relative z-10 flex items-center justify-end">
          <div className="hidden lg:flex items-center space-x-3 bg-white/75 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-[#DFD6C3] shadow-xs">
            <Sun className="w-5 h-5 text-[#254D3A]" />
            <div className="text-xs">
              <span className="font-bold text-[#254D3A] block">Clean Energy Transition</span>
              <span className="text-[#6D7D70]">7.20% p.a. • PM Surya Ghar Eligible</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Comparison Bar Graph & AI Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left: Annual Electricity Cost Comparison */}
        <div className="lg:col-span-7">
          <ComparisonBarChart
            title="Annual Electricity Cost Comparison"
            tooltipText="Based on your actual electricity spending of ₹ 56,000 trailing 12 months, compared to rooftop grid-tied solar generation."
            currentLabel="Current Electricity"
            currentSublabel="(Without Solar)"
            currentAmount={132000}
            projectedLabel="With Solar Panels"
            projectedSublabel="(Estimated)"
            projectedAmount={32000}
            savingsAmount={100000}
            savingsPercent={76}
            savingsDescription="lower electricity cost with solar"
            maxScale={180000}
          />
        </div>

        {/* Right: Why Consider Solar Finance? */}
        <div className="lg:col-span-5 bg-[#FAF7F0] rounded-2xl p-6 border border-[#E7DFCF] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <Leaf className="w-5 h-5 text-[#254D3A]" />
              <h3 className="text-base font-bold text-[#254D3A] font-serif">
                Why Consider Solar Finance?
              </h3>
            </div>
            <p className="text-xs text-[#667568] leading-relaxed mb-4">
              Based on your electricity spending and home profile, installing solar panels can help you save money and reduce your environmental impact.
            </p>

            <div className="space-y-3.5">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#E5ECE6] text-[#254D3A] flex items-center justify-center shrink-0 mt-0.5">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#254D3A] block">Lower Electricity Bills</span>
                  <span className="text-xs text-[#5D6B60] leading-snug block">
                    Generate your own electricity and reduce reliance on the grid.
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#E5ECE6] text-[#254D3A] flex items-center justify-center shrink-0 mt-0.5">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#254D3A] block">Reduce Carbon Footprint</span>
                  <span className="text-xs text-[#5D6B60] leading-snug block">
                    Use clean, renewable energy and contribute to a greener future.
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#E5ECE6] text-[#254D3A] flex items-center justify-center shrink-0 mt-0.5">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#254D3A] block">Increase Property Value</span>
                  <span className="text-xs text-[#5D6B60] leading-snug block">
                    Homes with solar panels are more energy-efficient and attractive in the market.
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#E5ECE6] text-[#254D3A] flex items-center justify-center shrink-0 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#254D3A] block">Incentives &amp; Benefits</span>
                  <span className="text-xs text-[#5D6B60] leading-snug block">
                    You may be eligible for government subsidies and tax benefits for solar installations.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Solar Installation Calculator, Loan Details & Photo Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left: Solar Installation Calculator Form */}
        <div className="lg:col-span-5 bg-[#FAF7F0] rounded-2xl p-6 border border-[#E7DFCF] shadow-xs">
          <div className="flex items-center space-x-2.5 mb-1.5">
            <Calculator className="w-5 h-5 text-[#254D3A]" />
            <h3 className="text-base font-bold text-[#254D3A] font-serif">Solar Installation Calculator</h3>
          </div>
          <p className="text-xs text-[#667568] mb-5">
            Enter the details below to estimate your loan and savings.
          </p>

          <form onSubmit={handleCalculate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#445247] mb-1">
                System Size (kW)
              </label>
              <select
                value={systemSizeKw}
                onChange={(e) => setSystemSizeKw(Number(e.target.value))}
                className="w-full text-xs p-2.5 bg-white border border-[#D5C9B5] rounded-xl text-[#343A35] focus:outline-none focus:border-[#254D3A]"
              >
                <option value={1}>1 kW (Small apartment / lights &amp; fans)</option>
                <option value={2}>2 kW (1 BHK / standard consumption)</option>
                <option value={3}>3 kW (2-3 BHK / AC &amp; refrigerator)</option>
                <option value={5}>5 kW (Villa / multiple air conditioners)</option>
                <option value={10}>10 kW (Commercial / heavy residential)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#445247] mb-1">
                  Estimated Installation Cost (₹)
                </label>
                <input
                  type="number"
                  value={installationCost}
                  onChange={(e) => setInstallationCost(Number(e.target.value))}
                  placeholder="300000"
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
                placeholder="60000"
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
              <span>{loading ? 'Calculating...' : 'Calculate'}</span>
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
                <span className="text-[#657467] font-medium">Total Repayment (approx.)</span>
                <span className="font-bold text-sm text-[#254D3A]">{formatINR(loanDetails.totalRepayment)}</span>
              </div>
            </div>

            {/* Additional Solar Generation & Savings Breakdown */}
            <div className="mt-4 pt-3 border-t border-[#DFD6C4] grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-white border border-[#E3DAC8]">
                <span className="text-[#717F72] block">Est. Generation</span>
                <span className="font-bold text-[#254D3A]">{loanDetails.generationKwh.toLocaleString('en-IN')} kWh/yr</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-[#E3DAC8]">
                <span className="text-[#717F72] block">Est. Payback</span>
                <span className="font-bold text-[#254D3A]">~{loanDetails.paybackYears} Years</span>
              </div>
            </div>

            <div className="mt-3 p-3 rounded-xl bg-[#F0ECE1] text-[11px] text-[#69796C] leading-relaxed border border-[#E2D9C7] flex items-start space-x-2">
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
              <Sun className="w-6 h-6 text-[#F4CA64]" />
            </div>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-[#A2C8AF]">
              Solar Rooftop Power
            </span>
          </div>

          <div className="relative z-10 pt-10">
            <div className="w-8 h-0.5 bg-[#75A583] mb-3" />
            <h4 className="text-xl font-serif italic text-[#F6F2E8] leading-snug">
              “Power your home with the sun, and save for tomorrow.”
            </h4>
            <span className="text-[10px] text-[#A2C8AF] mt-2 block">G.I.F.T. Clean Solar Finance</span>
          </div>
        </div>
      </div>
    </div>
  );
};
