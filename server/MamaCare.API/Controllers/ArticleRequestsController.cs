using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MamaCare.API.Data;
using MamaCare.API.DTOs;
using MamaCare.API.Models;
using System.Security.Claims;

namespace MamaCare.API.Controllers;

[ApiController]
[Route("api/article-requests")]
[Authorize]
public class ArticleRequestsController : ControllerBase
{
    private readonly AppDbContext _db;
    public ArticleRequestsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var requests = await _db.ArticleRequests
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ArticleRequestDto(
                r.Id, r.Topic, r.Description, r.Category,
                r.SubmittedByName, r.SubmittedByEmail,
                r.Status.ToString(), r.CreatedAt))
            .ToListAsync();
        return Ok(requests);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateArticleRequestDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _db.Users.FindAsync(userId);
        if (user is null) return Unauthorized();

        var request = new ArticleRequest
        {
            Topic = dto.Topic,
            Description = dto.Description,
            Category = dto.Category,
            SubmittedByName = user.FullName,
            SubmittedByEmail = user.Email
        };
        _db.ArticleRequests.Add(request);
        await _db.SaveChangesAsync();
        return Ok(new { request.Id });
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
    {
        var request = await _db.ArticleRequests.FindAsync(id);
        if (request is null) return NotFound();
        if (Enum.TryParse<ArticleRequestStatus>(status, out var parsed))
            request.Status = parsed;
        await _db.SaveChangesAsync();
        return Ok();
    }
}
