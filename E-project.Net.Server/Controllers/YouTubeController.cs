using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Text.Json;

namespace E_project.Net.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class YouTubeController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public YouTubeController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        [HttpGet("info")]
        public async Task<IActionResult> GetVideoInfo([FromQuery] string url)
        {
            if (string.IsNullOrWhiteSpace(url)) return BadRequest("URL is required");

            try
            {
                // 1. Extract Video ID
                string videoId = null;
                var uri = new Uri(url);
                
                if (uri.Host.Contains("youtube.com"))
                {
                    var query = Microsoft.AspNetCore.WebUtilities.QueryHelpers.ParseQuery(uri.Query);
                    if (query.ContainsKey("v"))
                    {
                        videoId = query["v"];
                    }
                    else if (uri.AbsolutePath.StartsWith("/embed/"))
                    {
                        videoId = uri.AbsolutePath.Split("/").Last();
                    }
                }
                else if (uri.Host.Contains("youtu.be"))
                {
                    videoId = uri.AbsolutePath.TrimStart('/');
                }

                if (string.IsNullOrEmpty(videoId))
                {
                    return BadRequest("Invalid YouTube URL");
                }

                // 2. Create Embed URL
                var embedUrl = $"https://www.youtube.com/embed/{videoId}?enablejsapi=1";

                // 3. Get Metadata via oEmbed
                var oembedRequestUrl = $"https://www.youtube.com/oembed?url={Uri.EscapeDataString(url)}&format=json";
                var response = await _httpClient.GetAsync(oembedRequestUrl);

                string title = "Unknown Title";
                string thumbnailUrl = "";
                string authorName = "";

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    using var document = JsonDocument.Parse(content);
                    var root = document.RootElement;
                    
                    if (root.TryGetProperty("title", out var titleProp)) title = titleProp.GetString();
                    if (root.TryGetProperty("thumbnail_url", out var thumbProp)) thumbnailUrl = thumbProp.GetString();
                    if (root.TryGetProperty("author_name", out var authorProp)) authorName = authorProp.GetString();
                }

                // 4. Return to client
                return Ok(new 
                { 
                    videoId,
                    embedUrl,
                    title,
                    thumbnailUrl,
                    authorName
                });
            }
            catch (Exception ex)
            {
                // Ensure no complex errors, just 500
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }
    }
}
