import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import Card from '../../components/Card';
import { XCircle, CheckCircle, Search, ExternalLink } from 'lucide-react';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/bookings'); // Admin endpoint
      setBookings(data.data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this user booking?')) {
      try {
        await api.delete(`/bookings/admin/${id}`);
        toast.success('Booking cancelled successfully');
        fetchBookings(); // Refresh the list
      } catch (error) {
        toast.error('Failed to cancel booking');
      }
    }
  };

  const handleVerifyBooking = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/verify`, { status });
      toast.success(`Booking ${status}`);
      fetchBookings();
    } catch (error) {
      toast.error(`Failed to ${status} booking`);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (b.userId?.name || '').toLowerCase().includes(searchLower) ||
      (b.userId?.email || '').toLowerCase().includes(searchLower) ||
      (b.classId?.title || '').toLowerCase().includes(searchLower)
    );
  });

  if (loading && bookings.length === 0) return <div>Loading bookings...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0, color: '#1e293b' }}>Bookings Management</h1>

        <div style={{ position: 'relative', width: '300px' }}>
          <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search users or classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem.75rem 0.75rem 2.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #e2e8f0',
              outline: 'none',
              fontSize: '0.875rem'
            }}
          />
        </div>
      </div>

      <Card style={{ overflowX: 'auto', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Student Name</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Email</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Class Title</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Details</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Payment</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Booking Date</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Status</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No bookings found.</td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr key={booking._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '1rem', color: '#0f172a', fontWeight: 500 }}>{booking.userId?.name || 'Unknown User'}</td>
                  <td style={{ padding: '1rem', color: '#475569', fontSize: '0.875rem' }}>{booking.userId?.email || 'N/A'}</td>
                  <td style={{ padding: '1rem', color: '#0f172a', fontWeight: 500 }}>{booking.classId?.title || 'Unknown Class'}</td>
                  <td style={{ padding: '1rem', color: '#475569', fontSize: '0.875rem' }}>
                    <div>{booking.classId?.schedule || 'N/A'}</div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                      {booking.sessions} Session(s)
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: '#475569', fontSize: '0.875rem' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>₹{booking.totalAmount || 0}</div>
                    {booking.paymentProof && (
                      <a
                        href={`http://localhost:5000${booking.paymentProof}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#3b82f6', textDecoration: 'none', fontSize: '0.75rem', marginTop: '0.25rem' }}
                      >
                        <ExternalLink size={12} /> View Proof
                      </a>
                    )}
                  </td>
                  <td style={{ padding: '1rem', color: '#475569', fontSize: '0.875rem' }}>
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: (booking.status === 'active' || booking.status === 'confirmed') ? '#dcfce7' : booking.status === 'pending' ? '#fef08a' : '#fee2e2',
                      color: (booking.status === 'active' || booking.status === 'confirmed') ? '#166534' : booking.status === 'pending' ? '#854d0e' : '#991b1b'
                    }}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center', height: '100%' }}>
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleVerifyBooking(booking._id, 'confirmed')}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#16a34a', fontSize: '0.75rem', fontWeight: 600 }}
                          title="Confirm Payment"
                        >
                          <CheckCircle size={16} /> Confirm
                        </button>
                        <button
                          onClick={() => handleVerifyBooking(booking._id, 'rejected')}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#ea580c', fontSize: '0.75rem', fontWeight: 600 }}
                          title="Reject Payment"
                        >
                          <XCircle size={16} /> Reject
                        </button>
                      </>
                    )}
                    {(booking.status === 'active' || booking.status === 'confirmed' || booking.status === 'pending') && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600 }}
                        title="Cancel Booking"
                      >
                        <XCircle size={16} /> Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default ManageBookings;
