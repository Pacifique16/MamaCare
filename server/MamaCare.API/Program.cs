using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using MamaCare.API.Data;
using Npgsql.EntityFrameworkCore.PostgreSQL;

var builder = WebApplication.CreateBuilder(args);

// Use PORT env variable for Render deployment
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
string? connectionString;
if (!string.IsNullOrEmpty(databaseUrl))
{
    // Convert postgresql://user:pass@host:port/db to Npgsql format
    var uri = new Uri(databaseUrl);
    var userInfo = uri.UserInfo.Split(':');
    connectionString = $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.TrimStart('/')};Username={userInfo[0]};Password={userInfo[1]}";
}
else
{
    connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Allow local dev + production frontend (update FRONTEND_URL on Render)
var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL") ?? "";
var allowedOrigins = new List<string>
{
    "http://localhost:5173",
    "http://localhost:5174",
};
if (!string.IsNullOrEmpty(frontendUrl))
    allowedOrigins.Add(frontendUrl);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
        policy.WithOrigins(allowedOrigins.ToArray())
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

app.UseCors("AllowReact");
app.UseAuthorization();
app.MapControllers();

app.Run();
