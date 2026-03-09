import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Recommendations from '../../components/Recommendations';
import { Clock, Calendar, Users, IndianRupee, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const BookClass = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [adminSettings, setAdminSettings] = useState(null);

  // Modal State
  const [selectedClass, setSelectedClass] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionsToBook, setSessionsToBook] = useState(1);
  const [paymentProof, setPaymentProof] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchClassesAndSettings = async () => {
      try {
        const [classesRes, settingsRes] = await Promise.all([
          api.get('/classes'),
          fetch('http://localhost:5000/api/admin-settings').then(res => res.json())
        ]);
        setClasses(classesRes.data);
        setAdminSettings(settingsRes);
      } catch (error) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchClassesAndSettings();
  }, []);

  const openBookingModal = (cls) => {
    setSelectedClass(cls);
    setSessionsToBook(1);
    setPaymentProof(null);
    setPreviewUrl('');
    setIsModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsModalOpen(false);
    setSelectedClass(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentProof(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!paymentProof && React.feePerSession > 0) {
      // If payment required but no proof uploaded
      // (Optional: validate)
    }

    setBookingLoading(true);
    try {
      let proofUrl = '';

      if (paymentProof) {
        const formData = new FormData();
        formData.append('image', paymentProof);
        const uploadRes = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          proofUrl = uploadData.url;
        } else {
          throw new Error('Screenshot upload failed');
        }
      }

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          classId: selectedClass._id,
          sessions: sessionsToBook,
          paymentProof: proofUrl
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Booking requested successfully!');
        closeBookingModal();
      } else {
        throw new Error(data.message || 'Failed to book');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to request booking');
    } finally {
      setBookingLoading(false);
    }
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

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  {cls.description}
                </p>

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
                <Button onClick={() => openBookingModal(cls)} style={{ width: '100%' }}>
                  Make Booking Request
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {isModalOpen && selectedClass && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
          <Card style={{ width: '100%', maxWidth: '600px', padding: '2rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={closeBookingModal} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <X size={24} />
            </button>

            <h2 style={{ margin: '0 0 0.5rem 0', color: '#0f172a' }}>Book {selectedClass.title}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Review details and complete your payment.</p>

            <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Instructor:</span>
                  <span style={{ fontWeight: 500 }}>{selectedClass.instructor || 'Admin'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Fee per session:</span>
                  <span style={{ fontWeight: 500 }}>₹{selectedClass.feePerSession || 0}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Sessions to book:</span>
                  <select
                    value={sessionsToBook}
                    onChange={(e) => setSessionsToBook(Number(e.target.value))}
                    style={{ padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                  >
                    {[...Array(selectedClass.totalSessions || 1)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed #cbd5e1', fontWeight: 600, fontSize: '1.1rem', color: '#0f172a' }}>
                  <span>Total Due:</span>
                  <span style={{ color: 'var(--primary-dark)' }}>₹{(selectedClass.feePerSession || 0) * sessionsToBook}</span>
                </div>
              </div>

              {adminSettings && (
                <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#1e293b' }}>Payment Information</h3>

                  {adminSettings.qrCodeUrl ? (
                    <img src={`http://localhost:5000${adminSettings.qrCodeUrl}`} alt="Payment QR" style={{ width: '150px', height: '150px', objectFit: 'contain', margin: '0 auto', display: 'block', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-sm)' }} />
                  ) : adminSettings.upiId ? (
                    <div style={{ margin: '0 auto 1.5rem auto', display: 'flex', justifyContent: 'center' }}>
                      <QRCodeSVG value={`upi://pay?pa=${adminSettings.upiId}&pn=${encodeURIComponent(adminSettings.adminName)}&cu=INR`} size={150} />
                    </div>
                  ) : (
                    <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>No payment methods configured by admin.</p>
                  )}

                  <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                    <strong>Pay to: </strong> {adminSettings.adminName} <br />
                    <strong style={{ color: 'var(--primary)' }}>{adminSettings.upiId}</strong>
                  </div>

                  <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Upload Payment Screenshot *</label>
                    <input type="file" required accept="image/*" onChange={handleImageChange} style={{ display: 'block', width: '100%', padding: '0.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }} />
                    {previewUrl && (
                      <img src={previewUrl} alt="Preview" style={{ marginTop: '1rem', width: '100%', maxHeight: '150px', objectFit: 'contain', borderRadius: 'var(--radius-md)' }} />
                    )}
                  </div>
                </div>
              )}

              <Button type="submit" variant="primary" disabled={bookingLoading} style={{ width: '100%' }}>
                {bookingLoading ? 'Submitting...' : 'Submit Booking Request'}
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BookClass;
