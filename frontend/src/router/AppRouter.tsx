import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import { ToastContainer } from '../components/ui';
import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute';
import { LoadingScreen } from '../components/ui';

// Lazy load pages for code splitting
const LandingPage = lazy(() => import('../pages/Landing').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('../pages/Login').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../pages/Register').then(m => ({ default: m.RegisterPage })));
const DashboardPage = lazy(() => import('../pages/Dashboard').then(m => ({ default: m.DashboardPage })));
const CycleTrackerPage = lazy(() => import('../pages/CycleTracker').then(m => ({ default: m.CycleTrackerPage })));
const CravingJournalPage = lazy(() => import('../pages/CravingJournal').then(m => ({ default: m.CravingJournalPage })));
const HealthJournalPage = lazy(() => import('../pages/HealthJournal').then(m => ({ default: m.HealthJournalPage })));
const AppointmentsPage = lazy(() => import('../pages/Appointments').then(m => ({ default: m.AppointmentsPage })));

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Suspense fallback={<LoadingScreen message="Loading HerCare..." />}>
            <Routes>
              {/* Public landing */}
              <Route path="/" element={<LandingPage />} />

              {/* Public-only routes (redirect if logged in) */}
              <Route element={<PublicOnlyRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              {/* Protected routes (redirect to login if not authenticated) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/cycle" element={<CycleTrackerPage />} />
                <Route path="/cravings" element={<CravingJournalPage />} />
                <Route path="/journal" element={<HealthJournalPage />} />
                <Route path="/appointments" element={<AppointmentsPage />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          <ToastContainer />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};
