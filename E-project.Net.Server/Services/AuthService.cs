using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using E_project.Net.Server.Data;
using E_project.Net.Server.Models;
using E_project.Net.Server.Models.DTOs;
using System.Linq;

namespace E_project.Net.Server.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<AuthResponseDTO> RegisterAsync(RegisterDTO registerDTO)
        {
            // Check if username already exists
            if (await _context.Users.AnyAsync(u => u.Username == registerDTO.Username))
            {
                return new AuthResponseDTO
                {
                    Success = false,
                    Message = "Username already exists"
                };
            }

            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == registerDTO.Email))
            {
                return new AuthResponseDTO
                {
                    Success = false,
                    Message = "Email already exists"
                };
            }

            // Create new user
            var user = new User
            {
                Username = registerDTO.Username,
                Email = registerDTO.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDTO.Password),
                FullName = registerDTO.FullName,
                IsAdmin = false,
                CreatedAt = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);

            return new AuthResponseDTO
            {
                Success = true,
                Message = "Registration successful",
                Token = token,
                User = MapToUserDTO(user)
            };
        }

        public async Task<AuthResponseDTO> LoginAsync(LoginDTO loginDTO)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == loginDTO.Username);

            if (user == null)
            {
                return new AuthResponseDTO
                {
                    Success = false,
                    Message = "Invalid username or password"
                };
            }

            if (!BCrypt.Net.BCrypt.Verify(loginDTO.Password, user.PasswordHash))
            {
                return new AuthResponseDTO
                {
                    Success = false,
                    Message = "Invalid username or password"
                };
            }

            var token = GenerateJwtToken(user);

            return new AuthResponseDTO
            {
                Success = true,
                Message = "Login successful",
                Token = token,
                User = MapToUserDTO(user)
            };
        }

        public async Task<UserDTO?> GetUserByIdAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            return user != null ? MapToUserDTO(user) : null;
        }

        public async Task<UserDTO?> UpdateProfileAsync(int userId, UpdateProfileDTO updateDTO)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return null;

            if (updateDTO.FullName != null)
                user.FullName = updateDTO.FullName;

            if (updateDTO.AvatarURL != null)
                user.AvatarURL = updateDTO.AvatarURL;

            if (updateDTO.CoverURL != null)
                user.CoverURL = updateDTO.CoverURL;

            await _context.SaveChangesAsync();
            return MapToUserDTO(user);
        }

        public async Task<AuthResponseDTO> ChangePasswordAsync(int userId, ChangePasswordDTO changePasswordDTO)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return new AuthResponseDTO
                {
                    Success = false,
                    Message = "User not found"
                };
            }

            if (!BCrypt.Net.BCrypt.Verify(changePasswordDTO.CurrentPassword, user.PasswordHash))
            {
                return new AuthResponseDTO
                {
                    Success = false,
                    Message = "Current password is incorrect"
                };
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(changePasswordDTO.NewPassword);
            await _context.SaveChangesAsync();

            return new AuthResponseDTO
            {
                Success = true,
                Message = "Password changed successfully"
            };
        }

        public async Task<bool> DeleteUserAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey is not configured");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserID.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.IsAdmin ? "Admin" : "User"),
                new Claim("IsAdmin", user.IsAdmin.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(Convert.ToDouble(jwtSettings["ExpirationInDays"] ?? "1")),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static UserDTO MapToUserDTO(User user)
        {
            return new UserDTO
            {
                UserID = user.UserID,
                Username = user.Username,
                Email = user.Email,
                FullName = user.FullName,
                AvatarURL = user.AvatarURL,
                CoverURL = user.CoverURL,
                IsAdmin = user.IsAdmin,
                CreatedAt = user.CreatedAt
            };
        }

        // Forgot Password Methods
        public async Task<AuthResponseDTO> ForgotPasswordAsync(ForgotPasswordDTO forgotPasswordDTO)
        {
            // Kiểm tra email có tồn tại không
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == forgotPasswordDTO.Email);

            if (user == null)
            {
                return new AuthResponseDTO
                {
                    Success = false,
                    Message = "Email not found"
                };
            }

            // Tạo token reset password (6 ký tự ngẫu nhiên)
            var resetToken = GenerateResetToken();

            // Lưu token vào database (có hiệu lực trong 15 phút)
            var passwordResetToken = new PasswordResetToken
            {
                UserID = user.UserID,
                Token = resetToken,
                ExpiresAt = DateTime.Now.AddMinutes(15),
                IsUsed = false,
                CreatedAt = DateTime.Now
            };

            _context.PasswordResetTokens.Add(passwordResetToken);
            await _context.SaveChangesAsync();

            return new AuthResponseDTO
            {
                Success = true,
                Message = "Password reset token has been created",
                Token = resetToken, // Trả về token để chuyển sang trang reset
                User = MapToUserDTO(user)
            };
        }

        public async Task<AuthResponseDTO> ValidateResetTokenAsync(string token)
        {
            var resetToken = await _context.PasswordResetTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.Token == token);

            if (resetToken == null)
            {
                return new AuthResponseDTO
                {
                    Success = false,
                    Message = "Invalid token"
                };
            }

            if (resetToken.IsUsed)
            {
                return new AuthResponseDTO
                {
                    Success = false,
                    Message = "Token has already been used"
                };
            }

            if (resetToken.ExpiresAt < DateTime.Now)
            {
                return new AuthResponseDTO
                {
                    Success = false,
                    Message = "Token has expired"
                };
            }

            return new AuthResponseDTO
            {
                Success = true,
                Message = "Token is valid",
                User = MapToUserDTO(resetToken.User)
            };
        }

        public async Task<AuthResponseDTO> ResetPasswordAsync(ResetPasswordDTO resetPasswordDTO)
        {
            // Validate token
            var resetToken = await _context.PasswordResetTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.Token == resetPasswordDTO.Token);

            if (resetToken == null)
            {
                return new AuthResponseDTO
                {
                    Success = false,
                    Message = "Invalid token"
                };
            }

            if (resetToken.IsUsed)
            {
                return new AuthResponseDTO
                {
                    Success = false,
                    Message = "Token has already been used"
                };
            }

            if (resetToken.ExpiresAt < DateTime.Now)
            {
                return new AuthResponseDTO
                {
                    Success = false,
                    Message = "Token has expired"
                };
            }

            // Cập nhật mật khẩu mới
            var user = resetToken.User;
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(resetPasswordDTO.NewPassword);

            // Đánh dấu token đã được sử dụng
            resetToken.IsUsed = true;

            await _context.SaveChangesAsync();

            return new AuthResponseDTO
            {
                Success = true,
                Message = "Password has been reset successfully",
                User = MapToUserDTO(user)
            };
        }

        private string GenerateResetToken()
        {
            // Tạo token 6 ký tự ngẫu nhiên (chữ và số)
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, 6)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}
