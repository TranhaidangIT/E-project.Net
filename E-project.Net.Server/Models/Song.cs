namespace E_project.Net.Server.Models
{
    public class Song
    {
        public int SongID { get; set; }
        public string SongName { get; set; } = string.Empty;
        public string ArtistName { get; set; } = string.Empty;
        public int? Duration { get; set; }
        public int PlayCount { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
