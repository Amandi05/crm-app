import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../api';

const StatCard = ({ title, value, color }) => (
  <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${color}`}>
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-3xl font-bold mt-1">{value}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <Link
            to="/leads/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium"
          >
            + New Lead
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Leads" value={stats?.totalLeads || 0} color="border-blue-500" />
          <StatCard title="New Leads" value={stats?.newLeads || 0} color="border-yellow-500" />
          <StatCard title="Qualified Leads" value={stats?.qualifiedLeads || 0} color="border-purple-500" />
          <StatCard title="Won Leads" value={stats?.wonLeads || 0} color="border-green-500" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <StatCard title="Lost Leads" value={stats?.lostLeads || 0} color="border-red-500" />
          <StatCard
            title="Total Deal Value"
            value={`$${Number(stats?.totalValue || 0).toLocaleString()}`}
            color="border-indigo-500"
          />
          <StatCard
            title="Won Deal Value"
            value={`$${Number(stats?.wonValue || 0).toLocaleString()}`}
            color="border-green-600"
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Quick Actions</h3>
          <div className="flex gap-4">
            <Link
              to="/leads/new"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              + Add New Lead
            </Link>
            <Link
              to="/leads"
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm"
            >
              View All Leads
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;