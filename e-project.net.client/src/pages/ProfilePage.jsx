import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { userAPI } from '../services/api';
import Layout from '../components/Layout';

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
            
            setFormData({ ...formData, avatarURL: avatarUrl });
            setMessage('Upload ảnh thành công! Nhấn "Lưu" để cập nhật profile.');
        } catch (err) {
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
        <div className="auth-container">
            <button onClick={() => navigate(-1)} className="btn-back-auth">← Quay Lại</button>
            <div className="auth-card profile-card">
                <h2>🎵 Thông Tin Tài Khoản</h2>
                
                {message && <div className="success-message">{message}</div>}
                {error && <div className="error-message">{error}</div>}
                
                <div className="profile-avatar">
                    {user.avatarURL ? (
                        <img src={user.avatarURL} alt="Avatar" />
                    ) : (
                        <div className="avatar-placeholder">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                    )}
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
                            <label>Vai trò:</label>
                            <span className={user.isAdmin ? 'badge admin' : 'badge user'}>
                                {user.isAdmin ? '👑 Admin' : '👤 User'}
                            </span>
                        </div>
                        <div className="info-item">
                            <label>Ngày tạo:</label>
                            <span>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        
                        <div className="button-group">
                            {user.isAdmin && (
                                <Link to="/admin" className="btn-primary">
                                    👑 Qu\ản Trị
                                </Link>
                            )}
                            <button onClick={() => setEditing(true)} className="btn-secondary">
                                ✏️ Chỉnh sửa
                            </button>
                            <Link to="/change-password" className="btn-warning">
                                🔒 Đổi Mật Khẩu
                            </Link>
                            <button onClick={handleLogout} className="btn-danger">
                                🚪 Đăng xuất
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleUpdate}>
                        <div className="form-group">
                            <label>Avatar</label>
                            <div className="avatar-upload-section">
                                {formData.avatarURL && (
                                    <div className="avatar-preview">
                                        <img src={formData.avatarURL} alt="Avatar preview" />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    disabled={uploadingAvatar}
                                    id="avatar-upload"
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="avatar-upload" className="btn-upload">
                                    {uploadingAvatar ? '📤 Đang upload...' : '📷 Chọn ảnh'}
                                </label>
                                <small style={{ color: '#b3b3b3', marginTop: '5px', display: 'block' }}>
                                    Hoặc nhập URL ảnh bên dưới
                                </small>
                            </div>
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
                        <div className="form-group">
                            <label>Avatar URL (tùy chọn)</label>
                            <input
                                type="url"
                                name="avatarURL"
                                value={formData.avatarURL}
                                onChange={handleChange}
                                placeholder="https://example.com/avatar.jpg"
                            />
                        </div>
                        <div className="button-group">
                            <button type="submit" className="btn-primary">
                                💾 Lưu
                            </button>
                            <button type="button" onClick={() => setEditing(false)} className="btn-secondary">
                                ❌ Hủy
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
