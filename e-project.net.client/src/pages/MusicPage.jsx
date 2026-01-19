import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { songAPI, playlistAPI } from '../services/api';
import MusicPlayer from '../components/MusicPlayer';
import Layout from '../components/Layout';

function MusicPage() {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentSong, setCurrentSong] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [playlists, setPlaylists] = useState([]);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState(null);
    const [playlistMessage, setPlaylistMessage] = useState('');
    
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchSongs();
        if (user) {
            fetchPlaylists();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchSongs = async () => {
        try {
            setLoading(true);
            const response = await songAPI.getAllSongs();
            setSongs(response.data);
        } catch (_err) {
            setError('Không thể tải danh sách bài hát');
        } finally {
            setLoading(false);
        }
    };

    const fetchPlaylists = async () => {
        try {
            const response = await playlistAPI.getMyPlaylists();
            setPlaylists(response.data);
        } catch (err) {
            console.error('Failed to fetch playlists:', err);
        }
    };

    const openPlaylistModal = (song, e) => {
        e.stopPropagation();
        if (!user) {
            navigate('/login');
            return;
        }
        setSelectedSongForPlaylist(song);
        setShowPlaylistModal(true);
        setPlaylistMessage('');
    };

    const addToPlaylist = async (playlistId) => {
        try {
            await playlistAPI.addSongToPlaylist(playlistId, selectedSongForPlaylist.songID);
            setPlaylistMessage('✅ Đã thêm vào playlist!');
            setTimeout(() => {
                setShowPlaylistModal(false);
                setPlaylistMessage('');
            }, 1500);
        } catch (err) {
            setPlaylistMessage(err.response?.data?.message || '❌ Không thể thêm vào playlist');
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
        } catch (_err) {
            setError('Lỗi tìm kiếm');
        }
    };

    const playSong = (song, index) => {
        setCurrentSong(song);
        setCurrentIndex(index);
    };

    const playNext = () => {
        if (currentIndex < songs.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentSong(songs[nextIndex]);
            setCurrentIndex(nextIndex);
        }
    };

    const playPrevious = () => {
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            setCurrentSong(songs[prevIndex]);
            setCurrentIndex(prevIndex);
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
        <div className="music-page">
            {/* Page Header with Back Button */}
            <div className="page-header">
                <button onClick={() => navigate(-1)} className="btn-back">
                    ← Quay Lại
                </button>
                <div className="page-title-section">
                    <h1>🎵 Duyệt Âm Nhạc</h1>
                    <p>Khám phá và thưởng thức các bài hát yêu thích</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="search-section">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="🔍 Tìm kiếm bài hát, nghệ sĩ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button onClick={handleSearch} className="btn-primary">
                        Tìm kiếm
                    </button>
                    <button onClick={() => { setSearchQuery(''); fetchSongs(); }} className="btn-secondary">
                        🔄 Tất cả
                    </button>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* Songs Grid */}
            <div className="songs-container">
                <h2>Danh Sách Bài Hát ({songs.length})</h2>
                <div className="songs-grid">
                    {songs.map((song, index) => (
                        <div 
                            key={song.songID} 
                            className={`song-card ${currentSong?.songID === song.songID ? 'active' : ''}`}
                        >
                            <div className="song-card-art" onClick={() => playSong(song, index)}>
                                🎵
                            </div>
                            <div className="song-card-info" onClick={() => playSong(song, index)}>
                                <h3>{song.songName}</h3>
                                <p className="artist">{song.artistName}</p>
                                <div className="song-card-meta">
                                    <span>⏱️ {formatDuration(song.duration)}</span>
                                    <span>👂 {song.playCount}</span>
                                </div>
                            </div>
                            <div className="song-card-actions">
                                <button 
                                    className="btn-icon-action"
                                    onClick={(e) => openPlaylistModal(song, e)}
                                    title="Thêm vào playlist"
                                >
                                    ➕
                                </button>
                            </div>
                            {currentSong?.songID === song.songID && (
                                <div className="playing-indicator">
                                    <span className="wave"></span>
                                    <span className="wave"></span>
                                    <span className="wave"></span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {songs.length === 0 && (
                    <div className="empty-state">
                        <p>Không tìm thấy bài hát nào</p>
                    </div>
                )}
            </div>

            {/* Music Player */}
            <MusicPlayer 
                song={currentSong}
                playlist={songs}
                onNext={currentIndex < songs.length - 1 ? playNext : null}
                onPrevious={currentIndex > 0 ? playPrevious : null}
            />

            {/* Add to Playlist Modal */}
            {showPlaylistModal && (
                <div className="modal-overlay" onClick={() => setShowPlaylistModal(false)}>
                    <div className="modal playlist-select-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Thêm vào Playlist</h3>
                            <button className="btn-close" onClick={() => setShowPlaylistModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p className="song-to-add">
                                <strong>{selectedSongForPlaylist?.songName}</strong> - {selectedSongForPlaylist?.artistName}
                            </p>
                            {playlistMessage && (
                                <div className={`alert ${playlistMessage.includes('✅') ? 'alert-success' : 'alert-error'}`}>
                                    {playlistMessage}
                                </div>
                            )}
                            {playlists.length === 0 ? (
                                <div className="empty-playlists">
                                    <p>Bạn chưa có playlist nào</p>
                                    <button 
                                        className="btn-primary"
                                        onClick={() => navigate('/playlists')}
                                    >
                                        Tạo Playlist Đầu Tiên
                                    </button>
                                </div>
                            ) : (
                                <div className="playlists-list">
                                    {playlists.map(playlist => (
                                        <div 
                                            key={playlist.playlistID}
                                            className="playlist-item-select"
                                            onClick={() => addToPlaylist(playlist.playlistID)}
                                        >
                                            <div className="playlist-icon">📋</div>
                                            <div className="playlist-info">
                                                <h4>{playlist.playlistName}</h4>
                                                <p>{playlist.songCount} bài hát</p>
                                            </div>
                                            <div className="playlist-arrow">→</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
        </Layout>
    );
}

export default MusicPage;
    