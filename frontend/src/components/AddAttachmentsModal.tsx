import { useState } from 'react'
import { sendCommand } from '../services/host'
import { useWorkspaceStore } from '../stores/workspaceStore'
import { Commands } from '../utils/commands'

type Props = {
    open: boolean
    onClose: () => void
}

export default function AddAttachmentsModal({ open, onClose }: Props) {
    const workspaceStore = useWorkspaceStore()
    const [newAttachmentName, setNewAttachmentName] = useState('')

    const handleUploadAttachments = async() => {
        if(!workspaceStore.activeChallenge) return
        await sendCommand(Commands.AddAttachments, { path: workspaceStore.path, id: workspaceStore.activeChallenge.id })
        workspaceStore.loadChallenges()
        onClose()
    }

    const handleDownloadAttachment = async() => { }

    const handleCreateAttachment = async() => { }

    return <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-bg-light p-6 rounded-xl w-lg flex flex-col">
            <h2 className="text-xl font-semibold">Add Attachments</h2>
            <hr className="my-4 border-border" />
            <label htmlFor="attachment-file-upload" className="mb-2">Choose Files To Add From Device</label>
            <button id="attachment-file-upload" onClick={handleUploadAttachments} className="px-4 py-2 bg-primary/90 hover:bg-primary rounded-xl cursor-pointer transition w-full">Add Files</button>
            <label htmlFor="attachment-url-download" className="mt-4 mb-2">Add Attachments From URL</label>
            <div className="flex flex-row gap-2">
                <input type="text" id="attachment-url-download" placeholder="Enter URL" className="px-4 py-2 border border-border rounded-xl w-full focus:outline-none focus:ring-1 focus:ring-primary" />
                <button onClick={handleDownloadAttachment} className="px-4 py-2 bg-primary/90 hover:bg-primary rounded-xl cursor-pointer transition w-32">Download</button>
            </div>
            <label htmlFor="attachment-create-new" className="mt-4 mb-2">Create New Attachment</label>
            <div className="flex flex-row gap-2">
                <input type="text" id="attachment-create-new" value={newAttachmentName} onChange={(e) => setNewAttachmentName(e.target.value)} placeholder="Enter Attachment Name" className="px-4 py-2 border border-border rounded-xl w-full focus:outline-none focus:ring-1 focus:ring-primary" />
                <button onClick={handleCreateAttachment} className="px-4 py-2 bg-primary/90 hover:bg-primary rounded-xl cursor-pointer transition w-32">Create</button>
            </div>
            <hr className="my-4 border-border" />
            <button onClick={onClose} className="px-4 py-2 border border-border hover:bg-border/30 rounded-xl cursor-pointer transition w-full">Close</button>
        </div>
    </div>
}
