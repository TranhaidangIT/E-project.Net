import { useState, useEffect, useRef } from 'react';

function MusicPlayer({ song, onNext, onPrevious }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(70);
    const intervalRef = useRef(null);

    const duration = song?.duration || 180;

    // Reset when song changes
    const currentSongId = song?.songID;
    useEffect(() => {
        setCurrentTime(0);
        setIsPlaying(false);
    }, [currentSongId]);

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
                {/* Song Info */}
                <div className="player-song-info">
                    <div className="player-album-art">
                        🎵
                    </div>
                    <div className="player-details">
                        <h3>{song.songName}</h3>
                        <p>{song.artistName}</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="player-controls">
                    <button 
                        className="control-btn" 
                        onClick={onPrevious}
                        disabled={!onPrevious}
                    >
                        ⏮️
                    </button>
                    
                    <button 
                        className="control-btn play-btn" 
                        onClick={togglePlay}
                    >
                        {isPlaying ? '⏸️' : '▶️'}
                    </button>
                    
                    <button 
                        className="control-btn" 
                        onClick={onNext}
                        disabled={!onNext}
                    >
                        ⏭️
                    </button>
                </div>

                {/* Progress Bar */}
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

                {/* Volume Control */}
                <div className="player-volume">
                    <span>🔊</span>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="volume-bar"
                    />
                    <span>{volume}%</span>
                </div>

                {/* Demo Badge */}
                <div className="demo-badge">
                    🎮 Demo Mode - Không có file nhạc thực tế
                </div>
            </div>
        </div>
    );
}

export default MusicPlayer;
