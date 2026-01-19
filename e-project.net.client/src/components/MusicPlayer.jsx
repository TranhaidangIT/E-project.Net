import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { likedSongAPI, playlistAPI } from '../services/api';
import './MusicPlayer.css';

function MusicPlayer({ song, onNext, onPrevious }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(70);
    const [isLiked, setIsLiked] = useState(false);
    const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [playlistMessage, setPlaylistMessage] = useState('');
    const intervalRef = useRef(null);
    const dropdownRef = useRef(null);

    const { user } = useAuth();
    const navigate = useNavigate();
    const duration = song?.duration || 180;

    // Define functions first using useCallback
    const checkIfLiked = useCallback(async (songId) => {
        try {
            const response = await likedSongAPI.checkLiked(songId);
            setIsLiked(response.data);
        } catch (err) {
            console.error('Failed to check liked status:', err);
            setIsLiked(false);
        }
    }, []);

    const fetchPlaylists = useCallback(async () => {
        try {
            const response = await playlistAPI.getMyPlaylists();
            setPlaylists(response.data);
        } catch (err) {
            console.error('Failed to fetch playlists:', err);
        }
    }, []);

    // Reset when song changes
    const currentSongId = song?.songID;
    useEffect(() => {
        setCurrentTime(0);
        setIsPlaying(false);
        setIsLiked(false);
        // Check if song is liked
        if (user && currentSongId) {
            checkIfLiked(currentSongId);
        }
    }, [currentSongId, user, checkIfLiked]);

    // Fetch playlists when user is logged in
    useEffect(() => {
        if (user) {
            fetchPlaylists();
        }
    }, [user, fetchPlaylists]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowPlaylistDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLikeToggle = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            if (isLiked) {
                await likedSongAPI.unlikeSong(song.songID);
                setIsLiked(false);
            } else {
                await likedSongAPI.likeSong(song.songID);
                setIsLiked(true);
            }
        } catch (err) {
            console.error('Failed to toggle like:', err);
        }
    };

    const handleAddToPlaylist = async (playlistId) => {
        try {
            await playlistAPI.addSongToPlaylist(playlistId, song.songID);
            setPlaylistMessage('Đã thêm!');
            setTimeout(() => {
                setPlaylistMessage('');
                setShowPlaylistDropdown(false);
            }, 1000);
        } catch (err) {
            setPlaylistMessage(err.response?.data?.message || 'Lỗi');
            setTimeout(() => setPlaylistMessage(''), 2000);
        }
    };

    useEffect(() => {
        // Simulate playback
        if (isPlaying) {
            intervalRef.current = setInterval(() => {
                setCurrentTime(prev => {
                    if (prev >= duration) {
                        setIsPlaying(false);
                        onNext?.();
                        return 0;
                    }
                    return prev + 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPlaying, duration, onNext]);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e) => {
        const newTime = parseInt(e.target.value);
        setCurrentTime(newTime);
    };

    const handleVolumeChange = (e) => {
        setVolume(parseInt(e.target.value));
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!song) {
        return (
            <div className="music-player">
                <div className="player-content">
                    <p style={{ textAlign: 'center', color: '#a0a0a0' }}>
                        Chọn một bài hát để phát
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="music-player">
            <div className="player-content">
                {/* Left: Song Info */}
                <div className="player-left">
                    <div className="player-album-art">
                        <img src="/logo.svg" alt="" className="player-logo-icon" />
                    </div>
                    <div className="player-details">
                        <h3>{song.songName}</h3>
                        <p>{song.artistName}</p>
                    </div>
                    <div className="player-actions">
                        <button 
                            className={`player-action-btn like-btn ${isLiked ? 'liked' : ''}`}
                            onClick={handleLikeToggle}
                            title={isLiked ? 'Bỏ thích' : 'Thích'}
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" fill={isLiked ? '#e74c3c' : 'currentColor'}>
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        </button>
                        <div className="playlist-dropdown-container" ref={dropdownRef}>
                            <button 
                                className="player-action-btn add-btn"
                                onClick={() => {
                                    if (!user) {
                                        navigate('/login');
                                        return;
                                    }
                                    setShowPlaylistDropdown(!showPlaylistDropdown);
                                }}
                                title="Thêm vào Playlist"
                            >
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                </svg>
                            </button>
                            {showPlaylistDropdown && (
                                <div className="player-playlist-dropdown">
                                    <div className="dropdown-header">Thêm vào Playlist</div>
                                    {playlistMessage && (
                                        <div className="dropdown-message">{playlistMessage}</div>
                                    )}
                                    {playlists.length === 0 ? (
                                        <div className="dropdown-empty">Chưa có playlist</div>
                                    ) : (
                                        playlists.map(playlist => (
                                            <div 
                                                key={playlist.playlistID}
                                                className="dropdown-item"
                                                onClick={() => handleAddToPlaylist(playlist.playlistID)}
                                            >
                                                {playlist.playlistName}
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Center: Controls & Progress */}
                <div className="player-center">
                    <div className="player-controls">
                        <button 
                            className="control-btn" 
                            onClick={onPrevious}
                            disabled={!onPrevious}
                            title="Previous"
                        >
                            ⏮
                        </button>
                        
                        <button 
                            className="control-btn play-btn" 
                            onClick={togglePlay}
                            title={isPlaying ? 'Pause' : 'Play'}
                        >
                            {isPlaying ? '⏸' : '▶'}
                        </button>
                        
                        <button 
                            className="control-btn" 
                            onClick={onNext}
                            disabled={!onNext}
                            title="Next"
                        >
                            ⏭
                        </button>
                    </div>

                    <div className="player-progress">
                        <span className="time">{formatTime(currentTime)}</span>
                        <input
                            type="range"
                            min="0"
                            max={duration}
                            value={currentTime}
                            onChange={handleSeek}
                            className="progress-bar"
                        />
                        <span className="time">{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Right: Volume & Demo Badge */}
                <div className="player-right">
                    <div className="player-volume">
                        <span className="volume-icon"></span>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="volume-bar"
                        />
                        <span className="volume-percent">{volume}%</span>
                    </div>
                    <div className="demo-badge">
                        Demo Mode - Không có file nhạc thực tế
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MusicPlayer;
