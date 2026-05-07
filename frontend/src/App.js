import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadForm from './pages/LeadForm';
import LeadDetail from './pages/LeadDetail';

// Protected Route - only allows logged in users
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      <Route path="/leads" element={
        <ProtectedRoute><Leads /></ProtectedRoute>
      } />
      <Route path="/leads/new" element={
        <ProtectedRoute><LeadForm /></ProtectedRoute>
      } />
      <Route path="/leads/:id" element={
        <ProtectedRoute><LeadDetail /></ProtectedRoute>
      } />
      <Route path="/leads/:id/edit" element={
        <ProtectedRoute><LeadForm /></ProtectedRoute>
      } />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;