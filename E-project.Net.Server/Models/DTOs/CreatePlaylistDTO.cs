using System.ComponentModel.DataAnnotations;

namespace E_project.Net.Server.Models.DTOs
{
    public class CreatePlaylistDTO
    {
        [Required]
        [MaxLength(255)]
        public string PlaylistName { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        public bool IsPublic { get; set; } = false;
    }
}
