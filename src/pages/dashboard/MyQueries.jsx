import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { MessageSquare, Clock, CheckCircle, User, Send, ChevronDown, ChevronUp } from 'lucide-react';

const MyQueries = () => {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyingTo, setReplyingTo] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);

    const fetchQueries = async () => {
        try {
            const { data } = await api.get('/queries/my');
            setQueries(data.data);
        } catch (error) {
            toast.error("Failed to fetch your queries");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueries();
    }, []);

    const handleSendReply = async (id) => {
        if (!newMessage.trim()) return;
        setSending(true);
        try {
            await api.post(`/queries/${id}/messages`, { message: newMessage });
            toast.success("Message sent");
            setNewMessage('');
            fetchQueries();
        } catch (error) {
            toast.error("Failed to send message");
        } finally {
            setSending(false);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <div className="spinner"></div>
        </div>
    );

    return (
        <div style={{ padding: '0.5rem 1rem 2rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>Personal Support</h1>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>Track and continue your conversations.</p>
            </div>
            
            {queries.length === 0 ? (
                <Card style={{ textAlign: 'center', padding: '5rem 2rem', borderRadius: 'var(--radius-xl)' }}>
                    <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--background)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', color: 'var(--primary)' }}>
                        <MessageSquare size={40} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Active Queries</h3>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>If you have questions regarding your practice or class schedules, please submit a query from the Class Detail or Contact section.</p>
                </Card>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {queries.map((query) => (
                        <div 
                            key={query._id} 
                            style={{ 
                                backgroundColor: 'var(--white)',
                                borderRadius: 'var(--radius-xl)',
                                border: '1px solid var(--border)',
                                boxShadow: 'var(--shadow-sm)',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            {/* Header */}
                            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(74, 124, 89, 0.02)' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 700 }}>{query.subject}</h3>
                                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        Ref: #{query._id.slice(-6).toUpperCase()} • Started {new Date(query.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span style={{ 
                                    padding: '0.5rem 1rem', 
                                    borderRadius: '2rem', 
                                    fontSize: '0.75rem', 
                                    fontWeight: 700,
                                    backgroundColor: query.status === 'Resolved' ? '#d1fae5' : '#fef3c7',
                                    color: query.status === 'Resolved' ? '#065f46' : '#92400e',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    {query.status === 'Resolved' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                    {query.status}
                                </span>
                            </div>
                            
                            {/* Chat Thread */}
                            <div style={{ padding: '2rem', backgroundColor: 'var(--background)', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '500px', overflowY: 'auto' }}>
                                {(query.messages || []).length > 0 ? (
                                    query.messages.map((msg, index) => (
                                        <div 
                                            key={index} 
                                            style={{ 
                                                display: 'flex', 
                                                flexDirection: 'column',
                                                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                                maxWidth: '100%'
                                            }}
                                        >
                                            <div style={{ 
                                                display: 'flex', 
                                                gap: '0.75rem', 
                                                maxWidth: '85%',
                                                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                                            }}>
                                                <div style={{ 
                                                    width: '36px', 
                                                    height: '36px', 
                                                    borderRadius: '50%', 
                                                    backgroundColor: msg.sender === 'user' ? '#f1f5f9' : 'var(--primary)', 
                                                    color: msg.sender === 'user' ? '#64748b' : 'var(--white)',
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center',
                                                    flexShrink: 0
                                                }}>
                                                    {msg.sender === 'user' ? <User size={18} /> : <CheckCircle size={18} />}
                                                </div>
                                                <div style={{ 
                                                    padding: '1rem 1.25rem', 
                                                    borderRadius: msg.sender === 'user' ? '1.25rem 0 1.25rem 1.25rem' : '0 1.25rem 1.25rem 1.25rem',
                                                    backgroundColor: msg.sender === 'user' ? 'var(--white)' : 'var(--primary-light)',
                                                    color: msg.sender === 'user' ? 'var(--text-primary)' : 'var(--white)',
                                                    boxShadow: 'var(--shadow-sm)',
                                                    border: msg.sender === 'user' ? '1px solid var(--border)' : 'none'
                                                }}>
                                                    <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>{msg.message}</p>
                                                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.7rem', opacity: 0.7, textAlign: 'right' }}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ alignSelf: 'flex-end', maxWidth: '85%', padding: '1rem 1.25rem', borderRadius: '1.25rem 0 1.25rem 1.25rem', backgroundColor: 'var(--white)', border: '1px solid var(--border)' }}>
                                            <p style={{ margin: 0 }}>{query.message}</p>
                                        </div>
                                        {query.adminReply && (
                                            <div style={{ alignSelf: 'flex-start', maxWidth: '85%', padding: '1rem 1.25rem', borderRadius: '0 1.25rem 1.25rem 1.25rem', backgroundColor: 'var(--primary-light)', color: 'var(--white)' }}>
                                                <p style={{ margin: 0 }}>{query.adminReply}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Reply Input */}
                            {query.status !== 'Resolved' && (
                                <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--border)', backgroundColor: 'var(--white)' }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <textarea 
                                            placeholder="Type your follow-up message..."
                                            value={replyingTo === query._id ? newMessage : ''}
                                            onFocus={() => setReplyingTo(query._id)}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            style={{ 
                                                flex: 1, 
                                                padding: '1rem', 
                                                borderRadius: 'var(--radius-md)', 
                                                border: '1px solid var(--border)', 
                                                fontFamily: 'inherit', 
                                                fontSize: '0.95rem',
                                                minHeight: '60px',
                                                resize: 'none',
                                                outline: 'none',
                                                transition: 'border-color 0.2s',
                                                backgroundColor: '#f8fafc'
                                            }}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendReply(query._id);
                                                }
                                            }}
                                        />
                                        <button 
                                            onClick={() => handleSendReply(query._id)}
                                            disabled={sending || !newMessage.trim() || replyingTo !== query._id}
                                            style={{ 
                                                padding: '1rem', 
                                                backgroundColor: 'var(--primary)', 
                                                color: 'var(--white)', 
                                                border: 'none', 
                                                borderRadius: '50%', 
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '50px',
                                                height: '50px',
                                                transition: 'all 0.2s',
                                                opacity: sending || !newMessage.trim() || replyingTo !== query._id ? 0.5 : 1
                                            }}
                                        >
                                            <Send size={20} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyQueries;
