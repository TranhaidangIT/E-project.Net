import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { playlistAPI, songAPI } from '../services/api';
import Layout from './Layout';
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

    const handleRemoveSong = async (songId) => {
        if (!selectedPlaylist) return;

        if (!window.confirm('Xóa bài hát này khỏi playlist?')) return;

        try {
            setLoading(true);
            await playlistAPI.removeSongFromPlaylist(selectedPlaylist, songId);
            setSuccess('Đã xóa bài hát khỏi playlist!');
            loadPlaylistDetail(selectedPlaylist);
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

    // Get songs not in current playlist
    const getAvailableSongs = () => {
        if (!playlistDetail) return allSongs;
        const playlistSongIds = playlistDetail.songs.map(s => s.songID);
        return allSongs.filter(song => !playlistSongIds.includes(song.songID));
    };

    return (
        <Layout>
        <div className="playlist-manager">
            <div className="playlist-header">
                <div className="header-with-back">
                    <button onClick={() => navigate(-1)} className="btn-back">
                        ← Quay Lại
                    </button>
                    <div>
                        <h1>Playlist Của Tôi</h1>
                        <p>Quản lý bộ sưu tập âm nhạc</p>
                    </div>
                </div>
                <button 
                    className="btn-primary" 
                    onClick={() => setShowCreateModal(true)}
                >
                    + Tạo Playlist Mới
                </button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="playlist-container">
                {/* Playlists List */}
                <div className="playlists-list">
                    {loading && playlists.length === 0 ? (
                        <p>Đang tải...</p>
                    ) : playlists.length === 0 ? (
                        <p className="no-data">Chưa có playlist. Tạo playlist đầu tiên của bạn!</p>
                    ) : (
                        playlists.map(playlist => (
                            <div 
                                key={playlist.playlistID}
                                className={`playlist-item ${selectedPlaylist === playlist.playlistID ? 'active' : ''}`}
                                onClick={() => loadPlaylistDetail(playlist.playlistID)}
                            >
                                <div className="playlist-info">
                                    <h3>{playlist.playlistName}</h3>
                                    <p className="song-count">{playlist.songCount} bài hát</p>
                                    <span className={`badge ${playlist.isPublic ? 'badge-public' : 'badge-private'}`}>
                                        {playlist.isPublic ? 'Công khai' : 'Riêng tư'}
                                    </span>
                                </div>
                                <div className="playlist-actions">
                                    <button 
                                        className="btn-icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleTogglePublic(playlist);
                                        }}
                                        title={playlist.isPublic ? 'Đặt Riêng Tư' : 'Đặt Công Khai'}
                                    >
                                        {playlist.isPublic ? '🔓' : '🔒'}
                                    </button>
                                    <button 
                                        className="btn-icon btn-delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeletePlaylist(playlist.playlistID);
                                        }}
                                        title="Xóa Playlist"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Playlist Detail */}
                <div className="playlist-detail">
                    {!playlistDetail ? (
                        <div className="no-selection">
                            <p>Chọn một playlist để xem chi tiết</p>
                        </div>
                    ) : (
                        <>
                            <div className="detail-header">
                                <h2>{playlistDetail.playlistName}</h2>
                                {playlistDetail.description && (
                                    <p className="description">{playlistDetail.description}</p>
                                )}
                                <button 
                                    className="btn-primary"
                                    onClick={() => setShowAddSongModal(true)}
                                >
                                    + Thêm Bài Hát
                                </button>
                            </div>

                            <div className="songs-list">
                                {playlistDetail.songs.length === 0 ? (
                                    <p className="no-data">Chưa có bài hát trong playlist này</p>
                                ) : (
                                    playlistDetail.songs.map((song, index) => (
                                        <div key={song.playlistSongID} className="song-item">
                                            <span className="song-number">{index + 1}</span>
                                            <div className="song-info">
                                                <h4>{song.songName}</h4>
                                                <p>{song.artistName}</p>
                                            </div>
                                            {song.duration && (
                                                <span className="duration">
                                                    {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                                                </span>
                                            )}
                                            <button 
                                                className="btn-remove"
                                                onClick={() => handleRemoveSong(song.songID)}
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

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
