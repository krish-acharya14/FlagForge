namespace FlagForgeHost.Tools;

public interface ITool
{
    string Name { get; }
    string Description { get; }
    bool CanRun(string filePath);
    Task<List<ToolResult>> ExecuteAsync(string filePath, Dictionary<string, string>? options = null);
}
