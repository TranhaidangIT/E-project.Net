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
                var oembedUrl = $"https://www.youtube.com/oembed?url={Uri.EscapeDataString(url)}&format=json";
                var response = await _httpClient.GetAsync(oembedUrl);

                if (!response.IsSuccessStatusCode) return NotFound("Video not found");

                var content = await response.Content.ReadAsStringAsync();
                using var document = JsonDocument.Parse(content);
                var root = document.RootElement;
                
                return Ok(new 
                { 
                    title = root.GetProperty("title").GetString(), 
                    thumbnailUrl = root.GetProperty("thumbnail_url").GetString(),
                    authorName = root.GetProperty("author_name").GetString()
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }
        [HttpGet("stream")]
        public async Task<IActionResult> StreamAudio([FromQuery] string url)
        {
            if (string.IsNullOrWhiteSpace(url)) return BadRequest("URL is required");

            try
            {
                // 1. Extract Video ID (used for cache filename)
                var videoId = "";
                if (url.Contains("v=")) 
                {
                    videoId = url.Split("v=")[1].Split("&")[0];
                }
                else if (url.Contains("youtu.be/"))
                {
                    videoId = url.Split("youtu.be/")[1].Split("?")[0];
                }

                if (string.IsNullOrEmpty(videoId)) return BadRequest("Invalid YouTube URL");

                // 2. Setup Cache
                var cacheDir = Path.Combine(Directory.GetCurrentDirectory(), "Data", "Cache");
                if (!Directory.Exists(cacheDir)) Directory.CreateDirectory(cacheDir);

                // Use the ID as the base filename. 
                // yt-dlp will create [id].mp3 after conversion.
                // We point to the final expected file.
                var finalFilePath = Path.Combine(cacheDir, $"{videoId}.mp3");

                // 3. Download if missing
                // We use a simple check. For high-concurrency, a named mutex/lock would be better.
                if (!System.IO.File.Exists(finalFilePath))
                {
                    var process = new Process
                    {
                        StartInfo = new ProcessStartInfo
                        {
                            FileName = "yt-dlp",
                            // -f ba: Best Audio (usually webm/opus)
                            // --no-part: Write directly to file (no .part)
                            // --no-playlist: Ensure single video
                            // -x: Extract audio (post-process)
                            // --audio-format mp3: Convert to MP3
                            // -o: Output template. We use %(id)s.%(ext)s so yt-dlp manages the temp extension, then renames to .mp3
                            Arguments = $"-f ba --no-part --no-playlist -x --audio-format mp3 -o \"{Path.Combine(cacheDir, "%(id)s.%(ext)s")}\" \"{url}\"",
                            RedirectStandardOutput = true,
                            RedirectStandardError = true,
                            UseShellExecute = false,
                            CreateNoWindow = true
                        }
                    };

                    process.Start();
                    
                    // Wait for the entire download and conversion to finish
                    await process.WaitForExitAsync();

                    if (process.ExitCode != 0)
                    {
                        var error = await process.StandardError.ReadToEndAsync();
                        // If multiple requests raced, the file might exist now despite the "error" from the loser process
                        if (!System.IO.File.Exists(finalFilePath)) 
                        {
                             return StatusCode(500, $"Download failed: {error}");
                        }
                    }
                }

                // 4. Serve the final MP3
                if (!System.IO.File.Exists(finalFilePath))
                {
                    return NotFound("Audio file could not be generated.");
                }

                // PhysicalFile supports Range requests (seeking) natively on Windows/IIS/Kestrel.
                // It handles the 'audio/mpeg' Content-Type and HTTP 206 responses.
                return PhysicalFile(finalFilePath, "audio/mpeg", enableRangeProcessing: true);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Server Error: {ex.Message}");
            }
        }
    }
}
