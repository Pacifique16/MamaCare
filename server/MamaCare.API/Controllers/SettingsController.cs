using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using MamaCare.API.Data;
using MamaCare.API.Models;

namespace MamaCare.API.Controllers;

[ApiController]
[Route("api/settings")]
[Authorize]
public class SettingsController : ControllerBase
{
    private readonly AppDbContext _db;
    public SettingsController(AppDbContext db) => _db = db;

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _db.Users.FindAsync(userId);
        if (user is null) return NotFound();
        return Ok(new {
            user.Id, user.FullName, user.Email,
            user.PhoneNumber, user.ProfileImageUrl, user.Role
        });
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _db.Users.FindAsync(userId);
        if (user is null) return NotFound();

        if (!string.IsNullOrWhiteSpace(dto.FullName)) user.FullName = dto.FullName.Trim();
        if (dto.PhoneNumber is not null) user.PhoneNumber = dto.PhoneNumber.Trim() == "" ? null : dto.PhoneNumber.Trim();
        if (dto.ProfileImageUrl is not null) user.ProfileImageUrl = dto.ProfileImageUrl;
        if (!string.IsNullOrWhiteSpace(dto.Email) && dto.Email != user.Email)
        {
            var emailTaken = await _db.Users.AnyAsync(u => u.Email == dto.Email.Trim() && u.Id != userId);
            if (emailTaken) return BadRequest(new { message = "This email is already in use." });
            user.Email = dto.Email.Trim();
        }

        await _db.SaveChangesAsync();
        return Ok(new { user.Id, user.FullName, user.Email, user.PhoneNumber, user.ProfileImageUrl });
    }

    [HttpPut("password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _db.Users.FindAsync(userId);
        if (user is null) return NotFound();

        if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
            return BadRequest(new { message = "Current password is incorrect." });

        if (dto.NewPassword.Length < 6)
            return BadRequest(new { message = "New password must be at least 6 characters." });

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Password updated successfully." });
    }
}

public record UpdateProfileDto(string? FullName, string? Email, string? PhoneNumber, string? ProfileImageUrl);
public record ChangePasswordDto(string CurrentPassword, string NewPassword);
