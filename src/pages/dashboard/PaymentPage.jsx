import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { CreditCard, Smartphone, Landmark, CheckCircle, AlertCircle, ArrowLeft, ChevronRight, Upload, MessageCircle, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { classData, slots } = location.state || {};

    const [method, setMethod] = useState('upi');
    const [loading, setLoading] = useState(false);
    const [adminSettings, setAdminSettings] = useState(null);
    const [receiptFile, setReceiptFile] = useState(null);
    const [receiptPreview, setReceiptPreview] = useState('');
    const [showChatModal, setShowChatModal] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [sendingChat, setSendingChat] = useState(false);
    const [chatSuccess, setChatSuccess] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await api.get('/admin-settings');
                setAdminSettings(data);
            } catch (error) {
                console.error("Failed to fetch admin settings");
            }
        };
        fetchSettings();

        if (!classData) {
            toast.error("No class selected for payment");
            navigate('/dashboard/book');
        }
    }, [classData, navigate]);

    const totalAmount = (classData?.feePerSession || 0) * (slots || 1);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setReceiptFile(file);
            setReceiptPreview(URL.createObjectURL(file));
        }
    };

    const handleSendChat = async (e) => {
        e.preventDefault();
        if (!chatMessage.trim()) return;
        setSendingChat(true);
        try {
            await api.post('/queries', {
                subject: `Question about ${classData?.title || 'Class'}`,
                message: chatMessage
            });
            setChatSuccess(true);
            setTimeout(() => {
                setChatSuccess(false);
                setShowChatModal(false);
                setChatMessage('');
            }, 2000);
        } catch (error) {
            toast.error("Failed to send message");
        } finally {
            setSendingChat(false);
        }
    };

    const handlePayment = async () => {
        if (!receiptFile) {
            toast.error("Please upload payment receipt screenshot");
            return;
        }
        setLoading(true);
        try {
            let proofUrl = '';
            // Upload receipt image
            const formData = new FormData();
            formData.append('image', receiptFile);
            const uploadRes = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            proofUrl = uploadRes.data.url;

            await api.post('/bookings', {
                classId: classData._id,
                sessions: slots || 1,
                paymentMethod: method,
                amountPaid: totalAmount,
                paymentProof: proofUrl,
                status: 'pending'
            });
            
            toast.success("Payment request submitted successfully!");
            navigate('/dashboard/bookings');
        } catch (error) {
            toast.error(error.response?.data?.message || "Payment failed");
        } finally {
            setLoading(false);
        }
    };

    if (!classData) return null;

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <button 
                onClick={() => navigate(-1)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '2rem', fontWeight: 500 }}
            >
                <ArrowLeft size={18} /> Back to Booking
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                {/* Left Side: Payment Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', margin: 0 }}>Choose Payment Method</h2>
                    
                    <div 
                        onClick={() => setMethod('upi')}
                        style={{ 
                            padding: '1.5rem', 
                            borderRadius: 'var(--radius-lg)', 
                            border: `2px solid ${method === 'upi' ? 'var(--primary)' : 'var(--border)'}`,
                            backgroundColor: method === 'upi' ? 'var(--secondary)' : 'var(--white)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}
                    >
                        <div style={{ backgroundColor: method === 'upi' ? 'var(--primary)' : 'var(--background)', color: method === 'upi' ? 'var(--white)' : 'var(--text-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                            <Smartphone size={24} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>UPI Payment</h4>
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Google Pay, PhonePe, Paytm</p>
                        </div>
                        {method === 'upi' && <CheckCircle size={20} style={{ color: 'var(--primary)' }} />}
                    </div>

                    <div 
                        onClick={() => setMethod('card')}
                        style={{ 
                            padding: '1.5rem', 
                            borderRadius: 'var(--radius-lg)', 
                            border: `2px solid ${method === 'card' ? 'var(--primary)' : 'var(--border)'}`,
                            backgroundColor: method === 'card' ? 'var(--secondary)' : 'var(--white)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}
                    >
                        <div style={{ backgroundColor: method === 'card' ? 'var(--primary)' : 'var(--background)', color: method === 'card' ? 'var(--white)' : 'var(--text-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                            <CreditCard size={24} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Credit / Debit Card</h4>
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Visa, Mastercard, RuPay</p>
                        </div>
                        {method === 'card' && <CheckCircle size={20} style={{ color: 'var(--primary)' }} />}
                    </div>

                    <div 
                        onClick={() => setMethod('netbanking')}
                        style={{ 
                            padding: '1.5rem', 
                            borderRadius: 'var(--radius-lg)', 
                            border: `2px solid ${method === 'netbanking' ? 'var(--primary)' : 'var(--border)'}`,
                            backgroundColor: method === 'netbanking' ? 'var(--secondary)' : 'var(--white)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}
                    >
                        <div style={{ backgroundColor: method === 'netbanking' ? 'var(--primary)' : 'var(--background)', color: method === 'netbanking' ? 'var(--white)' : 'var(--text-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                            <Landmark size={24} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Net Banking</h4>
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>All major Indian banks</p>
                        </div>
                        {method === 'netbanking' && <CheckCircle size={20} style={{ color: 'var(--primary)' }} />}
                    </div>

                    {method === 'upi' && adminSettings?.upiId && (
                        <div style={{ padding: '1.5rem', backgroundColor: '#eff6ff', borderRadius: 'var(--radius-lg)', border: '1px solid #bfdbfe', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
                                <QRCodeSVG value={`upi://pay?pa=${adminSettings.upiId}&pn=${encodeURIComponent(adminSettings.adminName || 'Sattva Yoga')}&cu=INR`} size={180} />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#1e40af', fontWeight: 600 }}>UPI ID: {adminSettings.upiId}</p>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#60a5fa' }}>Scan the QR code or use the UPI ID above to pay.</p>
                            </div>
                        </div>
                    )}

                    <Card style={{ padding: '1.5rem', border: '1px dashed var(--primary)' }}>
                        <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Upload size={18} /> Upload Payment Receipt
                        </h4>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange}
                            style={{ width: '100%', marginBottom: '1rem' }}
                            required
                        />
                        {receiptPreview && (
                            <img src={receiptPreview} alt="Receipt Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }} />
                        )}
                        <p style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            Please upload a screenshot of your successful transaction for verification.
                        </p>
                    </Card>

                    <div 
                        onClick={() => setShowChatModal(true)}
                        className="modern-card"
                        style={{ 
                            padding: '1.5rem', 
                            borderRadius: 'var(--radius-lg)', 
                            backgroundColor: 'var(--white)',
                            border: '1px solid var(--primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.25rem',
                            background: 'linear-gradient(135deg, var(--white) 0%, var(--secondary) 100%)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1, color: 'var(--primary)' }}>
                            <MessageCircle size={80} />
                        </div>
                        <div style={{ backgroundColor: 'var(--primary)', color: 'var(--white)', padding: '0.75rem', borderRadius: '50%', boxShadow: '0 4px 12px rgba(74, 124, 89, 0.3)' }}>
                            <MessageCircle size={24} />
                        </div>
                        <div style={{ flex: 1, zIndex: 1 }}>
                            <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary-dark)', fontWeight: 700 }}>Personal Consultation</h4>
                            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Unsure? Ask the instructor anything before booking.</p>
                        </div>
                        <ChevronRight size={20} style={{ color: 'var(--primary)' }} />
                    </div>

                    {method === 'netbanking' && adminSettings?.bankAccount && (
                        <div style={{ padding: '1.5rem', backgroundColor: '#f0fdf4', borderRadius: 'var(--radius-lg)', border: '1px solid #bbf7d0' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>A/C Holder:</span>
                                <span style={{ fontWeight: 600, color: '#166534' }}>{adminSettings.accountHolder}</span>
                                <span style={{ color: 'var(--text-secondary)' }}>Bank:</span>
                                <span style={{ fontWeight: 600, color: '#166534' }}>{adminSettings.bankName}</span>
                                <span style={{ color: 'var(--text-secondary)' }}>A/C No:</span>
                                <span style={{ fontWeight: 600, color: '#166534' }}>{adminSettings.bankAccount}</span>
                                <span style={{ color: 'var(--text-secondary)' }}>IFSC:</span>
                                <span style={{ fontWeight: 600, color: '#166534' }}>{adminSettings.ifscCode}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side: Order Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Card style={{ padding: '2rem', position: 'sticky', top: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: '0 0 1.5rem 0', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Order Summary</h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>{classData.title}</h4>
                                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{classData.schedule}</p>
                                </div>
                                <span style={{ fontWeight: 600 }}>₹{classData.feePerSession}</span>
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Number of Sessions/Slots</span>
                                <span>x {slots || 1}</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: '#10b981', fontWeight: 500 }}>
                                <span>Discount</span>
                                <span>- ₹0</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px dashed var(--border)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Total Amount</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>₹{totalAmount}</span>
                        </div>

                        <Button 
                            variant="primary" 
                            size="lg" 
                            style={{ width: '100%', marginBottom: '1rem' }} 
                            onClick={handlePayment}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : `Pay ₹${totalAmount}`}
                        </Button>

                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                            <AlertCircle size={14} /> Your payment is secured with 256-bit encryption
                        </p>
                    </Card>

                    <div style={{ backgroundColor: 'var(--background)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                        <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1rem', color: 'var(--text-primary)' }}>Why join this class?</h4>
                        <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {['Improve flexibility & strength', 'Personalized attention', 'Calm and serene environment'].map((item, i) => (
                                <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <ChevronRight size={14} style={{ color: 'var(--primary)' }} /> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Chat with Admin Modal */}
            {showChatModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div 
                        className="glass-card animate-fade-in"
                        style={{ width: '100%', maxWidth: '500px', padding: '2.5rem', position: 'relative', borderRadius: 'var(--radius-xl)' }}
                    >
                        {!chatSuccess ? (
                            <>
                                <button 
                                    onClick={() => setShowChatModal(false)}
                                    style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                                >
                                    <X size={24} />
                                </button>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div style={{ padding: '0.75rem', backgroundColor: 'var(--secondary)', color: 'var(--primary)', borderRadius: 'var(--radius-md)' }}>
                                        <MessageCircle size={28} />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.5rem' }}>Direct Message</h3>
                                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Consulting about {classData.title}</p>
                                    </div>
                                </div>
                                
                                <form onSubmit={handleSendChat} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Your Message</label>
                                        <textarea 
                                            value={chatMessage}
                                            onChange={(e) => setChatMessage(e.target.value)}
                                            placeholder="What would you like to know?"
                                            required
                                            style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', minHeight: '150px', fontFamily: 'inherit', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
                                            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                                        />
                                    </div>
                                    <Button type="submit" variant="primary" size="lg" disabled={sendingChat} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                        {sendingChat ? 'Sending Knowledge...' : 'Send to Instructor'}
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                <div style={{ width: '80px', height: '80px', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                                    <CheckCircle size={48} />
                                </div>
                                <h3 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>Message Sent!</h3>
                                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>The instructor will get back to you shortly.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentPage;
