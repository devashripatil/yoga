import { useState, useEffect, useContext } from 'react';
import api from '../../utils/api';
import AuthContext from '../../context/AuthContext';
import Card from '../../components/Card';
import Recommendations from '../../components/Recommendations';
import { Calendar, CheckCircle, Clock } from 'lucide-react';

const Overview = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    upcoming: null,
    totalBooked: 0,
    attendedThisMonth: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/bookings/my-bookings');
        
        // Basic stats derived from user's bookings
        const upcoming = data.data.filter(b => new Date(b.classId.schedule) > new Date() && b.status !== 'cancelled');
        const attended = data.data.filter(b => b.status === 'completed' || new Date(b.classId.schedule) < new Date());
        
        setStats({
          upcoming: upcoming.length > 0 ? upcoming[0].classId : null,
          totalBooked: data.data.length,
          attendedThisMonth: attended.length
        });
      } catch (error) {
        console.error("Error fetching overview stats:", error);
      }
    };
    
    if (user) {
      fetchStats();
    }
  }, [user]);

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Welcome back, {user?.name || 'Yogi'}!</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Here is what is happening with your practice today.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <Card style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(74, 124, 89, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={24} />
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Total Bookings</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)' }}>{stats.totalBooked}</h3>
          </div>
        </Card>
        
        <Card style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(74, 124, 89, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Classes Attended</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)' }}>{stats.attendedThisMonth}</h3>
          </div>
        </Card>
        
        <Card style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(74, 124, 89, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Next Class</p>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              {stats.upcoming ? new Date(stats.upcoming.schedule).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'None booked'}
            </h3>
          </div>
        </Card>
      </div>

      <Recommendations />

    </div>
  );
};

export default Overview;
