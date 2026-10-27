import React, { useState, useEffect } from 'react';
import { Calculator, FileText, CheckCircle2, Coins, Leaf, Building, PlugZap, ShieldAlert } from 'lucide-react';
import { ComparisonBarChart } from '../components/ComparisonBarChart';
import { formatINR } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

export const EVFinance: React.FC = () => {
  const { user } = useAuth();
  const customerId = user?.id || 'C10234';

  // Calculator form states
  const [evModel, setEvModel] = useState<string>('Tata Nexon EV Empowered');
  const [purchasePrice, setPurchasePrice] = useState<number>(1500000);
  const [tenureYears, setTenureYears] = useState<number>(5);
  const [downPayment, setDownPayment] = useState<number>(300000);

  // Calculation output states
  const [loanDetails, setLoanDetails] = useState<{
    loanAmount: number;
    monthlyEmi: number;
    totalInterest: number;
    totalRepayment: number;
  }>({
    loanAmount: 1200000,
    monthlyEmi: 24222,
    totalInterest: 253320,
    totalRepayment: 1453320
  });

  const [appliedSuccess, setAppliedSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Record 'Viewed' engagement on initial page view
  useEffect(() => {
    fetch('/api/engagement/record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId,
        productType: 'EV Finance',
        status: 'Viewed',
        details: 'Customer viewed EV Finance comparison and guidelines'
      })
    }).catch(console.warn);
  }, [customerId]);

  const handleCalculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/calculate/ev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purchasePrice,
          downPayment,
          loanTenureYears: tenureYears,
          interestRateAnnual: 7.8
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Calculation failed. Please check inputs.');
        setLoading(false);
        return;
      }

      setLoanDetails({
        loanAmount: data.loanAmount,
        monthlyEmi: data.monthlyEmi,
        totalInterest: data.totalInterest,
        totalRepayment: data.totalRepayment
      });

      // Record 'In Progress' engagement in backend
      fetch('/api/engagement/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          productType: 'EV Finance',
          status: 'In Progress',
          details: `Calculated EV loan for ₹ ${data.loanAmount.toLocaleString('en-IN')} (${tenureYears} yrs)`
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
          productType: 'EV Finance',
          status: 'Completed',
          details: `Customer submitted pre-application inquiry for ${evModel} (Loan: ₹ ${loanDetails.loanAmount.toLocaleString('en-IN')})`
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
            EV FINANCE
          </span>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#254D3A] font-serif tracking-tight">
            Drive Cleaner, Save Smarter
          </h1>
          <p className="text-sm text-[#5B6A5D] mt-2 leading-relaxed">
            Make the switch to electric vehicles with easy and flexible financing options, and contribute to a greener future.
          </p>
        </div>

        {/* Right side artistic vehicle & charger imagery styling */}
        <div className="relative z-10 flex items-center justify-end">
          <div className="hidden lg:flex items-center space-x-3 bg-white/75 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-[#DFD6C3] shadow-xs">
            <PlugZap className="w-5 h-5 text-[#254D3A]" />
            <div className="text-xs">
              <span className="font-bold text-[#254D3A] block">Green Auto Concession</span>
              <span className="text-[#6D7D70]">7.80% p.a. • Zero processing fee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Comparison Bar Graph & AI Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left: Petrol vs EV Spending Comparison */}
        <div className="lg:col-span-7">
          <ComparisonBarChart
            title="Your Estimated Annual Spending"
            tooltipText="Based on your actual petrol spending of ₹ 68,000 (trailing months) annualized at standard 23,000 km baseline."
            currentLabel="Current Vehicle"
            currentSublabel="(Petrol/Diesel)"
            currentAmount={168000}
            projectedLabel="Electric Vehicle"
            projectedSublabel="(EV)"
            projectedAmount={52000}
            savingsAmount={116000}
            savingsPercent={69}
            savingsDescription="lower running cost with an EV"
            maxScale={200000}
          />
        </div>

        {/* Right: Why Consider an Electric Vehicle? */}
        <div className="lg:col-span-5 bg-[#FAF7F0] rounded-2xl p-6 border border-[#E7DFCF] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <Leaf className="w-5 h-5 text-[#254D3A]" />
              <h3 className="text-base font-bold text-[#254D3A] font-serif">
                Why Consider an Electric Vehicle?
              </h3>
            </div>
            <p className="text-xs text-[#667568] leading-relaxed mb-4">
              Based on your current spending and vehicle usage, an electric vehicle can help you save money and reduce your environmental impact.
            </p>

            <div className="space-y-3.5">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#E5ECE6] text-[#254D3A] flex items-center justify-center shrink-0 mt-0.5">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#254D3A] block">Lower Running Costs</span>
                  <span className="text-xs text-[#5D6B60] leading-snug block">
                    Electricity is significantly cheaper than petrol or diesel for daily travel.
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
                    Switching to an EV can help you lower your carbon footprint.
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#E5ECE6] text-[#254D3A] flex items-center justify-center shrink-0 mt-0.5">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#254D3A] block">Government Incentives</span>
                  <span className="text-xs text-[#5D6B60] leading-snug block">
                    You may be eligible for subsidies and tax benefits.
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#E5ECE6] text-[#254D3A] flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#254D3A] block">Convenient Charging</span>
                  <span className="text-xs text-[#5D6B60] leading-snug block">
                    A growing network of charging stations makes EV ownership easier than ever.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: EV Loan Calculator, Loan Details & Photo Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left: EV Loan Calculator Form */}
        <div className="lg:col-span-5 bg-[#FAF7F0] rounded-2xl p-6 border border-[#E7DFCF] shadow-xs">
          <div className="flex items-center space-x-2.5 mb-1.5">
            <Calculator className="w-5 h-5 text-[#254D3A]" />
            <h3 className="text-base font-bold text-[#254D3A] font-serif">EV Loan Calculator</h3>
          </div>
          <p className="text-xs text-[#667568] mb-5">
            Enter the details below to estimate your loan and monthly payment.
          </p>

          <form onSubmit={handleCalculate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#445247] mb-1">
                EV Model (Optional)
              </label>
              <select
                value={evModel}
                onChange={(e) => setEvModel(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-[#D5C9B5] rounded-xl text-[#343A35] focus:outline-none focus:border-[#254D3A]"
              >
                <option value="Tata Nexon EV Empowered">Tata Nexon EV Empowered (Long Range)</option>
                <option value="MG ZS EV Excite">MG ZS EV Excite</option>
                <option value="Mahindra XUV400 EL">Mahindra XUV400 EL Pro</option>
                <option value="Hyundai Ioniq 5">Hyundai Ioniq 5</option>
                <option value="BYD Atto 3">BYD Atto 3</option>
                <option value="Other EV Model">Other EV Model</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#445247] mb-1">
                  EV Purchase Price (₹)
                </label>
                <input
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  placeholder="Enter vehicle cost"
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
                <span className="text-[#657467] font-medium">Monthly EMI</span>
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
          {/* Subtle vehicle charger graphics */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />

          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center mb-4">
              <PlugZap className="w-6 h-6 text-[#99C5A8]" />
            </div>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-[#A2C8AF]">
              Sustainable Drive
            </span>
          </div>

          <div className="relative z-10 pt-10">
            <div className="w-8 h-0.5 bg-[#75A583] mb-3" />
            <h4 className="text-xl font-serif italic text-[#F6F2E8] leading-snug">
              “A cleaner drive today, a healthier planet tomorrow.”
            </h4>
            <span className="text-[10px] text-[#A2C8AF] mt-2 block">G.I.F.T. Green Vehicle Initiative</span>
          </div>
        </div>
      </div>
    </div>
  );
};
