namespace FlagForgeHost.Tools.Tool;

using System.IO;

public class PngfixTool : CommandTool
{
    public override string Name => "pngfix";
    public override string Description => "Repairs Corrupted PNG Files";

    public override string InstallHint => "sudo apt install libpng-tools";
    protected override string EmptyResultMessage => "No issues found.";
    protected override string BuildArguments(string wslPath) => $"pngfix \"{wslPath}\"";
    protected override string? GetWorkingDirectory(string filePath) => Path.GetDirectoryName(filePath);

    public override bool CanRun(string filePath) =>
        Path.GetExtension(filePath).Equals(".png", StringComparison.OrdinalIgnoreCase);

    public override async Task<List<ToolResult>> ExecuteAsync(string filePath, Dictionary<string, string>? options = null)
    {
        var result = await RunAsync(filePath);

        if (!result.IsError)
            result.Metadata = new Dictionary<string, object> {
                ["repairedFile"] = $"fix-{Path.GetFileName(filePath)}"
            };

        return [result];
    }
}
