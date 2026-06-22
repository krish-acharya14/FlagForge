using System.Diagnostics;
using System.IO;

namespace FlagForgeHost.Tools;

public class ProcessExecutionResult
{
    public string Output { get; init; } = "";
    public string Error { get; init; } = "";
    public int ExitCode { get; init; }

    // True when the executable we tried to launch (e.g. "wsl" itself) couldn't be started at all.
    public bool LaunchFailed { get; init; }
}

public static class ToolExecutor
{
    public static string ToWslPath(string windowsPath)
    {
        var driveLetter = char.ToLower(windowsPath[0]);
        return $"/mnt/{driveLetter}{windowsPath.Substring(2).Replace("\\", "/")}";
    }

    public static async Task<ProcessExecutionResult> RunAsync(string executable, string arguments = "", Dictionary<string, string>? envVars = null, string? workingDirectory = null)
    {
        try
        {
            var startInfo = new ProcessStartInfo(executable, arguments)
            {
                UseShellExecute = false,
                RedirectStandardError = true,
                RedirectStandardOutput = true,
                CreateNoWindow = true
            };

            if (!string.IsNullOrEmpty(workingDirectory))
                startInfo.WorkingDirectory = workingDirectory;

            if (envVars != null)
                foreach (var env in envVars) startInfo.Environment[env.Key] = env.Value;

            using var process = new Process { StartInfo = startInfo };
            process.Start();

            string stdOut = await process.StandardOutput.ReadToEndAsync();
            string stdErr = await process.StandardError.ReadToEndAsync();

            await process.WaitForExitAsync();

            return new ProcessExecutionResult { Output = stdOut, Error = stdErr, ExitCode = process.ExitCode };
        }
        catch
        {
            return new ProcessExecutionResult { LaunchFailed = true, ExitCode = -1 };
        }
    }

    public static bool IndicatesMissingBinary(int exitCode, string? stdErr, string binaryName)
    {
        if (exitCode == 127) return true;
        if (string.IsNullOrWhiteSpace(stdErr)) return false;

        var lower = stdErr.ToLowerInvariant();
        var name = binaryName.ToLowerInvariant();

        return lower.Contains("command not found")
            || lower.Contains($"{name}: not found")
            || lower.Contains("createprocessentrycommon")
            || (lower.Contains(name) && lower.Contains("no such file or directory"));
    }
}
