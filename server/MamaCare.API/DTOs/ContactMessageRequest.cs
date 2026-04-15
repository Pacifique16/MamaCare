using System.ComponentModel.DataAnnotations;

namespace MamaCare.API.DTOs;

public class ContactMessageRequest
{
    [Required(ErrorMessage = "Name is required.")]
    [MaxLength(100, ErrorMessage = "Name cannot exceed 100 characters.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Please provide a valid email address.")]
    [MaxLength(200, ErrorMessage = "Email cannot exceed 200 characters.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Subject is required.")]
    [MaxLength(200, ErrorMessage = "Subject cannot exceed 200 characters.")]
    public string Subject { get; set; } = string.Empty;

    [Required(ErrorMessage = "Message is required.")]
    [MinLength(10, ErrorMessage = "Message must be at least 10 characters.")]
    [MaxLength(2000, ErrorMessage = "Message cannot exceed 2000 characters.")]
    public string Message { get; set; } = string.Empty;
}
