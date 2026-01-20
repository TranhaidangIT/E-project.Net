import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { songAPI, playlistAPI, likedSongAPI } from '../services/api';
import MusicPlayer from '../components/MusicPlayer';
import Layout from '../components/Layout';
import './MusicPage.css';

function MusicPage() {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentSong, setCurrentSong] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [playlists, setPlaylists] = useState([]);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState(null);
    const [playlistMessage, setPlaylistMessage] = useState('');
    const [favoritesPlaylist, setFavoritesPlaylist] = useState(null);
    
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const query = searchParams.get('q');
        if (query) {
            searchSongs(query);
        } else {
            fetchSongs();
        }
        if (user) {
            fetchPlaylists();
            fetchLikedSongIds();
        }
    }, [user]);

    const fetchSongs = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await songAPI.getAllSongs();
            setSongs(response.data);
            // Optional: Auto-select first song if none selected
            // if (response.data.length > 0 && !currentSong) {
            //     setCurrentSong(response.data[0]);
            //     setCurrentIndex(0);
            // }
        } catch {
            setError('Không thể tải danh sách bài hát');
        } finally {
            setLoading(false);
        }
    };

    const searchSongs = async (query) => {
        try {
            setLoading(true);
            setError('');
            const response = await songAPI.searchSongs(query);
            setSongs(response.data);
            if (response.data.length === 0) {
                setError('');
            }
        } catch (err) {
            console.error('Search error:', err);
            setError('Lỗi tìm kiếm. Vui lòng thử lại.');
            setSongs([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchPlaylists = async () => {
        try {
            const response = await playlistAPI.getMyPlaylists();
            setPlaylists(response.data);
            
            // Find 'Favorites' playlist
            const fav = response.data.find(p => p.playlistName === 'Favorites');
            if (fav) {
                setFavoritesPlaylist(fav);
            } else {
                // Optional: Create if not exists (lazy creation on first like is better, or here)
                // For now, we will create it when user first likes a song if it doesn't exist
            }
        } catch (err) {
            console.error('Failed to fetch playlists:', err);
        }
    };

    const toggleFavorite = async (song, e) => {
        e.stopPropagation();
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            let targetPlaylist = favoritesPlaylist;
            
            // Create Favorites playlist if it doesn't exist
            if (!targetPlaylist) {
                const createRes = await playlistAPI.createPlaylist({
                    playlistName: 'Favorites',
                    description: 'My favorite songs',
                    isPublic: false
                });
                targetPlaylist = createRes.data;
                setFavoritesPlaylist(targetPlaylist);
                // Refresh playlists to show in modal list too
                fetchPlaylists(); // async but we have the object
            }

            // Check if song is already in Favorites (We need detail or check fetch)
            // Since we don't have the full list of songs in favoritesPlaylist object (only count),
            // we might need to fetch the details OR just try to add/remove.
            // Simplified approach: Try add. If error "already exists", try remove (if API supported remove by songID easily).
            // Actually, `addSongToPlaylist` throws if exists.
            // Let's rely on a helper to check status or just manage local state for "liked" icons if possible.
            // BETTER: Load Favorites Details to know what's liked.
            
            // For this iteration, I'll fetch the favorite playlist details to know the songs.
            await handleFavoriteAction(targetPlaylist.playlistID, song.songID);
            
        } catch (err) {
            alert('Lỗi cập nhật yêu thích');
            console.error(err);
        }
    };

    const handleFavoriteAction = async (playlistId, songId) => {
        // First get current details to see if it's there
        const detailRes = await playlistAPI.getPlaylistById(playlistId);
        const isLiked = detailRes.data.songs.some(s => s.songID === songId);
        
        if (isLiked) {
            await playlistAPI.removeSongFromPlaylist(playlistId, songId);
        } else {
            await playlistAPI.addSongToPlaylist(playlistId, songId);
        }
        // Refresh to update UI (if we had "isLiked" state on songs)
        await fetchFavoriteSongsIds(); 
    };

    const [likedSongIds, setLikedSongIds] = useState(new Set());

    useEffect(() => {
        const fetchIds = async () => {
             if (!favoritesPlaylist) return;
            try {
                const res = await playlistAPI.getPlaylistById(favoritesPlaylist.playlistID);
                const ids = new Set(res.data.songs.map(s => s.songID));
                setLikedSongIds(ids);
            } catch (err) {
                console.error(err);
            }
        };
        fetchIds();
    }, [favoritesPlaylist]);

    const fetchFavoriteSongsIds = async () => {
        // Keeping this for manual refresh if needed, duplicating logic or extracting it.
        // Actually toggleFavorite calls this, so we need it defined.
        if (!favoritesPlaylist) return;
        try {
            const res = await playlistAPI.getPlaylistById(favoritesPlaylist.playlistID);
            const ids = new Set(res.data.songs.map(s => s.songID));
            setLikedSongIds(ids);
        } catch (err) {
            console.error(err);
        }
    };

    const openPlaylistModal = (song, e) => {
        e.stopPropagation();
        if (!user) {
            navigate('/login');
            return;
        }
        setSelectedSongForPlaylist(song);
        setShowPlaylistModal(true);
        setPlaylistMessage('');
    };

    const addToPlaylist = async (playlistId) => {
        try {
            await playlistAPI.addSongToPlaylist(playlistId, selectedSongForPlaylist.songID);
            setPlaylistMessage('Đã thêm vào playlist!');
            setTimeout(() => {
                setShowPlaylistModal(false);
                setPlaylistMessage('');
            }, 1500);
        } catch (err) {
            setPlaylistMessage(err.response?.data?.message || '❌ Không thể thêm vào playlist');
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
        } catch {
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

    if (loading) return <Layout><div className="loading">Đang tải...</div></Layout>;

    return (
        <Layout>
            <div className="music-page-container" style={{ 
                display: 'flex', 
                height: 'calc(100vh - 80px)', // Adjust based on header height 
                overflow: 'hidden' 
            }}>
                
                {/* LEFT PANEL: Player */}
                <div className="player-sidebar" style={{
                    width: '320px',
                    minWidth: '320px',
                    borderRight: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <MusicPlayer 
                        key={currentSong?.songID}
                        song={currentSong}
                        playlist={songs}
                        onNext={currentIndex < songs.length - 1 ? playNext : null}
                        onPrevious={currentIndex > 0 ? playPrevious : null}
                    />
                </div>

                {/* RIGHT PANEL: Song List */}
                <div className="song-list-panel" style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '30px',
                    background: 'rgba(0,0,0,0.1)'
                }}>
                    
                    {/* Header & Search */}
                    <div className="list-header" style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 style={{ fontSize: '2rem', margin: '0 0 10px' }}>🎵 Duyệt Âm Nhạc</h1>
                            <p style={{ margin: 0, color: '#b3b3b3' }}>Khám phá {songs.length} bài hát</p>
                        </div>
                        
                        <div className="search-bar" style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                placeholder="🔍 Tìm kiếm..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                style={{
                                    padding: '10px 15px',
                                    borderRadius: '20px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'white',
                                    width: '250px'
                                }}
                            />
                            <button onClick={handleSearch} className="btn-primary" style={{ padding: '10px 20px', borderRadius: '20px' }}>
                                Tìm
                            </button>
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    {/* Table Song List */}
                    <div className="songs-list-view">
                        {songs.length === 0 ? (
                             <div className="empty-state">
                                <p>Không tìm thấy bài hát nào</p>
                            </div>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#b3b3b3' }}>
                                        <th style={{ padding: '10px', textAlign: 'center', width: '50px' }}>#</th>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>Tiêu đề</th>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>Album</th>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>Ngày thêm</th>
                                        <th style={{ padding: '10px', textAlign: 'right' }}>Thời gian</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {songs.map((song, index) => {
                                        const isCurrent = currentSong?.songID === song.songID;
                                        return (
                                            <tr 
                                                key={song.songID}
                                                onClick={() => playSong(song, index)}
                                                className="song-row"
                                                style={{ 
                                                    cursor: 'pointer',
                                                    background: isCurrent ? 'rgba(255,255,255,0.1)' : 'transparent',
                                                    color: isCurrent ? '#e94560' : 'inherit',
                                                    transition: 'background 0.2s',
                                                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = isCurrent ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = isCurrent ? 'rgba(255,255,255,0.1)' : 'transparent'}
                                            >
                                                <td style={{ padding: '10px', textAlign: 'center' }}>
                                                    {isCurrent ? <span className="playing-anim">▶️</span> : index + 1}
                                                </td>
                                                <td style={{ padding: '10px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                        <div style={{ 
                                                            width: '40px', 
                                                            height: '40px', 
                                                            background: '#333', 
                                                            borderRadius: '4px', 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            justifyContent: 'center',
                                                            color: '#fff'
                                                        }}>
                                                            🎵
                                                        </div>
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <span style={{ fontWeight: 500, fontSize: '1rem', color: isCurrent ? '#e94560' : '#fff' }}>
                                                                {song.songName}
                                                            </span>
                                                            <span style={{ fontSize: '0.85rem', color: '#b3b3b3' }}>
                                                                {song.artistName}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '10px', color: '#b3b3b3' }}>
                                                    Single
                                                </td>
                                                <td style={{ padding: '10px', color: '#b3b3b3' }}>
                                                    {song.createdAt ? new Date(song.createdAt).toLocaleDateString('vi-VN') : '---'}
                                                </td>
                                                <td style={{ padding: '10px', textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '15px' }}>
                                                        <button
                                                            onClick={(e) => toggleFavorite(song, e)}
                                                            className="row-action-btn"
                                                            style={{
                                                                background: 'transparent',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                fontSize: '1.2rem',
                                                                color: likedSongIds.has(song.songID) ? '#e94560' : 'rgba(255,255,255,0.3)',
                                                                transition: 'all 0.2s',
                                                                padding: 0
                                                            }}
                                                            title={likedSongIds.has(song.songID) ? "Bỏ yêu thích" : "Yêu thích"}
                                                        >
                                                            {likedSongIds.has(song.songID) ? '❤️' : '♡'}
                                                        </button>
                                                        <span style={{ minWidth: '40px', color: '#b3b3b3' }}>--:--</span>
                                                        <button 
                                                             onClick={(e) => openPlaylistModal(song, e)}
                                                             className="row-action-btn"
                                                             style={{
                                                                background: 'transparent',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                fontSize: '1.2rem',
                                                                color: '#fff',
                                                                opacity: 0.5,
                                                                padding: 0
                                                             }}
                                                             title="Thêm vào playlist"
                                                        >
                                                            ➕
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Add to Playlist Modal */}
                {showPlaylistModal && (
                    <div className="modal-overlay" onClick={() => setShowPlaylistModal(false)} style={{ zIndex: 1000 }}>
                        <div className="modal playlist-select-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Thêm vào Playlist</h3>
                                <button className="btn-close" onClick={() => setShowPlaylistModal(false)}>×</button>
                            </div>
                            <div className="modal-body">
                                <p className="song-to-add">
                                    <strong>{selectedSongForPlaylist?.songName}</strong> - {selectedSongForPlaylist?.artistName}
                                </p>
                                {playlistMessage && (
                                    <div className={`alert ${playlistMessage.includes('✅') ? 'alert-success' : 'alert-error'}`}>
                                        {playlistMessage}
                                    </div>
                                )}
                                {playlists.length === 0 ? (
                                    <div className="empty-playlists">
                                        <p>Bạn chưa có playlist nào</p>
                                        <button 
                                            className="btn-primary"
                                            onClick={() => navigate('/playlists')}
                                        >
                                            Tạo Playlist Đầu Tiên
                                        </button>
                                    </div>
                                ) : (
                                    <div className="playlists-list">
                                        {playlists.map(playlist => (
                                            <div 
                                                key={playlist.playlistID}
                                                className="playlist-item-select"
                                                onClick={() => addToPlaylist(playlist.playlistID)}
                                            >
                                                <div className="playlist-icon">📋</div>
                                                <div className="playlist-info">
                                                    <h4>{playlist.playlistName}</h4>
                                                    <p>{playlist.songCount} bài hát</p>
                                                </div>
                                                <div className="playlist-arrow">→</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default MusicPage;
    