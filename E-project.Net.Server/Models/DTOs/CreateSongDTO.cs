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

        public int? Duration { get; set; }

        [Required(ErrorMessage = "Audio file is required")]
        public IFormFile File { get; set; } = null!;
    }
}
