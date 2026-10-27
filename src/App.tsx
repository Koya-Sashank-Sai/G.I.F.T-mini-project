import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CustomerSidebar } from './components/CustomerSidebar';
import { OfficerSidebar } from './components/OfficerSidebar';
import { SharedHeader } from './components/SharedHeader';

import { CustomerHome } from './pages/CustomerHome';
import { EVFinance } from './pages/EVFinance';
import { GreenHomeLoan } from './pages/GreenHomeLoan';
import { SolarFinance } from './pages/SolarFinance';
import { CustomerLogin } from './pages/CustomerLogin';
import { CustomerRegister } from './pages/CustomerRegister';
import { OfficerLogin } from './pages/OfficerLogin';
import { OfficerDashboard } from './pages/OfficerDashboard';
import { OfficerReports } from './pages/OfficerReports';

function MainAppContent() {
  const { activeView, role } = useAuth();

  // Authentication pages (full screen without sidebar)
  if (activeView === 'customer-login') {
    return <CustomerLogin />;
  }
  if (activeView === 'customer-register') {
    return <CustomerRegister />;
  }
  if (activeView === 'officer-login') {
    return <OfficerLogin />;
  }

  // Officer portal views
  const isOfficer = role === 'officer' || activeView.startsWith('officer-');
  if (isOfficer) {
    return (
      <div className="flex min-h-screen bg-[#F6F2E8]">
        <OfficerSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <SharedHeader />
          <main className="flex-1 overflow-y-auto">
            {activeView === 'officer-reports' ? (
              <OfficerReports />
            ) : (
              <OfficerDashboard />
            )}
          </main>
        </div>
      </div>
    );
  }

  // Customer portal views (Default)
  return (
    <div className="flex min-h-screen bg-[#F6F2E8]">
      <CustomerSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <SharedHeader />
        <main className="flex-1 overflow-y-auto">
          {activeView === 'ev-finance' && <EVFinance />}
          {activeView === 'green-home' && <GreenHomeLoan />}
          {activeView === 'solar-finance' && <SolarFinance />}
          {(activeView === 'customer-home' || !activeView) && <CustomerHome />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
