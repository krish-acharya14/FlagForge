using DiscordRPC;

namespace FlagForgeHost.Services;

public class DiscordService
{
    private readonly DiscordRpcClient _client;
    private readonly string APPLICATION_ID = "1517040582730448979";
    private readonly Timestamps _timestamps = Timestamps.Now;

    private readonly Assets assets = new()
    {
        LargeImageKey = "flagforgeicon",
        LargeImageText = "FlagForge",
        LargeImageUrl = "https://github.com/AaryanKhClasses/FlagForge"
    };

    private readonly Button githubButton = new()
    {
        Label = "GitHub",
        Url = "https://github.com/AaryanKhClasses/FlagForge"
    };

    public DiscordService()
    {
        _client = new DiscordRpcClient(APPLICATION_ID);
        _client.Initialize();
        _client.SetPresence(new RichPresence()
        {
            Details = "Starting App",
            State = "Loading",
            Timestamps = _timestamps,
            Assets = assets,
            // Buttons = [ githubButton ]
        });
    }

    public void UpdateRichPresence(string details, string state)
    {
        _client.SetPresence(new RichPresence()
        {
            Details = details,
            State = state,
            Timestamps = _timestamps,
            Assets = assets,
            // Buttons = [githubButton]
        });
    }

    public void Shutdown()
    {
        _client.Dispose();
    }
}
