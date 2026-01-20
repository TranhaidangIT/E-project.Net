import { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

function YouTubePage() {
  const [inputUrl, setInputUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState(null); // Contains { embedUrl, videoId, title, ... }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Player State
  const [playerReady, setPlayerReady] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  
  const playerRef = useRef(null); // Holds the YT.Player instance
  const iframeRef = useRef(null); // Holds the iframe DOM element

  // Load YouTube IFrame API
  useEffect(() => {
    // If API is already loaded
    if (window.YT && window.YT.Player) {
      setApiReady(true);
    } else {
      // Define global callback
      window.onYouTubeIframeAPIReady = () => {
        setApiReady(true);
      };

      // Inject script if not already present
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
    }
  }, []);

  // Initialize Player when videoInfo AND apiReady are set
  useEffect(() => {
    if (videoInfo && apiReady && window.YT && window.YT.Player && iframeRef.current) {
        // Destroy existing player if any
        if (playerRef.current) {
            playerRef.current.destroy();
        }

        // The iframe is already in the DOM with the SRC from backend. 
        // We initialize the player on it.
        playerRef.current = new window.YT.Player(iframeRef.current, {
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }
  }, [videoInfo, apiReady]);

  const onPlayerReady = (event) => {
    setPlayerReady(true);
    event.target.setVolume(volume);
    // Auto-play not always guaranteed by browsers, but we can try
    // event.target.playVideo(); 
  };

  const onPlayerStateChange = (event) => {
    // YT.PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0
    if (event.data === 1) {
        setIsPlaying(true);
    } else {
        setIsPlaying(false);
    }
  };

  const handleLoadUrl = async () => {
    if (!inputUrl) return;
    setLoading(true);
    setError("");
    setVideoInfo(null);
    setPlayerReady(false);
    
    try {
      const res = await api.get(`/youtube/info?url=${encodeURIComponent(inputUrl)}`);
      setVideoInfo(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load video info.");
    } finally {
      setLoading(false);
    }
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

  return (
    <Layout>
        <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto", color: "white" }}>
        <h2 style={{ marginBottom: "30px", fontWeight: 600, fontSize: "2rem", letterSpacing: "-0.5px" }}>YouTube</h2>
        <div style={{ display: "flex", gap: "40px", flexWrap: "wrap", alignItems: "flex-start" }}>
          {/* LEFT: Metadata */}
            <div style={{ flex: "1", minWidth: "300px" }}>
            <div className="auth-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "220px", background: "#181818", borderRadius: "10px" }}>
              {videoInfo ? (
                <div style={{ textAlign: "center", width: "100%" }}>
                  <img 
                    src={videoInfo.thumbnailUrl} 
                    alt="Thumb" 
                    style={{ width: "100%", borderRadius: "8px", marginBottom: "16px" }}
                  />
                  <div style={{ fontWeight: 500, fontSize: "1.08rem", marginBottom: "6px" }}>{videoInfo.title}</div>
                  <div style={{ color: "#b3b3b3", fontSize: "0.95rem" }}>{videoInfo.authorName}</div>
                </div>
              ) : (
                <div style={{ textAlign: "center", color: "#888", marginTop: "60px", fontSize: "1rem" }}>
                  Chưa có video nào
                </div>
              )}
            </div>
            </div>
          {/* RIGHT: Input & Player Controls */}
          <div style={{ flex: "1", minWidth: "300px" }}>
            <div className="auth-card" style={{ width: "100%", background: "#181818", borderRadius: "10px" }}>
            {/* Search Input */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <input 
                type="text" 
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Nhập đường dẫn YouTube..."
                style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "none", background: "#222", color: "white", fontSize: "1rem" }}
              />
              <button 
                onClick={handleLoadUrl} 
                disabled={loading}
                className="btn-primary"
                style={{ padding: "0 20px", borderRadius: "6px", fontWeight: 500, fontSize: "1rem" }}
              >
                {loading ? "Đang tải..." : "Load"}
              </button>
            </div>
            {error && <p className="error-message">{error}</p>}
            {/* Player UI */}
            {videoInfo && (
              <div style={{ background: "rgba(0,0,0,0.3)", padding: "20px", borderRadius: "10px", marginTop: "20px" }}>
                {/* Hidden IFrame container - keep it strictly hidden or very small */}
                <div style={{ width: "1px", height: "1px", overflow: "hidden", opacity: 0, position: "absolute", left: "-9999px" }}>
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
                  ></iframe>
                </div>
                {/* Custom Audio Controls */}
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                   <div style={{marginBottom: "10px", fontWeight: 500, fontSize: "1.05rem"}}>Điều khiển âm thanh</div>
                   <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", marginBottom: "15px" }}>
                    <button 
                      onClick={togglePlay}
                      style={{ 
                        minWidth: "80px", height: "36px", borderRadius: "6px", 
                        background: playerReady ? "#e94560" : "#555", 
                        border: "none", fontSize: "1rem", cursor: playerReady ? "pointer" : "not-allowed",
                        color: "white", fontWeight: 500
                      }}
                      disabled={!playerReady}
                    >
                      {isPlaying ? "Tạm dừng" : "Phát"}
                    </button>
                   </div>
                   <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px" }}>
                    <span style={{fontSize: "0.98rem"}}>Âm lượng</span>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={volume} 
                      onChange={handleVolume}
                      style={{ accentColor: "#e94560" }}
                    />
                    <span style={{fontSize: "0.98rem"}}>{volume}%</span>
                   </div>
                </div>
                 <div style={{ fontSize: "0.8rem", color: "#aaa", textAlign: "center" }}>
                  * Powered by YouTube IFrame API
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
