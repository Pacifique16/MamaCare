# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY MamaCare.API/MamaCare.API.csproj MamaCare.API/
RUN dotnet restore MamaCare.API/MamaCare.API.csproj

# Copy everything else and build
COPY MamaCare.API/ MamaCare.API/
WORKDIR /src/MamaCare.API
RUN dotnet publish MamaCare.API.csproj -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

# Render injects PORT at runtime — default to 8080
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "MamaCare.API.dll"]
