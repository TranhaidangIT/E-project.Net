using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using E_project.Net.Server.Data;
using E_project.Net.Server.Models;
using E_project.Net.Server.Models.DTOs;
using System.Security.Claims;

namespace E_project.Net.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PlaylistController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PlaylistController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim ?? "0");
        }

        /// <summary>
        /// Get all playlists of current user
        /// </summary>
        [HttpGet("my-playlists")]
        public async Task<ActionResult<IEnumerable<PlaylistDTO>>> GetMyPlaylists()
        {
            var userId = GetCurrentUserId();

            var playlists = await _context.Playlists
                .Where(p => p.UserID == userId)
                .Select(p => new PlaylistDTO
                {
                    PlaylistID = p.PlaylistID,
                    UserID = p.UserID,
                    PlaylistName = p.PlaylistName,
                    Description = p.Description,
                    IsPublic = p.IsPublic,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt,
                    SongCount = p.PlaylistSongs.Count,
                    Username = p.User.Username
                })
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return Ok(playlists);
        }

        /// <summary>
        /// Get all public playlists
        /// </summary>
        [HttpGet("public")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<PlaylistDTO>>> GetPublicPlaylists()
        {
            var playlists = await _context.Playlists
                .Where(p => p.IsPublic)
                .Select(p => new PlaylistDTO
                {
                    PlaylistID = p.PlaylistID,
                    UserID = p.UserID,
                    PlaylistName = p.PlaylistName,
                    Description = p.Description,
                    IsPublic = p.IsPublic,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt,
                    SongCount = p.PlaylistSongs.Count,
                    Username = p.User.Username
                })
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return Ok(playlists);
        }

        /// <summary>
        /// Get playlist by ID with all songs
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<PlaylistDetailDTO>> GetPlaylistById(int id)
        {
            var userId = GetCurrentUserId();

            var playlist = await _context.Playlists
                .Include(p => p.User)
                .Include(p => p.PlaylistSongs)
                    .ThenInclude(ps => ps.Song)
                .FirstOrDefaultAsync(p => p.PlaylistID == id);

            if (playlist == null)
            {
                return NotFound(new { message = "Playlist not found" });
            }

            // Check if user has permission to view this playlist
            if (!playlist.IsPublic && playlist.UserID != userId)
            {
                return Forbid();
            }

            var playlistDetail = new PlaylistDetailDTO
            {
                PlaylistID = playlist.PlaylistID,
                UserID = playlist.UserID,
                PlaylistName = playlist.PlaylistName,
                Description = playlist.Description,
                IsPublic = playlist.IsPublic,
                CreatedAt = playlist.CreatedAt,
                UpdatedAt = playlist.UpdatedAt,
                Username = playlist.User.Username,
                Songs = playlist.PlaylistSongs
                    .OrderBy(ps => ps.OrderIndex)
                    .Select(ps => new PlaylistSongDTO
                    {
                        PlaylistSongID = ps.PlaylistSongID,
                        SongID = ps.SongID,
                        SongName = ps.Song.SongName,
                        ArtistName = ps.Song.ArtistName,
                        Duration = ps.Song.Duration,
                        OrderIndex = ps.OrderIndex,
                        AddedAt = ps.AddedAt
                    })
                    .ToList()
            };

            return Ok(playlistDetail);
        }

        /// <summary>
        /// Create new playlist
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<PlaylistDTO>> CreatePlaylist([FromBody] CreatePlaylistDTO createPlaylistDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();

            var playlist = new Playlist
            {
                UserID = userId,
                PlaylistName = createPlaylistDTO.PlaylistName,
                Description = createPlaylistDTO.Description,
                IsPublic = createPlaylistDTO.IsPublic,
                CreatedAt = DateTime.Now
            };

            _context.Playlists.Add(playlist);
            await _context.SaveChangesAsync();

            var playlistDTO = new PlaylistDTO
            {
                PlaylistID = playlist.PlaylistID,
                UserID = playlist.UserID,
                PlaylistName = playlist.PlaylistName,
                Description = playlist.Description,
                IsPublic = playlist.IsPublic,
                CreatedAt = playlist.CreatedAt,
                UpdatedAt = playlist.UpdatedAt,
                SongCount = 0
            };

            return CreatedAtAction(nameof(GetPlaylistById), new { id = playlist.PlaylistID }, playlistDTO);
        }

        /// <summary>
        /// Update playlist information
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<PlaylistDTO>> UpdatePlaylist(int id, [FromBody] UpdatePlaylistDTO updatePlaylistDTO)
        {
            var userId = GetCurrentUserId();

            var playlist = await _context.Playlists.FindAsync(id);

            if (playlist == null)
            {
                return NotFound(new { message = "Playlist not found" });
            }

            if (playlist.UserID != userId)
            {
                return Forbid();
            }

            if (updatePlaylistDTO.PlaylistName != null)
            {
                playlist.PlaylistName = updatePlaylistDTO.PlaylistName;
            }

            if (updatePlaylistDTO.Description != null)
            {
                playlist.Description = updatePlaylistDTO.Description;
            }

            if (updatePlaylistDTO.IsPublic.HasValue)
            {
                playlist.IsPublic = updatePlaylistDTO.IsPublic.Value;
            }

            playlist.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            var playlistDTO = new PlaylistDTO
            {
                PlaylistID = playlist.PlaylistID,
                UserID = playlist.UserID,
                PlaylistName = playlist.PlaylistName,
                Description = playlist.Description,
                IsPublic = playlist.IsPublic,
                CreatedAt = playlist.CreatedAt,
                UpdatedAt = playlist.UpdatedAt,
                SongCount = await _context.PlaylistSongs.CountAsync(ps => ps.PlaylistID == id)
            };

            return Ok(playlistDTO);
        }

        /// <summary>
        /// Delete playlist
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePlaylist(int id)
        {
            var userId = GetCurrentUserId();

            var playlist = await _context.Playlists.FindAsync(id);

            if (playlist == null)
            {
                return NotFound(new { message = "Playlist not found" });
            }

            if (playlist.UserID != userId)
            {
                return Forbid();
            }

            _context.Playlists.Remove(playlist);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Playlist deleted successfully" });
        }

        /// <summary>
        /// Add song to playlist
        /// </summary>
        [HttpPost("{id}/songs")]
        public async Task<ActionResult> AddSongToPlaylist(int id, [FromBody] AddSongToPlaylistDTO addSongDTO)
        {
            var userId = GetCurrentUserId();

            var playlist = await _context.Playlists.FindAsync(id);

            if (playlist == null)
            {
                return NotFound(new { message = "Playlist not found" });
            }

            if (playlist.UserID != userId)
            {
                return Forbid();
            }

            // Check if song exists
            var song = await _context.Songs.FindAsync(addSongDTO.SongID);
            if (song == null)
            {
                return NotFound(new { message = "Song not found" });
            }

            // Check if song already in playlist
            var existingSong = await _context.PlaylistSongs
                .FirstOrDefaultAsync(ps => ps.PlaylistID == id && ps.SongID == addSongDTO.SongID);

            if (existingSong != null)
            {
                return BadRequest(new { message = "Song already in playlist" });
            }

            // Get the next order index
            var maxOrderIndex = await _context.PlaylistSongs
                .Where(ps => ps.PlaylistID == id)
                .MaxAsync(ps => (int?)ps.OrderIndex) ?? -1;

            var playlistSong = new PlaylistSong
            {
                PlaylistID = id,
                SongID = addSongDTO.SongID,
                OrderIndex = maxOrderIndex + 1,
                AddedAt = DateTime.Now
            };

            _context.PlaylistSongs.Add(playlistSong);
            
            // Update playlist's UpdatedAt
            playlist.UpdatedAt = DateTime.Now;
            
            await _context.SaveChangesAsync();

            return Ok(new { message = "Song added to playlist successfully" });
        }

        /// <summary>
        /// Remove song from playlist
        /// </summary>
        [HttpDelete("{playlistId}/songs/{songId}")]
        public async Task<ActionResult> RemoveSongFromPlaylist(int playlistId, int songId)
        {
            var userId = GetCurrentUserId();

            var playlist = await _context.Playlists.FindAsync(playlistId);

            if (playlist == null)
            {
                return NotFound(new { message = "Playlist not found" });
            }

            if (playlist.UserID != userId)
            {
                return Forbid();
            }

            var playlistSong = await _context.PlaylistSongs
                .FirstOrDefaultAsync(ps => ps.PlaylistID == playlistId && ps.SongID == songId);

            if (playlistSong == null)
            {
                return NotFound(new { message = "Song not found in playlist" });
            }

            var removedOrderIndex = playlistSong.OrderIndex;
            _context.PlaylistSongs.Remove(playlistSong);

            // Re-order remaining songs
            var remainingSongs = await _context.PlaylistSongs
                .Where(ps => ps.PlaylistID == playlistId && ps.OrderIndex > removedOrderIndex)
                .ToListAsync();

            foreach (var ps in remainingSongs)
            {
                ps.OrderIndex--;
            }

            // Update playlist's UpdatedAt
            playlist.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Song removed from playlist successfully" });
        }

        /// <summary>
        /// Reorder songs in playlist
        /// </summary>
        [HttpPut("{id}/reorder")]
        public async Task<ActionResult> ReorderPlaylist(int id, [FromBody] List<int> songIds)
        {
            var userId = GetCurrentUserId();

            var playlist = await _context.Playlists
                .Include(p => p.PlaylistSongs)
                .FirstOrDefaultAsync(p => p.PlaylistID == id);

            if (playlist == null)
            {
                return NotFound(new { message = "Playlist not found" });
            }

            if (playlist.UserID != userId)
            {
                return Forbid();
            }

            // Update order index for each song
            for (int i = 0; i < songIds.Count; i++)
            {
                var playlistSong = playlist.PlaylistSongs
                    .FirstOrDefault(ps => ps.SongID == songIds[i]);

                if (playlistSong != null)
                {
                    playlistSong.OrderIndex = i;
                }
            }

            playlist.UpdatedAt = DateTime.Now;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Playlist reordered successfully" });
        }
    }
}
