import { useState } from 'react'
import { createChallenge, loadChallenges } from '../services/host'
import { useWorkspaceStore } from '../stores/workspaceStore'

type Props = {
    open: boolean
    onClose: () => void
    onCreate: () => void
}

export default function CreateChallengeModal({ open, onClose, onCreate }: Props) {
    const workspaceStore = useWorkspaceStore()
    const [challengeTitle, setChallengeTitle] = useState('')
    
    const handleCancel = () => {
        setChallengeTitle('')
        onClose()
    }

    const handleCreate = async() => {
        await createChallenge(workspaceStore.location, challengeTitle)
        workspaceStore.setChallenges(await loadChallenges(workspaceStore.location))
        handleCancel()
        onCreate()
    }

    return <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-bg-light p-6 rounded-xl w-lg flex flex-col">
            <h2 className="text-xl font-semibold">Create New Challenge</h2>
            <hr className="my-4 border-border" />
            <label htmlFor="challengeTitle" className="mb-2">Challenge Title</label>
            <input id="challengeTitle" autoComplete="off" type="text" value={challengeTitle} onChange={(e) => setChallengeTitle(e.target.value)} className="w-full p-2 rounded-xl bg-bg-light border border-border focus:outline-none focus:ring-1 focus:ring-primary transition" placeholder="Enter challenge title" />
            <div className="flex flex-row mt-6">
                <button onClick={handleCancel} className="px-4 py-2 border border-border hover:bg-border/30 rounded-xl cursor-pointer transition w-full">Cancel</button>
                <button onClick={handleCreate} className="px-4 py-2 bg-primary/90 hover:bg-primary rounded-xl cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed w-full ml-4" disabled={!challengeTitle}>Create</button>
            </div>
        </div>
    </div>
}
