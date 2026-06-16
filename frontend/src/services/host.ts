import type { Challenge, Workspace } from '../utils/types'

export async function pickFolder(): Promise<string | null> {
    return new Promise((resolve) => {
        const handler = (event: MessageEvent) => {
            const data = event.data
            if(data.type === "pickFolderResult") {
                window.chrome?.webview?.removeEventListener("message", handler)
                resolve(data.path)
            }
        }

        window.chrome?.webview?.addEventListener("message", handler)
        window.chrome?.webview?.postMessage({ type: "pickFolder" })
    })
}

export async function loadRecentWorkspaces(): Promise<Workspace[]> {
    return new Promise((resolve) => {
        const handler = (event: MessageEvent) => {
            const data = event.data
            if(data.type === "loadRecentWorkspacesResult") {
                window.chrome?.webview?.removeEventListener("message", handler)
                resolve(data.workspaces ?? [])
            }
        }

        window.chrome?.webview?.addEventListener("message", handler)
        window.chrome?.webview?.postMessage({ type: "loadRecentWorkspaces" })
    })
}

export async function createWorkspace(name: string, location: string): Promise<string | null> {
    return new Promise((resolve) => {
        const handler = (event: MessageEvent) => {
            const data = event.data
            if(data.type === "createWorkspaceResult") {
                window.chrome?.webview?.removeEventListener("message", handler)
                resolve(data.path)
            }
            // ! TODO handle createWorkspaceFailed case
        }

        window.chrome?.webview?.addEventListener("message", handler)
        window.chrome?.webview?.postMessage({
            type: "createWorkspace",
            payload: { name, location }
        })
    })
}

export async function openWorkspace(): Promise<Workspace> {
    return new Promise((resolve) => {
        const handler = (event: MessageEvent) => {
            const data = event.data
            if(data.type === "openWorkspaceResult") {
                window.chrome?.webview?.removeEventListener("message", handler)
                resolve(data.workspace)
            }
        }

        window.chrome?.webview?.addEventListener("message", handler)
        window.chrome?.webview?.postMessage({ type: "openWorkspace" })
    })
}

export async function openRecentWorkspace(path: string): Promise<Workspace> {
    return new Promise((resolve) => {
        const handler = (event: MessageEvent) => {
            const data = event.data
            if(data.type === "openRecentWorkspaceResult") {
                window.chrome?.webview?.removeEventListener("message", handler)
                console.log(data)
                resolve(data.workspace)
            }
        }

        window.chrome?.webview?.addEventListener("message", handler)
        window.chrome?.webview?.postMessage({
            type: "openRecentWorkspace",
            payload: { path }
        })
    })
}

export async function loadChallenges(workspacePath: string): Promise<Challenge[]> {
    return new Promise((resolve) => {
        const handler = (event: MessageEvent) => {
            const data = event.data
            if(data.type === "loadChallengesResult") {
                window.chrome?.webview?.removeEventListener("message", handler)
                resolve(data.challenges ?? [])
            }
        }

        window.chrome?.webview?.addEventListener("message", handler)
        window.chrome?.webview?.postMessage({
            type: "loadChallenges",
            payload: { workspacePath }
        })
    })
}

export async function createChallenge(workspacePath: string, challengeName: string): Promise<string | null> {
    return new Promise((resolve) => {
        const handler = (event: MessageEvent) => {
            const data = event.data
            if(data.type === "createChallengeResult") {
                window.chrome?.webview?.removeEventListener("message", handler)
                resolve(data.challengeId ?? null)
            }
        }

        window.chrome?.webview?.addEventListener("message", handler)
        window.chrome?.webview?.postMessage({
            type: "createChallenge",
            payload: { workspacePath, challengeName }
        })
    })
}

export async function updateChallengeTags(workspacePath: string, challengeId: string, tags: string[]): Promise<void> {
    return new Promise((resolve) => {
        const handler = (event: MessageEvent) => {
            const data = event.data
            if(data.type === "updateChallengeTagsResult") {
                window.chrome?.webview?.removeEventListener("message", handler)
                resolve()
            }
        }

        window.chrome?.webview?.addEventListener("message", handler)
        window.chrome?.webview?.postMessage({
            type: "updateChallengeTags",
            payload: { workspacePath, challengeId, tags }
        })
    })
}

export async function minimizeWindow(): Promise<void> {
    window.chrome?.webview?.postMessage({ type: "minimizeWindow" })
}

export async function closeWindow(): Promise<void> {
    window.chrome?.webview?.postMessage({ type: "closeWindow" })
}
