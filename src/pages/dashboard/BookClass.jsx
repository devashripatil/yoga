import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Recommendations from '../../components/Recommendations';
import { Clock, Calendar, Users, IndianRupee, X, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const BookClass = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionsToBook, setSessionsToBook] = useState(1);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data } = await api.get('/classes');
        setClasses(data);
      } catch (error) {
        toast.error('Failed to load classes');
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const handleBookRedirect = (cls) => {
    navigate('/dashboard/payment', { state: { classData: cls, slots: sessionsToBook } });
  };

  if (loading) return <p>Loading classes...</p>;

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Book a Class</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>View and book available sessions with Maya.</p>

      <Recommendations />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {classes.length === 0 ? (
          <p>No classes available right now.</p>
        ) : (
          classes.map((cls) => (
            <Card key={cls._id} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ padding: '1.5rem', flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>{cls.title}</h3>
                  <span style={{ backgroundColor: 'rgba(74, 124, 89, 0.1)', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                    {cls.difficulty}
                  </span>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1rem', lineHeight: 1.5, flexGrow: 1 }}>
                  {cls.description}
                </p>

                <div style={{ backgroundColor: 'var(--background)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Select Slots:</span>
                    <select
                      value={sessionsToBook}
                      onChange={(e) => setSessionsToBook(Number(e.target.value))}
                      style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {[...Array(cls.totalSessions || 5)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    <Calendar size={16} />
                    <span>{new Date(cls.schedule).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    <Clock size={16} />
                    <span>{new Date(cls.schedule).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({cls.duration} min)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    <Users size={16} />
                    <span>{cls.maxSlots} spots total</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    <IndianRupee size={16} />
                    <span>₹{cls.feePerSession || 0} / session</span>
                  </div>
                </div>
              </div>

              <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', backgroundColor: '#f9fafb', borderBottomLeftRadius: 'var(--radius-lg)', borderBottomRightRadius: 'var(--radius-lg)' }}>
                <Button onClick={() => handleBookRedirect(cls)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  Proceed to Payment <IndianRupee size={16} />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

    </div>
  );
};

export default BookClass;
