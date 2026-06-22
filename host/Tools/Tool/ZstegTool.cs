namespace FlagForgeHost.Tools.Tool;

using System.IO;

public class ZstegTool : CommandTool
{
    private static readonly string[] SupportedExtensions = [".png", ".bmp"];

    public override string Name => "zsteg";
    public override string Description => "Detects Steganography In PNG/BMP Images";

    public override string InstallHint => "gem install zsteg";
    protected override string EmptyResultMessage => "No hidden data found.";
    protected override string BuildArguments(string wslPath) => $"zsteg -a \"{wslPath}\"";

    public override bool CanRun(string filePath) =>
        SupportedExtensions.Contains(Path.GetExtension(filePath).ToLowerInvariant());
}
