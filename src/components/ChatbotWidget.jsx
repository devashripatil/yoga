import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import api from '../utils/api';

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Namaste! I am your AI Yoga Assistant. How can I guide your practice today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const toggleChat = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setIsTyping(true);

        try {
            // Send to backend API
            const response = await fetch('http://localhost:5000/api/yoga-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg })
            });

            const data = await response.json();

            if (response.ok) {
                setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
            } else {
                throw new Error(data.error || 'Failed to get response');
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'ai', content: "I'm sorry, my spiritual connection is weak right now. Please tell the Admin to configure their Gemini API Key in the server `.env` file! 🙏" }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    style={{
                        position: 'fixed',
                        bottom: '2rem',
                        right: '2rem',
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(74, 124, 89, 0.4)',
                        cursor: 'pointer',
                        zIndex: 9999,
                        transition: 'transform 0.3s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    title="Open Yoga Assistant"
                >
                    <MessageCircle size={28} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    width: '350px',
                    height: '500px',
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 9999,
                    overflow: 'hidden',
                    animation: 'slideUp 0.3s ease-out'
                }}>
                    {/* Header */}
                    <div style={{
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        padding: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Bot size={24} />
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-heading)' }}>Yoga AI Assistant</h3>
                        </div>
                        <button onClick={toggleChat} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div style={{
                        flex: 1,
                        padding: '1rem',
                        overflowY: 'auto',
                        backgroundColor: '#f8fafc',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        {messages.map((msg, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                gap: '0.5rem',
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '85%'
                            }}>
                                {msg.role === 'ai' && (
                                    <div style={{
                                        width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0
                                    }}>
                                        <Bot size={16} />
                                    </div>
                                )}

                                <div style={{
                                    backgroundColor: msg.role === 'user' ? 'var(--primary)' : 'white',
                                    color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                                    padding: '0.75rem 1rem',
                                    borderRadius: msg.role === 'user' ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                    fontSize: '0.9rem',
                                    lineHeight: 1.4,
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                                    <Bot size={16} />
                                </div>
                                <div style={{ backgroundColor: 'white', padding: '0.75rem 1rem', borderRadius: '1rem 1rem 1rem 0', display: 'flex', gap: '4px' }}>
                                    <span className="typing-dot" style={{ width: '6px', height: '6px', backgroundColor: '#cbd5e1', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }}></span>
                                    <span className="typing-dot" style={{ width: '6px', height: '6px', backgroundColor: '#cbd5e1', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.2s' }}></span>
                                    <span className="typing-dot" style={{ width: '6px', height: '6px', backgroundColor: '#cbd5e1', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.4s' }}></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} style={{
                        display: 'flex',
                        padding: '1rem',
                        backgroundColor: 'white',
                        borderTop: '1px solid var(--border)'
                    }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about yoga or classes..."
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-md) 0 0 var(--radius-md)',
                                outline: 'none',
                                fontFamily: 'inherit'
                            }}
                            disabled={isTyping}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            style={{
                                backgroundColor: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                padding: '0 1rem',
                                borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                                cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
                                opacity: input.trim() && !isTyping ? 1 : 0.7,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
            <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
        </>
    );
};

export default ChatbotWidget;
