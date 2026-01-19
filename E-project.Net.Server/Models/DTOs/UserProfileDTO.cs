namespace E_project.Net.Server.Models.DTOs
{
    public class UserProfileDTO
    {
        public int UserID { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? FullName { get; set; }
        public string? AvatarURL { get; set; }
        public DateTime CreatedAt { get; set; }
        public int PlaylistCount { get; set; }
    }
}
