import { useState, useEffect, useRef } from 'react';
import { historyAPI } from '../services/api';

function MusicPlayer({ song, onNext, onPrevious }) {
    // ===== STATE =====
    // Component sẽ được remount khi songID đổi (key ở parent)
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(100);
    const [hasRecorded, setHasRecorded] = useState(false);

    const audioRef = useRef(null);

    // ===== PLAY / PAUSE EFFECT =====
    useEffect(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.play().catch(err => {
                console.warn('Autoplay prevented:', err);
                setIsPlaying(false);
            });
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    // ===== VOLUME EFFECT =====
    useEffect(() => {
        if (!audioRef.current) return;
        audioRef.current.volume = volume / 100;
    }, [volume]);

    // ===== AUDIO EVENTS =====
    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        if (!audio) return;

        const current = audio.currentTime;
        setCurrentTime(current);

        // 🔑 30-Second Listen Rule
        if (current >= 30 && !hasRecorded && song?.songID) {
            setHasRecorded(true);
            historyAPI.recordHistory(song.songID).catch(err =>
                console.error('Failed to record listening history', err)
            );
        }
    };

    const handleLoadedMetadata = () => {
        if (!audioRef.current) return;
        setDuration(audioRef.current.duration || 0);
    };

    const handleEnded = () => {
        setIsPlaying(false);
        if (onNext) onNext();
    };

    // ===== CONTROLS =====
    const togglePlay = () => {
        setIsPlaying(prev => !prev);
    };

    const handleSeek = (e) => {
        const newTime = Number(e.target.value);
        setCurrentTime(newTime);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
    };

    const handleVolumeChange = (e) => {
        setVolume(Number(e.target.value));
    };

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // ===== EMPTY STATE =====
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

    // File URL (ASP.NET wwwroot/uploads)
    const songUrl = `/uploads/songs/${song.songID}.mp3`;

    // ===== RENDER =====
    return (
        <div className="music-player">
            <audio
                ref={audioRef}
                src={songUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
                onError={(e) => {
                    console.error('Audio error', e);
                    setIsPlaying(false);
                }}
            />

            <div className="player-content">
                {/* SONG INFO */}
                <div className="player-song-info">
                    <div className="player-album-art">🎵</div>
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

                {/* CONTROLS */}
                <div className="player-controls">
                    <button
                        className="control-btn"
                        onClick={onPrevious}
                        disabled={!onPrevious}
                        title="Bài trước"
                    >
                        ⏮️
                    </button>

                    <button
                        className="control-btn play-btn"
                        onClick={togglePlay}
                        title={isPlaying ? 'Tạm dừng' : 'Phát'}
                    >
                        {isPlaying ? '⏸️' : '▶️'}
                    </button>

                    <button
                        className="control-btn"
                        onClick={onNext}
                        disabled={!onNext}
                        title="Bài tiếp theo"
                    >
                        ⏭️
                    </button>
                </div>

                {/* PROGRESS */}
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

                {/* VOLUME */}
                <div className="player-volume">
                    <span
                        onClick={() => setVolume(volume === 0 ? 100 : 0)}
                        style={{ cursor: 'pointer' }}
                    >
                        {volume === 0 ? '🔇' : '🔊'}
                    </span>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="volume-bar"
                    />
                </div>
            </div>
        </div>
    );
}

export default MusicPlayer;
