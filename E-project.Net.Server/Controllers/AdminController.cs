using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using E_project.Net.Server.Data;
using E_project.Net.Server.Models.DTOs;

namespace E_project.Net.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get all users (Admin only)
        /// </summary>
        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetAllUsers()
        {
            var users = await _context.Users
                .OrderByDescending(u => u.CreatedAt)
                .Select(u => new UserDTO
                {
                    UserID = u.UserID,
                    Username = u.Username,
                    Email = u.Email,
                    FullName = u.FullName,
                    AvatarURL = u.AvatarURL,
                    IsAdmin = u.IsAdmin,
                    CreatedAt = u.CreatedAt
                })
                .ToListAsync();

            return Ok(users);
        }

        /// <summary>
        /// Get user by ID (Admin only)
        /// </summary>
        [HttpGet("users/{id}")]
        public async Task<ActionResult<UserDTO>> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(new UserDTO
            {
                UserID = user.UserID,
                Username = user.Username,
                Email = user.Email,
                FullName = user.FullName,
                AvatarURL = user.AvatarURL,
                IsAdmin = user.IsAdmin,
                CreatedAt = user.CreatedAt
            });
        }

        /// <summary>
        /// Toggle user admin role (Admin only)
        /// </summary>
        [HttpPut("users/{id}/role")]
        public async Task<ActionResult> ToggleAdminRole(int id, [FromBody] ToggleAdminDTO dto)
        {
            var currentUserId = GetCurrentUserId();
            if (currentUserId == id)
            {
                return BadRequest(new { message = "Cannot change your own admin status" });
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            user.IsAdmin = dto.IsAdmin;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"User {user.Username} is now {(user.IsAdmin ? "an Admin" : "a regular User")}" });
        }

        /// <summary>
        /// Delete user (Admin only)
        /// </summary>
        [HttpDelete("users/{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            var currentUserId = GetCurrentUserId();
            if (currentUserId == id)
            {
                return BadRequest(new { message = "Cannot delete yourself" });
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"User {user.Username} has been deleted" });
        }

        private int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return null;
            }
            return userId;
        }
    }

    public class ToggleAdminDTO
    {
        public bool IsAdmin { get; set; }
    }
}
