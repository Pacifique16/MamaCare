namespace MamaCare.API.Models;

public enum ArticleStatus { Draft, Published }
public enum ArticleCategory { Nutrition, Safety, MentalHealth, FetalDevelopment, Fitness, Postpartum }

public class LibraryArticle
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Summary { get; set; }
    public string? Content { get; set; }
    public ArticleCategory Category { get; set; }
    public ArticleStatus Status { get; set; } = ArticleStatus.Draft;
    public string? ImageUrl { get; set; }
    public DateTime PublishedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public int ViewCount { get; set; } = 0;
}
