namespace E_project.Net.Server.Models.DTOs
{
    public class PlaylistDetailDTO
    {
        public int PlaylistID { get; set; }
        public int UserID { get; set; }
        public string PlaylistName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsPublic { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? Username { get; set; }
        public List<PlaylistSongDTO> Songs { get; set; } = new List<PlaylistSongDTO>();
    }

    public class PlaylistSongDTO
    {
        public int PlaylistSongID { get; set; }
        public int SongID { get; set; }
        public string SongName { get; set; } = string.Empty;
        public string ArtistName { get; set; } = string.Empty;
        public int? Duration { get; set; }
        public int OrderIndex { get; set; }
        public DateTime AddedAt { get; set; }
    }
}
