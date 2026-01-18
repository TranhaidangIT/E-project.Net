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
    public class SongController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SongController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get all songs (Public - anyone can view)
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SongDTO>>> GetAllSongs()
        {
            var songs = await _context.Songs
                .OrderByDescending(s => s.CreatedAt)
                .Select(s => new SongDTO
                {
                    SongID = s.SongID,
                    SongName = s.SongName,
                    ArtistName = s.ArtistName,
                    Duration = s.Duration,
                    PlayCount = s.PlayCount,
                    CreatedAt = s.CreatedAt
                })
                .ToListAsync();

            return Ok(songs);
        }

        /// <summary>
        /// Get song by ID (Public)
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<SongDTO>> GetSongById(int id)
        {
            var song = await _context.Songs.FindAsync(id);

            if (song == null)
            {
                return NotFound(new { message = "Song not found" });
            }

            var songDTO = new SongDTO
            {
                SongID = song.SongID,
                SongName = song.SongName,
                ArtistName = song.ArtistName,
                Duration = song.Duration,
                PlayCount = song.PlayCount,
                CreatedAt = song.CreatedAt
            };

            return Ok(songDTO);
        }

        /// <summary>
        /// Create new song (Admin only)
        /// </summary>
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<SongDTO>> CreateSong([FromBody] CreateSongDTO createSongDTO)
        {
            // Check if user is admin
            var isAdminClaim = User.FindFirst("IsAdmin")?.Value;
            if (isAdminClaim != "True")
            {
                return Forbid();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var song = new Song
            {
                SongName = createSongDTO.SongName,
                ArtistName = createSongDTO.ArtistName,
                Duration = createSongDTO.Duration,
                PlayCount = 0,
                CreatedAt = DateTime.Now
            };

            _context.Songs.Add(song);
            await _context.SaveChangesAsync();

            var songDTO = new SongDTO
            {
                SongID = song.SongID,
                SongName = song.SongName,
                ArtistName = song.ArtistName,
                Duration = song.Duration,
                PlayCount = song.PlayCount,
                CreatedAt = song.CreatedAt
            };

            return CreatedAtAction(nameof(GetSongById), new { id = song.SongID }, songDTO);
        }

        /// <summary>
        /// Update song (Admin only)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<SongDTO>> UpdateSong(int id, [FromBody] UpdateSongDTO updateSongDTO)
        {
            // Check if user is admin
            var isAdminClaim = User.FindFirst("IsAdmin")?.Value;
            if (isAdminClaim != "True")
            {
                return Forbid();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var song = await _context.Songs.FindAsync(id);
            if (song == null)
            {
                return NotFound(new { message = "Song not found" });
            }

            song.SongName = updateSongDTO.SongName;
            song.ArtistName = updateSongDTO.ArtistName;
            song.Duration = updateSongDTO.Duration;

            await _context.SaveChangesAsync();

            var songDTO = new SongDTO
            {
                SongID = song.SongID,
                SongName = song.SongName,
                ArtistName = song.ArtistName,
                Duration = song.Duration,
                PlayCount = song.PlayCount,
                CreatedAt = song.CreatedAt
            };

            return Ok(songDTO);
        }

        /// <summary>
        /// Delete song (Admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult> DeleteSong(int id)
        {
            // Check if user is admin
            var isAdminClaim = User.FindFirst("IsAdmin")?.Value;
            if (isAdminClaim != "True")
            {
                return Forbid();
            }

            var song = await _context.Songs.FindAsync(id);
            if (song == null)
            {
                return NotFound(new { message = "Song not found" });
            }

            _context.Songs.Remove(song);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Song deleted successfully" });
        }

        /// <summary>
        /// Search songs by name or artist (Public)
        /// </summary>
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<SongDTO>>> SearchSongs([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest(new { message = "Search query is required" });
            }

            var songs = await _context.Songs
                .Where(s => s.SongName.Contains(query) || s.ArtistName.Contains(query))
                .OrderByDescending(s => s.CreatedAt)
                .Select(s => new SongDTO
                {
                    SongID = s.SongID,
                    SongName = s.SongName,
                    ArtistName = s.ArtistName,
                    Duration = s.Duration,
                    PlayCount = s.PlayCount,
                    CreatedAt = s.CreatedAt
                })
                .ToListAsync();

            return Ok(songs);
        }
    }
}
