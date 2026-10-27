import React from 'react';
import { Home, Users, BarChart3, LogOut } from 'lucide-react';
import { useAuth, ActiveView } from '../context/AuthContext';
import { LeafLogoIcon, SidebarLeavesGraphic } from './LeafGraphic';

export const OfficerSidebar: React.FC = () => {
  const { activeView, setActiveView, logout } = useAuth();

  const navItems: Array<{
    id: ActiveView;
    label: string;
    icon: React.ReactNode;
  }> = [
    { id: 'officer-home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'officer-customers', label: 'Customers', icon: <Users className="w-5 h-5" /> },
    { id: 'officer-reports', label: 'Reports', icon: <BarChart3 className="w-5 h-5" /> }
  ];

  return (
    <aside className="w-64 bg-[#173829] text-white flex flex-col justify-between shrink-0 min-h-screen select-none shadow-xl z-20">
      <div>
        {/* Logo and Brand */}
        <div className="p-6 pb-5 flex items-center space-x-3.5 border-b border-[#244b38]">
          <LeafLogoIcon className="w-10 h-10 drop-shadow" />
          <div>
            <div className="text-2xl font-bold tracking-wider font-serif text-[#F6F2E8]">
              G.I.F.T.
            </div>
            <div className="text-[11px] text-[#A6C0AD] font-medium leading-tight tracking-wide">
              Green Insights &amp; Financial Transition
            </div>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="p-4 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-[#2E5841] text-[#FFFFFF] shadow-sm font-semibold'
                    : 'text-[#D0E0D4] hover:bg-[#204533] hover:text-white'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-[#A0BFAB]'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 pb-2">
            <div className="border-t border-[#264e3b]" />
          </div>

          {/* Logout */}
          <button
            onClick={() => logout()}
            className="w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl font-medium text-sm text-[#D0E0D4] hover:bg-[#204533] hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5 text-[#A0BFAB]" />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Bottom Botanical Element & Motto */}
      <div className="p-5 pt-0">
        <SidebarLeavesGraphic />
        <div className="text-xs text-[#BED2C4] leading-relaxed font-normal mt-2 border-t border-[#254b38] pt-3">
          Supporting greener choices, stronger communities.
          <div className="w-8 h-0.5 bg-[#4B795D] mt-2 rounded-full" />
        </div>
      </div>
    </aside>
  );
};
