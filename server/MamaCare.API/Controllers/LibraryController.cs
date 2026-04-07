using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MamaCare.API.Data;
using MamaCare.API.DTOs;
using MamaCare.API.Models;

namespace MamaCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LibraryController : ControllerBase
{
    private readonly AppDbContext _db;
    public LibraryController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] ArticleStatus? status, [FromQuery] ArticleCategory? category)
    {
        var query = _db.LibraryArticles.AsQueryable();
        if (status.HasValue) query = query.Where(a => a.Status == status);
        if (category.HasValue) query = query.Where(a => a.Category == category);

        var result = await query
            .OrderByDescending(a => a.PublishedAt)
            .Select(a => new LibraryArticleDto(
                a.Id, a.Title, a.Summary, a.Category,
                a.Status, a.ImageUrl, a.PublishedAt, a.UpdatedAt))
            .ToListAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var a = await _db.LibraryArticles.FindAsync(id);
        if (a is null) return NotFound();
        return Ok(new LibraryArticleDto(
            a.Id, a.Title, a.Summary, a.Category,
            a.Status, a.ImageUrl, a.PublishedAt, a.UpdatedAt));
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateArticleDto dto)
    {
        var article = new LibraryArticle
        {
            Title = dto.Title, Summary = dto.Summary,
            Content = dto.Content, Category = dto.Category, ImageUrl = dto.ImageUrl
        };
        _db.LibraryArticles.Add(article);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = article.Id }, article);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateArticleDto dto)
    {
        var article = await _db.LibraryArticles.FindAsync(id);
        if (article is null) return NotFound();

        if (dto.Title is not null) article.Title = dto.Title;
        if (dto.Summary is not null) article.Summary = dto.Summary;
        if (dto.Content is not null) article.Content = dto.Content;
        if (dto.Category.HasValue) article.Category = dto.Category.Value;
        if (dto.Status.HasValue) article.Status = dto.Status.Value;
        if (dto.ImageUrl is not null) article.ImageUrl = dto.ImageUrl;
        article.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(article);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var article = await _db.LibraryArticles.FindAsync(id);
        if (article is null) return NotFound();
        _db.LibraryArticles.Remove(article);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
