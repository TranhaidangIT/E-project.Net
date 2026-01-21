import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { songAPI, playlistAPI } from '../services/api';
import MusicPlayer from '../components/MusicPlayer';
import Layout from '../components/Layout';

function MusicPage() {
    // ===== STATE =====
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentSong, setCurrentSong] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [playlists, setPlaylists] = useState([]);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState(null);
    const [playlistMessage, setPlaylistMessage] = useState('');
    const [favoritesPlaylist, setFavoritesPlaylist] = useState(null);
    const [likedSongIds, setLikedSongIds] = useState(new Set());

    const { user } = useAuth();
    const navigate = useNavigate();

    // ===== EFFECTS =====
    useEffect(() => {
        fetchSongs();
        if (user) {
            fetchPlaylists();
        }
    }, [user]);

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

    // ===== API HELPERS =====
    const fetchSongs = async () => {
        try {
            setLoading(true);
            const response = await songAPI.getAllSongs();
            setSongs(response.data);
        } catch {
            setError('Không thể tải danh sách bài hát');
        } finally {
            setLoading(false);
        }
    };

    const fetchPlaylists = async () => {
        try {
            const response = await playlistAPI.getMyPlaylists();
            setPlaylists(response.data);
            const fav = response.data.find(p => p.playlistName === 'Favorites');
            if (fav) setFavoritesPlaylist(fav);
        } catch (err) {
            console.error('Failed to fetch playlists:', err);
        }
    };

    const fetchFavoriteSongsIds = async () => {
        if (!favoritesPlaylist) return;
        try {
            const res = await playlistAPI.getPlaylistById(favoritesPlaylist.playlistID);
            const ids = new Set(res.data.songs.map(s => s.songID));
            setLikedSongIds(ids);
        } catch (err) {
            console.error(err);
        }
    };

    // ===== HANDLERS =====
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

    const toggleFavorite = async (song, e) => {
        e.stopPropagation();
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            let targetPlaylist = favoritesPlaylist;
            if (!targetPlaylist) {
                const createRes = await playlistAPI.createPlaylist({
                    playlistName: 'Favorites',
                    description: 'My favorite songs',
                    isPublic: false
                });
                targetPlaylist = createRes.data;
                setFavoritesPlaylist(targetPlaylist);
                fetchPlaylists();
            }

            const playlistId = targetPlaylist.playlistID;
            const songId = song.songID;

            const detailRes = await playlistAPI.getPlaylistById(playlistId);
            const isLiked = detailRes.data.songs.some(s => s.songID === songId);

            if (isLiked) {
                await playlistAPI.removeSongFromPlaylist(playlistId, songId);
            } else {
                await playlistAPI.addSongToPlaylist(playlistId, songId);
            }
            await fetchFavoriteSongsIds();

        } catch (err) {
            alert('Lỗi cập nhật yêu thích');
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
            setPlaylistMessage('✅ Đã thêm vào playlist!');
            setTimeout(() => {
                setShowPlaylistModal(false);
                setPlaylistMessage('');
            }, 1500);
        } catch (err) {
            setPlaylistMessage(err.response?.data?.message || '❌ Không thể thêm vào playlist');
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

    return (
        <Layout>
            {/* 3-Column Layout Container */}
            <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] -mx-4 -mb-12">

                {/* COL 1: PLAYER (Left) */}
                <div className="w-full lg:w-1/4 bg-surface border-r border-border-color p-4 overflow-y-auto hidden lg:block">
                    <MusicPlayer
                        song={currentSong}
                        onNext={currentIndex < songs.length - 1 ? playNext : null}
                        onPrevious={currentIndex > 0 ? playPrevious : null}
                    />
                </div>

                {/* COL 2: SONG LIST (Center) - Expanded */}
                <div className="w-full lg:w-3/4 flex flex-col bg-transparent relative">
                    {/* Header / Search */}
                    <div className="p-8 sticky top-0 z-20 bg-surface/95 backdrop-blur border-b border-border-color shadow-sm">
                        <h1 className="text-3xl font-bold text-text-primary mb-4">Khám Phá Âm Nhạc</h1>
                        <div className="relative max-w-2xl">
                            <input
                                type="text"
                                placeholder="Tìm kiếm bài hát, nghệ sĩ..."
                                className="w-full bg-surface border border-border-color rounded-xl py-4 px-14 text-text-primary placeholder-text-muted focus:outline-none focus:border-primary focus:bg-surface-hover transition-all text-lg"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted text-xl">⌕</span>
                        </div>
                    </div>

                    {/* Song Table */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                        {loading ? (
                            <div className="flex items-center justify-center h-full text-primary text-lg">Đang tải...</div>
                        ) : error ? (
                            <div className="flex items-center justify-center h-full text-red-400">{error}</div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-surface/95 z-10 text-sm text-text-muted uppercase tracking-wider">
                                    <tr className="border-b border-border-color">
                                        <th className="p-4 text-center w-16">#</th>
                                        <th className="p-4">Tiêu đề</th>
                                        <th className="p-4 text-right w-32">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="text-base">
                                    {songs.map((song, index) => {
                                        const isCurrent = currentSong?.songID === song.songID;
                                        return (
                                            <tr
                                                key={song.songID}
                                                onClick={() => playSong(song, index)}
                                                className={`group border-b border-border-color hover:bg-surface-hover transition-colors cursor-pointer ${isCurrent ? 'bg-primary/10 border-l-4 border-l-primary' : ''}`}
                                            >
                                                <td className="p-4 text-center text-text-muted font-medium w-16">
                                                    {isCurrent ? (
                                                        <svg className="w-4 h-4 text-primary inline" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M8 5v14l11-7z" />
                                                        </svg>
                                                    ) : index + 1}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className={`font-semibold text-lg ${isCurrent ? 'text-primary' : 'text-text-primary'}`}>{song.songName}</span>
                                                        <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">{song.artistName}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={(e) => toggleFavorite(song, e)}
                                                            className={`p-2 rounded-lg hover:bg-surface transition-colors ${likedSongIds.has(song.songID) ? 'text-primary' : 'text-text-muted'}`}
                                                            title="Yêu thích"
                                                        >
                                                            {likedSongIds.has(song.songID) ? '♥' : '♡'}
                                                        </button>
                                                        <button
                                                            onClick={(e) => openPlaylistModal(song, e)}
                                                            className="p-2 rounded-lg hover:bg-surface text-text-muted hover:text-text-primary transition-colors"
                                                            title="Thêm vào playlist"
                                                        >
                                                            +
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
            </div>

            {/* MODAL */}
            {showPlaylistModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowPlaylistModal(false)}>
                    <div className="bg-surface border border-border-color rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        <div className="p-4 border-b border-border-color flex justify-between items-center bg-surface-hover">
                            <h3 className="text-lg font-bold text-text-primary">Thêm vào Playlist</h3>
                            <button className="text-text-muted hover:text-text-primary text-2xl" onClick={() => setShowPlaylistModal(false)}>×</button>
                        </div>
                        <div className="p-6">
                            <p className="text-text-secondary mb-4">
                                Thêm bài hát <strong className="text-text-primary">{selectedSongForPlaylist?.songName}</strong> vào:
                            </p>

                            {playlistMessage && (
                                <div className={`p-3 rounded-lg text-center mb-4 text-sm font-medium ${playlistMessage.includes('✅') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {playlistMessage}
                                </div>
                            )}

                            {playlists.length === 0 ? (
                                <div className="text-center py-6">
                                    <p className="text-text-muted mb-4">Bạn chưa có playlist nào</p>
                                    <button
                                        className="btn-primary"
                                        onClick={() => navigate('/playlists')}
                                    >
                                        Tạo Playlist Đầu Tiên
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                                    {playlists.map(playlist => (
                                        <div
                                            key={playlist.playlistID}
                                            className="flex items-center justify-between p-3 rounded-xl bg-surface hover:bg-surface-hover cursor-pointer transition-colors group border border-transparent hover:border-border-color"
                                            onClick={() => addToPlaylist(playlist.playlistID)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">{playlist.playlistName}</h4>
                                                    <p className="text-xs text-text-muted">{playlist.songCount} bài hát</p>
                                                </div>
                                            </div>
                                            <span className="text-text-muted group-hover:translate-x-1 transition-transform">→</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default MusicPage;
