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
