using FlagForgeHost.Tools.Tool;

namespace FlagForgeHost.Tools;

public static class ToolRegistry
{
    private static readonly List<ITool> _tools = [
        new FileTool(),
        new ExiftoolTool(),
        new StringsTool(),
        new XxdTool(),
        new BinwalkTool(),
        new EntropyTool(),
        new SteghideTool(),
        new ZstegTool(),
        new HashidTool(),
        new WiresharkTool(),
        new PngfixTool(),
        new ZbarimgTool()
    ];

    public static IEnumerable<ITool> GetAvailableTools(string filePath)
    {
        return _tools.Where(t => t.CanRun(filePath));
    }

    public static ITool? GetTool(string name)
    {
        return _tools.FirstOrDefault(x => x.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
    }
}
