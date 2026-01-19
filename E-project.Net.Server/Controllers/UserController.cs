using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using E_project.Net.Server.Data;
using E_project.Net.Server.Models.DTOs;
using E_project.Net.Server.Services;

namespace E_project.Net.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ApplicationDbContext _context;

        public UserController(IAuthService authService, ApplicationDbContext context)
        {
            _authService = authService;
            _context = context;
        }

        /// <summary>
        /// Get current user profile
        /// </summary>
        [HttpGet("profile")]
        public async Task<ActionResult<UserProfileDTO>> GetProfile()
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            var user = await _authService.GetUserByIdAsync(userId.Value);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var playlistCount = await _context.Playlists
                .CountAsync(p => p.UserID == userId.Value);

            var userProfile = new UserProfileDTO
            {
                UserID = user.UserID,
                Username = user.Username,
                Email = user.Email,
                FullName = user.FullName,
                AvatarURL = user.AvatarURL,
                CreatedAt = user.CreatedAt,
                PlaylistCount = playlistCount
            };

            return Ok(userProfile);
        }

        /// <summary>
        /// Update user profile
        /// </summary>
        [HttpPut("profile")]
        public async Task<ActionResult<UserDTO>> UpdateProfile([FromBody] UpdateProfileDTO updateDTO)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            var user = await _authService.UpdateProfileAsync(userId.Value, updateDTO);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(user);
        }

        /// <summary>
        /// Change user password
        /// </summary>
        [HttpPut("change-password")]
        public async Task<ActionResult<AuthResponseDTO>> ChangePassword([FromBody] ChangePasswordDTO changePasswordDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new AuthResponseDTO
                {
                    Success = false,
                    Message = "Invalid input data"
                });
            }

            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(new AuthResponseDTO
                {
                    Success = false,
                    Message = "User not authenticated"
                });
            }

            var result = await _authService.ChangePasswordAsync(userId.Value, changePasswordDTO);
            
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        /// <summary>
        /// Delete user account
        /// </summary>
        [HttpDelete("delete")]
        public async Task<ActionResult<AuthResponseDTO>> DeleteAccount()
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(new AuthResponseDTO
                {
                    Success = false,
                    Message = "User not authenticated"
                });
            }

            var success = await _authService.DeleteUserAsync(userId.Value);
            
            if (!success)
            {
                return NotFound(new AuthResponseDTO
                {
                    Success = false,
                    Message = "User not found"
                });
            }

            return Ok(new AuthResponseDTO
            {
                Success = true,
                Message = "Account deleted successfully"
            });
        }

        /// <summary>
        /// Upload avatar (returns URL to use in UpdateProfile)
        /// </summary>
        [HttpPost("upload-avatar")]
        public async Task<ActionResult> UploadAvatar(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "No file uploaded" });
            }

            // Validate file type
            var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/gif" };
            if (!allowedTypes.Contains(file.ContentType.ToLower()))
            {
                return BadRequest(new { message = "Invalid file type. Only JPEG, PNG, and GIF are allowed" });
            }

            // Validate file size (max 5MB)
            if (file.Length > 5 * 1024 * 1024)
            {
                return BadRequest(new { message = "File size must be less than 5MB" });
            }

            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            try
            {
                // Create uploads directory if it doesn't exist
                var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "avatars");
                Directory.CreateDirectory(uploadsPath);

                // Generate unique filename
                var fileExtension = Path.GetExtension(file.FileName);
                var fileName = $"{userId}_{DateTime.Now.Ticks}{fileExtension}";
                var filePath = Path.Combine(uploadsPath, fileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Return the URL
                var avatarUrl = $"/uploads/avatars/{fileName}";
                
                return Ok(new { avatarUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error uploading file: {ex.Message}" });
            }
        }

        /// <summary>
        /// Upload cover image (returns URL to use in UpdateProfile)
        /// </summary>
        [HttpPost("upload-cover")]
        public async Task<ActionResult> UploadCover(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "No file uploaded" });
            }

            // Validate file type
            var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/gif" };
            if (!allowedTypes.Contains(file.ContentType.ToLower()))
            {
                return BadRequest(new { message = "Invalid file type. Only JPEG, PNG, and GIF are allowed" });
            }

            // Validate file size (max 10MB for cover)
            if (file.Length > 10 * 1024 * 1024)
            {
                return BadRequest(new { message = "File size must be less than 10MB" });
            }

            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            try
            {
                // Create uploads directory if it doesn't exist
                var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "covers");
                Directory.CreateDirectory(uploadsPath);

                // Generate unique filename
                var fileExtension = Path.GetExtension(file.FileName);
                var fileName = $"{userId}_{DateTime.Now.Ticks}{fileExtension}";
                var filePath = Path.Combine(uploadsPath, fileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Return the URL
                var coverUrl = $"/uploads/covers/{fileName}";
                
                return Ok(new { coverUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error uploading file: {ex.Message}" });
            }
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
}
