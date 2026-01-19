import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { likedSongAPI, playlistAPI } from '../services/api';
import MusicPlayer from '../components/MusicPlayer';
import Layout from '../components/Layout';
import './MusicPage.css';

function LikedSongsPage() {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentSong, setCurrentSong] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [playlists, setPlaylists] = useState([]);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState(null);
    const [playlistMessage, setPlaylistMessage] = useState('');
    
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchLikedSongs();
        fetchPlaylists();
    }, [user, navigate]);

    const fetchLikedSongs = async () => {
        try {
            setLoading(true);
            const response = await likedSongAPI.getLikedSongs();
            setSongs(response.data);
        } catch {
            setError('Không thể tải danh sách bài hát yêu thích');
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

    const handleUnlike = async (songId, e) => {
        e.stopPropagation();
        try {
            await likedSongAPI.unlikeSong(songId);
            setSongs(songs.filter(s => s.songID !== songId));
        } catch (err) {
            console.error('Failed to unlike song:', err);
        }
    };

    const openPlaylistModal = (song, e) => {
        e.stopPropagation();
        setSelectedSongForPlaylist(song);
        setShowPlaylistModal(true);
        setPlaylistMessage('');
    };

    const addToPlaylist = async (playlistId) => {
        try {
            await playlistAPI.addSongToPlaylist(playlistId, selectedSongForPlaylist.songID);
            setPlaylistMessage('Đã thêm vào playlist!');
            setTimeout(() => {
                setShowPlaylistModal(false);
                setPlaylistMessage('');
            }, 1500);
        } catch (err) {
            setPlaylistMessage(err.response?.data?.message || 'Không thể thêm vào playlist');
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

    if (loading) return <Layout><div className="loading">Đang tải...</div></Layout>;
    if (error) return <Layout><div className="error">{error}</div></Layout>;

    return (
        <Layout>
            <div className="music-page liked-songs-page">
                {/* Page Header */}
                <div className="music-header liked-header">
                    <div className="liked-header-icon">
                        <svg viewBox="0 0 24 24" width="64" height="64" fill="#1DB954">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    </div>
                    <div className="liked-header-text">
                        <span className="liked-label">Playlist</span>
                        <h1>Bài Hát Đã Thích</h1>
                        <p>{songs.length} bài hát yêu thích của bạn</p>
                    </div>
                </div>

                {/* Songs Grid */}
                {songs.length === 0 ? (
                    <div className="empty-state">
                        <svg viewBox="0 0 24 24" width="64" height="64" fill="#b3b3b3">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <h3>Chưa có bài hát yêu thích</h3>
                        <p>Hãy thích các bài hát để thêm vào danh sách này</p>
                        <button className="btn-primary" onClick={() => navigate('/music')}>
                            Khám phá nhạc
                        </button>
                    </div>
                ) : (
                    <div className="songs-grid">
                        {songs.map((song, index) => (
                            <div 
                                key={song.songID} 
                                className="song-card"
                            >
                                <div className="song-card-image">
                                    <div className="song-image-placeholder">
                                        <img src="/logo.svg" alt="" className="song-logo-icon" />
                                    </div>
                                    <div 
                                        className="play-button-overlay"
                                        onClick={() => playSong(song, index)}
                                    >
                                        <div className="play-button">
                                            ▶
                                        </div>
                                    </div>
                                </div>
                                <div className="song-card-info">
                                    <h3>{song.songName}</h3>
                                    <p>{song.artistName}</p>
                                    <div className="song-card-actions">
                                        <button 
                                            className="btn-like liked"
                                            onClick={(e) => handleUnlike(song.songID, e)}
                                            title="Bỏ thích"
                                        >
                                            <svg viewBox="0 0 24 24" width="20" height="20" fill="#e74c3c">
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                            </svg>
                                        </button>
                                        <button 
                                            className="btn-add-playlist-mini"
                                            onClick={(e) => openPlaylistModal(song, e)}
                                            title="Thêm vào Playlist"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Music Player */}
                {currentSong && (
                    <MusicPlayer 
                        song={currentSong}
                        playlist={songs}
                        onNext={currentIndex < songs.length - 1 ? playNext : null}
                        onPrevious={currentIndex > 0 ? playPrevious : null}
                    />
                )}

                {/* Playlist Modal */}
                {showPlaylistModal && (
                    <div className="playlist-modal-overlay" onClick={() => setShowPlaylistModal(false)}>
                        <div className="playlist-modal" onClick={(e) => e.stopPropagation()}>
                            <h3>Thêm vào Playlist</h3>
                            {playlistMessage && (
                                <div className={playlistMessage.includes('Đã thêm') ? 'success-message' : 'error-message'}>
                                    {playlistMessage}
                                </div>
                            )}
                            <div className="playlist-list">
                                {playlists.map(playlist => (
                                    <div 
                                        key={playlist.playlistID}
                                        className="playlist-item-modal"
                                        onClick={() => addToPlaylist(playlist.playlistID)}
                                    >
                                        <h4>{playlist.playlistName}</h4>
                                        <p>{playlist.songCount} bài hát</p>
                                    </div>
                                ))}
                            </div>
                            <button className="modal-close" onClick={() => setShowPlaylistModal(false)}>
                                Đóng
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default LikedSongsPage;
