using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MamaCare.API.Data;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace MamaCare.API.Controllers;

[ApiController]
[Route("api/chat")]
[Authorize]
public class ChatController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly AppDbContext _db;
    private readonly HttpClient _http;

    public ChatController(IConfiguration config, AppDbContext db, IHttpClientFactory httpFactory)
    {
        _config = config;
        _db = db;
        _http = httpFactory.CreateClient();
    }

    [HttpPost]
    public async Task<IActionResult> Chat([FromBody] ChatRequest request)
    {
        var apiKey = Environment.GetEnvironmentVariable("GROQ_API_KEY")
            ?? _config["Groq:ApiKey"];

        if (string.IsNullOrEmpty(apiKey) || apiKey == "<your-groq-api-key>")
            return BadRequest(new { error = "Groq API key not configured." });

        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var mother = await _db.Mothers
            .Include(m => m.User)
            .FirstOrDefaultAsync(m => m.UserId == userId);

        var motherContext = mother != null
            ? $"The mother's name is {mother.User.FullName}, she is {mother.GestationalWeek} weeks pregnant (trimester {mother.CurrentTrimester}), risk level: {mother.RiskLevel}."
            : "";

        var systemPrompt = $"""
            You are MamaCare AI, a compassionate and knowledgeable maternal health assistant.
            You specialize in pregnancy-related topics including nutrition, safe exercises, mental health,
            fetal development, common symptoms, sleep, prenatal vitamins, labor preparation, postpartum care, and breastfeeding.
            {motherContext}
            Always give warm, supportive, evidence-based answers. Keep responses concise and easy to understand.
            If a question is outside pregnancy/maternal health, gently redirect back to pregnancy topics.
            Never diagnose or replace professional medical advice — always recommend consulting their doctor for medical concerns.
            Respond in the same language the mother uses.
            """;

        var messages = new List<object>
        {
            new { role = "system", content = systemPrompt }
        };

        if (request.History != null)
        {
            foreach (var msg in request.History)
                messages.Add(new { role = msg.Role == "assistant" ? "assistant" : "user", content = msg.Content });
        }

        messages.Add(new { role = "user", content = request.Message });

        var body = new
        {
            model = "llama-3.3-70b-versatile",
            messages,
            max_tokens = 1024,
            temperature = 0.7
        };

        var json = JsonSerializer.Serialize(body);

        try
        {
            var req = new HttpRequestMessage(HttpMethod.Post, "https://api.groq.com/openai/v1/chat/completions");
            req.Headers.Add("Authorization", $"Bearer {apiKey}");
            req.Content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _http.SendAsync(req);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, new { error = responseBody });

            using var doc = JsonDocument.Parse(responseBody);
            var reply = doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();

            return Ok(new { reply });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }
}

public record ChatMessageHistory(string Role, string Content);
public record ChatRequest(string Message, List<ChatMessageHistory>? History);
