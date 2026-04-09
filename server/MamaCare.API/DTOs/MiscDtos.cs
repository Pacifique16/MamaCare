using MamaCare.API.Models;

namespace MamaCare.API.DTOs;

public record MessageDto(
    int Id,
    int MotherId,
    int DoctorId,
    string Content,
    bool SentByDoctor,
    DateTime SentAt,
    bool IsRead
);

public record SendMessageDto(
    int MotherId,
    int DoctorId,
    string Content,
    bool SentByDoctor
);

public record LibraryArticleDto(
    int Id,
    string Title,
    string? Summary,
    ArticleCategory Category,
    ArticleStatus Status,
    string? ImageUrl,
    DateTime PublishedAt,
    DateTime UpdatedAt
);

public record CreateArticleDto(
    string Title,
    string? Summary,
    string? Content,
    ArticleCategory Category,
    string? ImageUrl
);

public record UpdateArticleDto(
    string? Title,
    string? Summary,
    string? Content,
    ArticleCategory? Category,
    ArticleStatus? Status,
    string? ImageUrl
);

public record AdminStatsDto(
    int TotalMothers,
    int TotalDoctors,
    int PendingDoctors,
    int TodayAppointments,
    int HighRiskMothers,
    int ActiveSessions
);
