import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import Card from '../../components/Card';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import { Edit, Trash2, Plus, X, Calendar, Clock, Users, Link as LinkIcon, Layers, IndianRupee, Image as ImageIcon } from 'lucide-react';

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
    totalSessions: 1,
    meetingLink: ''
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
        totalSessions: cls.totalSessions || 1,
        meetingLink: cls.meetingLink || ''
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
        totalSessions: 1,
        meetingLink: ''
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

  if (loading && classes.length === 0) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div className="spinner"></div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>Class Management</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Create and organize your yoga sessions.</p>
        </div>
        <Button variant="primary" onClick={() => openModal()} style={{ borderRadius: 'var(--radius-lg)', padding: '0.75rem 1.5rem', fontWeight: 600, boxShadow: '0 4px 14px 0 rgba(74, 124, 89, 0.39)' }}>
          <Plus size={20} style={{ marginRight: '0.5rem' }} /> Add New Class
        </Button>
      </div>

      {classes.length === 0 ? (
        <Card style={{ padding: '4rem', textAlign: 'center', backgroundColor: '#f9fafb', border: '2px dashed #e2e8f0' }}>
          <Layers size={48} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
          <h3 style={{ color: '#64748b', marginBottom: '0.5rem' }}>No classes found</h3>
          <p style={{ color: '#94a3b8' }}>Get started by creating your first session.</p>
          <Button variant="outline" onClick={() => openModal()} style={{ marginTop: '1rem' }}>Create Class</Button>
        </Card>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '2rem',
          paddingBottom: '2rem'
        }}>
          {classes.map((cls, index) => (
            <Card 
              key={cls._id} 
              className={`modern-card stagger-${(index % 3) + 1}`}
              style={{ padding: 0, position: 'relative', overflow: 'hidden', border: 'none' }}
            >
              <div style={{ width: '100%', height: '180px', backgroundColor: '#f1f5f9', position: 'relative', overflow: 'hidden' }}>
                {cls.imageUrl ? (
                  <img 
                    src={`http://localhost:5000${cls.imageUrl}`} 
                    alt={cls.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#cbd5e1' }}>
                    <ImageIcon size={48} />
                  </div>
                )}
                <div style={{ 
                  position: 'absolute', 
                  top: '1rem', 
                  right: '1rem', 
                  display: 'flex', 
                  gap: '0.5rem' 
                }}>
                  <span style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em',
                    backgroundColor: cls.difficulty === 'Beginner' ? '#dcfce7' : cls.difficulty === 'Intermediate' ? '#fef9c3' : '#e0e7ff',
                    color: cls.difficulty === 'Beginner' ? '#166534' : cls.difficulty === 'Intermediate' ? '#854d0e' : '#3730a3',
                    backdropFilter: 'blur(4px)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    {cls.difficulty}
                  </span>
                </div>
                <div style={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  padding: '0.5rem 1rem', 
                  backgroundColor: 'rgba(74, 124, 89, 0.9)', 
                  color: 'white', 
                  fontSize: '0.75rem', 
                  fontWeight: 600,
                  borderTopRightRadius: 'var(--radius-md)'
                }}>
                  {cls.category || 'Yoga'}
                </div>
              </div>

              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 700, color: '#1e293b' }}>{cls.title}</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b', fontSize: '0.875rem' }}>
                    <Calendar size={16} />
                    <span>{cls.schedule}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b', fontSize: '0.875rem' }}>
                    <Clock size={16} />
                    <span>{cls.duration} mins • {cls.totalSessions} Sessions</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b', fontSize: '0.875rem' }}>
                    <Users size={16} />
                    <span>{cls.maxSlots} Slots Available</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', fontSize: '1rem', fontWeight: 700 }}>
                    <IndianRupee size={16} />
                    <span>{cls.feePerSession} / session</span>
                  </div>
                </div>

                <div style={{ 
                  marginTop: '1.5rem', 
                  paddingTop: '1.25rem', 
                  borderTop: '1px solid #f1f5f9', 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {cls.meetingLink ? (
                      <a 
                        href={cls.meetingLink} 
                        target="_blank" 
                        rel="noreferrer" 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '50%', 
                          backgroundColor: '#ecfdf5', 
                          color: '#10b981' 
                        }}
                        title="View Class Link"
                      >
                        <LinkIcon size={14} />
                      </a>
                    ) : (
                      <div 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '50%', 
                          backgroundColor: '#f8fafc', 
                          color: '#94a3b8' 
                        }}
                        title="No Link Added"
                      >
                        <LinkIcon size={14} />
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button 
                      onClick={() => openModal(cls)} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        width: '36px', 
                        height: '36px', 
                        borderRadius: 'var(--radius-md)', 
                        backgroundColor: '#f1f5f9', 
                        border: 'none', 
                        cursor: 'pointer', 
                        color: '#475569',
                        transition: 'all 0.2s'
                      }} 
                      title="Edit Class"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(cls._id)} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        width: '36px', 
                        height: '36px', 
                        borderRadius: 'var(--radius-md)', 
                        backgroundColor: '#fef2f2', 
                        border: 'none', 
                        cursor: 'pointer', 
                        color: '#ef4444',
                        transition: 'all 0.2s'
                      }} 
                      title="Delete Class"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
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
            maxWidth: '650px', 
            padding: 0, 
            position: 'relative', 
            maxHeight: '90vh', 
            overflow: 'hidden',
            border: 'none',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{ 
              padding: '1.5rem 2rem', 
              borderBottom: '1px solid #f1f5f9', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              backgroundColor: '#f8fafc'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1e293b', fontWeight: 700 }}>
                {editingClass ? 'Edit Class Details' : 'Create New Session'}
              </h2>
              <button 
                onClick={closeModal} 
                style={{ 
                  background: '#f1f5f9', 
                  border: 'none', 
                  cursor: 'pointer', 
                  color: '#64748b', 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '2rem', overflowY: 'auto', maxHeight: 'calc(90vh - 80px)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <FormInput 
                  label="Class Title" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="e.g., Morning Flow Vinyasa"
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    placeholder="Describe the class highlights and what students can expect..."
                    style={{ 
                      width: '100%', 
                      padding: '0.875rem', 
                      borderRadius: 'var(--radius-md)', 
                      border: '1px solid #e2e8f0', 
                      fontFamily: 'inherit', 
                      fontSize: '0.95rem', 
                      minHeight: '100px', 
                      resize: 'vertical',
                      outlineColor: 'var(--primary)'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <FormInput 
                    label="Schedule" 
                    name="schedule" 
                    value={formData.schedule} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Mon, Wed 7:00 AM"
                  />
                  <FormInput 
                    label="Duration (min)" 
                    name="duration" 
                    type="number" 
                    value={formData.duration} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>Difficulty</label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      style={{ 
                        width: '100%', 
                        padding: '0.875rem', 
                        borderRadius: 'var(--radius-md)', 
                        border: '1px solid #e2e8f0', 
                        backgroundColor: 'white', 
                        fontSize: '0.95rem',
                        outlineColor: 'var(--primary)'
                      }}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="All Levels">All Levels</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      style={{ 
                        width: '100%', 
                        padding: '0.875rem', 
                        borderRadius: 'var(--radius-md)', 
                        border: '1px solid #e2e8f0', 
                        backgroundColor: 'white', 
                        fontSize: '0.95rem',
                        outlineColor: 'var(--primary)'
                      }}
                    >
                      <option value="Yoga">Yoga</option>
                      <option value="Meditation">Meditation</option>
                      <option value="Breathing">Breathing</option>
                    </select>
                  </div>
                  <FormInput 
                    label="Max Capacity" 
                    name="maxSlots" 
                    type="number" 
                    value={formData.maxSlots} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <FormInput 
                    label="Fee per Session (₹)" 
                    name="feePerSession" 
                    type="number" 
                    value={formData.feePerSession} 
                    onChange={handleInputChange} 
                    required 
                  />
                  <FormInput 
                    label="Total Sessions" 
                    name="totalSessions" 
                    type="number" 
                    value={formData.totalSessions} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>

                <FormInput 
                  label="Common Meeting Link" 
                  name="meetingLink" 
                  value={formData.meetingLink} 
                  onChange={handleInputChange} 
                  placeholder="https://meet.google.com/..." 
                />

                <div style={{ 
                  padding: '1.25rem', 
                  backgroundColor: '#f8fafc', 
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #e2e8f0'
                }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                    Session Image
                  </label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    style={{ 
                      display: 'block', 
                      width: '100%', 
                      padding: '0.5rem', 
                      fontSize: '0.875rem',
                      color: '#64748b'
                    }} 
                  />
                  {previewUrl && (
                    <div style={{ marginTop: '1rem', position: 'relative' }}>
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} 
                      />
                      <button 
                        type="button" 
                        onClick={() => { setImageFile(null); setPreviewUrl(''); }}
                        style={{ 
                          position: 'absolute', 
                          top: '0.5rem', 
                          right: '0.5rem', 
                          background: 'rgba(0,0,0,0.5)', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '50%', 
                          width: '24px', 
                          height: '24px',
                          cursor: 'pointer'
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <Button type="button" variant="ghost" onClick={closeModal}>Cancel</Button>
                  <Button type="submit" variant="primary" style={{ padding: '0.75rem 2rem' }}>
                    {editingClass ? 'Update Session' : 'Creating Session...'}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ManageClasses;
