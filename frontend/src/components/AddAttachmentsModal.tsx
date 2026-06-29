import { faDownload, faFile, faFileCirclePlus, faLink, faPlus, faUpload, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { sendCommand } from '../services/host'
import { useWorkspaceStore } from '../stores/workspaceStore'
import { Commands } from '../utils/commands'

type Props = {
    open: boolean
    onClose: () => void
    onCreate: () => void
}

type AttachmentOptions = {
    url?: string
    name?: string
}

export default function AddAttachmentsModal({ open, onClose, onCreate }: Props) {
    const workspaceStore = useWorkspaceStore()
    const [newAttachmentName, setNewAttachmentName] = useState('')
    const [attachmentUrl, setAttachmentUrl] = useState('')

    const invalidTitle = /[<>:"/\\|?*]/.test(newAttachmentName)

    const addAttachment = async(type: 'upload' | 'download' | 'create', options?: AttachmentOptions) => {
        if(!workspaceStore.activeChallenge) return
        try {
            await sendCommand(Commands.AddAttachments, {
                type,
                path: workspaceStore.path,
                id: workspaceStore.activeChallenge.id,
                ...options
            })
            toast.success('Attachment added successfully!')
        } catch(err) {
            console.error(err)
            toast.error(err instanceof Error ? err.message : 'Failed to add attachment.')
        }
        await workspaceStore.loadChallenges()
        onClose()
        onCreate()
    }

    const handleUploadAttachments = async() => {
        addAttachment('upload')
    }

    const handleDownloadAttachment = async() => {
        if(!attachmentUrl) return
        setAttachmentUrl('')
        addAttachment('download', { url: attachmentUrl })
    }

    const handleCreateAttachment = async() => {
        if(!newAttachmentName || invalidTitle) return
        setNewAttachmentName('')
        addAttachment('create', { name: newAttachmentName })
    }

    return <div className={`fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-bg-light border border-border/60 rounded-2xl shadow-2xl overflow-hidden w-lg max-w-[92vw]">
            <div className="flex items-center justify-between px-7 py-6 border-b border-border/60">
                <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
                        <FontAwesomeIcon icon={faFileCirclePlus} className="text-base" />
                    </span>
                    <div>
                        <h2 className="text-base font-semibold tracking-tight">Add Attachments</h2>
                        <p className="text-xs text-muted mt-0.5">Attach a file to this challenge</p>
                    </div>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-text hover:bg-border/40 transition cursor-pointer">
                    <FontAwesomeIcon icon={faXmark} className="text-sm" />
                </button>
            </div>

            <div className="flex flex-col gap-6 px-7 py-6">
                <button
                    id="attachment-file-upload"
                    onClick={handleUploadAttachments}
                    className="flex flex-col items-center gap-3 px-6 py-10 rounded-2xl border-2 border-dashed border-border bg-bg/40 hover:border-primary/50 hover:bg-primary/5 transition cursor-pointer group"
                >
                    <span className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center text-primary transition">
                        <FontAwesomeIcon icon={faUpload} className="text-lg" />
                    </span>
                    <div className="flex flex-col items-center gap-0.5">
                        <span className="text-sm font-semibold">Drop files or click to browse</span>
                        <span className="text-xs text-muted">Any file type</span>
                    </div>
                </button>

                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-border/60" />
                    <span className="text-[10px] font-semibold text-muted uppercase tracking-wider">or add manually</span>
                    <div className="flex-1 h-px bg-border/60" />
                </div>

                <div className="flex flex-col gap-4 p-4 rounded-xl bg-bg/30 border border-border/50">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="attachment-url-download" className="text-xs font-semibold text-muted uppercase tracking-wide flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faLink} className="text-[10px]" />
                            From URL
                        </label>
                        <div className="flex flex-row gap-2">
                            <input
                                type="text"
                                id="attachment-url-download"
                                value={attachmentUrl}
                                onChange={(e) => setAttachmentUrl(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleDownloadAttachment()}
                                placeholder="https://..."
                                autoComplete="off"
                                className="flex-1 px-3 py-2.5 text-sm rounded-lg border border-border bg-bg placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-primary transition"
                            />
                            <button onClick={handleDownloadAttachment} className="flex items-center justify-center w-28 gap-1.5 px-4 py-2.5 text-sm font-semibold bg-primary/90 hover:bg-primary rounded-lg cursor-pointer transition whitespace-nowrap">
                                <FontAwesomeIcon icon={faDownload} className="text-xs" />
                                Download
                            </button>
                        </div>
                    </div>

                    <hr className="border-border/50" />

                    <div className="flex flex-col gap-2">
                        <label htmlFor="attachment-create-new" className="text-xs font-semibold text-muted uppercase tracking-wide flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faFile} className="text-[10px]" />
                            New File
                        </label>
                        <div className="flex flex-row gap-2">
                            <input
                                type="text"
                                id="attachment-create-new"
                                value={newAttachmentName}
                                onChange={(e) => setNewAttachmentName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleCreateAttachment()}
                                placeholder="filename.md"
                                autoComplete="off"
                                className="flex-1 px-3 py-2.5 text-sm rounded-lg border border-border bg-bg placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-primary transition"
                            />
                            <button onClick={handleCreateAttachment} disabled={invalidTitle} className="flex items-center justify-center w-28 gap-1.5 px-4 py-2.5 text-sm font-semibold bg-primary/90 hover:bg-primary rounded-lg cursor-pointer transition whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed">
                                <FontAwesomeIcon icon={faPlus} className="text-xs" />
                                Create
                            </button>
                        </div>
                        {invalidTitle && <span className="text-xs text-primary mt-1">Invalid filename. Please avoid using the following characters: &lt; &gt; : " / \ | ? *</span>}
                    </div>
                </div>
            </div>
        </div>
    </div>
}
