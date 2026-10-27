import React from 'react';
import { Info, ArrowDown } from 'lucide-react';
import { formatINR } from '../utils/formatters';

interface ComparisonBarChartProps {
  title: string;
  tooltipText?: string;
  currentLabel: string;
  currentSublabel?: string;
  currentAmount: number;
  projectedLabel: string;
  projectedSublabel?: string;
  projectedAmount: number;
  savingsAmount: number;
  savingsPercent: number;
  savingsDescription: string;
  maxScale?: number; // e.g. 200000
}

export const ComparisonBarChart: React.FC<ComparisonBarChartProps> = ({
  title,
  tooltipText = 'Calculated based on customer spending baseline and standard verified green-efficiency models.',
  currentLabel,
  currentSublabel,
  currentAmount,
  projectedLabel,
  projectedSublabel,
  projectedAmount,
  savingsAmount,
  savingsPercent,
  savingsDescription,
  maxScale = 200000
}) => {
  const currentHeightPct = Math.min(100, Math.max(12, (currentAmount / maxScale) * 100));
  const projectedHeightPct = Math.min(100, Math.max(12, (projectedAmount / maxScale) * 100));

  const yTicks = [
    maxScale,
    Math.round(maxScale * 0.75),
    Math.round(maxScale * 0.5),
    Math.round(maxScale * 0.25),
    0
  ];

  return (
    <div className="bg-[#FAF7F0] rounded-2xl p-6 border border-[#E7DFCF] shadow-xs">
      {/* Title & Info */}
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-5 h-5 rounded bg-[#254D3A] text-white flex items-center justify-center">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-[#254D3A] font-serif">{title}</h3>
        <div className="relative group cursor-pointer">
          <Info className="w-4 h-4 text-[#8C988D] hover:text-[#254D3A] transition-colors" />
          <div className="absolute left-6 top-0 hidden group-hover:block bg-[#254D3A] text-[#F6F2E8] text-xs p-2.5 rounded-lg w-64 shadow-xl z-30">
            {tooltipText}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Left: Custom SVG / CSS Bar Chart */}
        <div className="md:col-span-8 flex flex-col justify-between pt-2">
          {/* Chart Plotting Area */}
          <div className="relative h-56 flex">
            {/* Y Axis Labels */}
            <div className="w-20 flex flex-col justify-between text-[11px] text-[#7E887E] font-medium pr-3 text-right select-none pb-5">
              {yTicks.map((val) => (
                <div key={val}>{formatINR(val)}</div>
              ))}
            </div>

            {/* Gridlines and Bars Container */}
            <div className="relative flex-1 h-full border-b border-[#D8CDBB]">
              {/* Horizontal Gridlines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-5">
                {yTicks.map((val) => (
                  <div key={val} className="w-full border-b border-[#E9E1D2]" />
                ))}
              </div>

              {/* Bars Row */}
              <div className="absolute inset-x-0 bottom-0 top-0 flex justify-around items-end px-6 pb-0">
                {/* Bar 1: Current Spending */}
                <div className="w-24 flex flex-col items-center group">
                  <div className="text-xs font-bold text-[#343A35] mb-1.5 transition-transform group-hover:-translate-y-0.5">
                    {formatINR(currentAmount)}
                  </div>
                  <div
                    style={{ height: `${currentHeightPct * 0.75}%` }}
                    className="w-20 bg-[#D4BE9B] rounded-t-sm shadow-xs transition-all duration-500 ease-out group-hover:brightness-95"
                  />
                </div>

                {/* Bar 2: Projected Green Spending */}
                <div className="w-24 flex flex-col items-center group">
                  <div className="text-xs font-bold text-[#254D3A] mb-1.5 transition-transform group-hover:-translate-y-0.5">
                    {formatINR(projectedAmount)}
                  </div>
                  <div
                    style={{ height: `${projectedHeightPct * 0.75}%` }}
                    className="w-20 bg-[#749272] rounded-t-sm shadow-xs transition-all duration-500 ease-out group-hover:brightness-95"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* X Axis Labels */}
          <div className="flex pl-20 justify-around text-center mt-3 text-xs text-[#526054]">
            <div className="w-36">
              <span className="font-semibold text-[#343A35]">{currentLabel}</span>
              {currentSublabel && (
                <span className="block text-[11px] text-[#7B8B7D]">{currentSublabel}</span>
              )}
            </div>
            <div className="w-36">
              <span className="font-semibold text-[#254D3A]">{projectedLabel}</span>
              {projectedSublabel && (
                <span className="block text-[11px] text-[#7B8B7D]">{projectedSublabel}</span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Savings Highlight Card */}
        <div className="md:col-span-4 bg-[#F0ECE1] rounded-xl p-5 border border-[#E0D7C4] flex flex-col justify-center items-start shadow-xs">
          <span className="text-xs text-[#6F7C70] font-medium tracking-wide">You could save</span>
          <div className="text-2xl lg:text-3xl font-extrabold text-[#254D3A] tracking-tight mt-1 font-serif">
            {formatINR(savingsAmount)}
          </div>
          <span className="text-xs text-[#6F7C70] font-medium mt-0.5">per year</span>

          <div className="mt-4 pt-3 border-t border-[#DFD5C2] w-full">
            <div className="flex items-center space-x-1.5 text-xl font-bold text-[#254D3A]">
              <ArrowDown className="w-5 h-5 text-[#254D3A] stroke-[3]" />
              <span>{savingsPercent}%</span>
            </div>
            <p className="text-xs text-[#5C6A5E] mt-1 font-medium leading-snug">
              {savingsDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
