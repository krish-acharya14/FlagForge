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
            case "updateChallenge": UpdateChallenge(root); break;
            case "createReadme": CreateReadme(root); break;
            case "addAttachments": AddAttachments(root); break;

            case "minimizeWindow": WindowState = WindowState.Minimized; break;
            case "closeWindow": Close(); break;
        }
    }

    private void SendMessage(object payload)
    {
        var json = JsonSerializer.Serialize(payload);
        WebView.CoreWebView2.PostWebMessageAsJson(json);
    }

    private static string GetRecentWorkspacesPath()
    {
        var appData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
        if (!Directory.Exists(Path.Combine(appData, "FlagForge"))) Directory.CreateDirectory(Path.Combine(appData, "FlagForge"));
        var recentPath = Path.Combine(appData, "FlagForge", "recent.json");
        if (!File.Exists(recentPath)) File.WriteAllText(recentPath, "[]");
        return recentPath;
    }

    private static List<Workspace> ReadRecentWorkspaces()
    {
        var recentPath = GetRecentWorkspacesPath();
        var recentJson = File.ReadAllText(recentPath);
        return JsonSerializer.Deserialize<List<Workspace>>(recentJson, JsonOptions) ?? [];
    }

    private static void SaveRecentWorkspaces(List<Workspace> recentWorkspaces)
    {
        var recentPath = GetRecentWorkspacesPath();
        File.WriteAllText(recentPath, JsonSerializer.Serialize(recentWorkspaces, JsonOptions));
    }

    private static string GetWorkspacePath(Workspace workspace)
    {
        return Path.Combine(workspace.Path, workspace.Name);
    }

    private static bool WorkspacePathsMatch(Workspace left, Workspace right)
    {
        return StringComparer.OrdinalIgnoreCase.Equals(GetWorkspacePath(left), GetWorkspacePath(right));
    }

    private static bool HasInvalidChallengeTitle(string title)
    {
        return title.IndexOfAny(Path.GetInvalidFileNameChars()) >= 0;
    }

    private static string GetChallengesRoot(string workspacePath)
    {
        return Path.Combine(workspacePath, "challenges");
    }

    private static string? FindChallengeFile(string workspacePath, Guid challengeId)
    {
        var challengesRoot = GetChallengesRoot(workspacePath);
        if (!Directory.Exists(challengesRoot)) return null;

        foreach (var file in Directory.GetFiles(challengesRoot, "challenge.json", SearchOption.AllDirectories))
        {
            var challengeJson = File.ReadAllText(file);
            var challenge = JsonSerializer.Deserialize<Challenge>(challengeJson, JsonOptions);
            if (challenge?.Id == challengeId) return file;
        }

        return null;
    }

    private static Challenge? ReadChallengeFile(string challengeFilePath)
    {
        if (!File.Exists(challengeFilePath)) return null;

        var challengeJson = File.ReadAllText(challengeFilePath);
        return JsonSerializer.Deserialize<Challenge>(challengeJson, JsonOptions);
    }

    private static List<Challenge> ReadChallenges(string workspacePath)
    {
        var challengesRoot = GetChallengesRoot(workspacePath);
        if (!Directory.Exists(challengesRoot)) return [];

        var challengeFiles = Directory.GetFiles(challengesRoot, "challenge.json", SearchOption.AllDirectories);
        var challenges = new List<Challenge>();

        foreach (var file in challengeFiles)
        {
            var challenge = ReadChallengeFile(file);
            if (challenge != null) challenges.Add(challenge);
        }

        return challenges;
    }

    private static object ToChallengePayload(Challenge challenge)
    {
        return new
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
    }

    private void SendChallengeResult(string type, Challenge challenge)
    {
        SendMessage(new
        {
            type,
            data = ToChallengePayload(challenge)
        });
    }

    private static List<Workspace> NormalizeRecentWorkspaces(IEnumerable<Workspace> recentWorkspaces)
    {
        var normalized = new List<Workspace>();

        foreach (var workspace in recentWorkspaces)
        {
            normalized.RemoveAll(existing => WorkspacePathsMatch(existing, workspace));
            normalized.Add(workspace);
        }

        return normalized;
    }

    private static void UpsertRecentWorkspace(Workspace workspace)
    {
        var recentWorkspaces = NormalizeRecentWorkspaces(ReadRecentWorkspaces());
        recentWorkspaces.RemoveAll(existing => WorkspacePathsMatch(existing, workspace));
        recentWorkspaces.Add(workspace);
        SaveRecentWorkspaces(recentWorkspaces);
    }

    private void PickFolder()
    {
        var dialog = new OpenFolderDialog() { Title = "Select Workspace Location" };
        if (dialog.ShowDialog() != true) return;

        SendMessage(new
        {
            type = "pickFolderResult",
            data = dialog.FolderName
        });
    }

    private void LoadRecentWorkspaces() {
        var recentWorkspaces = NormalizeRecentWorkspaces(ReadRecentWorkspaces());
        recentWorkspaces.RemoveAll(w => !Directory.Exists(w.Path));
        SaveRecentWorkspaces(recentWorkspaces);

        var workspaceObjs = recentWorkspaces.Select(w => new
        {
            id = w.Id,
            name = w.Name,
            path = w.Path,
            updatedAt = w.UpdatedAt
        }).ToArray();

        SendMessage(new
        {
            type = "loadRecentWorkspacesResult",
            data = workspaceObjs
        });
    }

    private void CreateWorkspace(JsonElement root)
    {
        var payload = root.GetProperty("payload");
        var name = payload.GetProperty("name").GetString()!;
        var path = payload.GetProperty("path").GetString()!;

        if (Directory.Exists(path))
        {
            SendMessage(new
            {
                type = "createWorkspaceFailed",
                error = "Workspace already exists."
            });
            return;
        }
        Directory.CreateDirectory(path);

        var workspace = new Workspace
        {
            Id = Guid.NewGuid(),
            Name = name,
            Path = path,
            Version = 1,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        
        var workspaceJson = JsonSerializer.Serialize(workspace, JsonOptions);
        File.WriteAllText(Path.Combine(path, "workspace.json"), workspaceJson);

        UpsertRecentWorkspace(workspace);

        SendMessage(new
        {
            type = "createWorkspaceResult",
            data = path
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
            data = JsonSerializer.Deserialize<JsonElement>(JsonSerializer.Serialize(workspace, JsonOptions))
        });
    }

    private void OpenRecentWorkspace(JsonElement root)
    {
        var payload = root.GetProperty("payload");
        var path = payload.GetProperty("path").GetString()!;
        var filePath = Path.Combine(path, "workspace.json");
        if (!File.Exists(filePath)) return;

        var workspaceJson = File.ReadAllText(filePath);
        var workspace = JsonSerializer.Deserialize<Workspace>(workspaceJson, JsonOptions)!;
        workspace.UpdatedAt = DateTime.UtcNow;
        File.WriteAllText(filePath, JsonSerializer.Serialize(workspace, JsonOptions));

        UpsertRecentWorkspace(workspace);

        SendMessage(new
        {
            type = "openRecentWorkspaceResult",
            data = JsonSerializer.Deserialize<JsonElement>(JsonSerializer.Serialize(workspace, JsonOptions))
        });
    }

    private void LoadChallenges(JsonElement root)
    {
        var payload = root.GetProperty("payload");
        var path = payload.GetProperty("path").GetString()!;

        var challenges = ReadChallenges(path).Select(ToChallengePayload).ToArray();

        SendMessage(new
        {
            type = "loadChallengesResult",
            data = challenges
        });
    }

    private void CreateChallenge(JsonElement root)
    {
        var payload = root.GetProperty("payload");
        var path = payload.GetProperty("path").GetString()!;
        var title = payload.GetProperty("title").GetString()!;

        if (string.IsNullOrWhiteSpace(title) || HasInvalidChallengeTitle(title))
        {
            SendMessage(new
            {
                type = "createChallengeFailed",
                error = "Challenge title contains invalid file name characters."
            });
            return;
        }

        var challengePath = Path.Combine(GetChallengesRoot(path), title);
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
            Title = title,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var challengeJson = JsonSerializer.Serialize(challenge, JsonOptions);
        File.WriteAllText(Path.Combine(challengePath, "challenge.json"), challengeJson);

        SendMessage(new
        {
            type = "createChallengeResult",
            data = challengePath
        });
    }

    private void UpdateChallenge(JsonElement root)
    {
        var payload = root.GetProperty("payload");
        var workspacePath = payload.GetProperty("path").GetString()!;
        var challengeId = payload.GetProperty("id").GetGuid();

        var challengeFilePath = FindChallengeFile(workspacePath, challengeId);
        if (challengeFilePath == null)
        {
            SendMessage(new
            {
                type = "updateChallengeFailed",
                error = "Challenge not found."
            });
            return;
        }

        var challenge = ReadChallengeFile(challengeFilePath);
        if (challenge == null)
        {
            SendMessage(new
            {
                type = "updateChallengeFailed",
                error = "Challenge could not be read."
            });
            return;
        }

        if (payload.TryGetProperty("description", out var descriptionElement)) challenge.Description = descriptionElement.GetString() ?? "";
        if (payload.TryGetProperty("solution", out var solutionElement)) challenge.Solution = solutionElement.GetString() ?? "";
        if (payload.TryGetProperty("flag", out var flagElement)) challenge.Flag = flagElement.GetString() ?? "";
        if (payload.TryGetProperty("tags", out var tagsElement)) challenge.Tags = [..tagsElement.EnumerateArray().Select(t => t.GetString() ?? "")];

        challenge.UpdatedAt = DateTime.UtcNow;
        File.WriteAllText(challengeFilePath, JsonSerializer.Serialize(challenge, JsonOptions));

        SendChallengeResult("updateChallengeResult", challenge);
    }

    private void CreateReadme(JsonElement root)
    {
        var payload = root.GetProperty("payload");
        var workspacePath = payload.GetProperty("path").GetString()!;
        var challengeTitle = payload.GetProperty("title").GetString()!;
        
        var challengePath = Path.Combine(GetChallengesRoot(workspacePath), challengeTitle);
        var challengeFilePath = Path.Combine(challengePath, "challenge.json");
        var challengeJson = ReadChallengeFile(challengeFilePath);
        if (challengeJson == null)
        {
            SendMessage(new
            {
                type = "createReadmeFailed",
                error = "Challenge not found."
            });
            return;
        }

        var readmePath = Path.Combine(challengePath, "README.md");
        if(!File.Exists(readmePath)) File.Create(readmePath).Dispose();
        var tags = string.Join(", ", challengeJson.Tags.Select(tag => $"`{tag}`"));
        var readmeContent = $"""
            # {challengeTitle}
            ---

            Tags: {tags}

            ---

            ## Description
            {challengeJson.Description}

            ---

            ## Solution
            {challengeJson.Solution}

            ---

            ## Flag
            {challengeJson.Flag}

            """;
        File.WriteAllText(readmePath, readmeContent);
        SendMessage(new { type = "createReadmeResult" });
    }

    private void AddAttachments(JsonElement root)
    {
        var payload = root.GetProperty("payload");
        var path = payload.GetProperty("path").GetString()!;
        var challengeId = payload.GetProperty("id").GetGuid();

        var challengeFilePath = FindChallengeFile(path, challengeId);
        if (challengeFilePath == null)
        {
            SendMessage(new
            {
                type = "addAttachmentsFailed",
                error = "Challenge not found."
            });
            return;
        }

        var challenge = ReadChallengeFile(challengeFilePath);
        if (challenge == null)
        {
            SendMessage(new
            {
                type = "addAttachmentsFailed",
                error = "Challenge could not be read."
            });
            return;
        }
        var challengePath = Path.GetDirectoryName(challengeFilePath)!;

        var newAttachments = new List<string>();
        foreach (var attachment in payload.GetProperty("attachmentData").EnumerateArray())
        {
            var fileName = attachment.GetProperty("name").GetString()!;
            var fileContentBase64 = attachment.GetProperty("content").GetString()!;

            var originalFileName = Path.GetFileNameWithoutExtension(fileName);
            var extension = Path.GetExtension(fileName);
            var counter = 1;
            while (File.Exists(Path.Combine(challengePath, fileName)))
            {
                fileName = $"{originalFileName} ({counter}){extension}";
                counter++;
            }

            var filePath = Path.Combine(challengePath, fileName);
            File.WriteAllBytes(filePath, Convert.FromBase64String(fileContentBase64));
            newAttachments.Add(fileName);
        }

        challenge.Attachments = challenge.Attachments.Concat(newAttachments).ToArray();
        challenge.UpdatedAt = DateTime.UtcNow;
        File.WriteAllText(challengeFilePath, JsonSerializer.Serialize(challenge, JsonOptions));

        SendChallengeResult("addAttachmentsResult", challenge);
    }
}
