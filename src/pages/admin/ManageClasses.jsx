import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import Card from '../../components/Card';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import { Edit, Trash2, Plus, X } from 'lucide-react';

const ManageClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 60,
    schedule: '',
    difficulty: 'Beginner',
    maxSlots: 15,
    category: 'Yoga',
    feePerSession: 0,
    totalSessions: 1
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/classes');
      setClasses(data);
    } catch (error) {
      toast.error('Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (cls = null) => {
    if (cls) {
      setEditingClass(cls);
      setFormData({
        title: cls.title,
        description: cls.description,
        duration: cls.duration,
        schedule: cls.schedule,
        difficulty: cls.difficulty,
        maxSlots: cls.maxSlots,
        category: cls.category || 'Yoga',
        feePerSession: cls.feePerSession || 0,
        totalSessions: cls.totalSessions || 1
      });
      if (cls.imageUrl) {
        setPreviewUrl(`http://localhost:5000${cls.imageUrl}`);
      } else {
        setPreviewUrl('');
      }
    } else {
      setEditingClass(null);
      setFormData({
        title: '',
        description: '',
        duration: 60,
        schedule: '',
        difficulty: 'Beginner',
        maxSlots: 15,
        category: 'Yoga',
        feePerSession: 0,
        totalSessions: 1
      });
      setPreviewUrl('');
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClass(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let finalImageUrl = editingClass ? editingClass.imageUrl : undefined;

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);
        const uploadRes = await api.post('/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        finalImageUrl = uploadRes.data.url;
      }

      const payload = { ...formData, imageUrl: finalImageUrl };

      if (editingClass) {
        await api.put(`/classes/${editingClass._id}`, payload);
        toast.success('Class updated successfully');
      } else {
        await api.post('/classes', payload);
        toast.success('Class created successfully');
      }
      closeModal();
      fetchClasses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save class');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
      try {
        await api.delete(`/classes/${id}`);
        toast.success('Class deleted');
        fetchClasses();
      } catch (error) {
        toast.error('Failed to delete class');
      }
    }
  };

  if (loading && classes.length === 0) return <div>Loading classes...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0, color: '#1e293b' }}>Manage Classes</h1>
        <Button variant="primary" onClick={() => openModal()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add New Class
        </Button>
      </div>

      <Card style={{ overflowX: 'auto', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Class Title</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Schedule</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Level</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Duration</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Capacity</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No classes found. Create one to get started!</td>
              </tr>
            ) : (
              classes.map((cls) => (
                <tr key={cls._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '1rem', color: '#0f172a', fontWeight: 500 }}>{cls.title}</td>
                  <td style={{ padding: '1rem', color: '#475569', fontSize: '0.875rem' }}>{cls.schedule}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: cls.difficulty === 'Beginner' ? '#dcfce7' : cls.difficulty === 'Intermediate' ? '#fef08a' : '#e0e7ff',
                      color: cls.difficulty === 'Beginner' ? '#166534' : cls.difficulty === 'Intermediate' ? '#854d0e' : '#3730a3'
                    }}>
                      {cls.difficulty}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#475569', fontSize: '0.875rem' }}>{cls.duration} min</td>
                  <td style={{ padding: '1rem', color: '#475569', fontSize: '0.875rem' }}>{cls.maxSlots} slots</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button onClick={() => openModal(cls)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', marginRight: '1rem' }} title="Edit">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(cls._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }} title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
          <Card style={{ width: '100%', maxWidth: '600px', padding: '2rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <X size={24} />
            </button>
            <h2 style={{ margin: '0 0 1.5rem 0', color: '#0f172a' }}>{editingClass ? 'Edit Class' : 'Create New Class'}</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <FormInput label="Class Title" name="title" value={formData.title} onChange={handleInputChange} required />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontFamily: 'inherit', fontSize: '1rem', minHeight: '100px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <FormInput label="Schedule (e.g., Monday 8:00 AM)" name="schedule" value={formData.schedule} onChange={handleInputChange} required />
                <FormInput label="Duration (minutes)" name="duration" type="number" value={formData.duration} onChange={handleInputChange} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>Difficulty Level</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--white)', fontSize: '1rem' }}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--white)', fontSize: '1rem' }}
                  >
                    <option value="Yoga">Yoga</option>
                    <option value="Meditation">Meditation</option>
                    <option value="Breathing">Breathing</option>
                  </select>
                </div>
                <FormInput label="Duration (minutes)" name="duration" type="number" value={formData.duration} onChange={handleInputChange} required />
                <FormInput label="Max Capacity (Slots)" name="maxSlots" type="number" value={formData.maxSlots} onChange={handleInputChange} required />
                <FormInput label="Fee per Session (₹)" name="feePerSession" type="number" value={formData.feePerSession} onChange={handleInputChange} required />
                <FormInput label="Total Sessions" name="totalSessions" type="number" value={formData.totalSessions} onChange={handleInputChange} required />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Class Image (Optional)</label>
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'block', width: '100%', padding: '0.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }} />
                {previewUrl && (
                  <img src={previewUrl.startsWith('blob:') ? previewUrl : previewUrl} alt="Preview" style={{ marginTop: '1rem', width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <Button type="button" variant="ghost" onClick={closeModal}>Cancel</Button>
                <Button type="submit" variant="primary">{editingClass ? 'Save Changes' : 'Create Class'}</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ManageClasses;
