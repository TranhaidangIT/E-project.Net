import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { adminAPI } from '../services/api';

function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, totalAdmins: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

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
                totalAdmins: response.data.filter(u => u.isAdmin).length
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

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    return (
        <div className="admin-container">
            <div className="admin-header">
                <div className="header-left">
                    <h1>🎵 Admin Dashboard</h1>
                    <p>Xin chào, <strong>{user?.fullName || user?.username}</strong> 👑</p>
                </div>
                <div className="header-right">
                    <Link to="/admin/songs" className="btn-secondary btn-sm">🎵 Quản lý Bài hát</Link>
                    <Link to="/profile" className="btn-secondary btn-sm">👤 Profile</Link>
                    <button onClick={handleLogout} className="btn-danger btn-sm">🚪 Đăng xuất</button>
                </div>
            </div>

            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            <div className="stats-container">
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <h3>{stats.totalUsers}</h3>
                        <p>Tổng Users</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👑</div>
                    <div className="stat-info">
                        <h3>{stats.totalAdmins}</h3>
                        <p>Admins</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👤</div>
                    <div className="stat-info">
                        <h3>{stats.totalUsers - stats.totalAdmins}</h3>
                        <p>Regular Users</p>
                    </div>
                </div>
            </div>

            <div className="admin-card">
                <h2>📋 Quản Lý Users</h2>
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
                                    <span className={`badge ${u.isAdmin ? 'admin' : 'user'}`}>
                                        {u.isAdmin ? '👑 Admin' : '👤 User'}
                                    </span>
                                </td>
                                <td>{new Date(u.createdAt).toLocaleDateString('vi-VN')}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button 
                                            onClick={() => handleToggleAdmin(u.userID, u.isAdmin)}
                                            className={`btn-sm ${u.isAdmin ? 'btn-warning' : 'btn-success'}`}
                                            disabled={u.userID === user.userID}
                                            title={u.isAdmin ? 'Hủy quyền Admin' : 'Cấp quyền Admin'}
                                        >
                                            {u.isAdmin ? '⬇️' : '⬆️'}
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteUser(u.userID, u.username)}
                                            className="btn-danger btn-sm"
                                            disabled={u.userID === user.userID}
                                            title="Xóa user"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminDashboard;
