import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Check, X, Calendar as CalendarIcon, User, Search, Filter, RefreshCw, AlertCircle } from 'lucide-react';

const AttendanceTracker = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [roster, setRoster] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch available classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data } = await api.get('/classes');
        setClasses(data);
        if (data.length > 0) {
          setSelectedClass(data[0]._id);
        }
      } catch (error) {
        toast.error('Failed to load classes');
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  // Fetch roster and attendance when class/date changes
  const fetchClassData = async () => {
    if (!selectedClass || !date) return;
    setRefreshing(true);
    try {
      // Fetch bookings to get the roster for this class
      const bookingsRes = await api.get('/bookings');
      // Include both confirmed and active bookings in the roster
      const classBookings = bookingsRes.data.data.filter(b => 
        b.classId && 
        b.classId._id === selectedClass && 
        (b.status === "active" || b.status === "confirmed")
      );
      
      const users = classBookings.map(b => b.userId).filter((v, i, a) => 
        v && a.findIndex(t => t && t._id === v._id) === i
      );
      setRoster(users);

      // Fetch attendance for this specific class and date from backend
      const attendanceRes = await api.get(`/attendance/class/${selectedClass}?date=${date}`);
      
      const recordMap = {};
      attendanceRes.data.forEach(record => {
        if (record.userId) {
          recordMap[record.userId._id] = record.status;
        }
      });
      
      setAttendanceRecords(recordMap);
    } catch (error) {
      toast.error('Failed to load class data');
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchClassData();
  }, [selectedClass, date]);


  const markAttendance = async (userId, status) => {
    try {
      await api.post('/attendance', {
        userId,
        classId: selectedClass,
        date,
        status
      });
      
      setAttendanceRecords(prev => ({
        ...prev,
        [userId]: status
      }));
      toast.success(`Marked as ${status}`);
    } catch (error) {
      toast.error('Failed to save attendance');
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div className="spinner"></div>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.25rem' }}>Attendance Tracker</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Mark and manage daily attendance for your shishyas.</p>
        </div>
        <Button variant="ghost" onClick={fetchClassData} disabled={refreshing} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} /> Refresh List
        </Button>
      </div>

      <Card style={{ marginBottom: '2.5rem', padding: '2rem', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>
              <Filter size={16} /> SELECT CLASS
            </label>
            <select 
              value={selectedClass || ''} 
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: 'white', fontWeight: 500, color: '#1e293b', boxShadow: 'var(--shadow-sm)' }}
            >
              {classes.length === 0 && <option disabled>No classes available</option>}
              {classes.map(c => (
                <option key={c._id} value={c._id}>{c.title} ({c.schedule})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>
              <CalendarIcon size={16} /> ATTENDANCE DATE
            </label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: 'white', fontWeight: 500, color: '#1e293b', boxShadow: 'var(--shadow-sm)' }}
            />
          </div>

        </div>
      </Card>

      <Card style={{ overflowX: 'auto', padding: 0, border: 'none', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.25rem', fontWeight: 700 }}>Class Roster</h3>
            <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.875rem' }}>
              <strong>{roster.length}</strong> Registered students found for this session
            </p>
          </div>
          <div style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: '#f0f9ff', color: '#0369a1', fontSize: '0.8rem', fontWeight: 700 }}>
            {new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <th style={{ padding: '1.25rem 2rem', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Student Information</th>
              <th style={{ padding: '1.25rem 2rem', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Attendance Status</th>
            </tr>
          </thead>
          <tbody>
            {roster.length === 0 ? (
              <tr>
                <td colSpan="2" style={{ padding: '5rem 2rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#94a3b8' }}>
                    <AlertCircle size={48} opacity={0.5} />
                    <p style={{ fontSize: '1.1rem', margin: 0 }}>No students have confirmed bookings for this class.</p>
                    <p style={{ fontSize: '0.9rem', margin: 0 }}>Check the "Manage Bookings" tab to confirm pending requests.</p>
                  </div>
                </td>
              </tr>
            ) : (
              roster.map((student) => {
                if (!student) return null;
                const status = attendanceRecords[student._id];
                return (
                  <tr key={student._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }} className="roster-row">
                    <td style={{ padding: '1.25rem 2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#f1f5f9', color: 'var(--primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 800, fontSize: '1.2rem', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 700, color: '#1e293b', fontSize: '1rem' }}>{student.name}</p>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 2rem', textAlign: 'center' }}>
                      {status ? (
                        <div style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '0.5rem', 
                          padding: '0.6rem 1.5rem', 
                          borderRadius: 'var(--radius-lg)', 
                          fontSize: '0.85rem', 
                          fontWeight: 800,
                          backgroundColor: status === 'present' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: status === 'present' ? '#10b981' : '#ef4444',
                          border: status === 'present' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          {status === 'present' ? <Check size={16} strokeWidth={3} /> : <X size={16} strokeWidth={3} />}
                          {status}
                        </div>
                      ) : (
                        <div style={{ display: 'inline-flex', backgroundColor: '#f1f5f9', padding: '0.35rem', borderRadius: 'var(--radius-lg)', gap: '0.35rem', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)' }}>
                          <button
                            onClick={() => markAttendance(student._id, 'present')}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', border: 'none',
                              backgroundColor: 'transparent',
                              color: '#64748b'
                            }}
                            onMouseOver={e => { e.currentTarget.style.backgroundColor = '#10b981'; e.currentTarget.style.color = 'white'; }}
                            onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
                          >
                            <Check size={16} strokeWidth={3} /> PRESENT
                          </button>
                          <button
                            onClick={() => markAttendance(student._id, 'absent')}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', border: 'none',
                              backgroundColor: 'transparent',
                              color: '#64748b'
                            }}
                            onMouseOver={e => { e.currentTarget.style.backgroundColor = '#ef4444'; e.currentTarget.style.color = 'white'; }}
                            onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
                          >
                            <X size={16} strokeWidth={3} /> ABSENT
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Card>
      
      <style>{`
        .roster-row:hover {
          background-color: #f8fafc;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AttendanceTracker;
