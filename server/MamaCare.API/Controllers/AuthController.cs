using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MamaCare.API.Data;
using MamaCare.API.Models;

namespace MamaCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly string _jwtSecret;

    public AuthController(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET")
            ?? config["Jwt:Secret"]
            ?? "mamacare-dev-secret-key-change-in-production";
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized(new { error = "Invalid email or password" });

        object profile;
        if (user.Role == UserRole.Mother)
        {
            var mother = await _db.Mothers.FirstOrDefaultAsync(m => m.UserId == user.Id);
            profile = new { id = user.Id, motherId = mother?.Id, role = "Mother", name = user.FullName, email = user.Email };
        }
        else if (user.Role == UserRole.Doctor)
        {
            var doctor = await _db.Doctors.FirstOrDefaultAsync(d => d.UserId == user.Id);
            profile = new { id = user.Id, doctorId = doctor?.Id, role = "Doctor", name = user.FullName, email = user.Email };
        }
        else
        {
            profile = new { id = user.Id, role = "Admin", name = user.FullName, email = user.Email };
        }

        var token = GenerateToken(user);
        return Ok(new { token, user = profile });
    }

    private string GenerateToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSecret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
        };
        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public record LoginDto(string Email, string Password);
