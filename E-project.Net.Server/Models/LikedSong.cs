namespace E_project.Net.Server.Models
{
    public class LikedSong
    {
        public int LikedSongID { get; set; }
        public int UserID { get; set; }
        public int SongID { get; set; }
        public DateTime LikedAt { get; set; } = DateTime.Now;

        // Navigation properties
        public User? User { get; set; }
        public Song? Song { get; set; }
    }
}
