import type { Project } from '../utils/types'

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
            type: "createWorkspace",
            payload: { name, location }
        })
    })
}

export async function openWorkspace(): Promise<any> {
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

export async function loadProjects(workspacePath: string): Promise<Project[] | null> {
    return new Promise((resolve) => {
        const handler = (event: MessageEvent) => {
            const data = event.data
            if(data.type === "loadProjectsResult") {
                window.chrome?.webview?.removeEventListener("message", handler)
                resolve(data.projects)
            }
        }

        window.chrome?.webview?.addEventListener("message", handler)
        window.chrome?.webview?.postMessage({
            type: "loadProjects",
            payload: { workspacePath }
        })
    })
}

export async function createProject(name: string, workspacePath: string): Promise<Project | null> {
    return new Promise((resolve) => {
        const handler = (event: MessageEvent) => {
            const data = event.data
            if(data.type === "createProjectResult") {
                window.chrome?.webview?.removeEventListener("message", handler)
                resolve(data.project)
            }
            // ! TODO handle createProjectFailed case
        }

        window.chrome?.webview?.addEventListener("message", handler)
        window.chrome?.webview?.postMessage({
            type: "createProject",
            payload: { name, workspacePath }
        })
    })
}

export async function deleteProject(projectPath: string): Promise<boolean> {
    return new Promise((resolve) => {
        const handler = (event: MessageEvent) => {
            const data = event.data
            if(data.type === "deleteProjectResult") {
                window.chrome?.webview?.removeEventListener("message", handler)
                resolve(true)
            }
            // ! TODO handle deleteProjectFailed case
        }

        window.chrome?.webview?.addEventListener("message", handler)
        window.chrome?.webview?.postMessage({
            type: "deleteProject",
            payload: { projectPath }
        })
    })
}

export async function maximizeWindow(): Promise<void> {
    window.chrome?.webview?.postMessage({ type: "maximizeWindow" })
}

export async function restoreWindow(): Promise<void> {
    window.chrome?.webview?.postMessage({ type: "restoreWindow" })
}
