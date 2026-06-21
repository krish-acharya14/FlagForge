namespace FlagForgeHost.Tools;

public abstract class CommandTool : ITool
{
    public abstract string Name { get; }
    public abstract string Description { get; }
    public virtual bool CanRun(string filePath) => true;
    public abstract Task<List<ToolResult>> ExecuteAsync(string filePath, Dictionary<string, string>? options = null);
}
