import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { userAPI, playlistAPI, historyAPI } from '../services/api';
import Layout from '../components/Layout';

function ProfilePage() {
    const { user, logout, loadUser } = useAuth();
    const navigate = useNavigate();

    // UI State
    const [activeTab, setActiveTab] = useState('history'); // history | favorites | playlists
    const [editing, setEditing] = useState(false);

    // Form State
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        avatarURL: user?.avatarURL || '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Data State
    const [listeningHistory, setListeningHistory] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [playlists, setPlaylists] = useState([]);

    // Audio Preview State
    const [playingPreview, setPlayingPreview] = useState(null); // songID
    const audioRef = useRef(new Audio());

    // Drag & Drop Ref
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    // Initial Load
    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                avatarURL: user.avatarURL || '',
            });
            fetchPlaylists();
            fetchFavorites();
            loadHistory();

            // Auto update history every 10s
            const interval = setInterval(loadHistory, 10000);
            return () => clearInterval(interval);
        }
    }, [user]);

    // Cleanup Audio
    useEffect(() => {
        const audio = audioRef.current;
        const handleEnded = () => setPlayingPreview(null);
        audio.addEventListener('ended', handleEnded);
        return () => {
            audio.removeEventListener('ended', handleEnded);
            audio.pause();
        };
    }, []);

    // Helpers
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

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Edit Profile Handlers
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
            setMessage('✅ Cập nhật hồ sơ thành công!');
            setTimeout(() => setEditing(false), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Cập nhật thất bại');
        }
    };

    const handleDrag = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type === "dragenter" || e.type === "dragover"); };
    const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files?.[0]) handleAvatarUpload({ target: { files: [e.dataTransfer.files[0]] } }); };

    // ... (imports remain same)

    if (!user) return <div className="flex h-screen items-center justify-center text-text-primary">Đang tải...</div>;

    // Render Song Item
    const SongItem = ({ song, showPlay = true }) => (
        <div className="group flex items-center justify-between p-3 rounded-xl bg-surface hover:bg-surface-hover transition-colors border border-transparent hover:border-border-color">
            <div className="flex items-center gap-4 overflow-hidden">
                <div className="w-10 h-10 rounded bg-gradient-to-br from-background-start to-background-end flex items-center justify-center shadow-inner">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                </div>
                <div className="flex-1 overflow-hidden">
                    <h4 className="font-semibold text-text-primary truncate group-hover:text-primary transition-colors">{song.songName}</h4>
                    <p className="text-xs text-text-muted truncate">{song.artistName}</p>
                </div>
            </div>
            {showPlay && (
                <button
                    onClick={() => togglePreview(song)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${playingPreview === song.songID ? 'bg-primary text-white shadow-lg shadow-primary/40' : 'bg-surface text-text-primary hover:bg-surface-hover'}`}
                >
                    {playingPreview === song.songID ? (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                    ) : (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </button>
            )}
        </div>
    );

    return (
        <Layout>
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: Profile Card (4 cols) */}
                    <div className="md:col-span-4 lg:col-span-3">
                        <div className="glass-panel p-6 sticky top-24">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-xl font-display font-bold text-text-primary">Hồ Sơ</h2>
                                {!editing && (
                                    <button onClick={() => setEditing(true)} className="p-2 text-text-secondary hover:text-text-primary transition-colors" title="Chỉnh sửa">
                                        Edit
                                    </button>
                                )}
                            </div>

                            {message && <div className="mb-4 p-3 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium border border-green-500/30">{message}</div>}
                            {error && <div className="mb-4 p-3 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium border border-red-500/30">{error}</div>}

                            {!editing ? (
                                <div className="text-center">
                                    <div className="relative w-32 h-32 mx-auto mb-6">
                                        {user.avatarURL ? (
                                            <img src={user.avatarURL} alt="Avatar" className="w-full h-full rounded-full object-cover border-4 border-surface shadow-xl" />
                                        ) : (
                                            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-bold text-white shadow-xl border-4 border-surface">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        {user.isAdmin && <div className="absolute bottom-0 right-0 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold shadow-lg border-2 border-background-start" title="Admin">A</div>}
                                    </div>

                                    <h3 className="text-2xl font-bold text-text-primary mb-1">{user.fullName || user.username}</h3>
                                    <p className="text-text-secondary mb-6">@{user.username}</p>

                                    <div className="space-y-3 text-left bg-surface rounded-xl p-4 mb-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-text-muted">Email</span>
                                            <span className="text-text-primary truncate max-w-[150px]">{user.email}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-text-muted">Tham gia</span>
                                            <span className="text-text-primary">{new Date(user.createdAt).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-text-muted">Vai trò</span>
                                            <span className={user.isAdmin ? 'text-yellow-400 font-bold' : 'text-text-primary'}>{user.isAdmin ? 'Admin' : 'Thành viên'}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {user.isAdmin && (
                                            <Link to="/admin" className="block w-full py-2.5 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 font-medium transition-colors border border-yellow-500/30">
                                                Trang Quản Trị
                                            </Link>
                                        )}
                                        <Link to="/change-password" className="block w-full py-2.5 rounded-lg bg-surface text-text-primary hover:bg-surface-hover font-medium transition-colors border border-border-color">
                                            Đổi Mật Khẩu
                                        </Link>
                                        <button onClick={handleLogout} className="block w-full py-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 font-medium transition-colors border border-red-500/30">
                                            Đăng Xuất
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleUpdate} className="space-y-4">
                                    <div className="text-center mb-6">
                                        <div
                                            className={`relative w-32 h-32 mx-auto rounded-full border-2 border-dashed transition-all cursor-pointer overflow-hidden ${dragActive ? 'border-primary bg-primary/10' : 'border-text-muted hover:border-text-primary'}`}
                                            onClick={() => fileInputRef.current.click()}
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                        >
                                            {(formData.avatarURL || user.avatarURL) && (
                                                <img src={formData.avatarURL || user.avatarURL} className="w-full h-full object-cover opacity-50" />
                                            )}
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-xs text-center p-2 text-text-primary">
                                                {uploadingAvatar ? <span className="animate-pulse">Đang tải...</span> : <span>{dragActive ? 'Thả ảnh ngay' : 'Nhấn để đổi ảnh'}</span>}
                                            </div>
                                        </div>
                                        <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleAvatarUpload(e)} className="hidden" />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-text-muted mb-1">Họ tên hiển thị</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="w-full bg-surface border border-border-color rounded-lg py-2 px-3 text-text-primary focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button type="button" onClick={() => setEditing(false)} className="flex-1 py-2 rounded-lg bg-surface hover:bg-surface-hover text-text-primary transition-colors">Hủy</button>
                                        <button type="submit" className="flex-1 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/30 transition-all">Lưu</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Tabs & Content (8 cols) */}
                    <div className="md:col-span-8 lg:col-span-9">
                        {/* Tabs */}
                        <div className="flex items-center gap-2 mb-8 border-b border-border-color pb-1 overflow-x-auto">
                            {[
                                { id: 'history', label: 'Lịch Sử Nghe' },
                                { id: 'favorites', label: 'Yêu Thích' },
                                { id: 'playlists', label: 'Playlist Của Tôi' },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-3 rounded-t-lg text-sm font-bold flex items-center gap-2 transition-colors relative ${activeTab === tab.id
                                        ? 'text-text-primary border-b-2 border-primary bg-surface'
                                        : 'text-text-muted hover:text-text-primary hover:bg-surface'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div className="animate-fade-in min-h-[300px]">
                            {activeTab === 'history' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-text-primary">Vừa nghe gần đây</h3>
                                        <span className="text-xs text-primary animate-pulse">● Cập nhật trực tiếp</span>
                                    </div>
                                    {listeningHistory.length === 0 ? (
                                        <div className="text-center py-12 text-text-muted border border-dashed border-border-color rounded-xl">
                                            Chưa có lịch sử nghe nhạc. <Link to="/music" className="text-primary hover:underline">Nghe ngay?</Link>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            {listeningHistory.map(item => (
                                                <SongItem key={item.historyID} song={item.song} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'favorites' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-text-primary">Bài hát đã thích</h3>
                                        <span className="text-sm text-text-muted">{favorites.length} bài hát</span>
                                    </div>
                                    {favorites.length === 0 ? (
                                        <div className="text-center py-12 text-text-muted border border-dashed border-border-color rounded-xl">
                                            Chưa có bài hát yêu thích.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            {favorites.map(song => (
                                                <SongItem key={song.songID} song={song} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'playlists' && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-bold text-text-primary">Danh sách phát của tôi</h3>
                                        <Link to="/playlists" className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
                                            <span>+</span> Tạo Mới
                                        </Link>
                                    </div>
                                    {playlists.length === 0 ? (
                                        <div className="text-center py-12 text-text-muted border border-dashed border-border-color rounded-xl">
                                            Bạn chưa có playlist nào.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                                            {playlists.map(playlist => (
                                                <div key={playlist.playlistID} className="glass-panel p-4 hover:bg-surface-hover transition-colors group cursor-pointer text-center relative">
                                                    <div className="w-full aspect-square bg-gradient-to-br from-background-start to-background-end rounded-xl mb-4 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                                        <img src="/wave-sound.png" alt="Playlist" className="w-16 h-16 opacity-50" />
                                                    </div>
                                                    <h4 className="font-bold text-text-primary truncate px-2">{playlist.playlistName}</h4>
                                                    <p className="text-xs text-text-muted mt-1">{playlist.songCount} bài hát</p>

                                                    {playlist.playlistName !== 'Favorites' && (
                                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button className="w-8 h-8 rounded-full bg-black/50 hover:bg-red-500 text-white flex items-center justify-center text-sm">
                                                                ×
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
