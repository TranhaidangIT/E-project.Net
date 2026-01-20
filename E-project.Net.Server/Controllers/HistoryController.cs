using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using E_project.Net.Server.Data;
using E_project.Net.Server.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace E_project.Net.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class HistoryController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public HistoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/history/record/{songId}
        [HttpPost("record/{songId}")]
        public async Task<IActionResult> RecordHistory(int songId)
        {
            try
            {
                var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdStr)) userIdStr = User.FindFirst("UserID")?.Value;
                if (string.IsNullOrEmpty(userIdStr)) userIdStr = User.FindFirst("id")?.Value;
                
                if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
                
                int userId = int.Parse(userIdStr);

                var song = await _context.Songs.FindAsync(songId);
                if (song == null) return NotFound("Song not found");

                // Check for duplicate recent listens (e.g. within last minute) to avoid spam
                var recentListen = await _context.ListeningHistories
                    .Where(h => h.UserID == userId && h.SongID == songId)
                    .OrderByDescending(h => h.ListenedAt)
                    .FirstOrDefaultAsync();

                if (recentListen != null && (DateTime.Now - recentListen.ListenedAt).TotalMinutes < 1)
                {
                    return Ok(new { message = "Already recorded recently" });
                }

                var history = new ListeningHistory
                {
                    UserID = userId,
                    SongID = songId,
                    ListenedAt = DateTime.Now
                };

                _context.ListeningHistories.Add(history);
                
                // Increment play count
                song.PlayCount++;
                
                await _context.SaveChangesAsync();

                return Ok(new { message = "History recorded" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/history
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetHistory()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) userIdStr = User.FindFirst("UserID")?.Value;
            if (string.IsNullOrEmpty(userIdStr)) userIdStr = User.FindFirst("id")?.Value;
            
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            
            int userId = int.Parse(userIdStr);

            var history = await _context.ListeningHistories
                .Include(h => h.Song)
                .Where(h => h.UserID == userId)
                .OrderByDescending(h => h.ListenedAt)
                .Take(5) // Limit to last 20
                .Select(h => new 
                {
                    h.HistoryID,
                    h.ListenedAt,
                    Song = new {
                        h.Song.SongID,
                        h.Song.SongName,
                        h.Song.ArtistName,
                        h.Song.Duration
                    }
                })
                .ToListAsync();

            return Ok(history);
        }
    }
}
