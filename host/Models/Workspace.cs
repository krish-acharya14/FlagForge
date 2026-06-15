namespace FlagForgeHost.Models;

public class Workspace
{
    public Guid Id { get; set; }
    public string Name { get; set; } = "";
    public int Version { get; set; }
    public DateTime CreatedAt { get; set; }
}