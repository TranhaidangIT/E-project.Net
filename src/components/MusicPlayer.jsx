import { useState, useEffect, useRef } from 'react';

function MusicPlayer({ song, onNext, onPrevious }) {
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(50);
    const audioRef = useRef(null);

    useEffect(() => {
        // Save to History
        if (song) {
            try {
                const history = JSON.parse(localStorage.getItem('listeningHistory') || '[]');
                // Remove if exists (to move to top)
                const newHistory = history.filter(h => h.songID !== song.songID);
                newHistory.unshift(song);
                // Keep last 20
                if (newHistory.length > 20) newHistory.pop();
                localStorage.setItem('listeningHistory', JSON.stringify(newHistory));
            } catch (err) {
                console.error('Failed to save history', err);
            }
        }
    }, [song]);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(err => {
                    console.error("Play error:", err);
                    setIsPlaying(false);
                });
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, song]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
        onNext?.();
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e) => {
        const newTime = parseFloat(e.target.value);
        setCurrentTime(newTime);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
    };

    const handleVolumeChange = (e) => {
        setVolume(parseInt(e.target.value));
    };

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!song) {
        return (
            <div className="music-player-sidebar" style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#a0a0a0',
                background: 'rgba(0,0,0,0.2)'
            }}>
                <p>Chọn bài hát</p>
            </div>
        );
    }

    return (
        <div className="music-player-sidebar" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '20px',
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
            color: 'white'
        }}>
            <audio
                ref={audioRef}
                src={song ? `/uploads/songs/${song.songID}.mp3` : ''}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
            />

            {/* TOP AREA: Art & Info */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* Album Art */}
                <div style={{
                    width: '100%',
                    maxWidth: '250px',
                    aspectRatio: '1/1',
                    background: 'linear-gradient(135deg, #e94560, #16213e)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '4rem',
                    marginBottom: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                }}>
                    🎵
                </div>

                {/* Song Info */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: '0 0 10px', fontSize: '1.5rem', lineHeight: '1.3' }}>{song.songName}</h2>
                    <p style={{ margin: 0, color: '#b3b3b3', fontSize: '1.1rem' }}>{song.artistName}</p>
                </div>
            </div>

            {/* BOTTOM AREA: Controls */}
            <div style={{ marginTop: 'auto', width: '100%' }}>
                {/* Progress Bar */}
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.85rem', color: '#ccc' }}>
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeek}
                        style={{
                            width: '100%',
                            cursor: 'pointer',
                            accentColor: '#e94560',
                            height: '4px'
                        }}
                    />
                </div>

                {/* Main Controls */}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '25px',
                    marginBottom: '20px' 
                }}>
                    <button 
                        onClick={onPrevious}
                        disabled={!onPrevious}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: !onPrevious ? '#555' : 'white',
                            fontSize: '2rem',
                            cursor: !onPrevious ? 'default' : 'pointer'
                        }}
                    >
                        ⏮️
                    </button>
                    
                    <button 
                        onClick={togglePlay}
                        style={{
                            background: '#e94560',
                            border: 'none',
                            color: 'white',
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            fontSize: '2rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 5px 15px rgba(233, 69, 96, 0.4)'
                        }}
                    >
                        {isPlaying ? '⏸️' : '▶️'}
                    </button>
                    
                    <button 
                        onClick={onNext}
                        disabled={!onNext}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: !onNext ? '#555' : 'white',
                            fontSize: '2rem',
                            cursor: !onNext ? 'default' : 'pointer'
                        }}
                    >
                        ⏭️
                    </button>
                </div>

                {/* Volume */}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    background: 'rgba(255,255,255,0.05)',
                    padding: '8px 15px',
                    borderRadius: '15px'
                }}>
                    <span style={{ fontSize: '1.2rem' }}>🔊</span>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={handleVolumeChange}
                        style={{ flex: 1, accentColor: '#e94560', height: '4px' }}
                    />
                </div>
            </div>
        </div>
    );
}

export default MusicPlayer;
