import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { MessageSquare, Clock, CheckCircle, RefreshCcw, User, Mail, Send, X, AlertCircle } from 'lucide-react';

const ManageQueries = () => {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyingTo, setReplyingTo] = useState(null);
    const [adminReply, setAdminReply] = useState('');
    const [sending, setSending] = useState(false);

    const fetchQueries = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/queries');
            setQueries(data.data);
        } catch (error) {
            toast.error("Failed to fetch queries");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueries();
    }, []);

    const handleSendReply = async (id) => {
        if (!adminReply.trim()) {
            toast.error("Please enter a message");
            return;
        }
        setSending(true);
        try {
            await api.post(`/queries/${id}/messages`, { message: adminReply });
            toast.success("Reply sent");
            setAdminReply('');
            setReplyingTo(null);
            fetchQueries();
        } catch (error) {
            toast.error("Failed to send reply");
        } finally {
            setSending(false);
        }
    };

    const handleResolve = async (id) => {
        try {
            await api.put(`/queries/${id}`, { status: 'Resolved' });
            toast.success("Query marked as Resolved");
            fetchQueries();
        } catch (error) {
            toast.error("Failed to resolve query");
        }
    };

    if (loading) return (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem auto' }}></div>
            <p style={{ color: 'var(--text-secondary)' }}>Loading conversations...</p>
        </div>
    );

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', color: '#0f172a', margin: 0, fontWeight: 700 }}>Query Management</h1>
                    <p style={{ color: '#64748b', margin: '0.25rem 0 0 0' }}>Communicate with students and resolve their issues.</p>
                </div>
                <Button variant="ghost" onClick={fetchQueries} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f1f5f9' }}>
                    <RefreshCcw size={18} /> Refresh
                </Button>
            </div>

            {queries.length === 0 ? (
                <Card style={{ textAlign: 'center', padding: '5rem 2rem', borderRadius: 'var(--radius-xl)' }}>
                    <div style={{ width: '80px', height: '80px', backgroundColor: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', color: '#94a3b8' }}>
                        <MessageSquare size={40} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#1e293b' }}>Clear Workspace</h3>
                    <p style={{ color: '#64748b', maxWidth: '400px', margin: '0 auto' }}>There are currently no active user queries to respond to. Great job!</p>
                </Card>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    {queries.map((query) => (
                        <Card key={query._id} style={{ padding: 0, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                            {/* Header */}
                            <div style={{ padding: '1.25rem 2rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', fontWeight: 700 }}>
                                        {query.user?.name ? query.user.name.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', fontWeight: 700 }}>{query.user?.name || 'Unknown User'}</h3>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{query.user?.email} • {query.subject}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{ 
                                        padding: '0.4rem 0.8rem', 
                                        borderRadius: '0.5rem', 
                                        fontSize: '0.75rem', 
                                        fontWeight: 700,
                                        backgroundColor: query.status === 'Resolved' ? '#dcfce7' : query.status === 'In Progress' ? '#dbeafe' : '#fef3c7',
                                        color: query.status === 'Resolved' ? '#166534' : query.status === 'In Progress' ? '#1e40af' : '#92400e',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem'
                                    }}>
                                        {query.status === 'Resolved' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                                        {query.status}
                                    </span>
                                    {query.status !== 'Resolved' && (
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => handleResolve(query._id)}
                                            style={{ color: '#10b981', backgroundColor: '#f0fdf4', fontSize: '0.8rem' }}
                                        >
                                            Mark Resolved
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Conversation Thread */}
                            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#fff', maxHeight: '400px', overflowY: 'auto' }}>
                                {(query.messages || []).length > 0 ? (
                                    query.messages.map((msg, index) => (
                                        <div 
                                            key={index} 
                                            style={{ 
                                                display: 'flex', 
                                                flexDirection: 'column',
                                                alignItems: msg.sender === 'admin' ? 'flex-end' : 'flex-start'
                                            }}
                                        >
                                            <div style={{ 
                                                maxWidth: '80%',
                                                padding: '1rem 1.25rem',
                                                borderRadius: msg.sender === 'admin' ? '1rem 0 1rem 1rem' : '0 1rem 1rem 1rem',
                                                backgroundColor: msg.sender === 'admin' ? '#1e293b' : '#f1f5f9',
                                                color: msg.sender === 'admin' ? '#fff' : '#1e293b',
                                                position: 'relative'
                                            }}>
                                                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>{msg.message}</p>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem', opacity: 0.6, fontSize: '0.7rem' }}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ alignSelf: 'flex-start', maxWidth: '85%', padding: '1rem 1.25rem', borderRadius: '0 1rem 1rem 1rem', backgroundColor: '#f1f5f9' }}>
                                            <p style={{ margin: 0 }}>{query.message}</p>
                                        </div>
                                        {query.adminReply && (
                                            <div style={{ alignSelf: 'flex-end', maxWidth: '85%', padding: '1rem 1.25rem', borderRadius: '1rem 0 1rem 1rem', backgroundColor: '#1e293b', color: '#fff' }}>
                                                <p style={{ margin: 0 }}>{query.adminReply}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Admin Input Area */}
                            {query.status !== 'Resolved' && (
                                <div style={{ padding: '1.5rem 2rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <textarea 
                                            value={replyingTo === query._id ? adminReply : ''}
                                            onFocus={() => setReplyingTo(query._id)}
                                            onChange={(e) => setAdminReply(e.target.value)}
                                            placeholder="Write your response here..."
                                            style={{ 
                                                flex: 1, 
                                                padding: '1rem', 
                                                borderRadius: '0.75rem', 
                                                border: '1px solid #d1d5db', 
                                                minHeight: '80px', 
                                                fontFamily: 'inherit',
                                                fontSize: '0.95rem',
                                                outline: 'none',
                                                resize: 'none'
                                            }}
                                        />
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <Button 
                                                onClick={() => handleSendReply(query._id)}
                                                disabled={sending || !adminReply.trim() || replyingTo !== query._id}
                                                style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60px' }}
                                            >
                                                <Send size={20} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageQueries;
