using MamaCare.API.DTOs;
using MamaCare.API.Models;

namespace MamaCare.API.Services;

public interface IPatientsService
{
    Task<List<Patient>> GetAllAsync();
    Task<Patient?> GetByIdAsync(int id);
    Task<Patient> CreateAsync(PatientRequest request);
    Task<Patient?> UpdateAsync(int id, PatientRequest request);
    Task<bool> DeleteAsync(int id);
}
