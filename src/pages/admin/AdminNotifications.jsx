import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import Card from '../../components/Card';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import { Send, Users, Bell } from 'lucide-react';

const AdminNotifications = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    targetUser: 'all', // 'all' or specific userId
    message: '',
    sendEmail: false,
    emailSubject: ''
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/users');
        setUsers(data);
      } catch (error) {
        toast.error('Failed to fetch user list');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleDispatch = async (e) => {
    e.preventDefault();
    
    if (!formData.message.trim()) {
      toast.error('Message content cannot be empty');
      return;
    }

    try {
      const payload = {
        userId: formData.targetUser === 'all' ? null : formData.targetUser,
        message: formData.message,
        sendEmail: formData.sendEmail,
        emailSubject: formData.emailSubject
      };

      // In a real production app we would have a unified `/notifications/broadcast` endpoint on the backend
      // taking advantage of the notificationController we built.
      await api.post('/notifications', payload); 
      
      toast.success('Notification dispatched successfully!');
      setFormData({ ...formData, message: '', emailSubject: '' });
    } catch (error) {
      toast.error('Failed to dispatch notification');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#1e293b' }}>Dispatch Alerts</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem', alignItems: 'start' }}>
        
        <Card style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: '#eff6ff', borderRadius: '50%', color: '#3b82f6' }}>
              <Send size={24} />
            </div>
            <div>
              <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.25rem' }}>New Announcement</h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>Broadcast messages instantly to student dashboards.</p>
            </div>
          </div>

          <form onSubmit={handleDispatch} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={16} /> Target Audience
              </label>
              <select 
                name="targetUser" 
                value={formData.targetUser} 
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: 'white' }}
              >
                <option value="all">Broadcast to All Students</option>
                <optgroup label="Specific Students">
                  {users.filter(u => u.role !== 'admin').map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bell size={16} /> Alert Message
              </label>
              <textarea 
                name="message" 
                value={formData.message} 
                onChange={handleInputChange} 
                placeholder="Type your announcement here..."
                required
                style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontFamily: 'inherit', fontSize: '1rem', minHeight: '150px', resize: 'vertical', outline: 'none' }}
              />
            </div>

            <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginBottom: formData.sendEmail ? '1rem' : 0 }}>
                <input 
                  type="checkbox" 
                  name="sendEmail" 
                  checked={formData.sendEmail} 
                  onChange={handleInputChange}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontWeight: 600, color: '#334155' }}>Simultaneously send as Email (Requires SMTP config)</span>
              </label>

              {formData.sendEmail && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginLeft: '2rem', animation: 'fadeIn 0.3s ease' }}>
                  <FormInput 
                    label="Email Subject Line" 
                    name="emailSubject" 
                    value={formData.emailSubject} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Important Update from Sattva Yoga"
                    required={formData.sendEmail}
                  />
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>The Alert Message text above will be injected into an HTML email template automatically.</p>
                </div>
              )}
            </div>

            <Button type="submit" variant="primary" style={{ padding: '1rem', fontSize: '1rem' }}>
              Dispatch Notification
            </Button>

          </form>
        </Card>

        <Card style={{ backgroundColor: '#fef3c7', border: '1px solid #fde68a' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#92400e', fontSize: '1.125rem' }}>Admin Tips</h3>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#b45309', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li>Students will see alerts immediately on their Dashboards if they are currently logged in via <strong>WebSockets</strong>.</li>
            <li>For urgent class cancellations, ensure you check the "Send as Email" box so users are notified on their mobile devices.</li>
            <li>Be careful when broadcasting to All Students, as this cannot be undone.</li>
          </ul>
        </Card>

      </div>
    </div>
  );
};

export default AdminNotifications;
