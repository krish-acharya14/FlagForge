namespace FlagForgeHost.Tools.Tool;

public class BinwalkTool : CommandTool
{
    public override string Name => "binwalk";
    public override string Description => "Scans For Embedded Data";

    public override string InstallHint => "sudo apt install binwalk";
    protected override string EmptyResultMessage => "No embedded data found.";
    protected override string BuildArguments(string wslPath) => $"binwalk \"{wslPath}\"";
}
