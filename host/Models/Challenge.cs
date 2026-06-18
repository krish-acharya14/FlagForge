namespace FlagForgeHost.Models;

public class Challenge
{
    public Guid Id { get; set; }
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public List<string> Tags { get; set; } = [];
    public List<string> Attachments { get; set; } = [];
    public string Solution { get; set; } = "";
    public string Flag { get; set; } = "";
    public int Order { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
