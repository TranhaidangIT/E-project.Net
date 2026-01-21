import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import Layout from '../components/Layout';

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
            setTimeout(() => setMessage(''), 3000);
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
            setTimeout(() => setMessage(''), 3000);
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
        return <div className="flex items-center justify-center h-screen text-text-primary">Đang tải...</div>;
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
                            Dashboard Quản Trị
                        </h1>
                        <p className="text-text-secondary">
                            Xin chào, <strong className="text-primary">{user?.fullName || user?.username}</strong> 👑
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/admin/songs" className="px-4 py-2 rounded-lg bg-surface border border-border-color text-text-primary hover:bg-surface-hover transition-colors flex items-center gap-2">
                            <span>🎵</span> Quản lý Bài hát
                        </Link>
                        <Link to="/profile" className="px-4 py-2 rounded-lg bg-surface border border-border-color text-text-primary hover:bg-surface-hover transition-colors flex items-center gap-2">
                            <span>👤</span> Hồ sơ
                        </Link>
                        <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-colors">
                            Đăng xuất
                        </button>
                    </div>
                </div>

                {message && <div className="mb-6 p-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 text-center animate-fade-in">{message}</div>}
                {error && <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-center animate-fade-in">{error}</div>}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="glass-panel p-6 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-3xl shadow-lg shadow-blue-500/20">
                            👥
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-text-primary">{stats.totalUsers}</h3>
                            <p className="text-text-secondary">Tổng Users</p>
                        </div>
                    </div>
                    <div className="glass-panel p-6 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20">
                            👑
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-text-primary">{stats.totalAdmins}</h3>
                            <p className="text-text-secondary">Quản Trị Viên</p>
                        </div>
                    </div>
                    <div className="glass-panel p-6 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-3xl shadow-lg shadow-purple-500/20">
                            👤
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-text-primary">{stats.totalUsers - stats.totalAdmins}</h3>
                            <p className="text-text-secondary">Người Dùng Thường</p>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="glass-panel p-6 overflow-hidden">
                    <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
                        <span>📋</span> Danh Sách Người Dùng
                    </h2>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border-color text-left text-text-muted text-sm uppercase tracking-wider">
                                    <th className="pb-4 pl-4">ID</th>
                                    <th className="pb-4">Người Dùng</th>
                                    <th className="pb-4">Email</th>
                                    <th className="pb-4">Họ Tên</th>
                                    <th className="pb-4">Vai Trò</th>
                                    <th className="pb-4">Ngày Tạo</th>
                                    <th className="pb-4 text-center">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-color">
                                {users.map(u => (
                                    <tr key={u.userID} className={`group hover:bg-surface-hover transition-colors ${u.userID === user.userID ? 'bg-primary/5' : ''}`}>
                                        <td className="py-4 pl-4 text-text-secondary">#{u.userID}</td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center text-xs font-bold text-text-primary border border-border-color">
                                                    {u.username.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-text-primary font-medium">{u.username}</span>
                                                {u.userID === user.userID && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full border border-primary/30">You</span>}
                                            </div>
                                        </td>
                                        <td className="py-4 text-text-secondary text-sm">{u.email}</td>
                                        <td className="py-4 text-text-primary text-sm">{u.fullName || '-'}</td>
                                        <td className="py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                                u.isAdmin 
                                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                            }`}>
                                                {u.isAdmin ? '👑 Admin' : '👤 User'}
                                            </span>
                                        </td>
                                        <td className="py-4 text-text-secondary text-sm">{new Date(u.createdAt).toLocaleDateString('vi-VN')}</td>
                                        <td className="py-4 text-center">
                                            <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => handleToggleAdmin(u.userID, u.isAdmin)}
                                                    disabled={u.userID === user.userID}
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        u.isAdmin 
                                                        ? 'hover:bg-amber-500/20 text-amber-500' 
                                                        : 'hover:bg-blue-500/20 text-blue-500'
                                                    } disabled:opacity-30 disabled:cursor-not-allowed`}
                                                    title={u.isAdmin ? 'Hủy quyền Admin' : 'Cấp quyền Admin'}
                                                >
                                                    {u.isAdmin ? '⬇️' : '⬆️'}
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteUser(u.userID, u.username)}
                                                    disabled={u.userID === user.userID}
                                                    className="p-2 rounded-lg hover:bg-red-500/20 text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
            </div>
        </Layout>
    );
}

export default AdminDashboard;
