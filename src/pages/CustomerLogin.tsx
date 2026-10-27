import React, { useState } from 'react';
import { User, Landmark, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LeafLogoIcon } from '../components/LeafGraphic';

export const CustomerLogin: React.FC = () => {
  const { loginCustomer, setActiveView } = useAuth();

  const [customerId, setCustomerId] = useState<string>('C10234');
  const [linkedAccount, setLinkedAccount] = useState<string>('987654321012');
  const [password, setPassword] = useState<string>('Password@123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const res = await loginCustomer(customerId, password, linkedAccount);
    if (!res.success) {
      setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F2E8] flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden border border-[#E5DEC9] grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Side: Brand & Visual Story */}
        <div className="lg:col-span-5 bg-[#FAF7F0] p-8 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E8DEC9] relative">
          <div>
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-10">
              <LeafLogoIcon className="w-10 h-10" />
              <div>
                <div className="text-2xl font-bold tracking-wider font-serif text-[#254D3A]">
                  G.I.F.T.
                </div>
                <div className="text-[11px] text-[#69796C] font-medium leading-tight">
                  Green Insights &amp; Financial Transition
                </div>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-3xl lg:text-4xl font-bold text-[#254D3A] font-serif leading-tight">
              A Greener Tomorrow, Together.
            </h1>
            <p className="text-sm text-[#5C6B5F] mt-3 leading-relaxed">
              Sustainable choices. Smarter finances. A cleaner, brighter future.
            </p>

            {/* Feature Bullets */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-9 h-9 rounded-full bg-[#E5EDE7] text-[#254D3A] flex items-center justify-center shrink-0">
                  <LeafLogoIcon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-[#343A35]">
                  Understand your spending
                </span>
              </div>

              <div className="flex items-center space-x-3.5">
                <div className="w-9 h-9 rounded-full bg-[#E5EDE7] text-[#254D3A] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="8" rx="2" />
                    <circle cx="7" cy="19" r="2" />
                    <circle cx="17" cy="19" r="2" />
                    <path d="M5 11l2-5h10l2 5" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-[#343A35]">
                  Explore greener financing options
                </span>
              </div>

              <div className="flex items-center space-x-3.5">
                <div className="w-9 h-9 rounded-full bg-[#E5EDE7] text-[#254D3A] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-[#343A35]">
                  Build a more sustainable future
                </span>
              </div>
            </div>
          </div>

          {/* Quick links to Officer Login */}
          <div className="pt-8 border-t border-[#E8DEC9] flex items-center justify-between text-xs text-[#6E7E71]">
            <span>Bank employee?</span>
            <button
              onClick={() => setActiveView('officer-login')}
              className="font-semibold text-[#254D3A] hover:underline flex items-center space-x-1"
            >
              <span>Officer Access</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Side: Customer Login Card */}
        <div className="lg:col-span-7 bg-[#FAF7F0] p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-2xl font-bold text-[#254D3A] font-serif">Customer Access</h2>
            <p className="text-xs text-[#6E7E71] mt-1 mb-5">
              Sign in to access your G.I.F.T. dashboard or create a new account.
            </p>

            {/* Sign In / Sign Up Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-[#EFE9DC] p-1 rounded-xl mb-5">
              <button
                type="button"
                className="py-2.5 text-xs font-bold rounded-lg bg-[#254D3A] text-white shadow-xs"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setActiveView('customer-register')}
                className="py-2.5 text-xs font-semibold rounded-lg text-[#556458] hover:text-[#254D3A] hover:bg-[#E7DFCF] transition-colors"
              >
                Sign Up
              </button>
            </div>

            {/* Security Banner */}
            <div className="mb-5 p-3 rounded-xl bg-[#EAF1EB] border border-[#CDE0D0] text-[#254D3A] text-xs flex items-center space-x-2.5">
              <ShieldCheck className="w-4 h-4 text-[#254D3A] shrink-0" />
              <span className="font-medium text-[11px]">
                Your information is secure and used only for your G.I.F.T. account.
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#254D3A] font-serif">Sign in to your account</h3>
                <p className="text-[11px] text-[#6E7E71] mb-3">
                  Enter your customer ID, linked bank account number and password.
                </p>
              </div>

              {/* Customer ID */}
              <div>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C988D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    placeholder="Customer ID"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-[#D5C9B5] rounded-xl text-[#343A35] placeholder-[#909E92] focus:outline-none focus:border-[#254D3A]"
                  />
                </div>
              </div>

              {/* Linked Bank Account */}
              <div>
                <div className="relative">
                  <Landmark className="w-4 h-4 text-[#8C988D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={linkedAccount}
                    onChange={(e) => setLinkedAccount(e.target.value)}
                    placeholder="Linked Bank Account Number"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-[#D5C9B5] rounded-xl text-[#343A35] placeholder-[#909E92] focus:outline-none focus:border-[#254D3A]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C988D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 text-xs bg-white border border-[#D5C9B5] rounded-xl text-[#343A35] placeholder-[#909E92] focus:outline-none focus:border-[#254D3A]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C988D] hover:text-[#343A35]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs">
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
                  onClick={() => alert('Demo prototype: Use default seeded customer password "Password@123".')}
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
                <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#DDD3C2]" />
                </div>
                <span className="relative px-3 bg-[#FAF7F0] text-[11px] text-[#8C988D] uppercase font-bold">
                  Or
                </span>
              </div>

              {/* New to G.I.F.T.? Create Account Box */}
              <div className="p-4 rounded-xl border border-[#DFD6C4] bg-white flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-[#254D3A] block">New to G.I.F.T.?</span>
                  <span className="text-[11px] text-[#69796C]">Create your account to start your green finance journey.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveView('customer-register')}
                  className="shrink-0 px-3 py-2 border border-[#254D3A] text-[#254D3A] hover:bg-[#254D3A] hover:text-white rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all"
                >
                  <span>Create Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Fast Fill Demo Button for Reviewers */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setCustomerId('C10234');
                    setLinkedAccount('987654321012');
                    setPassword('Password@123');
                  }}
                  className="w-full text-center text-[11px] text-[#6E7E71] hover:text-[#254D3A] underline"
                >
                  Fill Demo Customer: Arun Kumar (C10234)
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
