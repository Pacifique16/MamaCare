using MamaCare.API.Data;
using MamaCare.API.DTOs;
using MamaCare.API.Models;

namespace MamaCare.API.Services;

public class ContactMessagesService : IContactMessagesService
{
    private readonly AppDbContext _db;

    public ContactMessagesService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<ContactMessage> SubmitAsync(ContactMessageRequest request)
    {
        var message = new ContactMessage
        {
            Name    = request.Name.Trim(),
            Email   = request.Email.Trim().ToLowerInvariant(),
            Subject = request.Subject.Trim(),
            Message = request.Message.Trim(),
            CreatedAt = DateTime.UtcNow,
        };

        _db.ContactMessages.Add(message);
        await _db.SaveChangesAsync();
        return message;
    }
}
