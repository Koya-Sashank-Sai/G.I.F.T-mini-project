import React, { useState } from 'react';
import { Landmark, User, MapPin, Building, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, ShieldAlert, BarChart3, Users, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LeafLogoIcon } from '../components/LeafGraphic';

export const OfficerLogin: React.FC = () => {
  const { loginOfficer, setActiveView } = useAuth();

  const [bankName, setBankName] = useState<string>('Lloyds Bank');
  const [employeeName, setEmployeeName] = useState<string>('R. Srinivas');
  const [branch, setBranch] = useState<string>('Guntur Branch');
  const [location, setLocation] = useState<string>('Guntur');
  const [employeeId, setEmployeeId] = useState<string>('EMP-8842');
  const [password, setPassword] = useState<string>('Officer@123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const res = await loginOfficer(employeeId, password, bankName, branch);
    if (!res.success) {
      setErrorMessage(res.error || 'Officer sign in failed. Please verify credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F2E8] flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden border border-[#E5DEC9] grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">
        {/* Left Side: Officer Branding & Mission */}
        <div className="lg:col-span-5 bg-[#FAF7F0] p-8 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E8DEC9]">
          <div>
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-8">
              <LeafLogoIcon className="w-10 h-10" />
              <div>
                <div className="text-2xl font-bold tracking-wider font-serif text-[#254D3A]">
                  G.I.F.T.
                </div>
                <div className="text-[11px] text-[#69796C] font-medium leading-tight">
                  Trusted | Responsible | Sustainable
                </div>
              </div>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-[#254D3A] font-serif leading-tight">
              Enabling Sustainable Finance Together
            </h1>
            <p className="text-sm text-[#5C6B5F] mt-3 leading-relaxed">
              Empowering people, businesses and communities towards a greener future.
            </p>

            {/* 4 Feature Items */}
            <div className="mt-8 space-y-3.5">
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-[#E5EDE7] text-[#254D3A] flex items-center justify-center shrink-0">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[#343A35]">
                  Monitor customer engagement
                </span>
              </div>

              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-[#E5EDE7] text-[#254D3A] flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[#343A35]">
                  Support greener financial decisions
                </span>
              </div>

              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-[#E5EDE7] text-[#254D3A] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[#343A35]">
                  Drive sustainable growth
                </span>
              </div>

              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-[#E5EDE7] text-[#254D3A] flex items-center justify-center shrink-0">
                  <LeafLogoIcon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[#343A35]">
                  Be part of a brighter tomorrow
                </span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[#E8DEC9]">
            <p className="text-xs italic font-serif text-[#445548]">
              “Sustainable progress is a shared responsibility.”
            </p>
          </div>
        </div>

        {/* Right Side: Officer Access Form */}
        <div className="lg:col-span-7 bg-[#FAF7F0] p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-[#254D3A] font-serif">Officer Access</h2>
                <p className="text-xs text-[#6E7E71] mt-1">
                  Sign in to access the G.I.F.T. officer dashboard.
                </p>
              </div>
              <div className="text-right text-xs">
                <span className="text-[#6E7E71] block">Not an officer?</span>
                <button
                  type="button"
                  onClick={() => setActiveView('customer-login')}
                  className="font-bold text-[#254D3A] hover:underline flex items-center justify-end space-x-1"
                >
                  <span>Customer Login</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Bank Name */}
              <div>
                <label className="block text-[11px] font-semibold text-[#445247] mb-1">
                  Bank Name
                </label>
                <div className="relative">
                  <Landmark className="w-4 h-4 text-[#8C988D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-[#D5C9B5] rounded-xl text-[#343A35] focus:outline-none focus:border-[#254D3A]"
                  >
                    <option value="Lloyds Bank">Lloyds Bank</option>
                    <option value="State Bank of India">State Bank of India</option>
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                  </select>
                </div>
              </div>

              {/* Employee Name */}
              <div>
                <label className="block text-[11px] font-semibold text-[#445247] mb-1">
                  Employee Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C988D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-[#D5C9B5] rounded-xl text-[#343A35] focus:outline-none focus:border-[#254D3A]"
                  />
                </div>
              </div>

              {/* Branch & Location Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#445247] mb-1">
                    Branch
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#8C988D] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      placeholder="Branch name"
                      className="w-full pl-8 pr-3 py-2.5 text-xs bg-white border border-[#D5C9B5] rounded-xl text-[#343A35] focus:outline-none focus:border-[#254D3A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#445247] mb-1">
                    Location
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-[#8C988D] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City"
                      className="w-full pl-8 pr-3 py-2.5 text-xs bg-white border border-[#D5C9B5] rounded-xl text-[#343A35] focus:outline-none focus:border-[#254D3A]"
                    />
                  </div>
                </div>
              </div>

              {/* Employee ID */}
              <div>
                <label className="block text-[11px] font-semibold text-[#445247] mb-1">
                  Employee ID
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C988D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="Enter your employee ID"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-[#D5C9B5] rounded-xl text-[#343A35] focus:outline-none focus:border-[#254D3A]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-semibold text-[#445247] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C988D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 text-xs bg-white border border-[#D5C9B5] rounded-xl text-[#343A35] focus:outline-none focus:border-[#254D3A]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C988D]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center space-x-2 cursor-pointer text-[#5C6B5F]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#C5BBA7] text-[#254D3A] focus:ring-0"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('Demo prototype: Use default seeded officer credentials EMP-8842 / Officer@123.')}
                  className="text-[#254D3A] font-semibold hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 bg-[#FDEEED] text-[#A6281E] text-xs rounded-xl flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Sign In CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#254D3A] hover:bg-[#1B3F2E] text-white font-semibold rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors shadow-sm"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Authorized Access Only Banner */}
              <div className="mt-4 p-3.5 rounded-xl bg-[#EAF1EB] border border-[#CDE0D0] text-[#254D3A] text-xs flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-[#254D3A] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-xs block">Authorized Access Only</span>
                  <span className="text-[11px] text-[#4A6451] leading-relaxed block mt-0.5">
                    This system is for bank employees and authorized officers of G.I.F.T. All access is logged and monitored for security.
                  </span>
                </div>
              </div>

              {/* Fast Fill Demo Officer */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setBankName('Lloyds Bank');
                    setBranch('Guntur Branch');
                    setEmployeeName('R. Srinivas');
                    setEmployeeId('EMP-8842');
                    setPassword('Officer@123');
                  }}
                  className="text-[11px] text-[#6E7E71] hover:text-[#254D3A] underline"
                >
                  Fill Demo Officer: EMP-8842 (Guntur Branch)
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
