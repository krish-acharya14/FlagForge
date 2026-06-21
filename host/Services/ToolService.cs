using FlagForgeHost.Tools;

namespace FlagForgeHost.Services;

public static class ToolService
{
    public static async Task<List<ToolResult>> ExecuteToolAsync(string toolName, string filePath)
    {
        var tool = ToolRegistry.GetTool(toolName);
        if (tool == null) return [];
        return await tool.ExecuteAsync(filePath);
    }

    public static async Task<List<ToolResult>> ExecuteAllToolsAsync(string filePath)
    {
        var results = new List<ToolResult>();
        foreach (var tool in ToolRegistry.GetAvailableTools(filePath))
        {
            var toolResults = await tool.ExecuteAsync(filePath);
            results.AddRange(toolResults);
        }
        return results;
    }
}
    