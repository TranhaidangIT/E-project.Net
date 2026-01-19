namespace E_project.Net.Server.Models
{
    public class PlaylistSong
    {
        public int PlaylistSongID { get; set; }
        public int PlaylistID { get; set; }
        public int SongID { get; set; }
        public int OrderIndex { get; set; }
        public DateTime AddedAt { get; set; } = DateTime.Now;

        // Navigation properties
        public Playlist Playlist { get; set; } = null!;
        public Song Song { get; set; } = null!;
    }
}
