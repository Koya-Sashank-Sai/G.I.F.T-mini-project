import React, { createContext, useContext, useState, useEffect } from 'react';
import { CustomerProfile, OfficerProfile, UserRole } from '../types';

export type ActiveView =
  | 'customer-home'
  | 'ev-finance'
  | 'green-home'
  | 'solar-finance'
  | 'officer-home'
  | 'officer-customers'
  | 'officer-reports'
  | 'customer-login'
  | 'customer-register'
  | 'officer-login';

interface AuthContextType {
  user: any | null;
  role: UserRole | null;
  token: string | null;
  loading: boolean;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  loginCustomer: (customerId: string, password: string, linkedAccount?: string) => Promise<{ success: boolean; error?: string }>;
  registerCustomer: (details: any) => Promise<{ success: boolean; customerId?: string; error?: string }>;
  loginOfficer: (employeeId: string, password: string, bankName?: string, branch?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchUserQuick: (role: 'customer' | 'officer') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('gift_token'));
  const [loading, setLoading] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<ActiveView>('customer-home');

  useEffect(() => {
    async function checkSession() {
      if (!token) {
        // Auto sign-in as demo customer Arun Kumar initially for immediate experience
        await autoLoginDemoCustomer();
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setRole(data.user.role);
          if (data.user.role === 'customer') {
            setActiveView('customer-home');
          } else {
            setActiveView('officer-home');
          }
        } else {
          await autoLoginDemoCustomer();
        }
      } catch (err) {
        console.error('Session verify failed, using demo fallback:', err);
        await autoLoginDemoCustomer();
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  async function autoLoginDemoCustomer() {
    try {
      const res = await fetch('/api/auth/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: 'C10234',
          password: 'Password@123',
          linkedAccount: '987654321012'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setRole('customer');
        setToken(data.token);
        localStorage.setItem('gift_token', data.token);
        setActiveView('customer-home');
      }
    } catch (e) {
      console.warn('Auto login failed:', e);
    }
  }

  const loginCustomer = async (customerId: string, password: string, linkedAccount?: string) => {
    try {
      const res = await fetch('/api/auth/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, password, linkedAccount })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      setUser(data.user);
      setRole('customer');
      setToken(data.token);
      localStorage.setItem('gift_token', data.token);
      setActiveView('customer-home');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const registerCustomer = async (details: any) => {
    try {
      const res = await fetch('/api/auth/customer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }
      setUser(data.user);
      setRole('customer');
      setToken(data.token);
      localStorage.setItem('gift_token', data.token);
      setActiveView('customer-home');
      return { success: true, customerId: data.customerId };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const loginOfficer = async (employeeId: string, password: string, bankName?: string, branch?: string) => {
    try {
      const res = await fetch('/api/auth/officer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId, password, bankName, branch })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Officer login failed' };
      }
      setUser(data.user);
      setRole('officer');
      setToken(data.token);
      localStorage.setItem('gift_token', data.token);
      setActiveView('officer-home');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Officer login failed' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      // Ignore network errors on logout
    }
    setUser(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem('gift_token');
    setActiveView('customer-login');
  };

  const switchUserQuick = async (targetRole: 'customer' | 'officer') => {
    if (targetRole === 'customer') {
      await loginCustomer('C10234', 'Password@123', '987654321012');
    } else {
      await loginOfficer('EMP-8842', 'Officer@123', 'Lloyds Bank', 'Guntur Branch');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        loading,
        activeView,
        setActiveView,
        loginCustomer,
        registerCustomer,
        loginOfficer,
        logout,
        switchUserQuick
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
