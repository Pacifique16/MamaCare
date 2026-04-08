using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MamaCare.API.Data;
using MamaCare.API.Models;

namespace MamaCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    public AuthController(AppDbContext db) => _db = db;

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email && u.PasswordHash == dto.Password);

        if (user is null)
            return Unauthorized(new { error = "Invalid email or password" });

        // Build session object based on role
        object session;

        if (user.Role == UserRole.Mother)
        {
            var mother = await _db.Mothers.FirstOrDefaultAsync(m => m.UserId == user.Id);
            session = new
            {
                id = user.Id,
                motherId = mother?.Id,
                role = "Mother",
                name = user.FullName,
                email = user.Email,
            };
        }
        else if (user.Role == UserRole.Doctor)
        {
            var doctor = await _db.Doctors.FirstOrDefaultAsync(d => d.UserId == user.Id);
            session = new
            {
                id = user.Id,
                doctorId = doctor?.Id,
                role = "Doctor",
                name = user.FullName,
                email = user.Email,
            };
        }
        else
        {
            session = new
            {
                id = user.Id,
                role = "Admin",
                name = user.FullName,
                email = user.Email,
            };
        }

        return Ok(session);
    }
}

public record LoginDto(string Email, string Password);
