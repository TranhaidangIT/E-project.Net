import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { userAPI } from '../services/api';
import Layout from '../components/Layout';
import './ProfilePage.css';

function ProfilePage() {
    const { user, logout, loadUser } = useAuth();
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        avatarURL: user?.avatarURL || '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            setError('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF)');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Kích thước file phải nhỏ hơn 5MB');
            return;
        }

        setUploadingAvatar(true);
        setError('');
        setMessage('');

        try {
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);

            const response = await userAPI.uploadAvatar(formDataUpload);
            const avatarUrl = response.data.avatarUrl;
            
            console.log('Avatar uploaded:', avatarUrl);
            
            // Update formData with server URL
            setFormData(prev => {
                const newData = { ...prev, avatarURL: avatarUrl };
                console.log('FormData updated:', newData);
                return newData;
            });
            
            setMessage('Upload ảnh thành công! Nhấn "Lưu" để cập nhật profile.');
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.response?.data?.message || 'Upload ảnh thất bại');
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            await userAPI.updateProfile(formData);
            await loadUser();
            setMessage('Cập nhật thành công!');
            setEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Cập nhật thất bại');
        }
    };

    if (!user) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <h2>Đang tải...</h2>
                </div>
            </div>
        );
    }

    return (
        <Layout>
            <div className="profile-page">
                {/* Page Header */}
                <div className="profile-header">
                    <h1>Thông Tin Tài Khoản</h1>
                    <p>Quản lý thông tin cá nhân của bạn</p>
                </div>

                <div className="profile-content">
                    {message && <div className="success-message">{message}</div>}
                    {error && <div className="error-message">{error}</div>}
                    
                    <div className="profile-avatar">
                        {(() => {
                            const avatarUrl = formData.avatarURL || user.avatarURL;
                            
                            if (avatarUrl) {
                                // Use relative URL - Vite proxy will handle it
                                const fullUrl = avatarUrl.startsWith('http') ? avatarUrl : avatarUrl;
                                return (
                                    <img 
                                        src={fullUrl}
                                        alt="Avatar" 
                                        onError={(e) => {
                                            // Hide broken image and show placeholder
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                );
                            }
                            return null;
                        })()}
                        <div 
                            className="avatar-placeholder"
                            style={{ display: (formData.avatarURL || user.avatarURL) ? 'none' : 'flex' }}
                        >
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                    </div>

                    {!editing ? (
                    <div className="profile-info">
                        <div className="info-item">
                            <label>Username:</label>
                            <span>{user.username}</span>
                        </div>
                        <div className="info-item">
                            <label>Email:</label>
                            <span>{user.email}</span>
                        </div>
                        <div className="info-item">
                            <label>Họ tên:</label>
                            <span>{user.fullName || 'Chưa cập nhật'}</span>
                        </div>
                        <div className="info-item">
                            <label>Ngày tạo:</label>
                            <span>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        
                        <div className="button-group">
                            {user.isAdmin && (
                                <Link to="/admin" className="btn-primary">
                                    Quản Trị
                                </Link>
                            )}
                            <button onClick={() => {
                                setFormData({
                                    fullName: user.fullName || '',
                                    avatarURL: user.avatarURL || '',
                                });
                                setEditing(true);
                            }} className="btn-secondary">
                                Chỉnh sửa
                            </button>
                            <Link to="/change-password" className="btn-warning">
                                Đổi Mật Khẩu
                            </Link>
                            <button onClick={handleLogout} className="btn-danger">
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleUpdate}>
                        <div className="form-group">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                disabled={uploadingAvatar}
                                id="avatar-upload"
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="avatar-upload" className="btn-upload" style={{ marginBottom: '20px', display: 'inline-block' }}>
                                {uploadingAvatar ? 'Đang upload...' : 'Chọn ảnh Avatar'}
                            </label>
                        </div>
                        <div className="form-group">
                            <label>Họ và tên</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Nhập họ tên"
                            />
                        </div>
                        <div className="button-group">
                            <button type="submit" className="btn-primary">
                                Lưu
                            </button>
                            <button type="button" onClick={() => setEditing(false)} className="btn-secondary">
                                Hủy
                            </button>
                        </div>
                    </form>
                )}
                </div>
            </div>
        </Layout>
    );
}

export default ProfilePage;
