import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import toast from 'react-hot-toast';
import { ExternalLink, Calendar, Clock, IndianRupee, Video, Info } from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/my-bookings');
      // Only show confirmed or active bookings as per requirements
      const confirmedBookings = data.data.filter(b => b.status === 'confirmed' || b.status === 'active');
      setBookings(confirmedBookings);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.delete(`/bookings/${bookingId}`);
      toast.success('Booking cancelled');
      fetchBookings(); // Refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <div className="spinner"></div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 700, color: 'var(--primary)' }}>My Sessions</h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Join your confirmed yoga classes and manage your schedule.</p>
      </div>

      {bookings.length === 0 ? (
        <Card style={{ padding: '4rem', textAlign: 'center', backgroundColor: '#f9fafb', border: '2px dashed #e2e8f0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              <Calendar size={32} />
            </div>
            <div>
              <h3 style={{ color: '#475569', marginBottom: '0.5rem' }}>No confirmed bookings yet</h3>
              <p style={{ color: '#94a3b8', maxWidth: '400px', margin: '0 auto' }}>
                Your booked classes will appear here once they are confirmed by the admin. Check your notifications for updates.
              </p>
            </div>
            <Button variant="primary" onClick={() => window.location.href = '/dashboard/book-class'}>
              Browse Classes
            </Button>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {bookings.map((booking, index) => {
            const displayLink = booking.meetingLink || booking.classId?.meetingLink;
            
            return (
              <Card 
                key={booking._id} 
                className={`modern-card stagger-${(index % 3) + 1}`}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '1.75rem',
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '12px', 
                    backgroundColor: 'rgba(74, 124, 89, 0.1)', 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'var(--primary)',
                    fontWeight: 700
                  }}>
                    <Video size={24} />
                  </div>
                  
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontSize: '1.25rem', fontWeight: 700 }}>
                      {booking.classId?.title || 'Class details unavailable'}
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: '#64748b', fontSize: '0.9rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Calendar size={14} />
                        {booking.classId?.schedule || 'Time TBD'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Clock size={14} />
                        {booking.classId?.duration || '--'} min • {booking.sessions} Sessions
                      </div>
                      {booking.totalAmount > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16a34a', fontWeight: 600 }}>
                          <IndianRupee size={14} />
                          PAID
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                  {displayLink ? (
                    <Button 
                      variant="primary" 
                      onClick={() => window.open(displayLink, '_blank')}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.6rem',
                        padding: '0.75rem 1.5rem',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: '0 4px 12px rgba(74, 124, 89, 0.25)'
                      }}
                    >
                      <Video size={18} /> Join Now
                    </Button>
                  ) : (
                    <div style={{ 
                      padding: '0.75rem 1.25rem', 
                      borderRadius: 'var(--radius-md)', 
                      backgroundColor: '#f1f5f9', 
                      color: '#64748b', 
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <Info size={16} /> Link coming soon
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    onClick={() => handleCancel(booking._id)} 
                    style={{ 
                      color: '#ef4444', 
                      borderColor: 'rgba(239, 68, 68, 0.2)',
                      padding: '0.75rem'
                    }}
                    title="Cancel Booking"
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
