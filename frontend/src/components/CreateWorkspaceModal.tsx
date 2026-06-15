import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createWorkspace, pickFolder } from '../services/host'
import { useWorkspaceStore } from '../stores/workspaceStore'

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
        const path = await pickFolder()
        setWorkspaceLocation(path || '')
    }

    const handleCancel = () => {
        setWorkspaceName('')
        setWorkspaceLocation('')
        onClose()
    }

    const handleCreate = async() => {
        await createWorkspace(workspaceName, workspaceLocation)
        const setWorkspace = workspaceStore.setWorkspace
        setWorkspace(workspaceName, `${workspaceLocation}\\${workspaceName}`)
        handleCancel()
        navigate('/workspace')
    }

    return <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-gray-800 p-6 rounded-xl w-lg flex flex-col">
            <h2 className="text-xl font-semibold">Create New Workspace</h2>
            <hr className="my-4 border-gray-700" />
            <label htmlFor="workspaceName" className="mb-2">Workspace Name</label>
            <input id="workspaceName" type="text" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} className="w-full p-2 rounded-xl bg-gray-700 border border-gray-600 text-white" placeholder="Enter workspace name" />
            <label htmlFor="workspaceLocation" className="mb-2 mt-4">Workspace Location</label>
            <button onClick={handleSelectLocation} className="w-full p-2 rounded-xl bg-gray-700 border border-gray-600 text-white hover:bg-gray-600 cursor-pointer transition">Select Location</button>
            {workspaceLocation && <span className="text-sm text-gray-400 mt-2 line-clamp-1">Selected: {workspaceLocation}\{workspaceName}</span>}
            <div className="flex flex-row mt-6">
                <button onClick={handleCancel} className="px-4 py-2 border border-gray-400 hover:bg-gray-700 rounded-xl cursor-pointer transition text-white w-full">Cancel</button>
                <button onClick={handleCreate} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-xl cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed text-white w-full ml-4" disabled={!workspaceName || !workspaceLocation}>Create</button>
            </div>
        </div>
    </div>
}
