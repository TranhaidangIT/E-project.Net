import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { userAPI, playlistAPI } from '../services/api';
import Layout from '../components/Layout';
import './ProfilePage.css';

function ProfilePage() {
    const { user, logout, loadUser } = useAuth();
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        avatarURL: user?.avatarURL || '',
        coverURL: user?.coverURL || '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [playlistCount, setPlaylistCount] = useState(0);

    useEffect(() => {
        if (user) {
            fetchPlaylistCount();
        }
    }, [user]);

    const fetchPlaylistCount = async () => {
        try {
            const response = await playlistAPI.getMyPlaylists();
            setPlaylistCount(response.data.length);
        } catch (err) {
            console.error('Failed to fetch playlist count:', err);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCoverUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            setError('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF)');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setError('Kích thước file phải nhỏ hơn 10MB');
            return;
        }

        setUploadingCover(true);
        setError('');
        setMessage('');

        try {
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);

            const response = await userAPI.uploadCover(formDataUpload);
            const coverUrl = response.data.coverUrl;
            
            setFormData(prev => ({ ...prev, coverURL: coverUrl }));
            setMessage('Upload ảnh bìa thành công! Nhấn "Lưu" để cập nhật.');
        } catch (err) {
            setError(err.response?.data?.message || 'Upload ảnh bìa thất bại');
        } finally {
            setUploadingCover(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            setError('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF)');
            return;
        }

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
            
            setFormData(prev => ({ ...prev, avatarURL: avatarUrl }));
            setMessage('Upload ảnh đại diện thành công! Nhấn "Lưu" để cập nhật.');
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
            <div className="profile-page">
                {/* Messages */}
                {message && <div className="success-message">{message}</div>}
                {error && <div className="error-message">{error}</div>}

                {!editing ? (
                    // View Mode - Card Layout with Cover
                    <div className="profile-wrapper">
                        {/* Cover Image */}
                        <div className="profile-cover">
                            {user.coverURL ? (
                                <img src={user.coverURL} alt="Cover" />
                            ) : (
                                <div className="cover-placeholder">
                                    <span>Ảnh bìa</span>
                                </div>
                            )}
                        </div>

                        {/* Profile Card overlapping cover */}
                        <div className="profile-card">
                            <div className="profile-card-left">
                                <div className="profile-avatar-large">
                                    {(() => {
                                        const avatarUrl = user.avatarURL;
                                        // Only show image if it's a valid local URL (starts with /)
                                        if (avatarUrl && avatarUrl.startsWith('/')) {
                                            return (
                                                <img 
                                                    src={avatarUrl} 
                                                    alt="Avatar" 
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                            );
                                        }
                                        return null;
                                    })()}
                                    <div 
                                        className="avatar-placeholder-large"
                                        style={{ display: user.avatarURL && user.avatarURL.startsWith('/') ? 'none' : 'flex' }}
                                    >
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                            </div>

                            <div className="profile-card-right">
                                <h2 className="profile-name">{user.fullName || user.username}</h2>
                                <div className="profile-stats">
                                    <div className="stat-item">
                                        <span className="stat-label">Playlist:</span>
                                        <span className="stat-value">{playlistCount}</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Yêu thích:</span>
                                        <span className="stat-value">0</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Ngày tham gia:</span>
                                        <span className="stat-value">{new Date(user.createdAt).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                </div>

                            <div className="profile-actions">
                                {user.isAdmin && (
                                    <Link to="/admin" className="btn-primary">
                                        Quản Trị
                                    </Link>
                                )}
                                <button onClick={() => {
                                    setFormData({
                                        fullName: user.fullName || '',
                                        avatarURL: user.avatarURL || '',
                                        coverURL: user.coverURL || '',
                                    });
                                    setEditing(true);
                                }} className="btn-secondary">
                                    Chỉnh sửa Profile
                                </button>
                                <Link to="/change-password" className="btn-warning">
                                    Đổi Mật Khẩu
                                </Link>
                                <button onClick={handleLogout} className="btn-danger">
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    </div>
                    </div>
                ) : (
                    // Edit Mode with Cover
                    <div className="profile-edit-wrapper">
                        {/* Cover Image Edit */}
                        <div className="profile-cover-edit">
                            {formData.coverURL || user.coverURL ? (
                                <img src={formData.coverURL || user.coverURL} alt="Cover" />
                            ) : (
                                <div className="cover-placeholder">
                                    <span>Ảnh bìa (1200x300px)</span>
                                </div>
                            )}
                            <div className="cover-upload-overlay">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCoverUpload}
                                    disabled={uploadingCover}
                                    id="cover-upload"
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="cover-upload" className="btn-upload-cover">
                                    {uploadingCover ? 'Đang upload...' : 'Đổi ảnh bìa'}
                                </label>
                            </div>
                        </div>

                        <div className="profile-edit-card">
                            <div className="profile-avatar-edit">
                                {(() => {
                                    const avatarUrl = formData.avatarURL || user.avatarURL;
                                    // Only show image if it's a valid local URL (starts with /)
                                    if (avatarUrl && avatarUrl.startsWith('/')) {
                                        return (
                                            <img 
                                                src={avatarUrl} 
                                                alt="Avatar" 
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        );
                                    }
                                    return null;
                                })()}
                                <div 
                                    className="avatar-placeholder-edit"
                                    style={{ display: (formData.avatarURL || user.avatarURL)?.startsWith('/') ? 'none' : 'flex' }}
                                >
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                            </div>

                            <form onSubmit={handleUpdate} className="profile-form">
                                <div className="form-group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarUpload}
                                        disabled={uploadingAvatar}
                                        id="avatar-upload"
                                        style={{ display: 'none' }}
                                    />
                                    <label htmlFor="avatar-upload" className="btn-upload">
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

                                <div className="form-actions">
                                    <button type="submit" className="btn-primary">
                                        Lưu
                                    </button>
                                    <button type="button" onClick={() => setEditing(false)} className="btn-secondary">
                                        Hủy
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default ProfilePage;
