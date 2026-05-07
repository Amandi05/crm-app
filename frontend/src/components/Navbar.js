import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold">CRM System</h1>
        <Link to="/dashboard" className="hover:underline text-sm">Dashboard</Link>
        <Link to="/leads" className="hover:underline text-sm">Leads</Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm">👤 {user?.name}</span>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;