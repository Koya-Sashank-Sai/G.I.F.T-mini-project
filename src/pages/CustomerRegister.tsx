import React, { useState } from 'react';
import { User, Mail, Phone, Landmark, MapPin, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LeafLogoIcon } from '../components/LeafGraphic';

export const CustomerRegister: React.FC = () => {
  const { registerCustomer, setActiveView } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [fullName, setFullName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('98450 12345');
  const [email, setEmail] = useState<string>('');
  const [bankName, setBankName] = useState<string>('Lloyds Bank');
  const [branch, setBranch] = useState<string>('Guntur Branch');
  const [location, setLocation] = useState<string>('Guntur');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Simulated OTP state (Step 2)
  const [otp, setOtp] = useState<string>('482910');
  const [otpSent, setOtpSent] = useState<boolean>(true);

  const [createdInfo, setCreatedInfo] = useState<{ customerId: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName || !phoneNumber || !email) {
      setErrorMessage('Please fill in all personal information fields');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setStep(2); // Proceed to Phone Verification
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setErrorMessage('Please enter the 6-digit verification code');
      return;
    }
    setStep(3); // Link Bank Account
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setErrorMessage('');

    const res = await registerCustomer({
      fullName,
      phone: `+91 ${phoneNumber}`,
      email,
      bankName,
      branch,
      location,
      password
    });

    if (res.success) {
      setCreatedInfo({ customerId: res.customerId || 'C19842' });
      setStep(4);
    } else {
      setErrorMessage(res.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F6F2E8] flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden border border-[#E5DEC9] grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">
        {/* Left Side: Brand Story */}
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
                  Secure | Transparent | Sustainable
                </div>
              </div>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-[#254D3A] font-serif leading-tight">
              Your Finances for a Greener Tomorrow
            </h1>
            <p className="text-sm text-[#5C6B5F] mt-3 leading-relaxed">
              Make smarter choices. Access green opportunities. Build a more sustainable future.
            </p>

            {/* 4 Feature Items */}
            <div className="mt-8 space-y-3.5">
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-[#E5EDE7] text-[#254D3A] flex items-center justify-center shrink-0">
                  <LeafLogoIcon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[#343A35]">
                  Understand your spending
                </span>
              </div>

              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-[#E5EDE7] text-[#254D3A] flex items-center justify-center shrink-0">
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
                <div className="w-8 h-8 rounded-full bg-[#E5EDE7] text-[#254D3A] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-[#343A35]">
                  Make your home more energy efficient
                </span>
              </div>

              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-[#E5EDE7] text-[#254D3A] flex items-center justify-center shrink-0">
                  <LeafLogoIcon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[#343A35]">
                  Be part of a sustainable future
                </span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[#E8DEC9]">
            <p className="text-xs italic font-serif text-[#445548]">
              “Sustainable finances today, a brighter tomorrow.”
            </p>
          </div>
        </div>

        {/* Right Side: Step-by-Step Registration Form */}
        <div className="lg:col-span-7 bg-[#FAF7F0] p-8 lg:p-12 flex flex-col justify-between">
          <div>
            {/* Header with Sign In Link */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#254D3A] font-serif">
                  Create Your G.I.F.T. Account
                </h2>
                <p className="text-xs text-[#6E7E71] mt-1">
                  Sign up to start your green finance journey.
                </p>
              </div>
              <div className="text-right text-xs">
                <span className="text-[#6E7E71] block">Already have an account?</span>
                <button
                  type="button"
                  onClick={() => setActiveView('customer-login')}
                  className="font-bold text-[#254D3A] hover:underline"
                >
                  Sign in
                </button>
              </div>
            </div>

            {/* 4-Step Progress Indicator (matches image_4bf81d0e.png) */}
            <div className="mb-7 flex items-center justify-between relative px-2">
              <div className="absolute left-8 right-8 top-4 h-0.5 bg-[#D8CEBA] -z-0" />
              {[
                { num: 1, label: 'Personal Details' },
                { num: 2, label: 'Verify Phone' },
                { num: 3, label: 'Link Bank Account' },
                { num: 4, label: 'Create Account' }
              ].map((s) => {
                const isActive = step === s.num;
                const isPassed = step > s.num;
                return (
                  <div key={s.num} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        isActive
                          ? 'bg-[#254D3A] text-white shadow-xs'
                          : isPassed
                          ? 'bg-[#5A8768] text-white'
                          : 'bg-[#E3D9C7] text-[#6F7D71]'
                      }`}
                    >
                      {s.num}
                    </div>
                    <span className="text-[10px] text-[#556458] font-medium mt-1.5 whitespace-nowrap">
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* STEP 1: Personal Details, Branch, and Password */}
            {step === 1 && (
              <form onSubmit={handleNextStep1} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Personal Information Column */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-[#254D3A] uppercase tracking-wider">
                      Personal Information
                    </h3>
                    <p className="text-[11px] text-[#6E7E71]">Enter your basic details to create an account.</p>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#445247] mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#8C988D] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter your full name"
                          required
                          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#D5C9B5] rounded-xl text-[#343A35] focus:outline-none focus:border-[#254D3A]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#445247] mb-1">
                        Phone Number
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-2.5 rounded-l-xl border border-r-0 border-[#D5C9B5] bg-[#EFE9DC] text-[#445247] text-xs font-semibold">
                          +91
                        </span>
                        <input
                          type="text"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="Enter your phone number"
                          required
                          className="w-full pl-3 pr-3 py-2 text-xs bg-white border border-[#D5C9B5] rounded-r-xl text-[#343A35] focus:outline-none focus:border-[#254D3A]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#445247] mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#8C988D] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          required
                          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#D5C9B5] rounded-xl text-[#343A35] focus:outline-none focus:border-[#254D3A]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Branch Details Column */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-[#254D3A] uppercase tracking-wider">
                      Branch Details
                    </h3>
                    <p className="text-[11px] text-[#6E7E71]">Enter your bank branch information.</p>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#445247] mb-1">
                        Bank Name
                      </label>
                      <div className="relative">
                        <Landmark className="w-4 h-4 text-[#8C988D] absolute left-3 top-1/2 -translate-y-1/2" />
                        <select
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#D5C9B5] rounded-xl text-[#343A35] focus:outline-none focus:border-[#254D3A]"
                        >
                          <option value="Lloyds Bank">Lloyds Bank</option>
                          <option value="State Bank of India">State Bank of India</option>
                          <option value="HDFC Bank">HDFC Bank</option>
                          <option value="ICICI Bank">ICICI Bank</option>
                        </select>
                      </div>
                    </div>

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
                          placeholder="Enter your branch name"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#D5C9B5] rounded-xl text-[#343A35] focus:outline-none focus:border-[#254D3A]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#445247] mb-1">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-[#8C988D] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Enter your city / location"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#D5C9B5] rounded-xl text-[#343A35] focus:outline-none focus:border-[#254D3A]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Set Your Password Section */}
                <div className="pt-2 border-t border-[#E8DEC9]">
                  <h3 className="text-xs font-bold text-[#254D3A] uppercase tracking-wider mb-1">
                    Set Your Password
                  </h3>
                  <p className="text-[11px] text-[#6E7E71] mb-3">Create a strong password to secure your account.</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#445247] mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#8C988D] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create a password"
                          required
                          className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-[#D5C9B5] rounded-xl text-[#343A35] focus:outline-none focus:border-[#254D3A]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C988D]"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#445247] mb-1">
                        Re-enter Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#8C988D] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm your password"
                          required
                          className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-[#D5C9B5] rounded-xl text-[#343A35] focus:outline-none focus:border-[#254D3A]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Banner */}
                <div className="p-3 rounded-xl bg-[#EAF1EB] border border-[#CDE0D0] text-[#254D3A] text-xs flex items-center space-x-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#254D3A] shrink-0" />
                  <span className="font-medium text-[11px]">
                    Your information is secure. We use industry-standard security measures to protect your data.
                  </span>
                </div>

                {errorMessage && (
                  <div className="p-2.5 bg-[#FDEEED] text-[#A6281E] text-xs rounded-xl flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="py-3 px-6 bg-[#254D3A] hover:bg-[#1B3F2E] text-white font-semibold rounded-xl text-xs flex items-center space-x-2 transition-colors shadow-sm"
                  >
                    <span>Next: Verify Phone</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Phone Verification (Simulated OTP Flow) */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-5 max-w-md mx-auto text-center py-6">
                <div className="w-12 h-12 rounded-full bg-[#E4EFE6] text-[#254D3A] flex items-center justify-center mx-auto mb-2">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#254D3A] font-serif">Verify Phone Number</h3>
                <p className="text-xs text-[#5D6D60]">
                  We sent a 6-digit verification code to <strong>+91 {phoneNumber}</strong>.
                </p>

                <div className="p-3 bg-[#FAF4E8] border border-[#E7D6BD] rounded-xl text-xs text-[#7B5E28]">
                  <span className="font-bold">Prototype Demo Notice:</span> Use simulated OTP code: <strong>{otp}</strong>
                </div>

                <div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-48 text-center tracking-widest text-xl font-bold py-2.5 border-2 border-[#254D3A] rounded-xl bg-white text-[#254D3A] focus:outline-none"
                  />
                </div>

                {errorMessage && (
                  <div className="p-2.5 bg-[#FDEEED] text-[#A6281E] text-xs rounded-xl">
                    {errorMessage}
                  </div>
                )}

                <div className="flex justify-center space-x-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 border border-[#D5C9B5] text-[#445247] rounded-xl text-xs font-semibold hover:bg-white"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#254D3A] hover:bg-[#1B3F2E] text-white rounded-xl text-xs font-semibold flex items-center space-x-2"
                  >
                    <span>Verify &amp; Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Link Bank Account */}
            {step === 3 && (
              <div className="space-y-5 max-w-md mx-auto py-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#E4EFE6] text-[#254D3A] flex items-center justify-center mx-auto mb-2">
                    <Landmark className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#254D3A] font-serif">Link Bank Account</h3>
                  <p className="text-xs text-[#5D6D60]">
                    Connect your registered {bankName} savings account to enable personalized green spending analytics.
                  </p>
                </div>

                <div className="p-4 bg-white border border-[#D8CEBA] rounded-2xl shadow-xs space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#6E7E71]">Bank</span>
                    <span className="font-bold text-[#254D3A]">{bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6E7E71]">Branch</span>
                    <span className="font-bold text-[#254D3A]">{branch}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6E7E71]">Account Reference</span>
                    <span className="font-mono font-bold text-[#254D3A]">9876 **** 1012</span>
                  </div>
                </div>

                <div className="p-3 bg-[#EAF1EB] rounded-xl text-[11px] text-[#254D3A] leading-relaxed">
                  ✓ Bank read-only aggregation authorized for green categorisation. We never ask for or store bank PINs or login credentials.
                </div>

                <div className="flex justify-center space-x-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2.5 border border-[#D5C9B5] text-[#445247] rounded-xl text-xs font-semibold hover:bg-white"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={loading}
                    className="px-6 py-2.5 bg-[#254D3A] hover:bg-[#1B3F2E] text-white rounded-xl text-xs font-semibold flex items-center space-x-2"
                  >
                    <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Registration Success */}
            {step === 4 && (
              <div className="text-center py-8 space-y-4 max-w-md mx-auto">
                <div className="w-14 h-14 rounded-full bg-[#E5F2E8] text-[#254D3A] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-[#254D3A]" />
                </div>
                <h3 className="text-2xl font-bold text-[#254D3A] font-serif">Welcome to G.I.F.T.!</h3>
                <p className="text-xs text-[#5D6D60]">
                  Your account has been created successfully with personalized spending insights.
                </p>

                <div className="p-4 bg-[#F0ECE1] rounded-2xl border border-[#DFD6C3] text-xs text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#6E7E71]">Customer ID:</span>
                    <span className="font-bold text-[#254D3A] font-mono">{createdInfo?.customerId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6E7E71]">Registered Name:</span>
                    <span className="font-bold text-[#254D3A]">{fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6E7E71]">Branch:</span>
                    <span className="font-bold text-[#254D3A]">{branch}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveView('customer-home')}
                  className="w-full py-3 bg-[#254D3A] hover:bg-[#1B3F2E] text-white font-semibold rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors shadow-sm mt-4"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
