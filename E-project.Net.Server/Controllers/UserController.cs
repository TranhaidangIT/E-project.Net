using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

        public UserController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Get current user profile
        /// </summary>
        [HttpGet("profile")]
        public async Task<ActionResult<UserDTO>> GetProfile()
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

            return Ok(user);
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
