import { faUpload, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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

    return <div className={`fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-bg-light border border-border/60 rounded-2xl shadow-2xl overflow-hidden w-[440px] max-w-[90vw]">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/40">
                <h2 className="text-base font-semibold tracking-tight">Add Attachments</h2>
                <button onClick={onClose} className="w-7 h-7 rounded-md flex items-center justify-center text-muted hover:text-text hover:bg-border/40 transition cursor-pointer">
                    <FontAwesomeIcon icon={faXmark} className="text-sm" />
                </button>
            </div>

            <div className="flex flex-col gap-5 px-6 py-5">
                <div className="flex flex-col gap-2">
                    <label htmlFor="attachment-file-upload" className="text-xs font-semibold text-muted uppercase tracking-wide">Upload</label>
                    <button
                        id="attachment-file-upload"
                        onClick={handleUploadAttachments}
                        className="flex flex-col items-center gap-2.5 px-6 py-7 rounded-xl border border-dashed border-border/70 bg-text/[0.02] hover:border-primary/40 hover:bg-primary/[0.03] transition cursor-pointer"
                    >
                        <span className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <FontAwesomeIcon icon={faUpload} className="text-sm" />
                        </span>
                        <span className="text-sm font-medium">Drop files or click to browse</span>
                        <span className="text-[11px] text-muted">Any file type</span>
                    </button>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="attachment-url-download" className="text-xs font-semibold text-muted uppercase tracking-wide">From URL</label>
                    <div className="flex flex-row gap-2">
                        <input
                            type="text"
                            id="attachment-url-download"
                            placeholder="https://..."
                            className="flex-1 px-3 py-2.5 text-sm rounded-lg border border-border bg-bg placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-primary transition"
                        />
                        <button onClick={handleDownloadAttachment} className="px-4 py-2.5 text-sm font-semibold bg-primary/90 hover:bg-primary rounded-lg cursor-pointer transition whitespace-nowrap">Download</button>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="attachment-create-new" className="text-xs font-semibold text-muted uppercase tracking-wide">New File</label>
                    <div className="flex flex-row gap-2">
                        <input
                            type="text"
                            id="attachment-create-new"
                            value={newAttachmentName}
                            onChange={(e) => setNewAttachmentName(e.target.value)}
                            placeholder="filename.md"
                            className="flex-1 px-3 py-2.5 text-sm rounded-lg border border-border bg-bg placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-primary transition"
                        />
                        <button onClick={handleCreateAttachment} className="px-4 py-2.5 text-sm font-semibold bg-primary/90 hover:bg-primary rounded-lg cursor-pointer transition whitespace-nowrap">Create</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}