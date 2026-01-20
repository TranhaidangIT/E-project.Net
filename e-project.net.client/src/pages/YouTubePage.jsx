import { useState, useRef } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

function YouTubePage() {
  const [inputUrl, setInputUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState("");
  const [audioSrc, setAudioSrc] = useState(""); // Re-introduced

  const audioRef = useRef(null);

  const handleLoadUrl = async () => {
    if (!inputUrl) return;

    setError("");
    setLoadingInfo(true);
    setVideoInfo(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setAudioSrc("");

    try {
      // 1. Get Info 
      const infoRes = await api.get(`/youtube/info?url=${encodeURIComponent(inputUrl)}`);
      setVideoInfo(infoRes.data);

      // 2. Set Stream URL
      // The backend will handle caching/conversion transparently.
      // It might take a few seconds to start if not cached.
      setAudioSrc(`/api/youtube/stream?url=${encodeURIComponent(inputUrl)}`);

    } catch (err) {
      console.error("Error loading video", err);
      setError("Không thể tải thông tin video hoặc URL không hợp lệ");
    } finally {
      setLoadingInfo(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().catch(console.error);
    } else {
      audioRef.current.pause();
    }
  };

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

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
        audioRef.current.currentTime = time; 
    }
  };

  const handleVolume = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };
    
  // Handlers for state sync
  const onPlay = () => setIsPlaying(true);
  const onPause = () => setIsPlaying(false);
  const onEnded = () => setIsPlaying(false);

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const date = new Date(seconds * 1000);
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");
    const hh = date.getUTCHours();
    if (hh) return `${hh}:${mm}:${ss}`;
    return `${mm}:${ss}`;
  };

  return (
    <Layout>
      <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto", color: "white" }}>
        <h2 style={{ marginBottom: "30px" }}>📺 YouTube MP3 Player</h2>

        <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
          
          {/* LEFT: Info & Thumbnail */}
          <div style={{ flex: "1", minWidth: "300px" }}>
            <div className="auth-card" style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "300px" }}>
                {videoInfo ? (
                    <div style={{ textAlign: "center", width: "100%" }}>
                        <img 
                            src={videoInfo.thumbnailUrl} 
                            alt="Thumb" 
                            style={{ width: "100%", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.5)", marginBottom: "20px" }}
                        />
                        <h3>{videoInfo.title}</h3>
                        <p style={{ color: "#aaa" }}>{videoInfo.authorName}</p>
                    </div>
                ) : (
                    <div style={{ textAlign: "center", color: "#666" }}>
                        <div style={{ fontSize: "3rem" }}>🎵</div>
                        <p>Nhập URL để phát nhạc (MP3)</p>
                    </div>
                )}
            </div>
          </div>

          {/* RIGHT: Controls */}
          <div style={{ flex: "1", minWidth: "300px" }}>
            <div className="auth-card" style={{ width: "100%" }}>
                
                {/* Input */}
                <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                    <input 
                        type="text" 
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        placeholder="YouTube URL..."
                        style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "none", background: "rgba(255,255,255,0.1)", color: "white" }}
                    />
                    <button 
                        onClick={handleLoadUrl} 
                        disabled={loadingInfo}
                        className="btn-primary"
                        style={{ padding: "0 20px" }}
                    >
                        {loadingInfo ? "Processing..." : "Go"}
                    </button>
                </div>
                {error && <p className="error-message">{error}</p>}

                {/* Audio Player */}
                {(audioSrc || loadingInfo) && (
                    <div style={{ background: "rgba(0,0,0,0.3)", padding: "20px", borderRadius: "10px" }}>
                        
                        {/* Hidden Native Audio Element */}
                        <audio 
                            ref={audioRef} 
                            src={audioSrc}
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                            onPlay={onPlay}
                            onPause={onPause}
                            onEnded={onEnded}
                            controls={false} // Hidden controls
                            autoPlay
                        />

                        {/* Progress */}
                        <div style={{ marginBottom: "15px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#ccc", marginBottom: "5px" }}>
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                            <input 
                                type="range" 
                                min={0} 
                                max={duration || 0} 
                                value={currentTime}
                                onChange={handleSeek}
                                style={{ width: "100%", accentColor: "#e94560", cursor: "pointer" }}
                            />
                        </div>

                        {/* Controls */}
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", marginBottom: "15px" }}>
                            <button className="control-btn" style={{ fontSize: "1.5rem", background: "none", border: "none" }}>⏮️</button>
                            <button 
                                onClick={togglePlay}
                                style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#e94560", border: "none", fontSize: "2rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                                {isPlaying ? "⏸️" : "▶️"}
                            </button>
                            <button className="control-btn" style={{ fontSize: "1.5rem", background: "none", border: "none" }}>⏭️</button>
                        </div>

                        {/* Volume */}
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                            <span>🔊</span>
                            <input 
                                type="range" 
                                min={0} 
                                max={1} 
                                step="0.1" 
                                value={volume}
                                onChange={handleVolume}
                                style={{ width: "100px", accentColor: "#e94560" }}
                            />
                        </div>

                    </div>
                )}

            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}

export default YouTubePage;
