using MamaCare.API.DTOs;
using MamaCare.API.Models;

namespace MamaCare.API.Services;

public interface IContactMessagesService
{
    Task<ContactMessage> SubmitAsync(ContactMessageRequest request);
}
