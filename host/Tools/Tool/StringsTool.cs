namespace FlagForgeHost.Tools.Tool;

public class StringsTool : CommandTool
{
    public override string Name => "strings";
    public override string Description => "Extracts Printable Strings";

    public override string InstallHint => "sudo apt install binutils";
    protected override string EmptyResultMessage => "No strings found.";
    protected override string BuildArguments(string wslPath) => $"strings -n 4 \"{wslPath}\"";
}
