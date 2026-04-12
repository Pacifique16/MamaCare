using System.ComponentModel.DataAnnotations;

namespace MamaCare.API.Models;

public class Patient
{
    public int Id { get; set; }

    [Required]
    public string FullName { get; set; } = string.Empty;

    public DateTime DateOfBirth { get; set; }

    public string? PhoneNumber { get; set; }

    public string? Address { get; set; }

    public int WeeksPregnant { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
