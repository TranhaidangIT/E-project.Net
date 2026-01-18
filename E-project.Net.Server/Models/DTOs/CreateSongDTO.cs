using System.ComponentModel.DataAnnotations;

namespace E_project.Net.Server.Models.DTOs
{
    public class CreateSongDTO
    {
        [Required(ErrorMessage = "Song name is required")]
        [MaxLength(255)]
        public string SongName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Artist name is required")]
        [MaxLength(255)]
        public string ArtistName { get; set; } = string.Empty;

        [Range(1, int.MaxValue, ErrorMessage = "Duration must be greater than 0")]
        public int? Duration { get; set; }
    }
}
