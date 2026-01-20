import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { userAPI, playlistAPI, historyAPI } from '../services/api';
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
    
    // Additional Data
    const [listeningHistory, setListeningHistory] = useState([]);
    const [favorites, setFavorites] = useState([]);
    
    const [playlists, setPlaylists] = useState([]);
    
    // Playing State
    const [playingPreview, setPlayingPreview] = useState(null); // songID
    const audioRef = useRef(new Audio());
    
    // Drag & Drop
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                avatarURL: user.avatarURL || '',
            });
            fetchPlaylists();
            fetchFavorites();
            loadHistory();
            
            // Auto update history every 5s
            const interval = setInterval(loadHistory, 5000);
            return () => clearInterval(interval);
        }
    }, [user]);

    // Handle Audio Preview
    useEffect(() => {
        const audio = audioRef.current;
        
        const handleEnded = () => setPlayingPreview(null);
        audio.addEventListener('ended', handleEnded);
        
        return () => {
            audio.removeEventListener('ended', handleEnded);
            audio.pause();
        };
    }, []);

    const togglePreview = (song) => {
        const audio = audioRef.current;
        
        if (playingPreview === song.songID) {
            audio.pause();
            setPlayingPreview(null);
        } else {
            audio.src = `/uploads/songs/${song.songID}.mp3`;
            audio.play().catch(e => console.error("Preview error:", e));
            setPlayingPreview(song.songID);
        }
    };

    const fetchPlaylists = async () => {
        try {
            const response = await playlistAPI.getMyPlaylists();
            setPlaylists(response.data);
        } catch (err) {
            console.error('Failed to load playlists', err);
        }
    };

    const fetchFavorites = async () => {
        try {
            const response = await playlistAPI.getMyPlaylists();
            const favPlaylist = response.data.find(p => p.playlistName === 'Favorites');
            if (favPlaylist) {
                const detail = await playlistAPI.getPlaylistById(favPlaylist.playlistID);
                setFavorites(detail.data.songs);
            }
        } catch (err) {
            console.error('Failed to load favorites', err);
        }
    };

    const loadHistory = async () => {
        try {
            const response = await historyAPI.getHistory();
            setListeningHistory(response.data);
        } catch (err) {
            console.error("Failed to load history", err);
        }
    };

    // ... (rest of standard profile handlers: handleLogout, handleChange, handleAvatarUpload, handleUpdate, Drag/Drop) ...
    // Note: I will need to replace the *entire* playing logic or carefully insert it.
    // Since I'm using replace_file_content for the whole file structure in previous turns, I can do it again to ensure structure.
    
    // ... [Copying the Drag/Drop handlers and Update handlers from previous state] ...
    
    // ... [Render includes new History and Favorites UI] ...
    
    // REPLACING THE ENTIRE FILE content to be safe and clean with new logic
    
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
            setFormData(prev => ({ ...prev, avatarURL: response.data.avatarUrl }));
            setMessage('✅ Upload ảnh thành công! Nhấn "Lưu" để cập nhật.');
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
            setMessage('✅ Cập nhật thành công!');
            setEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Cập nhật thất bại');
        }
    };
    
    const handleDrag = (e) => { e.preventDefault(); e.stopPropagation(); if (e.type === "dragenter" || e.type === "dragover") setDragActive(true); else setDragActive(false); };
    const handleDrop = async (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files?.[0]) await uploadFile(e.dataTransfer.files[0]); };
    const handleFileSelect = async (e) => { if (e.target.files?.[0]) await uploadFile(e.target.files[0]); };
    const uploadFile = async (file) => { /* reuse handleAvatarUpload logic or call it */ 
        // calling handleAvatarUpload directly requires a synthetic event, better to extract logic.
        // For brevity in this replacement, I'll allow the duplicate logic in handleAvatarUpload or separate it.
        // Actually, let's just use handleAvatarUpload with a fake event object
        handleAvatarUpload({ target: { files: [file] } });
    };


    if (!user) return <div className="auth-container"><div className="auth-card"><h2>Đang tải...</h2></div></div>;

    const renderSongItem = (song) => (
        <div key={song.songID} style={{ 
            background: 'rgba(255,255,255,0.05)', 
            padding: '10px', 
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '10px'
        }}>
            <div style={{ fontSize: '1.2rem' }}>🎵</div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
                <h4 style={{ margin: '0 0 2px', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.songName}</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#b3b3b3' }}>{song.artistName}</p>
            </div>
            <button 
                onClick={() => togglePreview(song)}
                style={{
                    background: playingPreview === song.songID ? '#e94560' : 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'white'
                }}
            >
                {playingPreview === song.songID ? '⏸' : '▶'}
            </button>
        </div>
    );

    return (
        <Layout>
            <div className="profile-page-container" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', color: 'white' }}>
                <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                    
                    {/* Left Column: Profile Card */}
                    <div style={{ flex: '1', minWidth: '300px', maxWidth: '400px' }}>
                        <div className="auth-card profile-card" style={{ width: '100%' }}>
                           {/* ... [Profile Header/Edit/Avatar UI - Same as before] ... */}
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2 style={{ margin: 0 }}>👤 Hồ Sơ</h2>
                                {!editing && <button onClick={() => setEditing(true)} className="btn-secondary" style={{ padding: '5px 10px', fontSize: '0.9rem' }}>✏️ Sửa</button>}
                            </div>
                            {message && <div className="success-message">{message}</div>}
                            {error && <div className="error-message">{error}</div>}

                            {!editing ? (
                                <div style={{ textAlign: 'center' }}>
                                    <div className="profile-avatar" style={{ margin: '0 auto 20px' }}>
                                        {user.avatarURL ? <img src={user.avatarURL} alt="Avatar" /> : <div className="avatar-placeholder">{user.username.charAt(0).toUpperCase()}</div>}
                                    </div>
                                    <h3 style={{ fontSize: '1.8rem', margin: '0 0 5px' }}>{user.fullName || user.username}</h3>
                                    <p style={{ color: '#b3b3b3', margin: '0 0 20px' }}>@{user.username}</p>
                                    <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '10px' }}>
                                        <div className="info-item"><label>Email:</label><span>{user.email}</span></div>
                                        <div className="info-item"><label>Vai trò:</label><span className={user.isAdmin ? 'badge admin' : 'badge user'}>{user.isAdmin ? '👑 Admin' : '👤 User'}</span></div>
                                        <div className="info-item"><label>Tham gia:</label><span>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</span></div>
                                    </div>
                                    <div className="button-group" style={{ marginTop: '20px' }}>
                                        {user.isAdmin && <Link to="/admin" className="btn-primary" style={{ display: 'block', marginBottom: '10px' }}>👑 Trang Quản Trị</Link>}
                                        <Link to="/change-password" className="btn-warning" style={{ display: 'block', marginBottom: '10px' }}>🔒 Đổi Mật Khẩu</Link>
                                        <button onClick={handleLogout} className="btn-danger" style={{ width: '100%' }}>🚪 Đăng xuất</button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleUpdate}>
                                     {/* ... [Edit Form logic same as before, condensed for brevity in plan but full in implementation] ... */}
                                    <div className="form-group" style={{ textAlign: 'center' }}>
                                    <div 
                                        className={`avatar-upload-zone ${dragActive ? 'active' : ''}`} 
                                        onClick={() => fileInputRef.current.click()}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                        style={{ 
                                            width: '150px', 
                                            height: '150px', 
                                            borderRadius: '50%', 
                                            border: `2px dashed ${dragActive ? '#e94560' : '#666'}`, 
                                            margin: '0 auto 20px', 
                                            position: 'relative', 
                                            overflow: 'hidden', 
                                            cursor: 'pointer', 
                                            background: formData.avatarURL ? `url(${formData.avatarURL}) center/cover` : 'rgba(0,0,0,0.3)' 
                                        }}
                                    >
                                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
                                        {uploadingAvatar && (
                                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                                ⏳
                                            </div>
                                        )}
                                        {!formData.avatarURL && !uploadingAvatar && (
                                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                                                {dragActive ? 'Thả ảnh vào đây' : 'Chọn hoặc thả ảnh'}
                                            </div>
                                        )}
                                    </div>
                                    </div>
                                    <div className="form-group"><label>Họ tên</label><input type="text" name="fullName" value={formData.fullName} onChange={handleChange} /></div>
                                    {/* ... buttons ... */}
                                     <div className="button-group">
                                        <button type="submit" className="btn-primary">💾 Lưu</button>
                                        <button type="button" onClick={() => setEditing(false)} className="btn-secondary">❌ Hủy</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Right Column: History & Favorites */}
                    <div style={{ flex: '2', minWidth: '300px' }}>
                        
                        {/* History Section */}
                        <div style={{ marginBottom: '40px' }}>
                            <h2 style={{ borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '20px' }}>
                                🕒 Lịch Sử Nghe (Cập nhật mỗi 5s)
                            </h2>
                            {listeningHistory.length === 0 ? (
                                <p style={{ color: '#b3b3b3' }}>Chưa có lịch sử nghe nhạc.</p>
                            ) : (
                                <div>
                                    {listeningHistory.map(item => (
                                        <div key={item.historyID}>
                                            {renderSongItem(item.song)}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Favorites Section */}
                         <div style={{ marginBottom: '40px' }}>
                            <h2 style={{ borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '20px' }}>
                                ❤️ Bài Hát Yêu Thích
                            </h2>
                            {favorites.length === 0 ? (
                                <p style={{ color: '#b3b3b3' }}>Chưa có bài hát yêu thích.</p>
                            ) : (
                                <div>
                                    {favorites.slice(0, 3).map(song => renderSongItem(song))}
                                </div>
                            )}
                        </div>

                        {/* Playlists Section (Keep it small or move down) */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '20px' }}>
                                <h2 style={{ margin: 0 }}>📋 Playlist Của Tôi</h2>
                                <Link to="/playlists" className="btn-secondary" style={{ padding: '5px 15px', fontSize: '0.9rem', textDecoration: 'none' }}>Quản lý</Link>
                            </div>
                             {playlists.length === 0 ? (
                                <p style={{ color: '#b3b3b3' }}>Bạn chưa tạo playlist nào.</p>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
                                   {playlists.map(playlist => (
                                        <div key={playlist.playlistID} style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px' }}>
                                            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>📋</div>
                                            <h4 style={{ margin: '0', fontSize: '1rem' }}>{playlist.playlistName}</h4>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>{playlist.songCount} bài</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
}
export default ProfilePage;
