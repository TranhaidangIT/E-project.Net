namespace E_project.Net.Server.Models.DTOs
{
    public class PlaylistDTO
    {
        public int PlaylistID { get; set; }
        public int UserID { get; set; }
        public string PlaylistName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsPublic { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int SongCount { get; set; }
        public string? Username { get; set; }
    }
}
