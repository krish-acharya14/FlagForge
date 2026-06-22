namespace FlagForgeHost.Tools.Tool;

public class EntropyTool : CommandTool
{
    public override string Name => "entropy";
    public override string Description => "Checks File Entropy For Hidden Data";

    protected override string BinaryName => "binwalk";
    public override string InstallHint => "sudo apt install binwalk";
    protected override string EmptyResultMessage => "Unable to calculate entropy.";
    protected override string BuildArguments(string wslPath) => $"binwalk -E \"{wslPath}\"";
}
