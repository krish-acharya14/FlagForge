import type { Workspace } from '../utils/types'

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
            type: "createdWorkspace",
            payload: { name, location }
        })
    })
}

export async function openWorkspace(): Promise<Workspace | null> {
    return new Promise((resolve) => {
        const handler = (event: MessageEvent) => {
            const data = event.data
            if(data.type === "openWorkspaceResult") {
                window.chrome?.webview?.removeEventListener("message", handler)
                resolve(data.workspace ?? null)
            }
        }

        window.chrome?.webview?.addEventListener("message", handler)
        window.chrome?.webview?.postMessage({ type: "openWorkspace" })
    })
}

export async function minimizeWindow(): Promise<void> {
    window.chrome?.webview?.postMessage({ type: "minimizeWindow" })
}

export async function closeWindow(): Promise<void> {
    window.chrome?.webview?.postMessage({ type: "closeWindow" })
}
