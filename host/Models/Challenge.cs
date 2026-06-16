namespace FlagForgeHost.Models;

public class Challenge
{
    public Guid Id { get; set; }
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string[] Tags { get; set; } = Array.Empty<string>();
    public string Solution { get; set; } = "";
    public string Flag { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
