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
                    IsSuperAdmin = u.IsSuperAdmin,
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
                IsSuperAdmin = user.IsSuperAdmin,
                CreatedAt = user.CreatedAt
            });
        }

        /// <summary>
        /// Toggle user admin role (Admin only - cannot modify SuperAdmin)
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

            // Prevent modifying SuperAdmin permissions
            if (user.IsSuperAdmin)
            {
                return BadRequest(new { message = "Cannot modify SuperAdmin permissions" });
            }

            user.IsAdmin = dto.IsAdmin;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"User {user.Username} is now {(user.IsAdmin ? "an Admin" : "a regular User")}" });
        }

        /// <summary>
        /// Delete user (Admin only - cannot delete SuperAdmin)
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

            // Prevent deleting SuperAdmin
            if (user.IsSuperAdmin)
            {
                return BadRequest(new { message = "Cannot delete SuperAdmin account" });
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"User {user.Username} has been deleted" });
        }

        /// <summary>
        /// Create new Admin account (SuperAdmin only)
        /// </summary>
        [HttpPost("create-admin")]
        public async Task<ActionResult> CreateAdminAccount([FromBody] CreateAdminDTO dto)
        {
            // Check if current user is SuperAdmin
            var currentUserId = GetCurrentUserId();
            var currentUser = await _context.Users.FindAsync(currentUserId);
            
            if (currentUser == null || !currentUser.IsSuperAdmin)
            {
                return Forbid();
            }

            // Check if username already exists
            if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
            {
                return BadRequest(new { message = "Username already exists" });
            }

            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            {
                return BadRequest(new { message = "Email already exists" });
            }

            // Create new admin user
            var newAdmin = new Models.User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                FullName = dto.FullName,
                IsAdmin = true,
                IsSuperAdmin = false,
                CreatedAt = DateTime.Now
            };

            _context.Users.Add(newAdmin);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Admin account '{dto.Username}' has been created successfully" });
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

    public class CreateAdminDTO
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? FullName { get; set; }
    }
}
