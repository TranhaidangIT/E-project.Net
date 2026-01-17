import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { userAPI } from '../services/api';

function ProfilePage() {
    const { user, logout, loadUser } = useAuth();
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
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
        <div className="auth-container">
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
                                    👑 Admin Panel
                                </Link>
                            )}
                            <button onClick={() => setEditing(true)} className="btn-secondary">
                                ✏️ Chỉnh sửa
                            </button>
                            <button onClick={handleLogout} className="btn-danger">
                                🚪 Đăng xuất
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleUpdate}>
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
                            <label>Avatar URL</label>
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
    );
}

export default ProfilePage;
