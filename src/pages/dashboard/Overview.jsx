import { useState, useEffect, useContext } from 'react';
import api from '../../utils/api';
import AuthContext from '../../context/AuthContext';
import Card from '../../components/Card';
import Recommendations from '../../components/Recommendations';
import { Calendar, CheckCircle, Clock, Sparkles, TrendingUp, Target, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Overview = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    upcoming: null,
    totalBooked: 0,
    attendedThisMonth: 0,
    wellnessSnapshot: '',
    activityData: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/bookings/my-bookings');
        
        // Basic stats derived from user's bookings
        const upcoming = data.data.filter(b => new Date(b.classId.schedule) > new Date() && b.status !== 'cancelled');
        const attended = data.data.filter(b => b.status === 'completed' || new Date(b.classId.schedule) < new Date());
        
        // Formulate activity data for chart (last 7 days mockup logic based on attended)
        // In a real app, this would be computed by the backend
        const chartData = [
          { day: 'Mon', sessions: 1 },
          { day: 'Tue', sessions: 2 },
          { day: 'Wed', sessions: 1 },
          { day: 'Thu', sessions: 3 },
          { day: 'Fri', sessions: 2 },
          { day: 'Sat', sessions: 4 },
          { day: 'Sun', sessions: 2 },
        ];

        // Fetch Coach Plan for Snapshot
        let snapshot = 'Breathe and stay mindful.';
        try {
          const coachRes = await api.get('/coach/plan');
          if (coachRes.data && coachRes.data.wellnessSnapshot) {
            snapshot = coachRes.data.wellnessSnapshot;
          }
        } catch (e) {
          console.log("No coach plan found for snapshot yet.");
        }

        setStats({
          upcoming: upcoming.length > 0 ? upcoming[0].classId : null,
          totalBooked: data.data.length,
          attendedThisMonth: attended.length,
          wellnessSnapshot: snapshot,
          activityData: chartData
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
    <div style={{ paddingBottom: '3rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* Stat Cards - Premium Version */}
        <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--secondary)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={24} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', backgroundColor: '#ecfdf5', padding: '0.25rem 0.5rem', borderRadius: '1rem' }}>+12% vs last month</span>
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.025em' }}>Practice Consistency</p>
            <h3 style={{ margin: '0.25rem 0 0 0', fontSize: '2rem', color: 'var(--text-primary)', fontWeight: 800 }}>{stats.attendedThisMonth} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Sessions</span></h3>
          </div>
        </div>

        <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={24} />
            </div>
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.025em' }}>Upcoming Class</p>
            <h3 style={{ margin: '0.25rem 0 0 0', fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 700, lineHeight: 1.4 }}>
              {stats.upcoming ? (
                <>
                {stats.upcoming.name} <br/>
                <span style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>{new Date(stats.upcoming.schedule).toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                </>
              ) : 'None currently scheduled'}
            </h3>
          </div>
        </div>

        <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--primary-dark)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={24} />
            </div>
            <Sparkles size={20} style={{ opacity: 0.6 }} />
          </div>
          <div>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Wellness Snapshot</p>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', fontWeight: 500, lineHeight: 1.5, fontStyle: 'italic' }}>
              "{stats.wellnessSnapshot}"
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        {/* Practice Analytics Chart */}
        <div className="premium-card" style={{ gridColumn: 'span 2', minHeight: '400px', padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 700 }}>Practice Intensity</h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Weekly visualization of your shadhana progress</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--white)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>7 Days</button>
              <button style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>30 Days</button>
            </div>
          </div>
          
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: 'var(--shadow-lg)',
                    padding: '12px' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="sessions" 
                  stroke="var(--primary)" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorSessions)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recommended Daily Goal */}
        <div className="premium-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '1.5rem' }}>Personal Goal</h3>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '1rem' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '1.5rem' }}>
              <svg width="120" height="120" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border-light)" strokeWidth="8" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--primary)" strokeWidth="8" strokeDasharray="210 283" strokeLinecap="round" />
              </svg>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-dark)', width: '100%' }}>74%</span>
              </div>
            </div>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Daily Mindfulness</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              You are just 15 minutes away from reaching your weekly meditation goal.
            </p>
            <button style={{ 
              marginTop: '1.5rem', 
              padding: '0.75rem 1.75rem', 
              backgroundColor: 'var(--secondary)', 
              color: 'var(--primary-dark)', 
              border: 'none', 
              borderRadius: 'var(--radius-md)', 
              fontWeight: 700, 
              fontSize: '0.9rem', 
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-light)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary)'}
            >
              Start Session
            </button>
          </div>
        </div>
      </div>

      <Recommendations />
    </div>
  );
};

export default Overview;
