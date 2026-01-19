import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import Layout from '../components/Layout';
import './AdminDashboard.css';

function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, totalAdmins: 0, totalSuperAdmins: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    
    // Create Admin Modal
    const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
    const [adminFormData, setAdminFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: ''
    });

    useEffect(() => {
        if (!user?.isAdmin) {
            navigate('/');
            return;
        }
        loadUsers();
    }, [user, navigate]);

    const loadUsers = async () => {
        try {
            const response = await adminAPI.getAllUsers();
            setUsers(response.data);
            setStats({
                totalUsers: response.data.length,
                totalAdmins: response.data.filter(u => u.isAdmin).length,
                totalSuperAdmins: response.data.filter(u => u.isSuperAdmin).length
            });
        } catch {
            setError('Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleAdmin = async (userId, currentStatus) => {
        if (userId === user.userID) {
            setError('Không thể thay đổi quyền của chính mình');
            return;
        }

        // Check if target user is SuperAdmin
        const targetUser = users.find(u => u.userID === userId);
        if (targetUser?.isSuperAdmin) {
            setError('Không thể thay đổi quyền của SuperAdmin');
            return;
        }
        
        try {
            await adminAPI.toggleAdmin(userId, !currentStatus);
            setMessage('Cập nhật quyền thành công!');
            loadUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Cập nhật thất bại');
        }
    };

    const handleDeleteUser = async (userId, username) => {
        if (userId === user.userID) {
            setError('Không thể xóa chính mình');
            return;
        }

        // Check if target user is SuperAdmin
        const targetUser = users.find(u => u.userID === userId);
        if (targetUser?.isSuperAdmin) {
            setError('Không thể xóa tài khoản SuperAdmin');
            return;
        }
        
        if (!window.confirm(`Bạn có chắc muốn xóa user "${username}"?`)) {
            return;
        }

        try {
            await adminAPI.deleteUser(userId);
            setMessage('Xóa user thành công!');
            loadUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Xóa thất bại');
        }
    };

    // Create Admin handlers
    const handleCreateAdminSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await adminAPI.createAdmin(adminFormData);
            setMessage('Tạo tài khoản Admin thành công!');
            setShowCreateAdminModal(false);
            setAdminFormData({ username: '', email: '', password: '', fullName: '' });
            loadUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Tạo Admin thất bại');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return <Layout><div className="loading">Đang tải...</div></Layout>;
    }

    return (
        <Layout>
        <div className="admin-container">
            <div className="admin-header">
                <div className="header-left">
                    <h1>Admin Dashboard</h1>
                    <p>Xin chào, <strong>{user?.fullName || user?.username}</strong>
                        {user?.isSuperAdmin && <span className="superadmin-badge">SuperAdmin</span>}
                    </p>
                </div>
                <div className="header-right">
                    {user?.isSuperAdmin && (
                        <button 
                            onClick={() => setShowCreateAdminModal(true)} 
                            className="btn-primary btn-sm"
                        >
                            + Tạo Admin
                        </button>
                    )}
                    <Link to="/admin/songs" className="btn-secondary btn-sm">Quản lý Bài hát</Link>
                    <Link to="/profile" className="btn-secondary btn-sm">Profile</Link>
                    <button onClick={handleLogout} className="btn-danger btn-sm">Đăng xuất</button>
                </div>
            </div>

            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            <div className="stats-container">
                <div className="stat-card">
                    <div className="stat-icon">○</div>
                    <div className="stat-info">
                        <h3>{stats.totalUsers}</h3>
                        <p>Tổng Users</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">★</div>
                    <div className="stat-info">
                        <h3>{stats.totalAdmins}</h3>
                        <p>Admins</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">●</div>
                    <div className="stat-info">
                        <h3>{stats.totalUsers - stats.totalAdmins}</h3>
                        <p>Regular Users</p>
                    </div>
                </div>
            </div>

            <div className="admin-card">
                <h2>Quản Lý Users</h2>
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Họ Tên</th>
                            <th>Vai Trò</th>
                            <th>Ngày Tạo</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.userID} className={u.userID === user.userID ? 'current-user' : ''}>
                                <td>{u.userID}</td>
                                <td>
                                    <div className="user-cell">
                                        <div className="avatar-small">
                                            {u.username.charAt(0).toUpperCase()}
                                        </div>
                                        {u.username}
                                        {u.userID === user.userID && <span className="you-badge">Bạn</span>}
                                    </div>
                                </td>
                                <td>{u.email}</td>
                                <td>{u.fullName || '-'}</td>
                                <td>
                                    <span className={`badge ${u.isSuperAdmin ? 'superadmin' : u.isAdmin ? 'admin' : 'user'}`}>
                                        {u.isSuperAdmin ? 'SuperAdmin' : u.isAdmin ? 'Admin' : 'User'}
                                    </span>
                                </td>
                                <td>{new Date(u.createdAt).toLocaleDateString('vi-VN')}</td>
                                <td>
                                    <div className="action-buttons">
                                        {u.isAdmin && (
                                            <button 
                                                onClick={() => handleToggleAdmin(u.userID, u.isAdmin)}
                                                className="btn-sm btn-warning"
                                                disabled={u.userID === user.userID || u.isSuperAdmin}
                                                title={u.isSuperAdmin ? 'Không thể thay đổi quyền SuperAdmin' : 'Hủy quyền Admin'}
                                            >
                                                ↓
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => handleDeleteUser(u.userID, u.username)}
                                            className="btn-danger btn-sm"
                                            disabled={u.userID === user.userID || u.isSuperAdmin}
                                            title={u.isSuperAdmin ? 'Không thể xóa SuperAdmin' : 'Xóa user'}
                                        >
                                            ×
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Admin Modal */}
            {showCreateAdminModal && (
                <div className="modal-overlay" onClick={() => setShowCreateAdminModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Tạo Tài Khoản Admin</h2>
                        
                        {error && <div className="error-message">{error}</div>}
                        
                        <form onSubmit={handleCreateAdminSubmit}>
                            <div className="form-group">
                                <label>Username *</label>
                                <input
                                    type="text"
                                    value={adminFormData.username}
                                    onChange={(e) => setAdminFormData({...adminFormData, username: e.target.value})}
                                    required
                                    placeholder="Nhập username"
                                />
                            </div>

                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    value={adminFormData.email}
                                    onChange={(e) => setAdminFormData({...adminFormData, email: e.target.value})}
                                    required
                                    placeholder="Nhập email"
                                />
                            </div>

                            <div className="form-group">
                                <label>Mật khẩu *</label>
                                <input
                                    type="password"
                                    value={adminFormData.password}
                                    onChange={(e) => setAdminFormData({...adminFormData, password: e.target.value})}
                                    required
                                    placeholder="Nhập mật khẩu"
                                    minLength="6"
                                />
                            </div>

                            <div className="form-group">
                                <label>Họ Tên</label>
                                <input
                                    type="text"
                                    value={adminFormData.fullName}
                                    onChange={(e) => setAdminFormData({...adminFormData, fullName: e.target.value})}
                                    placeholder="Nhập họ tên (không bắt buộc)"
                                />
                            </div>

                            <div className="modal-buttons">
                                <button type="submit" className="btn-primary">
                                    Tạo Admin
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setShowCreateAdminModal(false);
                                        setAdminFormData({ username: '', email: '', password: '', fullName: '' });
                                        setError('');
                                    }} 
                                    className="btn-secondary"
                                >
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

export default AdminDashboard;
