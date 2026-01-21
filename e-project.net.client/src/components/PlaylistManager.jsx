import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { playlistAPI, songAPI } from '../services/api';
import Layout from './Layout';
import MusicPlayer from './MusicPlayer';
import './PlaylistManager.css';

const PlaylistManager = () => {
    const navigate = useNavigate();
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [playlistDetail, setPlaylistDetail] = useState(null);
    const [allSongs, setAllSongs] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAddSongModal, setShowAddSongModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Playback state
    const [currentSong, setCurrentSong] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);

    // Form state
    const [newPlaylist, setNewPlaylist] = useState({
        playlistName: '',
        description: '',
        isPublic: false
    });

    useEffect(() => {
        loadPlaylists();
        loadAllSongs();
    }, []);

    const loadPlaylists = async () => {
        try {
            setLoading(true);
            const response = await playlistAPI.getMyPlaylists();
            setPlaylists(response.data);
        } catch (err) {
            setError('Không thể tải danh sách playlist');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadAllSongs = async () => {
        try {
            const response = await songAPI.getAllSongs();
            setAllSongs(response.data);
        } catch (err) {
            console.error('Failed to load songs:', err);
        }
    };

    const loadPlaylistDetail = async (playlistId) => {
        try {
            setLoading(true);
            const response = await playlistAPI.getPlaylistById(playlistId);
            setPlaylistDetail(response.data);
            setSelectedPlaylist(playlistId);
        } catch (err) {
            setError('Không thể tải chi tiết playlist');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePlaylist = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await playlistAPI.createPlaylist(newPlaylist);
            setSuccess('Đã tạo playlist thành công!');
            setShowCreateModal(false);
            setNewPlaylist({ playlistName: '', description: '', isPublic: false });
            loadPlaylists();
        } catch (err) {
            setError('Không thể tạo playlist');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePlaylist = async (playlistId) => {
        if (!window.confirm('Bạn có chắc muốn xóa playlist này?')) return;

        try {
            setLoading(true);
            await playlistAPI.deletePlaylist(playlistId);
            setSuccess('Đã xóa playlist thành công!');
            if (selectedPlaylist === playlistId) {
                setSelectedPlaylist(null);
                setPlaylistDetail(null);
                setCurrentSong(null); // Stop music if deleted playlist was playing
            }
            loadPlaylists();
        } catch (err) {
            setError('Không thể xóa playlist');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSong = async (songId) => {
        if (!selectedPlaylist) return;

        try {
            setLoading(true);
            await playlistAPI.addSongToPlaylist(selectedPlaylist, songId);
            setSuccess('Đã thêm bài hát vào playlist!');
            loadPlaylistDetail(selectedPlaylist);
            setShowAddSongModal(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể thêm bài hát');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveSong = async (songId, e) => {
        e.stopPropagation(); // Prevent playing when clicking delete
        if (!selectedPlaylist) return;

        if (!window.confirm('Xóa bài hát này khỏi playlist?')) return;

        try {
            setLoading(true);
            await playlistAPI.removeSongFromPlaylist(selectedPlaylist, songId);
            setSuccess('Đã xóa bài hát khỏi playlist!');
            loadPlaylistDetail(selectedPlaylist);
            // If removed song is playing, stop or next? For now, keep simple.
        } catch (err) {
            setError('Không thể xóa bài hát');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePublic = async (playlist) => {
        try {
            setLoading(true);
            await playlistAPI.updatePlaylist(playlist.playlistID, {
                isPublic: !playlist.isPublic
            });
            setSuccess('Đã cập nhật chế độ hiển thị!');
            loadPlaylists();
            if (selectedPlaylist === playlist.playlistID) {
                loadPlaylistDetail(playlist.playlistID);
            }
        } catch (err) {
            setError('Không thể cập nhật playlist');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Playback Logic
    const playSong = (song, index) => {
        setCurrentSong(song);
        setCurrentIndex(index);
    };

    const playNext = () => {
        if (playlistDetail && currentIndex < playlistDetail.songs.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentSong(playlistDetail.songs[nextIndex]);
            setCurrentIndex(nextIndex);
        }
    };

    const playPrevious = () => {
        if (playlistDetail && currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            setCurrentSong(playlistDetail.songs[prevIndex]);
            setCurrentIndex(prevIndex);
        }
    };

    // Get songs not in current playlist
    const getAvailableSongs = () => {
        if (!playlistDetail) return allSongs;
        const playlistSongIds = playlistDetail.songs.map(s => s.songID);
        return allSongs.filter(song => !playlistSongIds.includes(song.songID));
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 pb-8" style={{ paddingBottom: currentSong ? '120px' : '32px' }}>
                {/* Header Section - Hierarchical */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-4 mb-2">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="p-2 hover:bg-surface rounded-lg transition-colors text-text-secondary hover:text-text-primary"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <h1 className="text-4xl font-bold text-text-primary">Playlist Của Tôi</h1>
                            </div>
                            <p className="text-text-secondary ml-14">Quản lý bộ sưu tập âm nhạc của bạn</p>
                        </div>
                        <button
                            className="btn-primary px-8 py-3"
                            onClick={() => setShowCreateModal(true)}
                        >
                            Tạo Playlist Mới
                        </button>
                    </div>

                    {/* Alerts */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl mb-4">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-500/10 border border-green-500/50 text-green-200 p-4 rounded-xl mb-4">
                            {success}
                        </div>
                    )}
                </div>

                {/* Main Content - Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Playlists Grid (2 columns) */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold text-text-primary mb-6">Danh Sách Playlist</h2>

                        {loading && playlists.length === 0 ? (
                            <div className="text-center py-12 text-text-muted">Đang tải...</div>
                        ) : playlists.length === 0 ? (
                            <div className="glass-panel p-12 text-center">
                                <div className="mb-4">
                                    <img src="/wave-sound.png" alt="No playlists" className="w-24 h-24 mx-auto opacity-20" />
                                </div>
                                <h3 className="text-xl font-bold text-text-primary mb-2">Chưa có playlist</h3>
                                <p className="text-text-muted mb-6">Tạo playlist đầu tiên của bạn!</p>
                                <button
                                    className="btn-primary px-8 py-3"
                                    onClick={() => setShowCreateModal(true)}
                                >
                                    + Tạo Playlist Ngay
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {playlists.map(playlist => {
                                    const isActive = selectedPlaylist === playlist.playlistID;
                                    return (
                                        <div
                                            key={playlist.playlistID}
                                            onClick={() => loadPlaylistDetail(playlist.playlistID)}
                                            className={`glass-panel p-6 cursor-pointer transition-all hover:border-primary ${isActive ? 'border-primary bg-primary/5' : ''
                                                }`}
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <h3 className={`text-xl font-bold mb-2 ${isActive ? 'text-primary' : 'text-text-primary'}`}>
                                                        {playlist.playlistName}
                                                    </h3>
                                                    <p className="text-sm text-text-secondary">{playlist.songCount} bài hát</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${playlist.isPublic
                                                    ? 'bg-primary/20 text-primary'
                                                    : 'bg-surface text-text-secondary'
                                                    }`}>
                                                    {playlist.isPublic ? 'Công khai' : 'Riêng tư'}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 pt-3 border-t border-border-color">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleTogglePublic(playlist);
                                                    }}
                                                    className="flex-1 px-3 py-2 text-sm rounded-lg hover:bg-surface transition-colors text-text-secondary hover:text-text-primary"
                                                    title={playlist.isPublic ? 'Đặt Riêng Tư' : 'Đặt Công Khai'}
                                                >
                                                    {playlist.isPublic ? 'Riêng tư' : 'Công khai'}
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeletePlaylist(playlist.playlistID);
                                                    }}
                                                    className="px-3 py-2 text-sm rounded-lg hover:bg-red-500/10 transition-colors text-text-secondary hover:text-red-400"
                                                    title="Xóa Playlist"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>


                    {/* Right: Playlist Detail Panel */}
                    <div className="lg:col-span-1">
                        {!playlistDetail ? (
                            <div className="glass-panel p-12 text-center h-full flex flex-col items-center justify-center">
                                <div className="mb-4">
                                    <img src="/wave-sound.png" alt="Select playlist" className="w-20 h-20 mx-auto opacity-20" />
                                </div>
                                <h3 className="text-lg font-bold text-text-primary mb-2">Chọn Playlist</h3>
                                <p className="text-sm text-text-muted">Chọn một playlist để xem chi tiết</p>
                            </div>
                        ) : (
                            <div className="glass-panel p-6 h-full flex flex-col">
                                {/* Detail Header */}
                                <div className="mb-6 pb-6 border-b border-border-color">
                                    <h2 className="text-2xl font-bold text-text-primary mb-2">{playlistDetail.playlistName}</h2>
                                    {playlistDetail.description && (
                                        <p className="text-sm text-text-secondary mb-4">{playlistDetail.description}</p>
                                    )}
                                    <button
                                        className="btn-primary w-full py-3"
                                        onClick={() => setShowAddSongModal(true)}
                                    >
                                        Thêm Bài Hát
                                    </button>
                                </div>

                                {/* Songs List */}
                                <div className="flex-1 overflow-y-auto custom-scrollbar">
                                    {playlistDetail.songs.length === 0 ? (
                                        <div className="text-center py-8">
                                            <p className="text-text-muted text-sm">Chưa có bài hát trong playlist này</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {playlistDetail.songs.map((song, index) => {
                                                const isPlayingThis = currentSong?.songID === song.songID;
                                                return (
                                                    <div
                                                        key={song.playlistSongID}
                                                        onClick={() => playSong(song, index)}
                                                        className={`p-3 rounded-lg cursor-pointer transition-all ${isPlayingThis
                                                            ? 'bg-primary/10 border border-primary'
                                                            : 'hover:bg-surface-hover border border-transparent'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className={`text-sm font-medium w-6 ${isPlayingThis ? 'text-primary' : 'text-text-muted'}`}>
                                                                {isPlayingThis ? (
                                                                    <svg className="w-3 h-3 inline" fill="currentColor" viewBox="0 0 24 24">
                                                                        <path d="M8 5v14l11-7z" />
                                                                    </svg>
                                                                ) : index + 1}
                                                            </span>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className={`text-sm font-semibold truncate ${isPlayingThis ? 'text-primary' : 'text-text-primary'
                                                                    }`}>
                                                                    {song.songName}
                                                                </h4>
                                                                <p className="text-xs text-text-secondary truncate">{song.artistName}</p>
                                                            </div>
                                                            <button
                                                                onClick={(e) => handleRemoveSong(song.songID, e)}
                                                                className="p-1 hover:bg-red-500/10 rounded text-text-muted hover:text-red-400 transition-colors"
                                                                title="Xóa"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Music Player Fixed at Bottom */}
                {currentSong && (
                    <div className="fixed-player" style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                        background: '#1a1a2e',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        padding: '0 20px'
                    }}>
                        <MusicPlayer
                            key={currentSong?.songID}
                            song={currentSong}
                            onNext={playlistDetail && currentIndex < playlistDetail.songs.length - 1 ? playNext : null}
                            onPrevious={playlistDetail && currentIndex > 0 ? playPrevious : null}
                        />
                    </div>
                )}

                {/* Create Playlist Modal */}
                {showCreateModal && (
                    <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Tạo Playlist Mới</h2>
                                <button className="btn-close" onClick={() => setShowCreateModal(false)}>×</button>
                            </div>
                            <form onSubmit={handleCreatePlaylist}>
                                <div className="form-group">
                                    <label>Tên Playlist *</label>
                                    <input
                                        type="text"
                                        value={newPlaylist.playlistName}
                                        onChange={(e) => setNewPlaylist({ ...newPlaylist, playlistName: e.target.value })}
                                        required
                                        maxLength={255}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Mô tả</label>
                                    <textarea
                                        value={newPlaylist.description}
                                        onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
                                        maxLength={1000}
                                        rows={3}
                                    />
                                </div>
                                <div className="form-group checkbox">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={newPlaylist.isPublic}
                                            onChange={(e) => setNewPlaylist({ ...newPlaylist, isPublic: e.target.checked })}
                                        />
                                        Đặt playlist công khai
                                    </label>
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                                        Hủy
                                    </button>
                                    <button type="submit" className="btn-primary" disabled={loading}>
                                        {loading ? 'Đang tạo...' : 'Tạo Playlist'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Add Song Modal */}
                {showAddSongModal && (
                    <div className="modal-overlay" onClick={() => setShowAddSongModal(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Thêm Bài Hát Vào Playlist</h2>
                                <button className="btn-close" onClick={() => setShowAddSongModal(false)}>×</button>
                            </div>
                            <div className="available-songs-list">
                                {getAvailableSongs().length === 0 ? (
                                    <p className="no-data">Không có bài hát để thêm</p>
                                ) : (
                                    getAvailableSongs().map(song => (
                                        <div key={song.songID} className="available-song-item">
                                            <div className="song-info">
                                                <h4>{song.songName}</h4>
                                                <p>{song.artistName}</p>
                                            </div>
                                            <button
                                                className="btn-primary btn-sm"
                                                onClick={() => handleAddSong(song.songID)}
                                                disabled={loading}
                                            >
                                                Thêm
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default PlaylistManager;
