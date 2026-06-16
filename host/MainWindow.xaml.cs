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
            case "createdWorkspace" : CreateWorkspace(root); break;
            case "openWorkspace" : OpenWorkspace(); break;
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
            UpdatedAt = DateTime.UtcNow,
        };
        
        var workspaceJson = JsonSerializer.Serialize(workspace, new JsonSerializerOptions { WriteIndented = true, IndentSize = 4, PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
        File.WriteAllText(Path.Combine(workspacePath, "workspace.json"), workspaceJson);

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
            Filter = "Workspace Files|workspace.json",
        };

        if (dialog.ShowDialog() != true) return;

        var path = dialog.FileName;
        if (!File.Exists(path)) return;

        var workspaceJson = File.ReadAllText(path);
        SendMessage(new
        {
            type = "openWorkspaceResult",
            workspace = JsonSerializer.Deserialize<JsonElement>(workspaceJson)
        });
    }
}
