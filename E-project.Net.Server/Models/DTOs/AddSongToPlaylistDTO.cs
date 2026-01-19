using System.ComponentModel.DataAnnotations;

namespace E_project.Net.Server.Models.DTOs
{
    public class AddSongToPlaylistDTO
    {
        [Required]
        public int SongID { get; set; }
    }
}
