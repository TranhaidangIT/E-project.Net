using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

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

        /// <summary>
        /// MP3 file upload (required)
        /// </summary>
        [Required(ErrorMessage = "Audio file is required")]
        public IFormFile File { get; set; } = null!;

        /// <summary>
        /// Song cover image upload (optional)
        /// </summary>
        public IFormFile? ImageFile { get; set; }

        /// <summary>
        /// Image URL (optional - used when not uploading file)
        /// </summary>
        [MaxLength(500)]
        public string? ImageUrl { get; set; }

        /// <summary>
        /// Song duration in seconds (optional)
        /// </summary>
        public int? Duration { get; set; }
    }
}
