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
        artistName: ''
    });
    const [audioFile, setAudioFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    
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
                artistName: song.artistName
            });
        } else {
            setEditMode(false);
            setCurrentSong(null);
            setFormData({ songName: '', artistName: '' });
        }
        setAudioFile(null);
        setImageFile(null);
        setImagePreview(null);
        setUploadProgress(0);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({ songName: '', artistName: '' });
        setAudioFile(null);
        setImageFile(null);
        setImagePreview(null);
        setUploadProgress(0);
        setError('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];
            if (!allowedTypes.includes(file.type)) {
                setError('Chỉ chấp nhận file MP3, WAV, OGG');
                return;
            }
            // Validate file size (50MB)
            if (file.size > 50 * 1024 * 1024) {
                setError('File không được vượt quá 50MB');
                return;
            }
            setAudioFile(file);
            setError('');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                setError('Chỉ chấp nhận file ảnh JPG, PNG, WEBP');
                return;
            }
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('File ảnh không được vượt quá 5MB');
                return;
            }
            setImageFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setError('');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (editMode && currentSong) {
                // Update mode - use JSON
                const songData = {
                    songName: formData.songName,
                    artistName: formData.artistName
                };
                await songAPI.updateSong(currentSong.songID, songData);
                alert('Cập nhật bài hát thành công!');
            } else {
                // Create mode - use FormData with file
                if (!audioFile) {
                    setError('Vui lòng chọn file nhạc MP3');
                    return;
                }

                const formDataToSend = new FormData();
                formDataToSend.append('SongName', formData.songName);
                formDataToSend.append('ArtistName', formData.artistName);
                formDataToSend.append('File', audioFile);
                if (imageFile) {
                    formDataToSend.append('ImageFile', imageFile);
                }

                await songAPI.createSongWithFile(formDataToSend, (progress) => {
                    setUploadProgress(progress);
                });
                alert('Thêm bài hát thành công!');
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
            alert('Xóa bài hát thành công!');
            fetchSongs();
        } catch (err) {
            alert('Lỗi: ' + (err.response?.data?.message || 'Không thể xóa bài hát'));
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
                <h1>Quản Lý Bài Hát</h1>
                <p>Quản lý: {user?.username} (Admin)</p>
                
                <div className="header-actions">
                    <button onClick={() => navigate('/admin')} className="btn-secondary">
                        Quản lý Users
                    </button>
                    <button onClick={() => navigate('/profile')} className="btn-secondary">
                        Profile
                    </button>
                    <button onClick={logout} className="btn-danger">
                        Đăng xuất
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
                        Tìm
                    </button>
                    <button onClick={() => fetchSongs()} className="btn-secondary">
                        Tất cả
                    </button>
                    <button onClick={() => handleOpenModal()} className="btn-primary">
                        + Thêm bài hát
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
                            <th>Ảnh</th>
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
                                <td>
                                    {song.imageUrl ? (
                                        <img 
                                            src={song.imageUrl} 
                                            alt={song.songName}
                                            className="song-thumbnail"
                                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                    ) : (
                                        <div className="song-thumbnail-placeholder" style={{ 
                                            width: '50px', 
                                            height: '50px', 
                                            backgroundColor: '#282828', 
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#b3b3b3',
                                            fontSize: '20px'
                                        }}>♪</div>
                                    )}
                                </td>
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
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(song.songID)}
                                            className="btn-danger btn-sm"
                                        >
                                            Xóa
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
                        <h2>{editMode ? 'Sửa Bài Hát' : 'Thêm Bài Hát Mới'}</h2>
                        
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

                            {!editMode && (
                                <>
                                <div className="form-group">
                                    <label>File Nhạc (MP3) *</label>
                                    <input
                                        type="file"
                                        accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg"
                                        onChange={handleFileChange}
                                        required={!editMode}
                                        style={{
                                            padding: '10px',
                                            backgroundColor: '#282828',
                                            border: '1px solid #404040',
                                            borderRadius: '4px',
                                            color: '#fff',
                                            width: '100%'
                                        }}
                                    />
                                    {audioFile && (
                                        <p style={{ marginTop: '5px', color: '#1db954', fontSize: '14px' }}>
                                            ✓ Đã chọn: {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
                                        </p>
                                    )}
                                    {uploadProgress > 0 && uploadProgress < 100 && (
                                        <div style={{ marginTop: '10px' }}>
                                            <div style={{
                                                width: '100%',
                                                height: '8px',
                                                backgroundColor: '#404040',
                                                borderRadius: '4px',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    width: `${uploadProgress}%`,
                                                    height: '100%',
                                                    backgroundColor: '#1db954',
                                                    transition: 'width 0.3s'
                                                }}></div>
                                            </div>
                                            <p style={{ textAlign: 'center', marginTop: '5px', color: '#b3b3b3' }}>
                                                Đang upload: {uploadProgress}%
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Hình Ảnh Bài Hát (Không bắt buộc)</label>
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        onChange={handleImageChange}
                                        style={{
                                            padding: '10px',
                                            backgroundColor: '#282828',
                                            border: '1px solid #404040',
                                            borderRadius: '4px',
                                            color: '#fff',
                                            width: '100%'
                                        }}
                                    />
                                    {imagePreview && (
                                        <div style={{ marginTop: '10px', textAlign: 'center' }}>
                                            <img 
                                                src={imagePreview} 
                                                alt="Preview" 
                                                style={{ 
                                                    width: '200px', 
                                                    height: '200px', 
                                                    objectFit: 'cover', 
                                                    borderRadius: '8px',
                                                    border: '2px solid #1db954'
                                                }} 
                                            />
                                            <p style={{ marginTop: '5px', color: '#1db954', fontSize: '14px' }}>
                                                ✓ {imageFile.name} ({(imageFile.size / 1024).toFixed(2)} KB)
                                            </p>
                                        </div>
                                    )}
                                </div>
                                </>
                            )}

                            <div className="modal-buttons">
                                <button type="submit" className="btn-primary">
                                    {editMode ? 'Cập Nhật' : 'Thêm'}
                                </button>
                                <button type="button" onClick={handleCloseModal} className="btn-secondary">
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

export default SongManagement;
