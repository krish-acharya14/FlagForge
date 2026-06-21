namespace FlagForgeHost.Tools;

public class ToolResult
{
    public string Type { get; set; } = "Generic";
    public string? Content { get; set; }
    public Dictionary<string, object>? Metadata { get; set; }
}
