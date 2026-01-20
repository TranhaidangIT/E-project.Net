import React, { useState, useEffect } from 'react';
import { playlistAPI, songAPI } from '../services/api';
import Layout from './Layout';
import MusicPlayer from './MusicPlayer';
import './PlaylistManager.css';

const PlaylistManager = () => {
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
            // Không đóng modal để user có thể tiếp tục thêm bài hát khác
            setTimeout(() => setSuccess(''), 2000);
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
        <div className="playlist-manager" style={{ paddingBottom: currentSong ? '100px' : '20px' }}>
            <div className="playlist-header">
                <div className="header-with-back">
                    <button onClick={() => navigate(-1)} className="btn-back">
                        ← Quay Lại
                    </button>
                </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {/* Main Content - Grid or Detail View */}
            {!playlistDetail ? (
                /* Playlists Grid */
                <div className="playlists-grid">
                    {loading && playlists.length === 0 ? (
                        <p className="loading-text">Đang tải...</p>
                    ) : playlists.length === 0 ? (
                        <div className="empty-state">
                            <p>Chưa có playlist. Tạo playlist đầu tiên của bạn!</p>
                        </div>
                    ) : (
                        playlists.map(playlist => (
                            <div 
                                key={playlist.playlistID}
                                className="playlist-card"
                                onClick={() => loadPlaylistDetail(playlist.playlistID)}
                            >
                                <div className="playlist-card-image">
                                    <img src="/logo.svg" alt="" className="playlist-icon" />
                                </div>
                                <div className="playlist-card-header">
                                    <h3>{playlist.playlistName}</h3>
                                </div>
                                <p className="song-count">{playlist.songCount} bài hát</p>
                                <span className={`badge ${playlist.isPublic ? 'badge-public' : 'badge-private'}`}>
                                    {playlist.isPublic ? 'Công khai' : 'Riêng tư'}
                                </span>
                                <div className="playlist-card-actions">
                                    <button 
                                        className="btn-icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleTogglePublic(playlist);
                                        }}
                                        title={playlist.isPublic ? 'Đặt Riêng Tư' : 'Đặt Công Khai'}
                                    >
                                        {playlist.isPublic ? '○' : '●'}
                                    </button>
                                    <button 
                                        className="btn-icon btn-delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeletePlaylist(playlist.playlistID);
                                        }}
                                        title="Xóa Playlist"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                /* Playlist Detail View */
                <div className="playlist-detail">
                    {/* Back Button & Header */}
                    <div className="playlist-detail-header">
                        <button 
                            className="btn-back" 
                            onClick={() => {
                                setPlaylistDetail(null);
                                setSelectedPlaylist(null);
                            }}
                        >
                            ← Quay lại
                        </button>
                        
                        <div className="playlist-detail-info">
                            <div className="playlist-detail-cover">
                                <img src="/logo.svg" alt="" className="playlist-icon-large" />
                            </div>
                            <div className="playlist-detail-meta">
                                <span className={`badge ${playlistDetail.isPublic ? 'badge-public' : 'badge-private'}`}>
                                    {playlistDetail.isPublic ? 'Công khai' : 'Riêng tư'}
                                </span>
                                <h1>{playlistDetail.playlistName}</h1>
                                {playlistDetail.description && (
                                    <p className="playlist-description">{playlistDetail.description}</p>
                                )}
                                <p className="playlist-stats">
                                    {playlistDetail.songs.length} bài hát • Tạo bởi {playlistDetail.username}
                                </p>
                                <div className="playlist-detail-actions">
                                    <button 
                                        className="btn-primary"
                                        onClick={() => setShowAddSongModal(true)}
                                    >
                                        + Thêm bài hát
                                    </button>
                                    <button 
                                        className="btn-secondary"
                                        onClick={() => handleTogglePublic(playlistDetail)}
                                    >
                                        {playlistDetail.isPublic ? 'Đặt riêng tư' : 'Đặt công khai'}
                                    </button>
                                    <button 
                                        className="btn-danger"
                                        onClick={() => handleDeletePlaylist(playlistDetail.playlistID)}
                                    >
                                        Xóa playlist
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Songs List */}
                    <div className="playlist-songs">
                        <div className="songs-header">
                            <span className="col-index">#</span>
                            <span className="col-title">Tiêu đề</span>
                            <span className="col-artist">Nghệ sĩ</span>
                            <span className="col-duration">Thời lượng</span>
                            <span className="col-action"></span>
                        </div>

                        {playlistDetail.songs.length === 0 ? (
                            <div className="empty-songs">
                                <p>Playlist chưa có bài hát nào</p>
                                <button 
                                    className="btn-primary"
                                    onClick={() => setShowAddSongModal(true)}
                                >
                                    + Thêm bài hát đầu tiên
                                </button>
                            </div>

                            <div className="songs-list">
                                {playlistDetail.songs.length === 0 ? (
                                    <p className="no-data">Chưa có bài hát trong playlist này</p>
                                ) : (
                                    playlistDetail.songs.map((song, index) => {
                                        const isPlayingThis = currentSong?.songID === song.songID;
                                        return (
                                            <div 
                                                key={song.playlistSongID} 
                                                className={`song-item ${isPlayingThis ? 'playing' : ''}`}
                                                onClick={() => playSong(song, index)}
                                                style={{ cursor: 'pointer', borderLeft: isPlayingThis ? '4px solid #e94560' : 'none' }}
                                            >
                                                <span className="song-number">
                                                    {isPlayingThis ? '▶️' : index + 1}
                                                </span>
                                                <div className="song-info">
                                                    <h4 style={{ color: isPlayingThis ? '#e94560' : 'inherit' }}>
                                                        {song.songName}
                                                    </h4>
                                                    <p>{song.artistName}</p>
                                                </div>
                                                {song.duration && (
                                                    <span className="duration">
                                                        {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                                                    </span>
                                                )}
                                                <button 
                                                    className="btn-remove"
                                                    onClick={(e) => handleRemoveSong(song.songID, e)}
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}

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
                                    onChange={(e) => setNewPlaylist({...newPlaylist, playlistName: e.target.value})}
                                    required
                                    maxLength={255}
                                />
                            </div>
                            <div className="form-group">
                                <label>Mô tả</label>
                                <textarea
                                    value={newPlaylist.description}
                                    onChange={(e) => setNewPlaylist({...newPlaylist, description: e.target.value})}
                                    maxLength={1000}
                                    rows={3}
                                />
                            </div>
                            <div className="form-group checkbox">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={newPlaylist.isPublic}
                                        onChange={(e) => setNewPlaylist({...newPlaylist, isPublic: e.target.checked})}
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
