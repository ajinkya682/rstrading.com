import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

// Public Pages
import Home from '@/pages/public/Home';
import About from '@/pages/public/About';
import BusinessPlan from '@/pages/public/BusinessPlan';
import HowItWorks from '@/pages/public/HowItWorks';
import Contact from '@/pages/public/Contact';

// Auth Pages
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';

// Dashboard Pages
import DashboardLayout from '@/components/layout/DashboardLayout';
import Overview from '@/pages/dashboard/Overview';
import Activation from '@/pages/dashboard/Activation';
import EPin from '@/pages/dashboard/EPin';
import TeamNetwork from '@/pages/dashboard/TeamNetwork';
import Referral from '@/pages/dashboard/Referral';
import Wallet from '@/pages/dashboard/Wallet';
import Statement from '@/pages/dashboard/Statement';
import BankDetails from '@/pages/dashboard/BankDetails';
import Profile from '@/pages/dashboard/Profile';
import ChangePassword from '@/pages/dashboard/ChangePassword';
import SupportTickets from '@/pages/dashboard/SupportTickets';

// Admin Pages
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminLayout from '@/components/layout/AdminLayout';
import AdminOverview from '@/pages/admin/AdminOverview';
import UserManagement from '@/pages/admin/UserManagement';
import IncomeManagement from '@/pages/admin/IncomeManagement';
import EPinManagement from '@/pages/admin/EPinManagement';
import WithdrawalManagement from '@/pages/admin/WithdrawalManagement';
import Reports from '@/pages/admin/Reports';
import CMSManagement from '@/pages/admin/CMSManagement';

// Guards
import { useAuthStore } from '@/store/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30000, refetchOnWindowFocus: false },
  },
});

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuthStore();
  if (!isAuthenticated || !isAdmin()) return <Navigate to="/admin/login" replace />;
  return children;
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'Manrope, sans-serif',
              fontSize: '14px',
              borderRadius: '12px',
              background: '#fff',
              color: '#0F172A',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            },
            success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
          }}
        />
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/business-plan" element={<BusinessPlan />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/contact" element={<Contact />} />

            {/* Auth */}
            <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
            <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* User Dashboard */}
            <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
              <Route index element={<Overview />} />
              <Route path="activation" element={<Activation />} />
              <Route path="epin" element={<EPin />} />
              <Route path="team" element={<TeamNetwork />} />
              <Route path="referral" element={<Referral />} />
              <Route path="wallet" element={<Wallet />} />
              <Route path="statement" element={<Statement />} />
              <Route path="bank-details" element={<BankDetails />} />
              <Route path="profile" element={<Profile />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="support" element={<SupportTickets />} />
            </Route>

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminOverview />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="income" element={<IncomeManagement />} />
              <Route path="epin" element={<EPinManagement />} />
              <Route path="withdrawals" element={<WithdrawalManagement />} />
              <Route path="reports" element={<Reports />} />
              <Route path="cms" element={<CMSManagement />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
