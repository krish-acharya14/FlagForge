namespace FlagForgeHost.Tools.Tool;

public class XxdTool : CommandTool
{
    public override string Name => "xxd";
    public override string Description => "Displays Hex Dump";

    public override string InstallHint => "sudo apt install xxd";
    protected override string EmptyResultMessage => "Unable to read file.";

    protected override string BuildArguments(string wslPath) => $"xxd -l 16384 \"{wslPath}\"";
}
