import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/my-bookings');
      setBookings(data.data);
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

  if (loading) return <p>Loading your bookings...</p>;

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>My Bookings</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Manage your upcoming reservations.</p>

      {bookings.length === 0 ? (
        <Card style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>You have no bookings yet.</p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {bookings.map((booking) => (
            <Card key={booking._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', opacity: booking.status === 'cancelled' ? 0.6 : 1 }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                  {booking.classId?.title || 'Class details unavailable'}
                </h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  {booking.classId?.schedule ? new Date(booking.classId.schedule).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Unknown Time'} • {booking.classId?.duration || '--'} min
                  {booking.sessions > 1 ? ` • ${booking.sessions} Sessions` : ''}
                  {booking.totalAmount > 0 ? ` • ₹${booking.totalAmount}` : ''}
                </p>
                <div style={{
                  marginTop: '0.75rem', display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                  backgroundColor: (booking.status === 'confirmed' || booking.status === 'active') ? 'rgba(74, 124, 89, 0.1)' :
                    (booking.status === 'cancelled' || booking.status === 'rejected') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: (booking.status === 'confirmed' || booking.status === 'active') ? 'var(--primary)' :
                    (booking.status === 'cancelled' || booking.status === 'rejected') ? '#ef4444' : '#f59e0b',
                }}>
                  {booking.status.toUpperCase()}
                </div>
              </div>

              {(booking.status === 'confirmed' || booking.status === 'active' || booking.status === 'pending') && new Date(booking.classId?.schedule || new Date(8640000000000000)) > new Date() && (
                <Button variant="outline" size="sm" onClick={() => handleCancel(booking._id)} style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                  Cancel
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
