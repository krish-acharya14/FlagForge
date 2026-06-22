namespace FlagForgeHost.Tools.Tool;

public class FileTool : CommandTool
{
    public override string Name => "file";

    public override string Description => "Detects File Type";

    public override string InstallHint => "sudo apt install file";

    protected override string BuildArguments(string wslPath) => $"file \"{wslPath}\"";

    public override async Task<List<ToolResult>> ExecuteAsync(string filePath, Dictionary<string, string>? options = null)
    {
        var result = await RunAsync(filePath);

        var content = result.Content;
        if (!result.IsError && content != null)
            result.Content = content[(content.IndexOf(':') + 1)..].Trim();

        return [result];
    }
}
