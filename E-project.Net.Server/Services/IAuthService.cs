using E_project.Net.Server.Models;
using E_project.Net.Server.Models.DTOs;

namespace E_project.Net.Server.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDTO> RegisterAsync(RegisterDTO registerDTO);
        Task<AuthResponseDTO> LoginAsync(LoginDTO loginDTO);
        Task<UserDTO?> GetUserByIdAsync(int userId);
        Task<UserDTO?> UpdateProfileAsync(int userId, UpdateProfileDTO updateDTO);
        Task<AuthResponseDTO> ChangePasswordAsync(int userId, ChangePasswordDTO changePasswordDTO);
        Task<bool> DeleteUserAsync(int userId);
        string GenerateJwtToken(User user);
    }
}
