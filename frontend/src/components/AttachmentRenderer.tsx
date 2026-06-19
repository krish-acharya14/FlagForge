import { useEffect, useState } from 'react'
import { sendCommand } from '../services/host'
import { useWorkspaceStore } from '../stores/workspaceStore'
import { Commands } from '../utils/commands'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { headingsPlugin, linkPlugin, listsPlugin, MDXEditor, quotePlugin } from '@mdxeditor/editor'

type Props = {
    open: boolean
    attachment: string
}

type AttachmentData = {
    name: string
    content: string
    type: string
    mimeType: string
}

const CODE_TYPES = [
    '.c', '.cpp', '.py', '.js', '.java', '.html', '.css', '.json', '.txt', '.ts'
] as const

export default function AttachmentRenderer({ open, attachment }: Props) {
    const workspaceStore = useWorkspaceStore()
    const [file, setFile] = useState<AttachmentData | null>(null)

    useEffect(() => {
        if(!open) return
        const loadAttachment = async() => {
            const res = await sendCommand<AttachmentData>(Commands.GetAttachment, {  
                path: workspaceStore.path,
                challengeId: workspaceStore.activeChallenge?.id,
                name: attachment
            })
            setFile(res)
        }
        loadAttachment()
    }, [open, attachment, workspaceStore.path, workspaceStore.activeChallenge?.id])

    const renderer = (file: AttachmentData) => {
        if(CODE_TYPES.includes(file.type as any)) return <CodeRenderer file={file} />
        if(file.mimeType.startsWith('image/')) return <ImageRenderer file={file} />
        if(file.mimeType === 'application/pdf') return <PdfRenderer file={file} />
        if(file.mimeType.startsWith('audio/')) return <AudioRenderer file={file} />
        if(file.mimeType.startsWith('video/')) return <VideoRenderer file={file} />
        if(file.type === '.md') return <MarkdownRenderer file={file} />
    }

    if(!open) return null
    if(!file) return <div className="flex flex-col items-center justify-center gap-2 p-6 flex-1">
        <p className="text-gray-500">Loading attachment...</p>
    </div>

    return <div className="flex flex-col items-center justify-center gap-2 p-6 flex-1">
        {renderer(file) || <p className="text-gray-500">Unsupported file type: {file.type}</p>}
    </div>
}

function ImageRenderer({ file }: { file: AttachmentData }) {
    return <img src={`data:${file.mimeType};base64,${file.content}`} alt={file.name} className="max-w-full max-h-[80vh]" />
}

function PdfRenderer({ file }: { file: AttachmentData }) {
    return <iframe src={`data:${file.mimeType};base64,${file.content}`} title={file.name} className="w-full h-[80vh]" />
}

function CodeRenderer({ file }: { file: AttachmentData }) {
    return <SyntaxHighlighter language={file.type.slice(1)} style={oneDark} showLineNumbers customStyle={{ width: '100%', minHeight: '80vh', overflowY: 'auto' }}>
        {file.content}
    </SyntaxHighlighter>
}

function AudioRenderer({ file }: { file: AttachmentData }) {
    return <audio controls className="w-full" src={`data:${file.mimeType};base64,${file.content}`} />
}

function VideoRenderer({ file }: { file: AttachmentData }) {
    return <video controls className="w-full" src={`data:${file.mimeType};base64,${file.content}`} />
}

function MarkdownRenderer({ file }: { file: AttachmentData }) {
    return <MDXEditor
        markdown={file.content}
        className="w-full min-h-[80vh] border border-border rounded-xl bg-bg-light"
        contentEditableClassName="text-text! p-4!"
        plugins={[headingsPlugin(), listsPlugin(), quotePlugin(), linkPlugin()]}
        readOnly
    />
}
