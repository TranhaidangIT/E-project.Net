import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { songAPI } from '../services/api';
import Layout from '../components/Layout';
import './SongManagement.css';

function SongManagement() {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentSong, setCurrentSong] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    const [formData, setFormData] = useState({
        songName: '',
        artistName: '',
        duration: ''
    });
    
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchSongs();
    }, []);

    const fetchSongs = async () => {
        try {
            setLoading(true);
            const response = await songAPI.getAllSongs();
            setSongs(response.data);
        } catch (err) {
            setError('Không thể tải danh sách bài hát');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            fetchSongs();
            return;
        }
        try {
            const response = await songAPI.searchSongs(searchQuery);
            setSongs(response.data);
        } catch (err) {
            setError('Lỗi tìm kiếm');
            console.error(err);
        }
    };

    const handleOpenModal = (song = null) => {
        if (song) {
            setEditMode(true);
            setCurrentSong(song);
            setFormData({
                songName: song.songName,
                artistName: song.artistName,
                duration: song.duration || ''
            });
        } else {
            setEditMode(false);
            setCurrentSong(null);
            setFormData({ songName: '', artistName: '', duration: '' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({ songName: '', artistName: '', duration: '' });
        setError('');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const songData = {
                songName: formData.songName,
                artistName: formData.artistName,
                duration: formData.duration ? parseInt(formData.duration) : null
            };

            if (editMode && currentSong) {
                await songAPI.updateSong(currentSong.songID, songData);
                alert('✅ Cập nhật bài hát thành công!');
            } else {
                await songAPI.createSong(songData);
                alert('✅ Thêm bài hát thành công!');
            }

            handleCloseModal();
            fetchSongs();
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleDelete = async (songId) => {
        if (!confirm('Bạn có chắc muốn xóa bài hát này?')) return;

        try {
            await songAPI.deleteSong(songId);
            alert('✅ Xóa bài hát thành công!');
            fetchSongs();
        } catch (err) {
            alert('❌ Lỗi: ' + (err.response?.data?.message || 'Không thể xóa bài hát'));
        }
    };

    const formatDuration = (seconds) => {
        if (!seconds) return 'N/A';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) return <Layout><div className="loading">Đang tải...</div></Layout>;

    return (
        <Layout>
        <div className="song-management-container">
            {/* Header */}
            <div className="song-management-header">
                <h1>🎵 Quản Lý Bài Hát</h1>
                <p>Quản lý: {user?.username} (Admin)</p>
                
                <div className="header-actions">
                    <button onClick={() => navigate('/admin')} className="btn-secondary">
                        👥 Quản lý Users
                    </button>
                    <button onClick={() => navigate('/profile')} className="btn-secondary">
                        👤 Profile
                    </button>
                    <button onClick={logout} className="btn-danger">
                        🚪 Đăng xuất
                    </button>
                </div>
            </div>

            {/* Search Section */}
            <div className="search-section">
                <div className="search-controls">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Tìm kiếm bài hát hoặc nghệ sĩ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button onClick={handleSearch} className="btn-secondary">
                        🔍 Tìm
                    </button>
                    <button onClick={() => fetchSongs()} className="btn-secondary">
                        🔄 Tất cả
                    </button>
                    <button onClick={() => handleOpenModal()} className="btn-primary">
                        ➕ Thêm bài hát
                    </button>
                </div>
            </div>

            {/* Songs Table */}
            <div className="song-table-section">
                <h2>Danh Sách Bài Hát ({songs.length})</h2>
                {error && <div className="error-message">{error}</div>}
                
                <table className="song-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên Bài Hát</th>
                            <th>Nghệ Sĩ</th>
                            <th>Thời Lượng</th>
                            <th>Lượt Nghe</th>
                            <th>Ngày Thêm</th>
                            <th>Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {songs.map((song) => (
                            <tr key={song.songID}>
                                <td>{song.songID}</td>
                                <td><strong>{song.songName}</strong></td>
                                <td>{song.artistName}</td>
                                <td>{formatDuration(song.duration)}</td>
                                <td>{song.playCount}</td>
                                <td>{new Date(song.createdAt).toLocaleDateString('vi-VN')}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            onClick={() => handleOpenModal(song)}
                                            className="btn-warning btn-sm"
                                        >
                                            ✏️ Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(song.songID)}
                                            className="btn-danger btn-sm"
                                        >
                                            🗑️ Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {songs.length === 0 && (
                    <p style={{ textAlign: 'center', padding: '20px', color: '#b3b3b3' }}>
                        Chưa có bài hát nào
                    </p>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{editMode ? '✏️ Sửa Bài Hát' : '➕ Thêm Bài Hát Mới'}</h2>
                        
                        {error && <div className="error-message">{error}</div>}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Tên Bài Hát *</label>
                                <input
                                    type="text"
                                    name="songName"
                                    value={formData.songName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Nhập tên bài hát"
                                />
                            </div>

                            <div className="form-group">
                                <label>Nghệ Sĩ *</label>
                                <input
                                    type="text"
                                    name="artistName"
                                    value={formData.artistName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Nhập tên nghệ sĩ"
                                />
                            </div>

                            <div className="form-group">
                                <label>Thời Lượng (giây)</label>
                                <input
                                    type="number"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    placeholder="Ví dụ: 240 (4 phút)"
                                    min="1"
                                />
                            </div>

                            <div className="modal-buttons">
                                <button type="submit" className="btn-primary">
                                    {editMode ? '💾 Cập Nhật' : '➕ Thêm'}
                                </button>
                                <button type="button" onClick={handleCloseModal} className="btn-secondary">
                                    ❌ Hủy
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

export default SongManagement;
