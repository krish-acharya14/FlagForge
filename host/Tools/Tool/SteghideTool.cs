namespace FlagForgeHost.Tools.Tool;

using System.IO;

public class SteghideTool : CommandTool
{
    private static readonly string[] SupportedExtensions = [".jpg", ".jpeg", ".bmp", ".wav", ".au"];

    public override string Name => "steghide";
    public override string Description => "Detects Hidden Files";

    public override string InstallHint => "sudo apt install steghide";
    protected override string EmptyResultMessage => "No information found.";
    protected override string BuildArguments(string wslPath) => $"steghide info \"{wslPath}\"";

    public override bool CanRun(string filePath) =>
        SupportedExtensions.Contains(Path.GetExtension(filePath).ToLowerInvariant());
}
