using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MamaCare.API.Data;
using MamaCare.API.Models;

namespace MamaCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MothersController : ControllerBase
{
    private readonly AppDbContext _context;

    public MothersController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _context.Mothers.ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var mother = await _context.Mothers.FindAsync(id);
        return mother is null ? NotFound() : Ok(mother);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Mother mother)
    {
        _context.Mothers.Add(mother);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = mother.Id }, mother);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Mother updated)
    {
        var mother = await _context.Mothers.FindAsync(id);
        if (mother is null) return NotFound();
        mother.FullName = updated.FullName;
        mother.Age = updated.Age;
        mother.PhoneNumber = updated.PhoneNumber;
        await _context.SaveChangesAsync();
        return Ok(mother);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var mother = await _context.Mothers.FindAsync(id);
        if (mother is null) return NotFound();
        _context.Mothers.Remove(mother);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
