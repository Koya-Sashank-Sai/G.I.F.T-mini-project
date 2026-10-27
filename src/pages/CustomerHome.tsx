import React, { useEffect, useState } from 'react';
import { Fuel, Zap, Armchair, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getTimeGreeting, formatINR } from '../utils/formatters';
import { EvCarIllustration, EcoHomeIllustration, SolarPanelIllustration } from '../components/CardIllustrations';
import { LeafLogoIcon } from '../components/LeafGraphic';
import { CustomerSpendingSummary, Recommendation } from '../types';

export const CustomerHome: React.FC = () => {
  const { user, setActiveView } = useAuth();
  const [spending, setSpending] = useState<CustomerSpendingSummary | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const customerName = user?.name || 'Arun Kumar';

  useEffect(() => {
    async function fetchData() {
      try {
        const [spendRes, recRes] = await Promise.all([
          fetch('/api/customer/spending'),
          fetch('/api/customer/recommendations')
        ]);
        if (spendRes.ok) {
          const sData = await spendRes.json();
          setSpending(sData);
        }
        if (recRes.ok) {
          const rData = await recRes.json();
          setRecommendations(rData);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const petrol = spending?.categories?.find((c) => c.category.includes('Petrol')) || {
    percentage: 34,
    amount: 68000
  };
  const electricity = spending?.categories?.find((c) => c.category.includes('Electricity')) || {
    percentage: 28,
    amount: 56000
  };
  const appliances = spending?.categories?.find((c) => c.category.includes('Appliances')) || {
    percentage: 20,
    amount: 40000
  };

  return (
    <div className="p-8 space-y-7 max-w-7xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#FAF6ED] via-[#F4EDE0] to-[#EBE2D2] rounded-2xl p-8 border border-[#E4DAC7] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Soft landscape background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-35 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#8BAF96] via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-xl">
          <div className="flex items-center space-x-2.5">
            <h1 className="text-3xl lg:text-4xl font-bold text-[#254D3A] font-serif tracking-tight">
              {getTimeGreeting(customerName)}
            </h1>
            <span className="inline-block p-1 bg-[#E4EEE6] rounded-full text-[#254D3A]">
              <LeafLogoIcon className="w-6 h-6" />
            </span>
          </div>
          <p className="text-sm text-[#5B6A5D] mt-2.5 leading-relaxed font-normal">
            Here's a quick view of your spending and recommendations for a greener and more financially healthy future.
          </p>
        </div>

        {/* Right side banner quote & landscape artistic touch */}
        <div className="relative z-10 text-right shrink-0 md:border-l md:border-[#DDD2BF] md:pl-8">
          <div className="w-10 h-0.5 bg-[#698870] mb-2 ml-auto" />
          <p className="text-xs text-[#4F6052] font-serif italic max-w-xs leading-snug">
            “Smarter finances today, a greener tomorrow.”
          </p>
          <div className="mt-2 text-[10px] uppercase tracking-wider text-[#8A998C] font-semibold">
            Tracked Spending: {spending ? formatINR(spending.totalTrackedSpending) : '₹ 2,00,000'}
          </div>
        </div>
      </div>

      {/* 3 Spending Percentage Cards Immediately Below Greeting */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Petrol Spending */}
        <div className="bg-[#FAF7F0] rounded-2xl p-6 border border-[#E7DFCF] shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#F4E9D8] text-[#9A6D3B] flex items-center justify-center shadow-xs">
              <Fuel className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#667568] block">Petrol Spending</span>
              <span className="text-[11px] text-[#8C988D]">{formatINR(petrol.amount)} / yr</span>
            </div>
          </div>

          <div className="mt-5">
            <div className="text-4xl font-extrabold text-[#254D3A] font-serif tracking-tight">
              {petrol.percentage}%
            </div>

            {/* Progress indicator */}
            <div className="w-full bg-[#E5DDCF] h-2.5 rounded-full mt-3 overflow-hidden">
              <div
                style={{ width: `${petrol.percentage}%` }}
                className="bg-[#254D3A] h-full rounded-full transition-all duration-700 ease-out"
              />
            </div>
            <div className="text-xs text-[#717F73] mt-2 font-medium">
              of your total spending
            </div>
          </div>
        </div>

        {/* Card 2: Electricity Bill */}
        <div className="bg-[#FAF7F0] rounded-2xl p-6 border border-[#E7DFCF] shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#E4EFE6] text-[#3E7453] flex items-center justify-center shadow-xs">
              <Zap className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#667568] block">Electricity Bill</span>
              <span className="text-[11px] text-[#8C988D]">{formatINR(electricity.amount)} / yr</span>
            </div>
          </div>

          <div className="mt-5">
            <div className="text-4xl font-extrabold text-[#254D3A] font-serif tracking-tight">
              {electricity.percentage}%
            </div>

            {/* Progress indicator */}
            <div className="w-full bg-[#E5DDCF] h-2.5 rounded-full mt-3 overflow-hidden">
              <div
                style={{ width: `${electricity.percentage}%` }}
                className="bg-[#5B8868] h-full rounded-full transition-all duration-700 ease-out"
              />
            </div>
            <div className="text-xs text-[#717F73] mt-2 font-medium">
              of your total spending
            </div>
          </div>
        </div>

        {/* Card 3: Home Appliances & Furniture */}
        <div className="bg-[#FAF7F0] rounded-2xl p-6 border border-[#E7DFCF] shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#EFE9DF] text-[#836C52] flex items-center justify-center shadow-xs">
              <Armchair className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#667568] block">Home Appliances &amp; Furniture</span>
              <span className="text-[11px] text-[#8C988D]">{formatINR(appliances.amount)} / yr</span>
            </div>
          </div>

          <div className="mt-5">
            <div className="text-4xl font-extrabold text-[#254D3A] font-serif tracking-tight">
              {appliances.percentage}%
            </div>

            {/* Progress indicator */}
            <div className="w-full bg-[#E5DDCF] h-2.5 rounded-full mt-3 overflow-hidden">
              <div
                style={{ width: `${appliances.percentage}%` }}
                className="bg-[#A48F73] h-full rounded-full transition-all duration-700 ease-out"
              />
            </div>
            <div className="text-xs text-[#717F73] mt-2 font-medium">
              of your total spending
            </div>
          </div>
        </div>
      </div>

      {/* Green Insights Overview */}
      <div className="bg-[#FAF7F0] rounded-2xl p-7 border border-[#E7DFCF] shadow-xs">
        <div className="flex items-start space-x-3.5 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#E4EFE6] text-[#254D3A] flex items-center justify-center shrink-0">
            <LeafLogoIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#254D3A] font-serif">Green Insights Overview</h2>
            <p className="text-xs text-[#667568] mt-1 leading-relaxed">
              Based on your spending, here are some personalized recommendations to help you save money and reduce your environmental impact.
            </p>
          </div>
        </div>

        {/* 3 Dedicated Product Recommendation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recommendation 1: Consider EV Finance */}
          <div className="bg-white rounded-2xl p-5 border border-[#E8DFD0] flex flex-col justify-between hover:shadow-md transition-all group">
            <div>
              <EvCarIllustration className="h-36 mb-4" />
              <h3 className="text-base font-bold text-[#254D3A] font-serif group-hover:text-[#1B3F2E] transition-colors">
                Consider EV Finance
              </h3>
              <p className="text-xs text-[#607063] mt-2 leading-relaxed">
                Your petrol spending is high. Explore electric vehicles with lower running costs.
              </p>
              <div className="mt-3 inline-flex items-center text-[11px] font-semibold text-[#254D3A] bg-[#EDF4EE] px-2.5 py-1 rounded-md">
                <Sparkles className="w-3 h-3 mr-1 text-[#254D3A]" />
                <span>Save ~₹ 1,16,000 / year</span>
              </div>
            </div>

            <button
              onClick={() => setActiveView('ev-finance')}
              className="mt-6 w-full py-2.5 px-4 bg-[#E8F0EA] hover:bg-[#254D3A] text-[#254D3A] hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all duration-200"
            >
              <span>Explore EV Finance</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Recommendation 2: Explore Green Home Loan */}
          <div className="bg-white rounded-2xl p-5 border border-[#E8DFD0] flex flex-col justify-between hover:shadow-md transition-all group">
            <div>
              <EcoHomeIllustration className="h-36 mb-4" />
              <h3 className="text-base font-bold text-[#254D3A] font-serif group-hover:text-[#1B3F2E] transition-colors">
                Explore Green Home Loan
              </h3>
              <p className="text-xs text-[#607063] mt-2 leading-relaxed">
                Make your home more energy-efficient and reduce your electricity bills.
              </p>
              <div className="mt-3 inline-flex items-center text-[11px] font-semibold text-[#254D3A] bg-[#EDF4EE] px-2.5 py-1 rounded-md">
                <Sparkles className="w-3 h-3 mr-1 text-[#254D3A]" />
                <span>Save ~₹ 58,000 / year</span>
              </div>
            </div>

            <button
              onClick={() => setActiveView('green-home')}
              className="mt-6 w-full py-2.5 px-4 bg-[#E8F0EA] hover:bg-[#254D3A] text-[#254D3A] hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all duration-200"
            >
              <span>Explore Green Home Loan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Recommendation 3: Look into Solar Finance */}
          <div className="bg-white rounded-2xl p-5 border border-[#E8DFD0] flex flex-col justify-between hover:shadow-md transition-all group">
            <div>
              <SolarPanelIllustration className="h-36 mb-4" />
              <h3 className="text-base font-bold text-[#254D3A] font-serif group-hover:text-[#1B3F2E] transition-colors">
                Look into Solar Finance
              </h3>
              <p className="text-xs text-[#607063] mt-2 leading-relaxed">
                Your electricity spending is significant. Solar can help you save and cut emissions.
              </p>
              <div className="mt-3 inline-flex items-center text-[11px] font-semibold text-[#254D3A] bg-[#EDF4EE] px-2.5 py-1 rounded-md">
                <Sparkles className="w-3 h-3 mr-1 text-[#254D3A]" />
                <span>Save ~₹ 1,00,000 / year (76%)</span>
              </div>
            </div>

            <button
              onClick={() => setActiveView('solar-finance')}
              className="mt-6 w-full py-2.5 px-4 bg-[#E8F0EA] hover:bg-[#254D3A] text-[#254D3A] hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all duration-200"
            >
              <span>Explore Solar Finance</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
