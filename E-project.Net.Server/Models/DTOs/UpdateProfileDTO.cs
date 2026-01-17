using System.ComponentModel.DataAnnotations;

namespace E_project.Net.Server.Models.DTOs
{
    public class UpdateProfileDTO
    {
        [MaxLength(255, ErrorMessage = "Full name cannot exceed 255 characters")]
        public string? FullName { get; set; }

        [MaxLength(500, ErrorMessage = "Avatar URL cannot exceed 500 characters")]
        public string? AvatarURL { get; set; }
    }
}
