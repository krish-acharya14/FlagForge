namespace FlagForgeHost.Tools.Tool;

using System.IO;

public class ZbarimgTool : CommandTool
{
    private static readonly string[] SupportedExtensions = [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".tiff", ".pnm"];

    public override string Name => "zbarimg";
    public override string Description => "Scans For Barcodes / QR Codes";

    public override string InstallHint => "sudo apt install zbar-tools";
    protected override string EmptyResultMessage => "No barcodes or QR codes found.";
    protected override string BuildArguments(string wslPath) => $"zbarimg \"{wslPath}\"";

    public override bool CanRun(string filePath) =>
        SupportedExtensions.Contains(Path.GetExtension(filePath).ToLowerInvariant());
}
