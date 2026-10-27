import React, { useState, useEffect } from 'react';
import {
  Users,
  Eye,
  Rocket,
  CheckCircle2,
  Search,
  Calendar,
  Building,
  Download,
  Filter,
  ArrowUp,
  MoreHorizontal
} from 'lucide-react';
import { LeafLogoIcon } from '../components/LeafGraphic';
import { CustomerHistoryModal } from '../components/CustomerHistoryModal';
import { OfficerMetrics, EngagementRecord, EngagementStatus, ProductType } from '../types';

export const OfficerDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<OfficerMetrics>({
    totalCustomers: 1248,
    totalCustomersTrend: '+12% vs last month',
    viewedRecommendations: 842,
    viewedPercentage: 67,
    viewedTrend: '+8% vs last month',
    startedProduct: 516,
    startedPercentage: 41,
    startedTrend: '+6% vs last month',
    completedProduct: 228,
    completedPercentage: 18,
    completedTrend: '+5% vs last month'
  });

  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [search, setSearch] = useState<string>('');
  const [productType, setProductType] = useState<string>('All Products');
  const [status, setStatus] = useState<string>('All');
  const [branch, setBranch] = useState<string>('Guntur Branch');
  const [dateRange, setDateRange] = useState<string>('');

  // Selected customer for history modal
  const [selectedCustomer, setSelectedCustomer] = useState<{
    id: string;
    name: string;
    branch: string;
    events: any[];
  } | null>(null);

  useEffect(() => {
    fetchMetrics();
    fetchCustomers();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/officer/metrics');
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (err) {
      console.warn('Metrics load error:', err);
    }
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (productType) params.append('productType', productType);
      if (status) params.append('status', status);
      if (branch) params.append('branch', branch);

      const res = await fetch(`/api/officer/customers?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (err) {
      console.warn('Customer load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleViewCustomer = async (item: any) => {
    try {
      const res = await fetch(`/api/officer/customer/${item.customerId}/history`);
      if (res.ok) {
        const data = await res.json();
        setSelectedCustomer({
          id: item.customerId,
          name: item.customerName,
          branch: item.branch || 'Guntur Branch',
          events: data.events || []
        });
      } else {
        setSelectedCustomer({
          id: item.customerId,
          name: item.customerName,
          branch: item.branch || 'Guntur Branch',
          events: [
            {
              id: '1',
              product_type: item.productRecommended,
              status: item.status,
              timestamp: `${item.lastActivity} 10:00 AM`,
              details: `Customer status: ${item.status}`
            }
          ]
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExport = () => {
    const params = new URLSearchParams();
    if (productType) params.append('productType', productType);
    if (status) params.append('status', status);
    if (branch) params.append('branch', branch);
    window.location.href = `/api/officer/export?${params.toString()}`;
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'Completed':
        return 'bg-[#E3EFE5] text-[#254D3A] border border-[#BFDCB9]';
      case 'In Progress':
        return 'bg-[#FDF4E7] text-[#9A621E] border border-[#EED7B8]';
      case 'Viewed':
        return 'bg-[#E7EFF7] text-[#20557E] border border-[#BAD1E5]';
      default:
        return 'bg-[#EFECE3] text-[#717E73] border border-[#DDD6C7]';
    }
  };

  const getAvatarColor = (name: string) => {
    const charCode = name.charCodeAt(0) || 65;
    const colors = [
      'bg-[#C5D8C9] text-[#254D3A]',
      'bg-[#E7D6C1] text-[#755531]',
      'bg-[#C4D3E3] text-[#234C73]',
      'bg-[#D8C7D8] text-[#693A69]'
    ];
    return colors[charCode % colors.length];
  };

  return (
    <div className="p-8 space-y-7 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#FAF6ED] via-[#F3ECE0] to-[#E9DFCF] rounded-2xl p-7 border border-[#E3DAC7] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl lg:text-3xl font-bold text-[#254D3A] font-serif">
              Welcome, Branch Officer
            </h1>
            <LeafLogoIcon className="w-5 h-5 text-[#254D3A]" />
          </div>
          <p className="text-xs text-[#5C6B5E] mt-2 leading-relaxed">
            Monitor customer engagement with green finance recommendations and support their sustainable journey.
          </p>
        </div>

        <div className="relative z-10 text-right shrink-0 md:border-l md:border-[#DDD2BF] md:pl-8">
          <div className="w-10 h-0.5 bg-[#698870] mb-2 ml-auto" />
          <p className="text-xs text-[#4F6052] font-serif italic max-w-xs leading-snug">
            “Greener customers today, stronger communities tomorrow.”
          </p>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Customers */}
        <div className="bg-[#FAF7F0] rounded-2xl p-5 border border-[#E7DFCF] shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-[#E5EDE7] text-[#254D3A] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#667568] block">Total Customers</span>
              <div className="text-2xl font-extrabold text-[#254D3A] font-serif">
                {metrics.totalCustomers.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-1 text-[11px] font-semibold text-[#254D3A]">
            <ArrowUp className="w-3.5 h-3.5" />
            <span>{metrics.totalCustomersTrend}</span>
          </div>
        </div>

        {/* Card 2: Viewed Recommendations */}
        <div className="bg-[#FAF7F0] rounded-2xl p-5 border border-[#E7DFCF] shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-[#E5ECE6] text-[#366848] flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#667568] block">Viewed Recommendations</span>
              <div className="text-2xl font-extrabold text-[#254D3A] font-serif">
                {metrics.viewedRecommendations} <span className="text-sm font-normal text-[#667568]">({metrics.viewedPercentage}%)</span>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-1 text-[11px] font-semibold text-[#254D3A]">
            <ArrowUp className="w-3.5 h-3.5" />
            <span>{metrics.viewedTrend}</span>
          </div>
        </div>

        {/* Card 3: Started a Product */}
        <div className="bg-[#FAF7F0] rounded-2xl p-5 border border-[#E7DFCF] shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-[#F7EFE2] text-[#9E6C2D] flex items-center justify-center">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#667568] block">Started a Product</span>
              <div className="text-2xl font-extrabold text-[#254D3A] font-serif">
                {metrics.startedProduct} <span className="text-sm font-normal text-[#667568]">({metrics.startedPercentage}%)</span>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-1 text-[11px] font-semibold text-[#254D3A]">
            <ArrowUp className="w-3.5 h-3.5" />
            <span>{metrics.startedTrend}</span>
          </div>
        </div>

        {/* Card 4: Completed a Product */}
        <div className="bg-[#FAF7F0] rounded-2xl p-5 border border-[#E7DFCF] shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-[#E4EFE6] text-[#254D3A] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#667568] block">Completed a Product</span>
              <div className="text-2xl font-extrabold text-[#254D3A] font-serif">
                {metrics.completedProduct} <span className="text-sm font-normal text-[#667568]">({metrics.completedPercentage}%)</span>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-1 text-[11px] font-semibold text-[#254D3A]">
            <ArrowUp className="w-3.5 h-3.5" />
            <span>{metrics.completedTrend}</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <form onSubmit={handleApplyFilters} className="bg-[#FAF7F0] p-4 rounded-2xl border border-[#E7DFCF] shadow-xs flex flex-wrap items-center gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-[#8C988D] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-[#D5C9B5] rounded-xl text-[#343A35] placeholder-[#8F9B90] focus:outline-none focus:border-[#254D3A]"
          />
        </div>

        {/* Product Type Filter */}
        <div className="w-40">
          <select
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            className="w-full py-2 px-3 bg-white border border-[#D5C9B5] rounded-xl text-[#343A35] focus:outline-none focus:border-[#254D3A]"
          >
            <option value="All Products">All Products</option>
            <option value="EV Finance">EV Finance</option>
            <option value="Green Home Loan">Green Home Loan</option>
            <option value="Solar Finance">Solar Finance</option>
            <option value="Go Paperless">Go Paperless</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-36">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full py-2 px-3 bg-white border border-[#D5C9B5] rounded-xl text-[#343A35] focus:outline-none focus:border-[#254D3A]"
          >
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Viewed">Viewed</option>
            <option value="Not Started">Not Started</option>
          </select>
        </div>

        {/* Date Range */}
        <div className="w-44 relative">
          <Calendar className="w-3.5 h-3.5 text-[#8C988D] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Select date range"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-white border border-[#D5C9B5] rounded-xl text-[#343A35] placeholder-[#8F9B90] focus:outline-none focus:border-[#254D3A]"
          />
        </div>

        {/* Branch */}
        <div className="w-40">
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full py-2 px-3 bg-white border border-[#D5C9B5] rounded-xl text-[#343A35] focus:outline-none focus:border-[#254D3A]"
          >
            <option value="Guntur Branch">Guntur Branch</option>
            <option value="Vijayawada Branch">Vijayawada Branch</option>
            <option value="Hyderabad Main">Hyderabad Main</option>
            <option value="Bangalore Branch">Bangalore Branch</option>
            <option value="All Branches">All Branches</option>
          </select>
        </div>

        {/* Apply Button */}
        <button
          type="submit"
          className="px-5 py-2 bg-[#254D3A] hover:bg-[#1C3E2E] text-white font-semibold rounded-xl transition-colors shadow-xs"
        >
          Apply
        </button>
      </form>

      {/* Customer Engagement Details Table */}
      <div className="bg-[#FAF7F0] rounded-2xl border border-[#E7DFCF] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E7DFCF] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-[#254D3A]" />
            <h3 className="text-base font-bold text-[#254D3A] font-serif">
              Customer Engagement Details
            </h3>
          </div>

          <button
            onClick={handleExport}
            className="px-3.5 py-1.5 bg-white border border-[#D5C9B5] hover:bg-[#F2ECE0] text-[#254D3A] text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EFE9DC] text-[#4F5E52] uppercase font-bold text-[10px] tracking-wider border-b border-[#E0D7C4]">
              <tr>
                <th className="py-3.5 px-4 w-14">S.No.</th>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Customer ID</th>
                <th className="py-3.5 px-4">Product Recommended</th>
                <th className="py-3.5 px-4">Date Recommended</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Activity</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D4]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#6E7E71]">
                    Loading customer engagement records...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#6E7E71]">
                    No engagement records found matching the active filters.
                  </td>
                </tr>
              ) : (
                customers.map((c, idx) => (
                  <tr key={c.id || idx} className="hover:bg-[#F2ECE0] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#5B6A5E]">{c.sNo || idx + 1}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2.5">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] ${getAvatarColor(
                            c.customerName
                          )}`}
                        >
                          {c.customerName.charAt(0)}
                        </div>
                        <span className="font-bold text-[#254D3A]">{c.customerName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#5B6A5E] font-medium">{c.customerId}</td>
                    <td className="py-3.5 px-4 font-medium text-[#343A35]">{c.productRecommended}</td>
                    <td className="py-3.5 px-4 text-[#667568]">{c.dateRecommended}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${getStatusBadge(
                          c.status
                        )}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#667568]">{c.lastActivity || '-'}</td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => handleViewCustomer(c)}
                          className="px-3 py-1 bg-white hover:bg-[#254D3A] text-[#254D3A] hover:text-white border border-[#C5BBA7] rounded-lg font-semibold transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleViewCustomer(c)}
                          className="p-1 text-[#8C988D] hover:text-[#343A35]"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3 Analytics Charts Row (matching exact reference 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Engagement by Product */}
        <div className="bg-[#FAF7F0] rounded-2xl p-6 border border-[#E7DFCF] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <LeafLogoIcon className="w-4 h-4 text-[#254D3A]" />
              <h4 className="text-sm font-bold text-[#254D3A] font-serif">Engagement by Product</h4>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="space-y-3 pt-2">
              {[
                { name: 'EV Finance', count: 320, max: 400, color: '#3A634E' },
                { name: 'Green Home Loan', count: 280, max: 400, color: '#D4BE9B' },
                { name: 'Solar Finance', count: 210, max: 400, color: '#688E72' },
                { name: 'Go Paperless', count: 180, max: 400, color: '#90B4A0' }
              ].map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-[#343A35]">{item.name}</span>
                    <span className="font-bold text-[#254D3A]">{item.count}</span>
                  </div>
                  <div className="w-full bg-[#E5DDCF] h-4 rounded-md overflow-hidden">
                    <div
                      style={{ width: `${(item.count / item.max) * 100}%`, backgroundColor: item.color }}
                      className="h-full rounded-md transition-all duration-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E8DFC9] text-[10px] text-[#717F72]">
            Total Engagements across branches: 990
          </div>
        </div>

        {/* Chart 2: Customer Status Overview */}
        <div className="bg-[#FAF7F0] rounded-2xl p-6 border border-[#E7DFCF] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Users className="w-4 h-4 text-[#254D3A]" />
              <h4 className="text-sm font-bold text-[#254D3A] font-serif">Customer Status Overview</h4>
            </div>

            {/* Donut Chart representation */}
            <div className="flex items-center justify-center my-3 relative">
              <div className="w-36 h-36 rounded-full border-12 border-[#254D3A] flex items-center justify-center relative shadow-xs">
                <div className="text-center">
                  <span className="text-xl font-bold font-serif text-[#254D3A] block">1,248</span>
                  <span className="text-[10px] text-[#717F72] block">Customers</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-2">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-[#254D3A]" />
                <span className="text-[#343A35]">Completed: <strong>228 (18%)</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-[#5C8A69]" />
                <span className="text-[#343A35]">In Progress: <strong>288 (23%)</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-[#D4BE9B]" />
                <span className="text-[#343A35]">Viewed: <strong>326 (26%)</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-[#E5DDCF]" />
                <span className="text-[#343A35]">Not Started: <strong>406 (33%)</strong></span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E8DFC9] text-[10px] text-[#717F72]">
            Data synced from live PostgreSQL / SQLite storage
          </div>
        </div>

        {/* Chart 3: Engagement Trend */}
        <div className="bg-[#FAF7F0] rounded-2xl p-6 border border-[#E7DFCF] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Rocket className="w-4 h-4 text-[#254D3A]" />
              <h4 className="text-sm font-bold text-[#254D3A] font-serif">Engagement Trend</h4>
            </div>

            {/* Multi-line Trend SVG */}
            <div className="h-40 relative flex items-end justify-between px-2 pt-4">
              <svg viewBox="0 0 300 120" className="w-full h-full overflow-visible">
                {/* Gridlines */}
                <line x1="0" y1="30" x2="300" y2="30" stroke="#E6DDCF" strokeDasharray="3 3" />
                <line x1="0" y1="70" x2="300" y2="70" stroke="#E6DDCF" strokeDasharray="3 3" />
                <line x1="0" y1="110" x2="300" y2="110" stroke="#E6DDCF" />

                {/* Line 1: Viewed (Green-gray) */}
                <polyline
                  points="20,80 100,55 180,35 270,15"
                  fill="none"
                  stroke="#254D3A"
                  strokeWidth="2.5"
                />
                <circle cx="270" cy="15" r="3.5" fill="#254D3A" />

                {/* Line 2: In Progress (Sage) */}
                <polyline
                  points="20,95 100,75 180,50 270,30"
                  fill="none"
                  stroke="#5C8A69"
                  strokeWidth="2.5"
                />
                <circle cx="270" cy="30" r="3.5" fill="#5C8A69" />

                {/* Line 3: Completed (Gold/Tan) */}
                <polyline
                  points="20,110 100,95 180,75 270,55"
                  fill="none"
                  stroke="#C29D6E"
                  strokeWidth="2.5"
                />
                <circle cx="270" cy="55" r="3.5" fill="#C29D6E" />
              </svg>
            </div>

            {/* X-axis months */}
            <div className="flex justify-between px-3 text-[11px] font-semibold text-[#667568] mt-1">
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-between text-[11px] text-[#556458] mt-4 pt-2 border-t border-[#E8DFC9]">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#254D3A]" />
                <span>Viewed</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5C8A69]" />
                <span>In Progress</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C29D6E]" />
                <span>Completed</span>
              </span>
            </div>
          </div>
          <div className="mt-3 text-[10px] text-[#717F72]">
            Q3-Q4 2026 Customer Transition Velocity
          </div>
        </div>
      </div>

      {/* Customer History Modal */}
      {selectedCustomer && (
        <CustomerHistoryModal
          customerId={selectedCustomer.id}
          customerName={selectedCustomer.name}
          branch={selectedCustomer.branch}
          events={selectedCustomer.events}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
};
