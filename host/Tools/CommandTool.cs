namespace FlagForgeHost.Tools;

public abstract class CommandTool : ITool
{
    public abstract string Name { get; }
    public abstract string Description { get; }
    public virtual bool CanRun(string filePath) => true;

    protected virtual string BinaryName => Name;

    public virtual string? InstallHint => null;

    protected virtual string EmptyResultMessage => "No results found.";

    protected abstract string BuildArguments(string wslPath);

    protected virtual string? GetWorkingDirectory(string filePath) => null;

    public virtual async Task<List<ToolResult>> ExecuteAsync(string filePath, Dictionary<string, string> options = null)
    {
        return [await RunAsync(filePath)];
    }

    protected async Task<ToolResult> RunAsync(string filePath)
    {
        var wslPath = ToolExecutor.ToWslPath(filePath);
        var arguments = BuildArguments(wslPath);
        var execResult = await ToolExecutor.RunAsync("wsl", arguments, workingDirectory: GetWorkingDirectory(filePath));

        return Classify(execResult);
    }

    private ToolResult Classify(ProcessExecutionResult execResult)
    {
        if (execResult.LaunchFailed) 
            return new ToolResult
            {
                Type = "Error",
                IsError = true,
                Content = "Couldn't reach WSL. Make sure WSL is installed and try again."
            };
        
        if (ToolExecutor.IndicatesMissingBinary(execResult.ExitCode, execResult.Error, BinaryName))
            return new ToolResult
            {
                Type = "Error",
                IsError = true,
                Content = InstallHint != null ? 
                      $"\"{BinaryName}\" isn't installed in your WSL environment.\nInstall it with: {InstallHint}"
                    : $"\"{BinaryName}\" isn't installed in your WSL environment."
            };
        
        var output = execResult.Output.Trim();
        var error = execResult.Error.Trim();
        var content = output.Length > 0 ? (error.Length > 0 ? $"{output}\n[stderr]: {error}" : output) : (error.Length > 0 ? error : EmptyResultMessage); 

        return new ToolResult{Type = Name, Content = content };       
    }
}