import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { songAPI, playlistAPI, likedSongAPI } from '../services/api';
import MusicPlayer from '../components/MusicPlayer';
import Layout from '../components/Layout';
import './MusicPage.css';

function MusicPage() {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentSong, setCurrentSong] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [playlists, setPlaylists] = useState([]);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState(null);
    const [playlistMessage, setPlaylistMessage] = useState('');
    const [likedSongIds, setLikedSongIds] = useState([]);
    const [searchParams] = useSearchParams();
    
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const query = searchParams.get('q');
        if (query) {
            searchSongs(query);
        } else {
            fetchSongs();
        }
        if (user) {
            fetchPlaylists();
            fetchLikedSongIds();
        }
    }, [user, searchParams]);

    const fetchSongs = async () => {
        try {
            setLoading(true);
            const response = await songAPI.getAllSongs();
            setSongs(response.data);
        } catch {
            setError('Không thể tải danh sách bài hát');
        } finally {
            setLoading(false);
        }
    };

    const searchSongs = async (query) => {
        try {
            setLoading(true);
            const response = await songAPI.searchSongs(query);
            setSongs(response.data);
        } catch {
            setError('Lỗi tìm kiếm');
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

    const fetchLikedSongIds = async () => {
        try {
            const response = await likedSongAPI.getLikedSongIds();
            setLikedSongIds(response.data);
        } catch (err) {
            console.error('Failed to fetch liked songs:', err);
        }
    };

    const handleLikeToggle = async (songId, e) => {
        e.stopPropagation();
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            if (likedSongIds.includes(songId)) {
                await likedSongAPI.unlikeSong(songId);
                setLikedSongIds(likedSongIds.filter(id => id !== songId));
            } else {
                await likedSongAPI.likeSong(songId);
                setLikedSongIds([...likedSongIds, songId]);
            }
        } catch (err) {
            console.error('Failed to toggle like:', err);
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

    const formatDuration = (seconds) => {
        if (!seconds) return 'N/A';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) return <Layout><div className="loading">⏳ Đang tải...</div></Layout>;
    if (error) return <Layout><div className="error">{error}</div></Layout>;

    return (
        <Layout>
            <div className="music-page">
                {/* Page Header */}
                <div className="music-header">
                    <h1>Duyệt Âm Nhạc</h1>
                    <p>Khám phá và thưởng thức các bài hát yêu thích</p>
                    {searchParams.get('q') && (
                        <p className="search-result-info">
                            Kết quả tìm kiếm cho: "{searchParams.get('q')}" ({songs.length} bài hát)
                        </p>
                    )}
                </div>

                {/* Songs Grid */}
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
                                        className={`btn-like ${likedSongIds.includes(song.songID) ? 'liked' : ''}`}
                                        onClick={(e) => handleLikeToggle(song.songID, e)}
                                        title={likedSongIds.includes(song.songID) ? 'Bỏ thích' : 'Thích'}
                                    >
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill={likedSongIds.includes(song.songID) ? '#e74c3c' : 'currentColor'}>
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                        </svg>
                                    </button>
                                    {user && (
                                        <button 
                                            className="btn-add-playlist-mini"
                                            onClick={(e) => openPlaylistModal(song, e)}
                                            title="Thêm vào Playlist"
                                        >
                                            +
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

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
                                <div className={playlistMessage.includes('thành công') ? 'success-message' : 'error-message'}>
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

export default MusicPage;
    