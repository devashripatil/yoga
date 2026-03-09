import React, { useState, useEffect, useContext } from 'react';
import api from '../../utils/api';
import AuthContext from '../../context/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, loginUser } = useContext(AuthContext); // we can reuse login context update logic or just refresh
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    newPassword: '',
    wellnessGoal: '',
    experienceLevel: '',
    preferredTime: '',
    dietPreference: '',
    timeAvailable: 30
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        wellnessGoal: user.wellnessGoal || '',
        experienceLevel: user.experienceLevel || '',
        preferredTime: user.preferredTime || '',
        dietPreference: user.dietPreference || '',
        timeAvailable: user.timeAvailable || 30
      }));
    }
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create payload, omit empty passwords
      const payload = { ...formData };
      if (!payload.password || !payload.newPassword) {
        delete payload.password;
        delete payload.newPassword;
      }

      await api.put('/users/profile', payload);
      toast.success('Profile updated successfully');
      
      // Clear password fields after success
      setFormData(prev => ({ ...prev, password: '', newPassword: '' }));
      
      // In a real app we might want to refresh the global user context here
      // For now, next full reload will grab it
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Profile Settings</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Update your personal details and account preferences.</p>

      <Card style={{ padding: '2rem', maxWidth: '600px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Personal Information</h3>
          <FormInput label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
          <FormInput label="Email Address" name="email" value={formData.email} onChange={handleChange} type="email" required />
          <FormInput label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} type="tel" />
          
          <h3 style={{ margin: '1rem 0 0.5rem 0', color: 'var(--text-primary)', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Wellness Preferences</h3>
          
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)' }}>What is your goal?</label>
            <select name="wellnessGoal" value={formData.wellnessGoal} onChange={handleChange} style={{
              padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontFamily: 'inherit', fontSize: '1rem', backgroundColor: 'var(--background)'
            }}>
              <option value="">-- Choose a goal --</option>
              <option value="Reduce stress">Reduce stress</option>
              <option value="Improve flexibility">Improve flexibility</option>
              <option value="Meditation practice">Meditation practice</option>
              <option value="Fitness">Fitness</option>
            </select>
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Experience level</label>
            <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} style={{
              padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontFamily: 'inherit', fontSize: '1rem', backgroundColor: 'var(--background)'
            }}>
              <option value="">-- Choose experience --</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Preferred time</label>
            <select name="preferredTime" value={formData.preferredTime} onChange={handleChange} style={{
              padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontFamily: 'inherit', fontSize: '1rem', backgroundColor: 'var(--background)'
            }}>
              <option value="">-- Choose time --</option>
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
            </select>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '0.5rem' }}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Diet Preference</label>
              <select name="dietPreference" value={formData.dietPreference} onChange={handleChange} style={{
                padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontFamily: 'inherit', fontSize: '1rem', backgroundColor: 'var(--background)'
              }}>
                <option value="">-- Choose diet --</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Balanced">Balanced</option>
              </select>
            </div>
            
            <FormInput label="Daily Time Available (mins)" name="timeAvailable" value={formData.timeAvailable} onChange={handleChange} type="number" min="10" max="180" />
          </div>
          
          <h3 style={{ margin: '1rem 0 0.5rem 0', color: 'var(--text-primary)', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Change Password (Optional)</h3>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Leave blank if you don't want to change your password.</p>
          <FormInput label="Current Password" name="password" value={formData.password} onChange={handleChange} type="password" />
          <FormInput label="New Password" name="newPassword" value={formData.newPassword} onChange={handleChange} type="password" />

          <Button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Profile;
