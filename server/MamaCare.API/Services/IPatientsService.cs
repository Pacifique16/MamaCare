using MamaCare.API.Models;

namespace MamaCare.API.Services;

public interface IPatientsService
{
    Task<List<Patient>> GetAllAsync();
    Task<Patient?> GetByIdAsync(int id);
    Task<Patient> CreateAsync(Patient patient);
    Task<Patient?> UpdateAsync(int id, Patient patient);
    Task<bool> DeleteAsync(int id);
}
