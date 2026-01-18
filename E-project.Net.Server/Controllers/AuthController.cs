using Microsoft.AspNetCore.Mvc;
using E_project.Net.Server.Models.DTOs;
using E_project.Net.Server.Services;

namespace E_project.Net.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Register a new user
        /// </summary>
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDTO>> Register([FromBody] RegisterDTO registerDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new AuthResponseDTO
                {
                    Success = false,
                    Message = "Invalid input data"
                });
            }

            var result = await _authService.RegisterAsync(registerDTO);
            
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        /// <summary>
        /// Login user
        /// </summary>
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDTO>> Login([FromBody] LoginDTO loginDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new AuthResponseDTO
                {
                    Success = false,
                    Message = "Invalid input data"
                });
            }

            var result = await _authService.LoginAsync(loginDTO);
            
            if (!result.Success)
            {
                return Unauthorized(result);
            }

            return Ok(result);
        }

        /// <summary>
        /// Logout user (client-side will clear the token)
        /// </summary>
        [HttpPost("logout")]
        public ActionResult<AuthResponseDTO> Logout()
        {
            // JWT is stateless, so logout is handled client-side by removing the token
            // This endpoint is for consistency and future enhancements (e.g., token blacklisting)
            return Ok(new AuthResponseDTO
            {
                Success = true,
                Message = "Logout successful"
            });
        }

        /// <summary>
        /// Request password reset - Step 1: Enter email to get reset token
        /// </summary>
        [HttpPost("forgot-password")]
        public async Task<ActionResult<AuthResponseDTO>> ForgotPassword([FromBody] ForgotPasswordDTO forgotPasswordDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new AuthResponseDTO
                {
                    Success = false,
                    Message = "Invalid input data"
                });
            }

            var result = await _authService.ForgotPasswordAsync(forgotPasswordDTO);
            
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        /// <summary>
        /// Validate reset token - Step 2: Check if token is valid (Optional)
        /// </summary>
        [HttpPost("validate-reset-token")]
        public async Task<ActionResult<AuthResponseDTO>> ValidateResetToken([FromBody] ValidateResetTokenDTO validateDTO)
        {
            var result = await _authService.ValidateResetTokenAsync(validateDTO.Token);
            
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        /// <summary>
        /// Reset password with token - Step 3: Enter new password with token
        /// </summary>
        [HttpPost("reset-password")]
        public async Task<ActionResult<AuthResponseDTO>> ResetPassword([FromBody] ResetPasswordDTO resetPasswordDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new AuthResponseDTO
                {
                    Success = false,
                    Message = "Invalid input data"
                });
            }

            var result = await _authService.ResetPasswordAsync(resetPasswordDTO);
            
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}
