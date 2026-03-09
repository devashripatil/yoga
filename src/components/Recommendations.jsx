import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import Card from './Card';
import Button from './Button';
import { Clock, IndianRupee, RotateCw } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/recommendations');
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  }, [user]);

  if (loading) {
    return (
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Recommended Classes For You</h2>
        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-lg)' }}>
           <RotateCw className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto 1rem auto' }} size={32} />
           <p style={{ color: 'var(--text-secondary)' }}>AI is curating your personalized classes...</p>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null; // Don't show section if no recommendations exist
  }

  return (
    <div style={{ marginBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--text-primary)' }}>Recommended Classes For You ✨</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>AI-powered suggestions based on your {user?.wellnessGoal ? 'goals' : 'preferences'}</p>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div style={{ 
        display: 'flex', 
        gap: '1.5rem', 
        overflowX: 'auto', 
        paddingBottom: '1rem',
        scrollbarWidth: 'thin',
        msOverflowStyle: 'none',
      }}
      className="hide-scrollbar"
      >
        {/* Style to hide scrollbar in webkit browsers added dynamically or in App.css ideally, but we'll stick to a clean look */}
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar {
            height: 6px;
          }
          .hide-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 4px;
          }
          .hide-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
          }
          .hide-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}} />

        {recommendations.map((cls) => (
          <Card key={cls._id} style={{ minWidth: '300px', maxWidth: '350px', flex: '0 0 auto', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', border: '1px solid var(--primary-light)' }}>
            <div style={{ position: 'relative' }}>
              <img src={cls.imageUrl || "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=400&fit=crop"} alt={cls.title} style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }} />
              <span style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'var(--white)', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600, boxShadow: 'var(--shadow-sm)' }}>
                {cls.difficulty}
              </span>
            </div>
            
            <div style={{ padding: '1.25rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{cls.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.4, flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {cls.description}
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Instructor:</span> {cls.instructor || 'Admin'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    <Clock size={14} />
                    <span>{cls.duration} min</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    <IndianRupee size={14} />
                    <span>₹{cls.feePerSession || 0}</span>
                  </div>
                </div>
              </div>

              <Button 
                variant="primary" 
                style={{ width: '100%' }}
                onClick={() => navigate('/dashboard/book')}
              >
                Book Now
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
