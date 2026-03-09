import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import toast from 'react-hot-toast';
import { Bell } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (error) {
      toast.error('Failed to update notification');
    }
  };

  if (loading) return <p>Loading notifications...</p>;

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Notifications</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Stay updated with class reminders and system alerts.</p>

      {notifications.length === 0 ? (
        <Card style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--text-secondary)', opacity: 0.5 }}>
            <Bell size={48} />
          </div>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>You're all caught up! No notifications right now.</p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notifications.map((note) => (
            <Card key={note._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1.5rem', borderLeft: note.read ? 'none' : '4px solid var(--primary)', backgroundColor: note.read ? 'var(--white)' : 'rgba(74, 124, 89, 0.02)' }}>
              <div>
                <p style={{ margin: '0 0 0.5rem 0', color: note.read ? 'var(--text-secondary)' : 'var(--text-primary)', fontSize: '1.05rem' }}>
                  {note.message}
                </p>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>
              {!note.read && (
                <Button variant="ghost" size="sm" onClick={() => markAsRead(note._id)}>
                  Mark Read
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
