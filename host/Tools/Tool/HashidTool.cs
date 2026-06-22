namespace FlagForgeHost.Tools.Tool;

public class HashidTool : CommandTool
{
    public override string Name => "hashid";
    public override string Description => "Identifies Hash Types Used In A File";

    public override string InstallHint => "pip3 install hashid";
    protected override string EmptyResultMessage => "No recognizable hashes found.";
    protected override string BuildArguments(string wslPath) => $"hashid -f \"{wslPath}\"";
}
