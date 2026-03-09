import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Check, X, Calendar as CalendarIcon } from 'lucide-react';

const AttendanceTracker = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  
  const [roster, setRoster] = useState([]); // This would ideally come from bookings for this specific class
  const [attendanceRecords, setAttendanceRecords] = useState({}); // { userId: 'present' | 'absent' }
  const [loading, setLoading] = useState(true);

  // 1. Fetch available classes on mount
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

  // 2. Fetch bookings and existing attendance when class or date changes
  useEffect(() => {
    if (!selectedClass || !date) return;

    const fetchClassData = async () => {
      try {
        // Fetch ALL bookings and filter manually for this class since we didn't build a `/bookings/class/:id` endpoint
        const bookingsRes = await api.get('/bookings');
        const classBookings = bookingsRes.data.data.filter(b => b.classId && b.classId._id === selectedClass && b.status === "active");
        
        // Extract unique users
        const users = classBookings.map(b => b.userId).filter((v, i, a) => a.findIndex(t => (t._id === v._id)) === i);
        setRoster(users);

        // Fetch attendance for this class
        const attendanceRes = await api.get(`/attendance/class/${selectedClass}`);
        // Filter by the selected date in JS
        const dateRecords = attendanceRes.data.filter(record => record.date.startsWith(date));
        
        const recordMap = {};
        dateRecords.forEach(record => {
          recordMap[record.userId._id] = record.status;
        });
        
        setAttendanceRecords(recordMap);
      } catch (error) {
        toast.error('Failed to load class roster');
        console.error(error);
      }
    };

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
      
      // Update local state to reflect UI change instantly
      setAttendanceRecords(prev => ({
        ...prev,
        [userId]: status
      }));
      toast.success(`Marked as ${status}`);
    } catch (error) {
      toast.error('Failed to save attendance');
    }
  };


  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0, color: '#1e293b' }}>Attendance Tracker</h1>
      </div>

      <Card style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>
              Select Class
            </label>
            <select 
              value={selectedClass || ''} 
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', outline: 'none' }}
            >
              <option value="" disabled>Select a class...</option>
              {classes.map(c => (
                <option key={c._id} value={c._id}>{c.title} ({c.schedule})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>
              <CalendarIcon size={16} /> Date
            </label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', outline: 'none' }}
            />
          </div>

        </div>
      </Card>

      <Card style={{ overflowX: 'auto', padding: 0 }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', backgroundColor: 'white' }}>
          <h3 style={{ margin: 0, color: '#1e293b' }}>Class Roster</h3>
          <p style={{ margin: '0.5rem 0 0 0', color: '#64748b', fontSize: '0.875rem' }}>Showing {roster.length} booked students for {classes.find(c => c._id === selectedClass)?.title}</p>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Student Details</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem', textAlign: 'center' }}>Mark Attendance</th>
            </tr>
          </thead>
          <tbody>
            {roster.length === 0 ? (
              <tr>
                <td colSpan="2" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                  No students have booked this class yet.
                </td>
              </tr>
            ) : (
              roster.map((student) => {
                const status = attendanceRecords[student._id];
                return (
                  <tr key={student._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e2e8f0', color: '#475569', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 500, color: '#0f172a' }}>{student.name}</p>
                          <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => markAttendance(student._id, 'present')}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease', border: 'none',
                            backgroundColor: status === 'present' ? '#22c55e' : '#f0fdf4',
                            color: status === 'present' ? 'white' : '#166534',
                            border: status === 'present' ? '1px solid #22c55e' : '1px solid #bbf7d0'
                          }}
                        >
                          <Check size={16} /> Present
                        </button>
                        <button
                          onClick={() => markAttendance(student._id, 'absent')}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease', border: 'none',
                            backgroundColor: status === 'absent' ? '#ef4444' : '#fef2f2',
                            color: status === 'absent' ? 'white' : '#991b1b',
                            border: status === 'absent' ? '1px solid #ef4444' : '1px solid #fecaca'
                          }}
                        >
                          <X size={16} /> Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default AttendanceTracker;
