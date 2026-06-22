namespace FlagForgeHost.Tools.Tool;

using System.IO;

public class WiresharkTool : CommandTool
{
    private static readonly string[] SupportedExtensions = [".pcap", ".pcapng", ".cap"];

    public override string Name => "wireshark";
    public override string Description => "Explores Packet Capture Files";

    protected override string BinaryName => "wireshark";
    public override string InstallHint => "sudo apt install wireshark";
    protected override string EmptyResultMessage => "No packets found.";
    protected override string BuildArguments(string wslPath) => $"wireshark \"{wslPath}\"";

    public override bool CanRun(string filePath) =>
        SupportedExtensions.Contains(Path.GetExtension(filePath).ToLowerInvariant());
}
