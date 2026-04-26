namespace MamaCare.API.Models;

public enum ArticleRequestStatus { Pending, Reviewed, Dismissed }

public class ArticleRequest
{
    public int Id { get; set; }
    public string Topic { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Category { get; set; }
    public string SubmittedByName { get; set; } = string.Empty;
    public string SubmittedByEmail { get; set; } = string.Empty;
    public ArticleRequestStatus Status { get; set; } = ArticleRequestStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
