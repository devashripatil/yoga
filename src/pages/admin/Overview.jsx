import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import Card from '../../components/Card';
import { Users, Video, CreditCard, Activity } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';

const Overview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/dashboard');
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const mockChartData = [
    { name: 'Jan', bookings: 40, activeUsers: 24 },
    { name: 'Feb', bookings: 30, activeUsers: 13 },
    { name: 'Mar', bookings: 20, activeUsers: 68 },
    { name: 'Apr', bookings: 27, activeUsers: 39 },
    { name: 'May', bookings: 18, activeUsers: 48 },
    { name: 'Jun', bookings: 23, activeUsers: 38 },
  ];

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#1e293b' }}>Platform Analytics</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <Card style={{ borderLeft: '4px solid #3b82f6', display: 'flex', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#eff6ff', padding: '1rem', borderRadius: '50%', marginRight: '1rem' }}>
            <Users size={24} color="#3b82f6" />
          </div>
          <div>
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0, fontWeight: 500 }}>Total Users</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>{stats?.totalUsers || 0}</h3>
          </div>
        </Card>
        
        <Card style={{ borderLeft: '4px solid #10b981', display: 'flex', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#ecfdf5', padding: '1rem', borderRadius: '50%', marginRight: '1rem' }}>
            <Video size={24} color="#10b981" />
          </div>
          <div>
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0, fontWeight: 500 }}>Total Classes</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>{stats?.totalClasses || 0}</h3>
          </div>
        </Card>
        
        <Card style={{ borderLeft: '4px solid #f59e0b', display: 'flex', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#fffbeb', padding: '1rem', borderRadius: '50%', marginRight: '1rem' }}>
            <CreditCard size={24} color="#f59e0b" />
          </div>
          <div>
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0, fontWeight: 500 }}>Total Bookings</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>{stats?.totalBookings || 0}</h3>
          </div>
        </Card>
        
        <Card style={{ borderLeft: '4px solid #8b5cf6', display: 'flex', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#f5f3ff', padding: '1rem', borderRadius: '50%', marginRight: '1rem' }}>
            <Activity size={24} color="#8b5cf6" />
          </div>
          <div>
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0, fontWeight: 500 }}>Classes Today</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>{stats?.todaysClassesCount || 0}</h3>
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
        <Card style={{ padding: '1.5rem' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#1e293b' }}>Booking Trends</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Line type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="activeUsers" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card style={{ padding: '1.5rem' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#1e293b' }}>User Acquisition</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="activeUsers" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
