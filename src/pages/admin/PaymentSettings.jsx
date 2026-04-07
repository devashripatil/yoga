import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import { toast } from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';

const PaymentSettings = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        adminName: '',
        upiId: '',
        qrCodeUrl: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/admin-settings');
            if (response.ok) {
                const data = await response.json();
                setSettings({
                    adminName: data.adminName || '',
                    upiId: data.upiId || '',
                    qrCodeUrl: data.qrCodeUrl || ''
                });
                if (data.qrCodeUrl) {
                    setPreviewUrl(`${data.qrCodeUrl}`);
                }
            }
        } catch (error) {
            console.error('Failed to fetch admin settings', error);
            toast.error('Failed to load payment settings');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
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
        if (!settings.adminName || !settings.upiId) {
            toast.error('Name and UPI ID are required');
            return;
        }

        setSaving(true);
        try {
            let finalQrCodeUrl = settings.qrCodeUrl;

            // Unpack user token
            const token = localStorage.getItem('token');

            // Upload image first if present
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    finalQrCodeUrl = uploadData.url;
                } else {
                    throw new Error('Image upload failed');
                }
            }

            // Update Settings
            const updateRes = await fetch('/api/admin-settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    adminName: settings.adminName,
                    upiId: settings.upiId,
                    qrCodeUrl: finalQrCodeUrl
                })
            });

            if (updateRes.ok) {
                toast.success('Payment settings updated successfully');
                const data = await updateRes.json();
                setSettings({
                    adminName: data.adminName,
                    upiId: data.upiId,
                    qrCodeUrl: data.qrCodeUrl
                });
                if (data.qrCodeUrl) {
                    setPreviewUrl(`${data.qrCodeUrl}`);
                }
            } else {
                throw new Error('Failed to update settings');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Server error occurred');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Loading settings...</p>;

    // Format UPI URI for the QR code
    // Example: upi://pay?pa=upiId@bank&pn=AdminName&cu=INR
    const upiUri = `upi://pay?pa=${settings.upiId}&pn=${encodeURIComponent(settings.adminName)}&cu=INR`;

    return (
        <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Payment Settings</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Configure the UPI payment details that users will see when booking classes.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                <Card>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <FormInput
                            label="Recipient Name"
                            name="adminName"
                            value={settings.adminName}
                            onChange={handleChange}
                            placeholder="e.g. Sattva Yoga Center"
                            required
                        />

                        <FormInput
                            label="UPI ID"
                            name="upiId"
                            value={settings.upiId}
                            onChange={handleChange}
                            placeholder="e.g. 9876543210@upi"
                            required
                        />

                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                Custom QR Code Image (Optional)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '0.5rem',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-sm)'
                                }}
                            />
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                If you leave this blank, a generic QR code will be generated from the UPI ID structure.
                            </p>
                        </div>

                        <Button type="submit" variant="primary" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Settings'}
                        </Button>
                    </form>
                </Card>

                <Card>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>User Preview</h3>
                    <div style={{ padding: '2rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="QR Code Preview"
                                style={{ width: '200px', height: '200px', objectFit: 'contain', margin: '0 auto', display: 'block', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                            />
                        ) : settings.upiId ? (
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'white', borderRadius: 'var(--radius-sm)' }}>
                                <QRCodeSVG value={upiUri} size={200} />
                            </div>
                        ) : (
                            <div style={{ width: '200px', height: '200px', backgroundColor: '#e2e8f0', margin: '0 auto 1.5rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)', color: '#94a3b8' }}>
                                No QR Data
                            </div>
                        )}

                        <h4 style={{ margin: '1rem 0 0.25rem 0', color: 'var(--text-primary)' }}>{settings.adminName || 'Your Name'}</h4>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{settings.upiId || 'your@upi.id'}</p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PaymentSettings;
