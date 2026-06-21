import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendCommand } from '../services/host'
import { useWorkspaceStore } from '../stores/workspaceStore'
import { Commands } from '../utils/commands'
import type { Workspace } from '../utils/types'
import toast from 'react-hot-toast'

type Props = {
    open: boolean
    onClose: () => void
}

export default function CreateWorkspaceModal({ open, onClose }: Props) {
    const navigate = useNavigate()
    const workspaceStore = useWorkspaceStore()
    const [workspaceName, setWorkspaceName] = useState('')
    const [workspaceLocation, setWorkspaceLocation] = useState('')
    
    const handleSelectLocation = async() => {
        const path = await sendCommand<string>(Commands.PickFolder)
        setWorkspaceLocation(path || '')
    }

    const handleCancel = () => {
        setWorkspaceName('')
        setWorkspaceLocation('')
        onClose()
    }

    const handleCreate = async() => {
        const workspacePath = `${workspaceLocation}\\${workspaceName}`
        try {
            await sendCommand<Workspace>(Commands.CreateWorkspace, { name: workspaceName, path: workspacePath })
            workspaceStore.setWorkspace(workspaceName, workspacePath)
            handleCancel()
            navigate('/workspace')
        } catch(err) {
            console.error('Error creating workspace:', err)
            toast.error(err instanceof Error ? err.message : 'Failed to create workspace')
        }
    }

    return <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-bg-light p-6 rounded-xl w-lg flex flex-col">
            <h2 className="text-xl font-semibold">Create New Workspace</h2>
            <hr className="my-4 border-border" />
            <label htmlFor="workspaceName" className="mb-2">Workspace Name</label>
            <input id="workspaceName" autoComplete="off" type="text" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} className="w-full p-2 rounded-xl bg-bg-light border border-border focus:outline-none focus:ring-1 focus:ring-primary transition" placeholder="Enter workspace name" />
            <label htmlFor="workspaceLocation" className="mb-2 mt-4">Workspace Location</label>
            <button onClick={handleSelectLocation} className="w-full p-2 rounded-xl bg-bg-light border border-border hover:bg-border/30 cursor-pointer transition">Select Location</button>
            {workspaceLocation && <span className="text-sm text-muted mt-2 line-clamp-1">Selected: {workspaceLocation}\{workspaceName}</span>}
            <div className="flex flex-row mt-6">
                <button onClick={handleCancel} className="px-4 py-2 border border-border hover:bg-border/30 rounded-xl cursor-pointer transition w-full">Cancel</button>
                <button onClick={handleCreate} className="px-4 py-2 bg-primary/90 hover:bg-primary rounded-xl cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed w-full ml-4" disabled={!workspaceName || !workspaceLocation}>Create</button>
            </div>
        </div>
    </div>
}
