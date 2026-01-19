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
    public class LikedSongController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LikedSongController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim ?? "0");
        }

        /// <summary>
        /// Get all liked songs for current user
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SongDTO>>> GetLikedSongs()
        {
            var userId = GetCurrentUserId();

            var likedSongs = await _context.LikedSongs
                .Where(ls => ls.UserID == userId)
                .Include(ls => ls.Song)
                .OrderByDescending(ls => ls.LikedAt)
                .Select(ls => new SongDTO
                {
                    SongID = ls.Song!.SongID,
                    SongName = ls.Song.SongName,
                    ArtistName = ls.Song.ArtistName,
                    Duration = ls.Song.Duration,
                    PlayCount = ls.Song.PlayCount,
                    CreatedAt = ls.Song.CreatedAt
                })
                .ToListAsync();

            return Ok(likedSongs);
        }

        /// <summary>
        /// Get IDs of all liked songs for current user (for checking like status)
        /// </summary>
        [HttpGet("ids")]
        public async Task<ActionResult<IEnumerable<int>>> GetLikedSongIds()
        {
            var userId = GetCurrentUserId();

            var likedSongIds = await _context.LikedSongs
                .Where(ls => ls.UserID == userId)
                .Select(ls => ls.SongID)
                .ToListAsync();

            return Ok(likedSongIds);
        }

        /// <summary>
        /// Like a song
        /// </summary>
        [HttpPost("{songId}")]
        public async Task<ActionResult> LikeSong(int songId)
        {
            var userId = GetCurrentUserId();

            // Check if song exists
            var song = await _context.Songs.FindAsync(songId);
            if (song == null)
            {
                return NotFound(new { message = "Không tìm thấy bài hát" });
            }

            // Check if already liked
            var existingLike = await _context.LikedSongs
                .FirstOrDefaultAsync(ls => ls.UserID == userId && ls.SongID == songId);

            if (existingLike != null)
            {
                return BadRequest(new { message = "Bạn đã thích bài hát này rồi" });
            }

            var likedSong = new LikedSong
            {
                UserID = userId,
                SongID = songId,
                LikedAt = DateTime.Now
            };

            _context.LikedSongs.Add(likedSong);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã thêm vào danh sách yêu thích" });
        }

        /// <summary>
        /// Unlike a song
        /// </summary>
        [HttpDelete("{songId}")]
        public async Task<ActionResult> UnlikeSong(int songId)
        {
            var userId = GetCurrentUserId();

            var likedSong = await _context.LikedSongs
                .FirstOrDefaultAsync(ls => ls.UserID == userId && ls.SongID == songId);

            if (likedSong == null)
            {
                return NotFound(new { message = "Bài hát không có trong danh sách yêu thích" });
            }

            _context.LikedSongs.Remove(likedSong);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa khỏi danh sách yêu thích" });
        }

        /// <summary>
        /// Check if a song is liked
        /// </summary>
        [HttpGet("check/{songId}")]
        public async Task<ActionResult<bool>> CheckLiked(int songId)
        {
            var userId = GetCurrentUserId();

            var isLiked = await _context.LikedSongs
                .AnyAsync(ls => ls.UserID == userId && ls.SongID == songId);

            return Ok(isLiked);
        }
    }
}
