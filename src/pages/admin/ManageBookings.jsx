import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import Card from '../../components/Card';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import { XCircle, CheckCircle, Search, ExternalLink, Filter, User, BookOpen, Calendar, Info, X } from 'lucide-react';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Confirmation Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [meetingLink, setMeetingLink] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/bookings');
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

  const openConfirmModal = (booking) => {
    setSelectedBooking(booking);
    setMeetingLink(booking.classId?.meetingLink || '');
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    try {
      await api.put(`/bookings/${selectedBooking._id}/verify`, { 
        status: 'confirmed',
        meetingLink 
      });
      toast.success('Booking confirmed with meeting link');
      setShowConfirmModal(false);
      fetchBookings();
    } catch (error) {
      toast.error('Failed to confirm booking');
    }
  };

  const handleRejectAction = async (id) => {
    if (!window.confirm('Are you sure you want to reject this booking?')) return;
    try {
      await api.put(`/bookings/${id}/verify`, { status: 'rejected' });
      toast.success('Booking rejected');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to reject booking');
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking? This cannot be undone.')) {
      try {
        await api.delete(`/bookings/admin/${id}`);
        toast.success('Booking cancelled successfully');
        fetchBookings();
      } catch (error) {
        toast.error('Failed to cancel booking');
      }
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

  if (loading && bookings.length === 0) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div className="spinner"></div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>Booking Management</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Review and manage student class registrations.</p>
        </div>

        <div style={{ position: 'relative', width: '350px' }}>
          <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Search students, classes, emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.875rem 0.875rem 0.875rem 3rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid #e2e8f0',
              outline: 'none',
              fontSize: '0.95rem',
              backgroundColor: 'white',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.2s'
            }}
          />
        </div>
      </div>

      <Card style={{ overflowX: 'auto', padding: 0, border: 'none', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <th style={{ padding: '1.25rem 1rem', color: '#475569', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' }}>Student Details</th>
              <th style={{ padding: '1.25rem 1rem', color: '#475569', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' }}>Class Info</th>
              <th style={{ padding: '1.25rem 1rem', color: '#475569', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' }}>Schedule</th>
              <th style={{ padding: '1.25rem 1rem', color: '#475569', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' }}>Payment</th>
              <th style={{ padding: '1.25rem 1rem', color: '#475569', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' }}>Status</th>
              <th style={{ padding: '1.25rem 1rem', color: '#475569', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <Info size={40} />
                    <span>No bookings found matching your search.</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr key={booking._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }} className="table-row-hover">
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                        <User size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{booking.userId?.name || 'Unknown User'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{booking.userId?.email || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b', fontWeight: 500 }}>
                      <BookOpen size={16} style={{ color: '#94a3b8' }} />
                      {booking.classId?.title || 'Unknown Class'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>{booking.sessions} Session(s)</div>
                  </td>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.875rem' }}>
                      <Calendar size={16} style={{ color: '#94a3b8' }} />
                      {booking.classId?.schedule || 'N/A'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                      Booked: {new Date(booking.bookingDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>₹{booking.totalAmount || 0}</div>
                    {booking.paymentProof ? (
                      <a
                        href={`http://localhost:5000${booking.paymentProof}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#3b82f6', textDecoration: 'none', fontSize: '0.7rem', marginTop: '0.25rem', fontWeight: 600 }}
                      >
                        <ExternalLink size={12} /> VIEW PROOF
                      </a>
                    ) : (
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.25rem' }}>NO PROOF</div>
                    )}
                  </td>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <span style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em',
                      backgroundColor: (booking.status === 'active' || booking.status === 'confirmed') ? '#dcfce7' : 
                                     booking.status === 'pending' ? '#fef9c3' : 
                                     booking.status === 'rejected' ? '#fee2e2' : '#f1f5f9',
                      color: (booking.status === 'active' || booking.status === 'confirmed') ? '#166534' : 
                             booking.status === 'pending' ? '#854d0e' : 
                             booking.status === 'rejected' ? '#991b1b' : '#475569'
                    }}>
                      {booking.status}
                    </span>
                    {booking.meetingLink && (
                      <div style={{ fontSize: '0.65rem', color: '#16a34a', marginTop: '0.4rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <CheckCircle size={10} /> LINK SET
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => openConfirmModal(booking)}
                            style={{ 
                              padding: '0.5rem 0.75rem', 
                              borderRadius: 'var(--radius-md)', 
                              backgroundColor: '#ecfdf5', 
                              border: 'none', 
                              cursor: 'pointer', 
                              color: '#10b981', 
                              fontSize: '0.75rem', 
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem'
                            }}
                            title="Confirm Booking"
                          >
                            <CheckCircle size={14} /> CONFIRM
                          </button>
                          <button
                            onClick={() => handleRejectAction(booking._id)}
                            style={{ 
                              padding: '0.5rem 0.75rem', 
                              borderRadius: 'var(--radius-md)', 
                              backgroundColor: '#fff7ed', 
                              border: 'none', 
                              cursor: 'pointer', 
                              color: '#f97316', 
                              fontSize: '0.75rem', 
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem'
                            }}
                            title="Reject Booking"
                          >
                            <XCircle size={14} /> REJECT
                          </button>
                        </>
                      )}
                      {(booking.status === 'active' || booking.status === 'confirmed' || booking.status === 'pending') && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          style={{ 
                            width: '32px', 
                            height: '32px', 
                            borderRadius: 'var(--radius-md)', 
                            backgroundColor: '#fef2f2', 
                            border: 'none', 
                            cursor: 'pointer', 
                            color: '#ef4444', 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Cancel Booking"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(15, 23, 42, 0.65)', 
          backdropFilter: 'blur(4px)',
          zIndex: 1000, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: '1.5rem' 
        }}>
          <Card className="animate-fade-in" style={{ 
            width: '100%', 
            maxWidth: '500px', 
            padding: 0, 
            border: 'none',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b', fontWeight: 700 }}>Confirm Registration</h2>
              <button 
                onClick={() => setShowConfirmModal(false)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: 'var(--radius-md)', border: '1px solid #e0f2fe' }}>
                <div style={{ fontSize: '0.875rem', color: '#0369a1', fontWeight: 600 }}>Confirming booking for:</div>
                <div style={{ color: '#0c4a6e', fontWeight: 700, fontSize: '1rem' }}>{selectedBooking?.userId?.name}</div>
                <div style={{ fontSize: '0.875rem', color: '#0c4a6e', marginTop: '0.25rem' }}>Class: {selectedBooking?.classId?.title}</div>
              </div>

              <FormInput 
                label="Google Meet / Zoom Link" 
                value={meetingLink} 
                onChange={(e) => setMeetingLink(e.target.value)} 
                placeholder="https://meet.google.com/..."
                helper="This link will be shown to the user only after confirmation."
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <Button variant="ghost" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleConfirmAction} style={{ padding: '0.75rem 2rem' }}>
                  Confirm & Notify Student
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .table-row-hover:hover {
          background-color: #f8fafc !important;
        }
      ` }} />
    </div>
  );
};

export default ManageBookings;
