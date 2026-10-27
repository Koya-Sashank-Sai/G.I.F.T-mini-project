import React, { useState } from 'react';
import { Search, Bell, ChevronDown, User, ShieldCheck, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SharedHeaderProps {
  searchPlaceholder?: string;
  onSearchChange?: (val: string) => void;
  searchValue?: string;
}

export const SharedHeader: React.FC<SharedHeaderProps> = ({
  searchPlaceholder,
  onSearchChange,
  searchValue = ''
}) => {
  const { user, role, switchUserQuick, logout, setActiveView } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const defaultPlaceholder =
    role === 'officer'
      ? 'Search customers by name, ID, or account number...'
      : 'Search for insights, products or support...';

  const isCustomer = role === 'customer';

  return (
    <header className="h-18 bg-[#F6F2E8] border-b border-[#E5DECD] px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Search Bar */}
      <div className="relative w-96 max-w-full">
        <Search className="w-4 h-4 text-[#8C988D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          placeholder={searchPlaceholder || defaultPlaceholder}
          className="w-full pl-10 pr-4 py-2 text-xs bg-[#EDE7D9] border border-transparent rounded-lg text-[#343A35] placeholder-[#8F9B90] focus:outline-none focus:border-[#254D3A] focus:bg-white transition-all shadow-inner"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-5">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#4B5E4F] hover:bg-[#EAE3D4] transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="w-2.5 h-2.5 bg-[#D33F2E] rounded-full absolute top-2 right-2 border-2 border-[#F6F2E8]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#D9CDB9] p-4 z-40 text-xs">
              <div className="font-semibold text-sm text-[#254D3A] mb-2 flex items-center justify-between">
                <span>Notifications</span>
                <span className="text-[10px] bg-[#EAF0EB] text-[#254D3A] px-2 py-0.5 rounded-full font-bold">New</span>
              </div>
              <div className="space-y-2.5">
                <div className="p-2.5 bg-[#FAF8F3] rounded-lg border border-[#EDE5D6]">
                  <p className="font-semibold text-[#343A35]">New Green Finance Policy</p>
                  <p className="text-[#6A786C] mt-0.5">Special concessional interest rates for residential rooftop solar updated for Q4 2026.</p>
                  <span className="text-[10px] text-[#9BA89D] mt-1 block">2 hours ago</span>
                </div>
                <div className="p-2.5 bg-[#FAF8F3] rounded-lg border border-[#EDE5D6]">
                  <p className="font-semibold text-[#343A35]">Spending Analysis Ready</p>
                  <p className="text-[#6A786C] mt-0.5">Annual fuel and utility transition insights refreshed based on latest bank statement.</p>
                  <span className="text-[10px] text-[#9BA89D] mt-1 block">Yesterday</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-3 text-left p-1.5 pr-2.5 rounded-xl hover:bg-[#EAE3D4] transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-[#B8C8BC] text-[#1E4331] font-semibold flex items-center justify-center text-sm border border-[#A6BAAA] shadow-xs">
              {isCustomer ? 'A' : 'O'}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-[#254D3A] leading-tight">
                {isCustomer ? (user?.name || 'Arun Kumar') : 'Officer'}
              </div>
              <div className="text-[10px] text-[#6E7D70] font-medium leading-tight">
                {isCustomer
                  ? `Customer ID: ${user?.id || 'C10234'}`
                  : `${user?.bankName || 'Lloyds Bank'} | ${user?.branch || 'Guntur Branch'}`}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-[#6E7D70]" />
          </button>

          {/* User Profile Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#D9CDB9] py-2 z-40 text-xs">
              <div className="px-4 py-2.5 border-b border-[#EAE3D4]">
                <p className="text-xs font-bold text-[#254D3A]">{user?.name || (isCustomer ? 'Arun Kumar' : 'R. Srinivas')}</p>
                <p className="text-[11px] text-[#6E7D70]">{user?.email || (isCustomer ? 'arun.kumar@example.com' : 'srinivas.r@lloydsbank.example')}</p>
                <div className="mt-1 inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E7EFE9] text-[#254D3A]">
                  <CheckCircle2 className="w-3 h-3 text-[#254D3A]" />
                  <span>{isCustomer ? 'Verified Customer' : 'Authorized Officer'}</span>
                </div>
              </div>

              {/* Quick Role Switcher for seamless evaluation */}
              <div className="px-3 py-2 bg-[#FBF9F5] border-b border-[#EAE3D4]">
                <p className="text-[10px] uppercase font-bold text-[#8C988D] tracking-wider mb-1.5">
                  Role Quick Switcher
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={async () => {
                      setDropdownOpen(false);
                      await switchUserQuick('customer');
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-center font-medium transition-colors ${
                      isCustomer
                        ? 'bg-[#254D3A] text-white font-semibold'
                        : 'bg-white border border-[#D5C9B4] text-[#343A35] hover:bg-[#EAE3D4]'
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    onClick={async () => {
                      setDropdownOpen(false);
                      await switchUserQuick('officer');
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-center font-medium transition-colors ${
                      !isCustomer
                        ? 'bg-[#254D3A] text-white font-semibold'
                        : 'bg-white border border-[#D5C9B4] text-[#343A35] hover:bg-[#EAE3D4]'
                    }`}
                  >
                    Officer
                  </button>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    if (isCustomer) {
                      setActiveView('customer-login');
                    } else {
                      setActiveView('officer-login');
                    }
                  }}
                  className="w-full px-4 py-2 text-left text-[#343A35] hover:bg-[#FAF7F0] flex items-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4 text-[#6A786C]" />
                  <span>Switch Account / Sign In</span>
                </button>
                <button
                  onClick={async () => {
                    setDropdownOpen(false);
                    await logout();
                  }}
                  className="w-full px-4 py-2 text-left text-[#A83226] hover:bg-[#FFF5F4] flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4 text-[#A83226]" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
