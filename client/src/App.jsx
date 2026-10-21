import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PublicPortfolioPage from './pages/PublicPortfolioPage';

// Protected Pages
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import SkillAnalysisPage from './pages/SkillAnalysisPage';
import ResumeAnalyzerPage from './pages/ResumeAnalyzerPage';
import JobMatchingPage from './pages/JobMatchingPage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import PortfolioBuilderPage from './pages/PortfolioBuilderPage';
import LearningPathPage from './pages/LearningPathPage';
import ProjectsPage from './pages/ProjectsPage';
import CareerGuidancePage from './pages/CareerGuidancePage';
import ProgressPage from './pages/ProgressPage';
import SettingsPage from './pages/SettingsPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password/:token', element: <ResetPasswordPage /> },
      { path: 'portfolio/:username', element: <PublicPortfolioPage /> },
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'onboarding', element: <OnboardingPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'skills', element: <SkillAnalysisPage /> },
      { path: 'resume-analyzer', element: <ResumeAnalyzerPage /> },
      { path: 'job-matching', element: <JobMatchingPage /> },
      { path: 'resume-builder', element: <ResumeBuilderPage /> },
      { path: 'portfolio-builder', element: <PortfolioBuilderPage /> },
      { path: 'learning-path', element: <LearningPathPage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'career', element: <CareerGuidancePage /> },
      { path: 'progress', element: <ProgressPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              borderRadius: '12px',
              border: '1px solid #334155',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
