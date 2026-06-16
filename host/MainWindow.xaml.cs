using FlagForgeHost.Models;
using Microsoft.Web.WebView2.Core;
using Microsoft.Win32;
using System.IO;
using System.Text.Json;
using System.Windows;

namespace FlagForgeHost;

/// <summary>
/// Interaction logic for MainWindow.xaml
/// </summary>

public partial class MainWindow : Window
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        WriteIndented = true,
        IndentSize = 4,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public MainWindow()
    {
        InitializeComponent();
        Loaded += MainWindow_Loaded;
    }

    private async void MainWindow_Loaded(object sender, RoutedEventArgs e)
    {
        await WebView.EnsureCoreWebView2Async();
        WebView.CoreWebView2.WebMessageReceived += WebMessageReceived;
        WebView.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false;
        WebView.Source = new Uri("http://localhost:5173");
    }

    private async void WebMessageReceived(object? sender, CoreWebView2WebMessageReceivedEventArgs e)
    {
        var json = e.WebMessageAsJson;
        using var document = JsonDocument.Parse(json);
        var root = document.RootElement;
        var type = root.GetProperty("type").GetString();

        switch (type)
        {
            case "pickFolder" : PickFolder(); break;
            case "loadRecentWorkspaces": LoadRecentWorkspaces(); break;
            case "createWorkspace" : CreateWorkspace(root); break;
            case "openWorkspace" : OpenWorkspace(); break;
            case "openRecentWorkspace" : OpenRecentWorkspace(root); break;
            case "loadChallenges": LoadChallenges(root); break;
            case "createChallenge": CreateChallenge(root); break;

            case "minimizeWindow": WindowState = WindowState.Minimized; break;
            case "closeWindow": Close(); break;
        }
    }

    private void SendMessage(object payload)
    {
        var json = JsonSerializer.Serialize(payload);
        WebView.CoreWebView2.PostWebMessageAsJson(json);
    }

    private void PickFolder()
    {
        var dialog = new OpenFolderDialog()
        {
            Title = "Select Workspace Location"
        };

        if (dialog.ShowDialog() != true) return;

        SendMessage(new
        {
            type = "pickFolderResult",
            path = dialog.FolderName
        });
    }

    private string GetRecentWorkspacesPath()
    {
        var appData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
        if(!Directory.Exists(Path.Combine(appData, "FlagForge"))) Directory.CreateDirectory(Path.Combine(appData, "FlagForge"));
        var recentPath = Path.Combine(appData, "FlagForge", "recent.json");
        if (!File.Exists(recentPath)) File.WriteAllText(recentPath, "[]");
        return recentPath;
    }

    private void LoadRecentWorkspaces() {
        var recentWorkspaces = NormalizeRecentWorkspaces(ReadRecentWorkspaces());
        SaveRecentWorkspaces(recentWorkspaces);

        var workspaceObjs = recentWorkspaces.Select(w => new
        {
            id = w.Id,
            name = w.Name,
            location = w.Location,
            path = Path.Combine(w.Location, w.Name),
            updatedAt = w.UpdatedAt
        }).ToArray();

        SendMessage(new
        {
            type = "loadRecentWorkspacesResult",
            workspaces = workspaceObjs
        });
    }

    private void CreateWorkspace(JsonElement root)
    {
        var payload = root.GetProperty("payload");
        var name = payload.GetProperty("name").GetString()!;
        var location = payload.GetProperty("location").GetString()!;

        var workspacePath = Path.Combine(location, name);
        if (Directory.Exists(workspacePath))
        {
            SendMessage(new
            {
                type = "createWorkspaceFailed",
                error = "Workspace already exists."
            });
            return;
        }
        Directory.CreateDirectory(workspacePath);

        var workspace = new Workspace
        {
            Id = Guid.NewGuid(),
            Name = name,
            Location = location,
            Version = 1,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        
        var workspaceJson = JsonSerializer.Serialize(workspace, JsonOptions);
        File.WriteAllText(Path.Combine(workspacePath, "workspace.json"), workspaceJson);

        UpsertRecentWorkspace(workspace);

        SendMessage(new
        {
            type = "createWorkspaceResult",
            path = workspacePath
        });
    }

    private void OpenWorkspace()
    {
        var dialog = new OpenFileDialog()
        {
            Title = "Open Workspace",
            AddExtension = true,
            Filter = "Workspace Files|workspace.json"
        };

        if (dialog.ShowDialog() != true) return;

        var path = dialog.FileName;
        if (!File.Exists(path)) return;
        var workspaceJson = File.ReadAllText(path);
        var workspace = JsonSerializer.Deserialize<Workspace>(workspaceJson, JsonOptions)!;
        workspace.UpdatedAt = DateTime.UtcNow;
        File.WriteAllText(path, JsonSerializer.Serialize(workspace, JsonOptions));

        UpsertRecentWorkspace(workspace);

        SendMessage(new
        {
            type = "openWorkspaceResult",
            workspace = JsonSerializer.Deserialize<JsonElement>(JsonSerializer.Serialize(workspace, JsonOptions))
        });
    }

    private void OpenRecentWorkspace(JsonElement root)
    {
        var payload = root.GetProperty("payload");
        var path = payload.GetProperty("path").GetString()!;
        Console.WriteLine($"Opening recent workspace at path: {path}");
        var filePath = Path.Combine(path, "workspace.json");
        Console.WriteLine($"{filePath}");
        if (!File.Exists(filePath)) return;

        var workspaceJson = File.ReadAllText(filePath);
        var workspace = JsonSerializer.Deserialize<Workspace>(workspaceJson, JsonOptions)!;
        workspace.UpdatedAt = DateTime.UtcNow;
        File.WriteAllText(filePath, JsonSerializer.Serialize(workspace, JsonOptions));

        UpsertRecentWorkspace(workspace);

        SendMessage(new
        {
            type = "openRecentWorkspaceResult",
            workspace = JsonSerializer.Deserialize<JsonElement>(JsonSerializer.Serialize(workspace, JsonOptions))
        });
    }

    private void LoadChallenges(JsonElement root)
    {
        var payload = root.GetProperty("payload");
        var workspacePath = payload.GetProperty("workspacePath").GetString()!;

        var challengesPath = Path.Combine(workspacePath, "challenges");
        if (!Directory.Exists(challengesPath))
        {
            SendMessage(new
            {
                type = "loadChallengesResult",
                challenges = Array.Empty<object>()
            });
            return;
        }

        var challengeFiles = Directory.GetFiles(challengesPath, "challenge.json", SearchOption.AllDirectories);
        var challenges = new List<object>();

        foreach (var file in challengeFiles)
        {
            var challengeJson = File.ReadAllText(file);
            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            var challenge = JsonSerializer.Deserialize<Challenge>(challengeJson, options);
            if (challenge != null)
            {
                var challengeObj = new
                {
                    id = challenge.Id,
                    title = challenge.Title,
                    description = challenge.Description,
                    tags = challenge.Tags,
                    solution = challenge.Solution,
                    flag = challenge.Flag,
                    createdAt = challenge.CreatedAt,
                    updatedAt = challenge.UpdatedAt
                };
                challenges.Add(challengeObj);
            }
        }

        SendMessage(new
        {
            type = "loadChallengesResult",
            challenges
        });
    }

    private void CreateChallenge(JsonElement root)
    {
        var payload = root.GetProperty("payload");
        var workspacePath = payload.GetProperty("workspacePath").GetString()!;
        var challengeName = payload.GetProperty("challengeName").GetString()!;

        var challengePath = Path.Combine(workspacePath, "challenges", challengeName);
        if (Directory.Exists(challengePath))
        {
            SendMessage(new
            {
                type = "createChallengeFailed",
                error = "Challenge already exists."
            });
            return;
        }
        Directory.CreateDirectory(challengePath);

        var challenge = new Challenge
        {
            Id = Guid.NewGuid(),
            Title = challengeName,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var challengeJson = JsonSerializer.Serialize(challenge, JsonOptions);
        File.WriteAllText(Path.Combine(challengePath, "challenge.json"), challengeJson);

        SendMessage(new
        {
            type = "createChallengeResult",
            path = challengePath
        });
    }

    private List<Workspace> ReadRecentWorkspaces()
    {
        var recentPath = GetRecentWorkspacesPath();
        var recentJson = File.ReadAllText(recentPath);
        return JsonSerializer.Deserialize<List<Workspace>>(recentJson, JsonOptions) ?? new List<Workspace>();
    }

    private void SaveRecentWorkspaces(List<Workspace> recentWorkspaces)
    {
        var recentPath = GetRecentWorkspacesPath();
        File.WriteAllText(recentPath, JsonSerializer.Serialize(recentWorkspaces, JsonOptions));
    }

    private static string GetWorkspacePath(Workspace workspace)
    {
        return Path.Combine(workspace.Location, workspace.Name);
    }

    private static bool WorkspacePathsMatch(Workspace left, Workspace right)
    {
        return StringComparer.OrdinalIgnoreCase.Equals(GetWorkspacePath(left), GetWorkspacePath(right));
    }

    private List<Workspace> NormalizeRecentWorkspaces(IEnumerable<Workspace> recentWorkspaces)
    {
        var normalized = new List<Workspace>();

        foreach (var workspace in recentWorkspaces)
        {
            normalized.RemoveAll(existing => WorkspacePathsMatch(existing, workspace));
            normalized.Add(workspace);
        }

        return normalized;
    }

    private void UpsertRecentWorkspace(Workspace workspace)
    {
        var recentWorkspaces = NormalizeRecentWorkspaces(ReadRecentWorkspaces());
        recentWorkspaces.RemoveAll(existing => WorkspacePathsMatch(existing, workspace));
        recentWorkspaces.Add(workspace);
        SaveRecentWorkspaces(recentWorkspaces);
    }
}
