import { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import AudioTerrainWave from "../components/AudioTerrainWave";

function YouTubePage() {
    const [inputUrl, setInputUrl] = useState("");
    const [videoInfo, setVideoInfo] = useState(null); // Current playing video
    const [playlist, setPlaylist] = useState([]); // Local playlist/history
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Player State
    const [playerReady, setPlayerReady] = useState(false);
    const [apiReady, setApiReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(100);

    // Progress State
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const playerRef = useRef(null); // Holds the YT.Player instance
    const iframeRef = useRef(null); // Holds the iframe DOM element

    // Mock initial playlist if empty (for demo)
    useEffect(() => {
        // You could load this from local storage or just have some defaults for UI demo
    }, []);

    // Load YouTube IFrame API
    useEffect(() => {
        if (window.YT && window.YT.Player) {
            setApiReady(true);
        } else {
            window.onYouTubeIframeAPIReady = () => setApiReady(true);
            if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
                const tag = document.createElement("script");
                tag.src = "https://www.youtube.com/iframe_api";
                const firstScriptTag = document.getElementsByTagName("script")[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            }
        }
    }, []);

    // Initialize Player when videoInfo changes
    useEffect(() => {
        if (videoInfo && apiReady && window.YT && window.YT.Player && iframeRef.current) {
            if (playerRef.current) {
                playerRef.current.destroy();
            }

            const onPlayerReady = () => {
                setPlayerReady(true);
                // Volume will be set by the useEffect below
            };

            const onPlayerStateChange = (event) => {
                setIsPlaying(event.data === 1);
            };

            playerRef.current = new window.YT.Player(iframeRef.current, {
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        }
    }, [videoInfo, apiReady]);

    // Sync volume when player becomes ready or volume changes
    useEffect(() => {
        if (playerReady && playerRef.current) {
            playerRef.current.setVolume(volume);
        }
    }, [playerReady, volume]);

    const handleLoadUrl = async () => {
        if (!inputUrl) return;
        setLoading(true);
        setError("");
        // Don't clear videoInfo immediately to avoid UI flickering, wait for result

        try {
            const res = await api.get(`/youtube/info?url=${encodeURIComponent(inputUrl)}`);
            const newVideo = res.data;
            setVideoInfo(newVideo);

            // Add to playlist if not exists
            setPlaylist(prev => {
                if (prev.find(v => v.videoId === newVideo.videoId)) return prev;
                return [newVideo, ...prev];
            });
            setInputUrl(""); // Clear input on success

        } catch (err) {
            console.error(err);
            setError("Không thể tải thông tin video. Vui lòng kiểm tra lại URL.");
        } finally {
            setLoading(false);
        }
    };

    const playFromPlaylist = (video) => {
        setVideoInfo(video);
    };

    const togglePlay = () => {
        if (!playerRef.current || !playerReady) return;
        if (isPlaying) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
    };

    const handleVolume = (e) => {
        const val = parseInt(e.target.value, 10);
        setVolume(val);
        if (playerRef.current && playerReady) {
            playerRef.current.setVolume(val);
        }
    };
    // Progress Loop
    useEffect(() => {
        let interval;
        if (playerReady && isPlaying && !isDragging) {
            interval = setInterval(() => {
                if (playerRef.current && playerRef.current.getCurrentTime) {
                    const time = playerRef.current.getCurrentTime();
                    const dur = playerRef.current.getDuration();
                    setCurrentTime(time);
                    if (dur) setDuration(dur);
                }
            }, 500); // Update every 500ms
        }
        return () => clearInterval(interval);
    }, [playerReady, isPlaying, isDragging]);

    const handleSeek = (e) => {
        const newTime = parseFloat(e.target.value);
        setCurrentTime(newTime);
        if (playerRef.current && playerReady) {
            playerRef.current.seekTo(newTime, true);
        }
    };

    const formatTime = (seconds) => {
        if (!seconds) return "00:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (

        <Layout>
            <AudioTerrainWave isPlaying={isPlaying} playerRef={playerRef} />

            <div className="max-w-7xl mx-auto px-4 h-[calc(100vh-100px)] flex flex-col relative z-10">
                {/* Header */}
                <div className="mb-8 flex items-center justify-end">
                    <div className="relative w-full max-w-lg">
                        <input
                            type="text"
                            value={inputUrl}
                            onChange={(e) => setInputUrl(e.target.value)}
                            placeholder="Dán link YouTube tại đây..."
                            className="w-full bg-surface border border-border-color rounded-full py-3 px-6 pr-14 text-text-primary placeholder-text-muted focus:outline-none focus:border-red-500 focus:bg-surface-hover transition-all"
                            onKeyPress={(e) => e.key === 'Enter' && handleLoadUrl()}
                        />
                        <button
                            onClick={handleLoadUrl}
                            disabled={loading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors disabled:opacity-50"
                        >
                            {loading ? "..." : "➔"}
                        </button>
                    </div>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 text-center">{error}</div>}

                {/* Main Layout Grid */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">

                    {/* LEFT: MAIN PLAYER (Cols 2) */}
                    <div className="lg:col-span-2 flex flex-col items-center justify-center p-8 glass-panel h-full relative overflow-hidden">
                        {videoInfo ? (
                            <div className="w-full max-w-2xl flex flex-col items-center z-10 animate-fade-in">
                                {/* Hidden IFrame */}
                                <div className="absolute opacity-0 pointer-events-none">
                                    <iframe
                                        ref={iframeRef}
                                        id="yt-player-iframe"
                                        width="200"
                                        height="200"
                                        src={videoInfo.embedUrl}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>

                                {/* Vinyl Record Style Thumbnail */}
                                <div className="relative mb-10 transition-all duration-500">
                                    {/* Rainbow Border Container */}
                                    <div className={`absolute -inset-1 rounded-full ${isPlaying
                                        ? 'bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 animate-rainbow bg-[length:200%_200%]'
                                        : 'bg-surface-hover'
                                        }`} />

                                    {/* Spinning Record */}
                                    <div className={`relative w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl ${isPlaying ? 'animate-spin-slow' : ''
                                        }`}>
                                        <img
                                            src={videoInfo.thumbnailUrl}
                                            alt="Album Art"
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Vinyl grooves overlay */}
                                        <div className="absolute inset-0 bg-black/10 ring-1 ring-inset ring-white/10 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>
                                    </div>
                                </div>

                                {/* Info Below Disc */}
                                <div className="text-center mb-6 w-full px-4">
                                    <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-1 line-clamp-1">{videoInfo.title}</h3>
                                    <p className="text-base text-text-secondary">{videoInfo.authorName}</p>
                                </div>

                                {/* Progress Bar with Time */}
                                <div className="w-full mb-8">
                                    <div className="flex items-center justify-between text-sm text-text-secondary mb-3 font-mono">
                                        <span>{formatTime(currentTime)}</span>
                                        <span>{formatTime(duration)}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max={duration || 0}
                                        value={currentTime}
                                        onChange={handleSeek}
                                        onMouseDown={() => setIsDragging(true)}
                                        onMouseUp={() => setIsDragging(false)}
                                        onTouchStart={() => setIsDragging(true)}
                                        onTouchEnd={() => setIsDragging(false)}
                                        className="w-full h-2 bg-surface-hover rounded-lg appearance-none cursor-pointer accent-primary hover:h-2.5 transition-all"
                                    />
                                </div>

                                {/* Simple Controls - SoundCloud Style */}
                                <div className="flex items-center justify-center gap-6 mb-8">
                                    <button
                                        className="p-3 text-text-secondary hover:text-text-primary transition-colors"
                                        title="Previous"
                                    >
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                                        </svg>
                                    </button>

                                    <button
                                        onClick={togglePlay}
                                        disabled={!playerReady}
                                        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${playerReady
                                            ? 'bg-primary hover:bg-primary-hover hover:scale-105 hover:shadow-primary/40 text-white'
                                            : 'bg-surface-hover text-text-muted cursor-not-allowed'
                                            }`}
                                    >
                                        {isPlaying ? (
                                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        )}
                                    </button>

                                    <button
                                        className="p-3 text-text-secondary hover:text-text-primary transition-colors"
                                        title="Next"
                                    >
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Volume - SoundCloud Style */}
                                <div className="flex items-center gap-4 w-full max-w-md px-6 py-3 bg-surface/50 rounded-full backdrop-blur-sm border border-border-color">
                                    <span className="text-text-secondary text-sm font-medium">Vol</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={volume}
                                        onChange={handleVolume}
                                        className="flex-1 h-1.5 bg-surface-hover rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                    <span className="text-text-secondary text-sm font-mono w-10 text-right">{volume}%</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-text-muted z-10">
                                <div className="mb-6">
                                    <img src="/wave-sound.png" alt="No video" className="w-32 h-32 mx-auto opacity-20" />
                                </div>
                                <h3 className="text-xl font-bold">Chưa có video nào</h3>
                                <p>Dán link YouTube ở trên để bắt đầu nghe</p>
                            </div>
                        )}

                        {/* Background Blur Effect */}
                        {videoInfo && (
                            <div className="absolute inset-0 z-0">
                                <img src={videoInfo.thumbnailUrl} alt="Video background" className="w-full h-full object-cover blur-3xl opacity-30" />
                                <div className="absolute inset-0 bg-background-start/80" />
                            </div>
                        )}
                    </div>

                    {/* RIGHT: PLAYLIST SIDEBAR (Col 3) */}
                    <div className="lg:col-span-1 bg-surface border-l border-border-color rounded-xl ml-4 overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-border-color bg-surface-hover">
                            <h3 className="font-bold text-text-primary">Danh Sách Đã Tải</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                            {playlist.length === 0 ? (
                                <div className="text-center py-10 text-text-muted text-sm px-4">
                                    Lịch sử trống. Hãy thêm bài hát!
                                </div>
                            ) : (
                                playlist.map((video, idx) => {
                                    const isActive = videoInfo && videoInfo.videoId === video.videoId;
                                    return (
                                        <div
                                            key={`${video.videoId}-${idx}`}
                                            onClick={() => playFromPlaylist(video)}
                                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${isActive
                                                ? 'bg-red-500/10 border border-red-500/30'
                                                : 'hover:bg-surface-hover border border-transparent'
                                                }`}
                                        >
                                            <div className="relative w-16 h-12 rounded overflow-hidden flex-shrink-0 bg-gray-900">
                                                <img src={video.thumbnailUrl} className="w-full h-full object-cover" alt="thumb" />
                                                {isActive && (
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="overflow-hidden">
                                                <h4 className={`text-sm font-semibold truncate ${isActive ? 'text-red-400' : 'text-text-primary'}`}>
                                                    {video.title}
                                                </h4>
                                                <p className="text-xs text-text-secondary truncate">{video.authorName}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout >
    );
}

export default YouTubePage;
