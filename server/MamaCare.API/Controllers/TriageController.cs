using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MamaCare.API.Data;
using MamaCare.API.DTOs;
using MamaCare.API.Models;
using System.Text;
using System.Text.Json;

namespace MamaCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TriageController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;
    private readonly HttpClient _http;

    public TriageController(AppDbContext db, IConfiguration config, IHttpClientFactory httpFactory)
    {
        _db = db;
        _config = config;
        _http = httpFactory.CreateClient();
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? motherId)
    {
        var query = _db.TriageSessions
            .Include(t => t.Mother).ThenInclude(m => m.User)
            .AsQueryable();

        if (motherId.HasValue) query = query.Where(t => t.MotherId == motherId);

        var result = await query
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new TriageSessionDto(
                t.Id, t.MotherId, t.Mother.User.FullName, t.Symptoms,
                t.SeverityScore, t.DurationDescription, t.BloodPressureSystolic,
                t.BloodPressureDiastolic, t.HeartRate, t.Temperature,
                t.Outcome, t.RiskLevel, t.AiRecommendation, t.CreatedAt))
            .ToListAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var t = await _db.TriageSessions
            .Include(t => t.Mother).ThenInclude(m => m.User)
            .FirstOrDefaultAsync(t => t.Id == id);
        if (t is null) return NotFound();
        return Ok(new TriageSessionDto(
            t.Id, t.MotherId, t.Mother.User.FullName, t.Symptoms,
            t.SeverityScore, t.DurationDescription, t.BloodPressureSystolic,
            t.BloodPressureDiastolic, t.HeartRate, t.Temperature,
            t.Outcome, t.RiskLevel, t.AiRecommendation, t.CreatedAt));
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateTriageSessionDto dto)
    {
        var mother = await _db.Mothers
            .Include(m => m.User)
            .FirstOrDefaultAsync(m => m.Id == dto.MotherId);

        var symptomsText = string.Join(", ", dto.Symptoms);
        var bpText = dto.BloodPressureSystolic.HasValue
            ? $"{dto.BloodPressureSystolic}/{dto.BloodPressureDiastolic} mmHg"
            : "Not provided";
        var tempText = dto.Temperature.HasValue ? $"{dto.Temperature}°C" : "Not provided";

        var motherProfile = mother != null
            ? $"Name: {mother.User.FullName}, Gestational Week: {mother.GestationalWeek}, Trimester: {mother.CurrentTrimester}, " +
              $"Current Risk Level: {mother.RiskLevel}, Has Hypertension: {mother.HasHypertension}, " +
              $"Has Gestational Diabetes: {mother.HasGestationalDiabetes}, Blood Type: {mother.BloodType}, " +
              $"Weight: {mother.WeightKg} kg, Medical Notes: {mother.MedicalNotes ?? "None"}"
            : "Mother profile not available.";

        var jsonFormat = "{ \"outcome\": \"Normal|Monitor|Urgent|Emergency\", \"riskLevel\": \"Low|Medium|High\", \"recommendation\": \"2-3 sentence clinical recommendation\" }";

        var prompt = "You are a compassionate clinical maternal health AI assistant. Analyze the following triage data and return a JSON response only.\n\n" +
            "Mother Profile: " + motherProfile + "\n" +
            "Current Symptoms: " + symptomsText + "\n" +
            "Severity Score: " + dto.SeverityScore + "/10\n" +
            "Duration: " + (dto.DurationDescription ?? "Not specified") + "\n" +
            "Blood Pressure: " + bpText + "\n" +
            "Temperature: " + tempText + "\n\n" +
            "Respond with ONLY this JSON format: " + jsonFormat + "\n\n" +
            "Rules:\n" +
            "- Red flag symptoms (severe headache, blurred vision, sudden swelling) = high priority\n" +
            "- BP >= 140/90 with symptoms = Emergency\n" +
            "- BP >= 130/85 = at minimum Urgent\n" +
            "- Pre-existing hypertension or diabetes elevates risk\n" +
            "- riskLevel must match outcome: Normal=Low, Monitor=Medium, Urgent/Emergency=High\n" +
            "- Write the recommendation directly to the mother using 'you/your' in a warm, clear tone (e.g. 'Your blood pressure is elevated...')\n" +
            "- Be specific about what she should do next, not generic\n" +
            "- Return ONLY the JSON object, no extra text.";

        var aiResult = await CallGroqAsync(prompt);

        TriageOutcome outcome = TriageOutcome.Normal;
        RiskLevel riskLevel = RiskLevel.Low;
        string recommendation = "Please consult your healthcare provider for guidance.";

        try
        {
            var jsonStart = aiResult.IndexOf('{');
            var jsonEnd = aiResult.LastIndexOf('}');
            if (jsonStart >= 0 && jsonEnd > jsonStart)
            {
                var json = aiResult[jsonStart..(jsonEnd + 1)];
                using var doc = JsonDocument.Parse(json);
                var root = doc.RootElement;

                if (root.TryGetProperty("outcome", out var outcomeEl))
                    Enum.TryParse(outcomeEl.GetString(), out outcome);

                if (root.TryGetProperty("riskLevel", out var riskEl))
                    Enum.TryParse(riskEl.GetString(), out riskLevel);

                if (root.TryGetProperty("recommendation", out var recEl))
                    recommendation = recEl.GetString() ?? recommendation;
            }
        }
        catch { /* fallback to defaults */ }

        if (mother is not null)
            mother.RiskLevel = riskLevel;

        var session = new TriageSession
        {
            MotherId = dto.MotherId,
            Symptoms = dto.Symptoms,
            SeverityScore = dto.SeverityScore,
            DurationDescription = dto.DurationDescription,
            BloodPressureSystolic = dto.BloodPressureSystolic,
            BloodPressureDiastolic = dto.BloodPressureDiastolic,
            HeartRate = dto.HeartRate,
            Temperature = dto.Temperature,
            Outcome = outcome,
            RiskLevel = riskLevel,
            AiRecommendation = recommendation
        };

        _db.TriageSessions.Add(session);

        // Also save vitals to VitalRecords so doctor sees latest measurements
        if (dto.BloodPressureSystolic.HasValue || dto.Temperature.HasValue || dto.HeartRate.HasValue)
        {
            _db.VitalRecords.Add(new VitalRecord
            {
                MotherId = dto.MotherId,
                BloodPressureSystolic = dto.BloodPressureSystolic,
                BloodPressureDiastolic = dto.BloodPressureDiastolic,
                Temperature = dto.Temperature,
                FetalHeartRate = dto.HeartRate,
                Notes = $"Recorded during triage assessment — {outcome} outcome"
            });
        }

        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = session.Id }, new TriageSessionDto(
            session.Id, session.MotherId, mother?.User.FullName ?? "", session.Symptoms,
            session.SeverityScore, session.DurationDescription, session.BloodPressureSystolic,
            session.BloodPressureDiastolic, session.HeartRate, session.Temperature,
            session.Outcome, session.RiskLevel, session.AiRecommendation, session.CreatedAt));
    }

    private async Task<string> CallGroqAsync(string prompt)
    {
        var apiKey = Environment.GetEnvironmentVariable("GROQ_API_KEY") ?? _config["Groq:ApiKey"];
        if (string.IsNullOrEmpty(apiKey)) return "{}";

        var body = new
        {
            model = "llama-3.3-70b-versatile",
            messages = new[] { new { role = "user", content = prompt } },
            max_tokens = 512,
            temperature = 0.2
        };

        var req = new HttpRequestMessage(HttpMethod.Post, "https://api.groq.com/openai/v1/chat/completions");
        req.Headers.Add("Authorization", $"Bearer {apiKey}");
        req.Content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");

        var response = await _http.SendAsync(req);
        if (!response.IsSuccessStatusCode) return "{}";

        var responseBody = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(responseBody);
        return doc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString() ?? "{}";
    }
}
