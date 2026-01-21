import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { songAPI } from '../services/api';
import Layout from '../components/Layout';

function SongManagement() {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentSong, setCurrentSong] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Drag & Drop state
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        songName: '',
        artistName: '',
        file: null
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
                file: null
            });
        } else {
            setEditMode(false);
            setCurrentSong(null);
            setFormData({ songName: '', artistName: '', file: null });
        }
        setShowModal(true);
        setError('');
        setDragActive(false);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({ songName: '', artistName: '', file: null });
        setError('');
        setDragActive(false);
    };

    const handleChange = (e) => {
        if (e.target.name === 'file') {
            setFormData({ ...formData, file: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    // Drag & Drop Handlers
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type.startsWith('audio/')) {
                setFormData({ ...formData, file: droppedFile });
            } else {
                setError('Chỉ chấp nhận file âm thanh (MP3, WAV...)');
            }
        }
    };

    const handleZoneClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (editMode && currentSong) {
                // Update mode (Metadata only for now)
                const songData = {
                    songName: formData.songName,
                    artistName: formData.artistName
                };
                await songAPI.updateSong(currentSong.songID, songData);
                // alert('✅ Cập nhật bài hát thành công!');
            } else {
                // Create mode (Multipart)
                if (!formData.file) {
                    setError('Vui lòng chọn file nhạc (.mp3)');
                    return;
                }

                const data = new FormData();
                data.append('songName', formData.songName);
                data.append('artistName', formData.artistName);
                data.append('file', formData.file);

                await songAPI.createSong(data);
                // alert('✅ Thêm bài hát thành công!');
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

    if (loading && songs.length === 0) return <div className="flex h-screen items-center justify-center text-white">Đang tải...</div>;

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white mb-2">
                            Quản Lý Bài Hát
                        </h1>
                        <p className="text-text-secondary">
                            Admin <strong className="text-primary">{user?.username}</strong>
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/admin')} className="px-4 py-2 rounded-lg bg-surface border border-white/10 text-white hover:bg-surface-hover transition-colors flex items-center gap-2">
                            Quản lý Users
                        </button>
                        <button onClick={() => navigate('/profile')} className="px-4 py-2 rounded-lg bg-surface border border-white/10 text-white hover:bg-surface-hover transition-colors flex items-center gap-2">
                            Hồ sơ
                        </button>
                        <button onClick={logout} className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-colors">
                            Đăng xuất
                        </button>
                    </div>
                </div>

                {/* Actions Bar */}
                <div className="glass-panel p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1 w-full md:max-w-md">
                        <input
                            type="text"
                            placeholder="Tìm kiếm bài hát hoặc nghệ sĩ..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 px-5 pl-11 text-white focus:outline-none focus:border-primary transition-all"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">🔍</span>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button onClick={handleSearch} className="px-4 py-2.5 rounded-lg bg-surface hover:bg-surface-hover text-white transition-colors border border-white/10 flex-1 md:flex-none">
                            Tìm Kiếm
                        </button>
                        <button onClick={() => { setSearchQuery(''); fetchSongs(); }} className="px-4 py-2.5 rounded-lg bg-surface hover:bg-surface-hover text-white transition-colors border border-white/10 flex-1 md:flex-none">
                            Làm Mới
                        </button>
                        <button onClick={() => handleOpenModal()} className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold shadow-lg shadow-primary/30 transition-all flex items-center gap-2 flex-1 md:flex-none justify-center">
                            <span>➕</span> Thêm Mới
                        </button>
                    </div>
                </div>

                {/* Songs Table */}
                <div className="glass-panel p-6 overflow-hidden">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        Danh Sách Bài Hát <span className="text-sm font-normal text-text-secondary bg-white/5 px-2 py-0.5 rounded-full ml-2">{songs.length}</span>
                    </h2>

                    {error && <div className="mb-4 text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-lg border border-red-500/20">{error}</div>}

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10 text-left text-text-muted text-sm uppercase tracking-wider">
                                    <th className="pb-4 pl-4">ID</th>
                                    <th className="pb-4">Bài Hát</th>
                                    <th className="pb-4">Nghệ Sĩ</th>
                                    <th className="pb-4">Thời Lượng</th>
                                    <th className="pb-4">Lượt Nghe</th>
                                    <th className="pb-4">Ngày Thêm</th>
                                    <th className="pb-4 text-center">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {songs.map((song) => (
                                    <tr key={song.songID} className="group hover:bg-white/5 transition-colors">
                                        <td className="py-4 pl-4 text-text-secondary">#{song.songID}</td>
                                        <td className="py-4 font-medium text-white">{song.songName}</td>
                                        <td className="py-4 text-text-secondary">{song.artistName}</td>
                                        <td className="py-4 text-text-secondary font-mono text-xs">{formatDuration(song.duration)}</td>
                                        <td className="py-4 text-text-secondary">{song.playCount}</td>
                                        <td className="py-4 text-text-secondary text-sm">{new Date(song.createdAt).toLocaleDateString('vi-VN')}</td>
                                        <td className="py-4 text-center">
                                            <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleOpenModal(song)}
                                                    className="p-2 rounded-lg hover:bg-amber-500/20 text-amber-500 transition-colors"
                                                    title="Sửa"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(song.songID)}
                                                    className="p-2 rounded-lg hover:bg-red-500/20 text-red-500 transition-colors"
                                                    title="Xóa"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {songs.length === 0 && !loading && (
                        <div className="text-center py-12 text-text-muted">
                            <div className="mb-4">
                                <img src="/wave-sound.png" alt="No songs" className="w-16 h-16 mx-auto opacity-50" />
                            </div>
                            <p>Không có bài hát nào được tìm thấy</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={handleCloseModal}>
                    <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h2 className="text-xl font-bold text-white">{editMode ? 'Cập Nhật Bài Hát' : 'Thêm Bài Hát Mới'}</h2>
                            <button onClick={handleCloseModal} className="text-text-muted hover:text-white transition-colors text-2xl leading-none">&times;</button>
                        </div>

                        <div className="p-6">
                            {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm text-center">{error}</div>}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-1">Tên Bài Hát <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="songName"
                                        value={formData.songName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Nhập tên bài hát"
                                        className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary transition-colors placeholder-text-muted/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-1">Nghệ Sĩ <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="artistName"
                                        value={formData.artistName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Nhập tên nghệ sĩ"
                                        className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary transition-colors placeholder-text-muted/50"
                                    />
                                </div>

                                {!editMode && (
                                    <div>
                                        <label className="block text-sm font-medium text-text-muted mb-1">File Nhạc (.mp3) <span className="text-red-500">*</span></label>
                                        <div
                                            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${dragActive
                                                ? 'border-primary bg-primary/10'
                                                : formData.file
                                                    ? 'border-green-500/50 bg-green-500/5'
                                                    : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                                                }`}
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                            onClick={handleZoneClick}
                                        >
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                name="file"
                                                accept="audio/*"
                                                onChange={handleChange}
                                                className="hidden"
                                            />
                                            {formData.file ? (
                                                <div className="text-green-400">
                                                    <div className="mb-2">
                                                        <img src="/wave-sound.png" alt="Upload" className="w-12 h-12 mx-auto opacity-50" />
                                                    </div>
                                                    <p className="font-medium truncate max-w-[200px] mx-auto">{formData.file.name}</p>
                                                    <p className="text-xs opacity-70 mt-1">Click để thay đổi</p>
                                                </div>
                                            ) : (
                                                <div className="text-text-muted">
                                                    <div className="mb-2">
                                                        <span className="text-2xl opacity-50">☁</span>
                                                    </div>
                                                    <p className="font-medium text-white mb-1">Kéo thả file vào đây</p>
                                                    <p className="text-xs">hoặc click để chọn file</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={handleCloseModal} className="flex-1 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors font-medium">
                                        Hủy
                                    </button>
                                    <button type="submit" className="flex-1 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/30 transition-all font-medium">
                                        {editMode ? 'Lưu Thay Đổi' : 'Tải Lên'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default SongManagement;
