import React, { useState } from 'react';
import { BarChart3, Download, FileSpreadsheet, ShieldCheck, TreePine, Zap, Car, Home } from 'lucide-react';
import { LeafLogoIcon } from '../components/LeafGraphic';

export const OfficerReports: React.FC = () => {
  const [reportType, setReportType] = useState<string>('Quarterly Green Impact');

  return (
    <div className="p-8 space-y-7 max-w-7xl mx-auto">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#FAF6ED] via-[#F3ECE0] to-[#E9DFCF] rounded-2xl p-7 border border-[#E3DAC7] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl lg:text-3xl font-bold text-[#254D3A] font-serif">
              Green Finance Portfolio Reports
            </h1>
            <BarChart3 className="w-5 h-5 text-[#254D3A]" />
          </div>
          <p className="text-xs text-[#5C6B5E] mt-2 leading-relaxed">
            Consolidated environmental transition analytics, customer adoption velocity, and regulatory ESG disclosures.
          </p>
        </div>

        <button
          onClick={() => {
            window.location.href = '/api/officer/export';
          }}
          className="px-4 py-2.5 bg-[#254D3A] hover:bg-[#1B3F2E] text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-colors shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export Master Dataset (CSV)</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FAF7F0] rounded-2xl p-6 border border-[#E7DFCF] shadow-xs">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#E4EFE6] text-[#254D3A] flex items-center justify-center">
              <TreePine className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#254D3A]">Annual CO2 Offset Potential</span>
              <span className="text-[11px] text-[#69796C] block">From completed customer transitions</span>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#254D3A] font-serif">~1,840 Metric Tonnes</div>
          <p className="text-xs text-[#566658] mt-2">
            Equivalent to planting 82,000 mature trees annually across South Indian urban centers.
          </p>
        </div>

        <div className="bg-[#FAF7F0] rounded-2xl p-6 border border-[#E7DFCF] shadow-xs">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#EFE8DD] text-[#8C6B3E] flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#254D3A]">Clean Energy Mobilized</span>
              <span className="text-[11px] text-[#69796C] block">Solar &amp; efficiency project loans</span>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#254D3A] font-serif">₹ 14.82 Crores</div>
          <p className="text-xs text-[#566658] mt-2">
            Disbursed across 228 completed customer installations with 0% default rate.
          </p>
        </div>

        <div className="bg-[#FAF7F0] rounded-2xl p-6 border border-[#E7DFCF] shadow-xs">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#E7F0EB] text-[#254D3A] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#254D3A]">ESG Compliance Score</span>
              <span className="text-[11px] text-[#69796C] block">Independent audit standard</span>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#254D3A] font-serif">96.4 / 100</div>
          <p className="text-xs text-[#566658] mt-2">
            Meets RBI Green Deposit framework and sovereign green bond allocation criteria.
          </p>
        </div>
      </div>

      {/* Product-Specific Portfolios */}
      <div className="bg-[#FAF7F0] rounded-2xl p-7 border border-[#E7DFCF] shadow-xs space-y-5">
        <h3 className="text-base font-bold text-[#254D3A] font-serif">
          Branch Portfolio Distribution &amp; Customer Transition Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-xl border border-[#E0D7C4]">
            <div className="flex items-center space-x-2 text-[#254D3A] font-bold mb-2">
              <Car className="w-4 h-4" />
              <span>EV Finance Portfolio</span>
            </div>
            <div className="text-2xl font-bold text-[#254D3A] font-serif">320 Engaged</div>
            <p className="text-xs text-[#607063] mt-1 leading-relaxed">
              Avg. loan size: ₹ 11.4 Lakhs • Avg. tenure: 5 years • 7.8% concessional interest.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E0D7C4]">
            <div className="flex items-center space-x-2 text-[#254D3A] font-bold mb-2">
              <Home className="w-4 h-4" />
              <span>Green Home Improvements</span>
            </div>
            <div className="text-2xl font-bold text-[#254D3A] font-serif">280 Engaged</div>
            <p className="text-xs text-[#607063] mt-1 leading-relaxed">
              Avg. project cost: ₹ 3.8 Lakhs • 40% reduction in customer household energy footprint.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E0D7C4]">
            <div className="flex items-center space-x-2 text-[#254D3A] font-bold mb-2">
              <Zap className="w-4 h-4" />
              <span>Solar Rooftop Facilities</span>
            </div>
            <div className="text-2xl font-bold text-[#254D3A] font-serif">210 Engaged</div>
            <p className="text-xs text-[#607063] mt-1 leading-relaxed">
              Avg. capacity: 3.5 kW • Payback timeframe: 3.0 to 3.8 years • PM Surya Ghar aligned.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
