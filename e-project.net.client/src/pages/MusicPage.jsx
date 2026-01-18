import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { songAPI } from '../services/api';
import MusicPlayer from '../components/MusicPlayer';

function MusicPage() {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentSong, setCurrentSong] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    
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
        } catch (_err) {
            setError('Không thể tải danh sách bài hát');
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

    if (loading) return <div className="loading">Đang tải...</div>;

    return (
        <div className="music-page">
            {/* Header */}
            <div className="music-header">
                <div className="header-left">
                    <h1>🎵 Music Web</h1>
                    <p>Thưởng thức âm nhạc miễn phí</p>
                </div>
                <div className="header-right">
                    {user ? (
                        <>
                            <span className="welcome-text">👋 {user.username}</span>
                            {user.isAdmin && (
                                <button onClick={() => navigate('/admin')} className="btn-secondary btn-sm">
                                    ⚙️ Admin
                                </button>
                            )}
                            <button onClick={() => navigate('/profile')} className="btn-secondary btn-sm">
                                👤 Profile
                            </button>
                            <button onClick={logout} className="btn-danger btn-sm">
                                Đăng xuất
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => navigate('/login')} className="btn-secondary btn-sm">
                                Đăng nhập
                            </button>
                            <button onClick={() => navigate('/register')} className="btn-primary btn-sm">
                                Đăng ký
                            </button>
                        </>
                    )}
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
                            onClick={() => playSong(song, index)}
                        >
                            <div className="song-card-art">
                                🎵
                            </div>
                            <div className="song-card-info">
                                <h3>{song.songName}</h3>
                                <p className="artist">{song.artistName}</p>
                                <div className="song-card-meta">
                                    <span>⏱️ {formatDuration(song.duration)}</span>
                                    <span>👂 {song.playCount}</span>
                                </div>
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
        </div>
    );
}

export default MusicPage;
