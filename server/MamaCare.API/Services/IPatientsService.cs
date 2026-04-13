using MamaCare.API.Models;

namespace MamaCare.API.Services;

public interface IPatientsService
{
    Task<List<Patient>> GetAllAsync();
    Task<Patient?> GetByIdAsync(int id);
}
