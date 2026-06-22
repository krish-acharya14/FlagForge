namespace FlagForgeHost.Tools.Tool;

public class ExiftoolTool : CommandTool
{
    public override string Name => "exiftool";
    public override string Description => "Extracts Metadata";

    public override string InstallHint => "sudo apt install libimage-exiftool-perl";
    protected override string EmptyResultMessage => "No metadata found.";
    protected override string BuildArguments(string wslPath) => $"exiftool \"{wslPath}\"";
}
