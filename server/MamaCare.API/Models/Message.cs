namespace MamaCare.API.Models;

public class Message
{
    public int Id { get; set; }
    public int MotherId { get; set; }
    public Mother Mother { get; set; } = null!;
    public int DoctorId { get; set; }
    public Doctor Doctor { get; set; } = null!;

    public string Content { get; set; } = string.Empty;
    public bool SentByDoctor { get; set; }
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
    public bool IsRead { get; set; }
}
