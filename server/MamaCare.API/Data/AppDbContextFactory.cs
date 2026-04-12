using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace MamaCare.API.Data;

/// <summary>
/// Used only by EF Core CLI tools (migrations) at design time.
/// Never runs in production.
/// </summary>
public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseNpgsql("Host=localhost;Port=5432;Database=mamacare;Username=postgres;Password=1234")
            .Options;

        return new AppDbContext(options);
    }
}
