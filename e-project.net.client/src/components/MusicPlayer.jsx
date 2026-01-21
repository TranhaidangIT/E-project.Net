import { useState, useEffect, useRef } from 'react';
import { historyAPI } from '../services/api';

function MusicPlayer({ song, onNext, onPrevious }) {
    // ===== STATE =====
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

    // File URL (ASP.NET wwwroot/uploads)
    const songUrl = song ? `/uploads/songs/${song.songID}.mp3` : '';

    if (!song) {
        return (
            <div className="glass-panel p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                <div className="text-6xl mb-4 text-white/20">🎵</div>
                <h3 className="text-xl font-bold text-white/50">Chưa chọn bài hát</h3>
                <p className="text-sm text-text-muted mt-2">Chọn một bài hát từ danh sách để bắt đầu phát</p>
            </div>
        );
    }

    // ===== RENDER =====
    return (
        <div className="glass-panel p-6 flex flex-col h-full sticky top-24">
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

            {/* ALBUM ART */}
            <div className="aspect-square w-full rounded-2xl bg-gradient-to-br from-gray-800 to-black mb-6 relative overflow-hidden shadow-2xl group">
                <div className="absolute inset-0 flex items-center justify-center text-8xl text-white/10 group-hover:text-white/20 transition-colors">
                    🎵
                </div>
                {/* Visualizer Effect (Static for now) */}
                <div className={`absolute bottom-0 left-0 right-0 h-1/3 flex items-end justify-center gap-1 p-4 opacity-50 ${isPlaying ? 'animate-pulse' : ''}`}>
                    <div className="w-2 bg-primary h-1/2 rounded-t" />
                    <div className="w-2 bg-secondary h-3/4 rounded-t" />
                    <div className="w-2 bg-info h-2/3 rounded-t" />
                    <div className="w-2 bg-primary h-1/3 rounded-t" />
                </div>
            </div>

            {/* SONG INFO */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-display font-bold text-white mb-2 truncate">{song.songName}</h2>
                <p className="text-text-secondary text-lg truncate">{song.artistName}</p>
            </div>

            {/* PROGRESS BAR */}
            <div className="mb-6">
                <div className="flex justify-between text-xs text-text-muted mb-2 font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary-hover active:accent-primary"
                />
            </div>

            {/* MAIN CONTROLS */}
            <div className="flex items-center justify-center gap-6 mb-8">
                <button
                    onClick={onPrevious}
                    disabled={!onPrevious}
                    className="p-3 text-text-secondary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                </button>

                <button
                    onClick={togglePlay}
                    className="w-16 h-16 rounded-full bg-primary hover:bg-primary-hover text-white flex items-center justify-center shadow-lg hover:shadow-primary/50 hover:scale-105 active:scale-95 transition-all"
                >
                    {isPlaying ? (
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    ) : (
                        <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    )}
                </button>

                <button
                    onClick={onNext}
                    disabled={!onNext}
                    className="p-3 text-text-secondary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                </button>
            </div>

            {/* VOLUME */}
            <div className="flex items-center gap-3 px-4">
                <button 
                    onClick={() => setVolume(volume === 0 ? 100 : 0)}
                    className="text-text-secondary hover:text-white"
                >
                    {volume === 0 ? '🔇' : '🔊'}
                </button>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white hover:accent-primary"
                />
            </div>
        </div>
    );
}

export default MusicPlayer;
