import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Card from '../../components/Card';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle } from 'lucide-react';

const Tracker = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const { data } = await api.get('/attendance');
        setAttendance(data);
      } catch (error) {
        toast.error('Failed to load attendance records');
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  if (loading) return <p>Loading your progress...</p>;

  // Calculate simple stats
  const attendedCount = attendance.filter(a => a.status === 'present').length;
  const totalClasses = attendance.length;
  const attendanceRate = totalClasses > 0 ? Math.round((attendedCount / totalClasses) * 100) : 0;

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Yoga Tracker</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Monitor your attendance and wellness milestones.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem', marginTop: '2rem' }}>
        <Card style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', color: 'var(--primary)', margin: '0 0 0.5rem 0' }}>{attendedCount}</h3>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontWeight: 500 }}>Classes Attended</p>
        </Card>
        <Card style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', color: 'var(--primary)', margin: '0 0 0.5rem 0' }}>{attendanceRate}%</h3>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontWeight: 500 }}>Attendance Rate</p>
        </Card>
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Attendance History</h2>
      {attendance.length === 0 ? (
        <Card style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>No attendance records found yet. Book a class to get started!</p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {attendance.map((record) => (
            <Card key={record._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem' }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>{record.classId?.title || 'Yoga Class'}</h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  {new Date(record.date).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div>
                {record.status === 'present' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                    <CheckCircle size={20} />
                    <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>Present</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}>
                    <XCircle size={20} />
                    <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>Absent</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tracker;
