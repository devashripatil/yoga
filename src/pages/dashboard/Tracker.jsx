import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Card from '../../components/Card';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Award, Target, Flame } from 'lucide-react';

const Tracker = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('attendance');

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
    <div className="animate-fade-in" style={{ animation: 'fadeIn 0.6s ease-out' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: 700 }}>Wellness Tracker</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Monitor your progress, attendance, and health milestones.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
        <Card style={{ padding: '2rem', textAlign: 'center', borderBottom: '4px solid var(--primary)', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ backgroundColor: 'rgba(74, 124, 89, 0.1)', color: 'var(--primary)', padding: '0.75rem', borderRadius: '50%' }}>
              <Flame size={28} />
            </div>
          </div>
          <h3 style={{ fontSize: '2.5rem', color: 'var(--primary-dark)', margin: '0 0 0.25rem 0', fontWeight: 800 }}>{attendedCount}</h3>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontWeight: 600, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Sessions Completed</p>
        </Card>
        
        <Card style={{ padding: '2rem', textAlign: 'center', borderBottom: '4px solid var(--secondary)', boxShadow: 'var(--shadow-md)' }}>
           <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ backgroundColor: 'rgba(212, 163, 115, 0.1)', color: 'var(--secondary-dark)', padding: '0.75rem', borderRadius: '50%' }}>
              <Target size={28} />
            </div>
          </div>
          <h3 style={{ fontSize: '2.5rem', color: 'var(--secondary-dark)', margin: '0 0 0.25rem 0', fontWeight: 800 }}>{attendanceRate}%</h3>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontWeight: 600, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Goal Consistency</p>
        </Card>

        <Card style={{ padding: '2rem', textAlign: 'center', borderBottom: '4px solid var(--primary-light)', boxShadow: 'var(--shadow-md)' }}>
           <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ backgroundColor: 'rgba(74, 124, 89, 0.1)', color: 'var(--primary)', padding: '0.75rem', borderRadius: '50%' }}>
              <Award size={28} />
            </div>
          </div>
          <h3 style={{ fontSize: '2.5rem', color: 'var(--primary)', margin: '0 0 0.25rem 0', fontWeight: 800 }}>{Math.floor(attendedCount / 5)}</h3>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontWeight: 600, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Milestones Achieved</p>
        </Card>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('attendance')}
          style={{ 
            padding: '1rem 0.5rem', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === 'attendance' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'attendance' ? 'var(--primary-dark)' : 'var(--text-secondary)',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          Attendance History
        </button>
        <button 
          onClick={() => setActiveTab('milestones')}
          style={{ 
            padding: '1rem 0.5rem', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === 'milestones' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'milestones' ? 'var(--primary-dark)' : 'var(--text-secondary)',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          Wellness Milestones
        </button>
      </div>

      {activeTab === 'attendance' ? (
        <div className="tab-content animate-fade-in">
          {attendance.length === 0 ? (
            <Card style={{ padding: '4rem', textAlign: 'center', backgroundColor: '#f9fafb' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No attendance records found yet. Your journey begins with your first class!</p>
            </Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {attendance.map((record) => (
                <Card key={record._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2rem', transition: 'transform 0.2s' }} className="hover-lift-sm">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ 
                      width: '10px', 
                      height: '10px', 
                      borderRadius: '50%', 
                      backgroundColor: record.status === 'present' ? 'var(--primary)' : '#ef4444' 
                    }}></div>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{record.classId?.title || 'Yoga Class'}</h4>
                      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {new Date(record.date).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div>
                    {record.status === 'present' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-dark)', backgroundColor: 'rgba(74, 124, 89, 0.1)', padding: '0.4rem 1rem', borderRadius: '1rem' }}>
                        <CheckCircle size={18} />
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>PRESENT</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b91c1c', backgroundColor: '#fee2e2', padding: '0.4rem 1rem', borderRadius: '1rem' }}>
                        <XCircle size={18} />
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>ABSENT</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="tab-content animate-fade-in">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
             {[
               { title: "First Step", desc: "Complete 1 yoga session", target: 1, current: attendedCount },
               { title: "Consistent Yogi", desc: "Attend 5 sessions", target: 5, current: attendedCount },
               { title: "Dedicated Practitioner", desc: "Attend 10 sessions", target: 10, current: attendedCount },
               { title: "Zen Master", desc: "Attend 25 sessions", target: 25, current: attendedCount },
             ].map((m, i) => (
               <Card key={i} style={{ padding: '2rem', opacity: m.current >= m.target ? 1 : 0.6, border: m.current >= m.target ? '1px solid var(--primary-light)' : '1px solid var(--border)' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div style={{ 
                      backgroundColor: m.current >= m.target ? 'var(--primary)' : 'var(--border)', 
                      color: 'white', 
                      padding: '0.75rem', 
                      borderRadius: 'var(--radius-md)' 
                    }}>
                      <Award size={24} />
                    </div>
                    {m.current >= m.target && <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem' }}>UNLOCKED</span>}
                 </div>
                 <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: 'var(--text-primary)' }}>{m.title}</h4>
                 <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{m.desc}</p>
                 
                 <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${Math.min(100, (m.current / m.target) * 100)}%`, 
                      height: '100%', 
                      backgroundColor: m.current >= m.target ? 'var(--primary)' : 'var(--secondary)',
                      transition: 'width 1s ease-out'
                    }}></div>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{Math.min(m.target, m.current)} / {m.target}</span>
                 </div>
               </Card>
             ))}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .hover-lift-sm:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }
      `}} />
    </div>
  );
};

export default Tracker;
