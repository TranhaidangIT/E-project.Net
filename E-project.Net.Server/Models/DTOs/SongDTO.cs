namespace E_project.Net.Server.Models.DTOs
{
    public class SongDTO
    {
        public int SongID { get; set; }
        public string SongName { get; set; } = string.Empty;
        public string ArtistName { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public int? Duration { get; set; }
        public int PlayCount { get; set; } = 0;
        public DateTime CreatedAt { get; set; }
    }
}
