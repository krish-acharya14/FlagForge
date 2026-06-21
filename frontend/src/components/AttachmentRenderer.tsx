import { headingsPlugin, linkPlugin, listsPlugin, MDXEditor, quotePlugin } from '@mdxeditor/editor'
import { Editor } from '@monaco-editor/react'

type AttachmentData = {
    name: string
    content: string
    type: string
    mimeType: string
}

export const CODE_TYPES = [
    '.c', '.cpp', '.py', '.js', '.java', '.html', '.css', '.json', '.txt', '.ts'
] as const

export const renderer = (open: boolean, file: AttachmentData | null, editable: boolean, setFile: React.Dispatch<React.SetStateAction<AttachmentData | null>>) => {
    if(!open) return null
    if(!file) return <div className="flex flex-col items-center gap-2 p-6 flex-1">
        <p className="text-muted self-center">Loading attachment...</p>
    </div>

    if(CODE_TYPES.includes(file.type as any)) return <CodeRenderer file={file} editable={editable} setFile={setFile} />
    if(file.mimeType.startsWith('image/')) return <ImageRenderer file={file} />
    if(file.mimeType === 'application/pdf') return <PdfRenderer file={file} />
    if(file.mimeType.startsWith('audio/')) return <AudioRenderer file={file} />
    if(file.mimeType.startsWith('video/')) return <VideoRenderer file={file} />
    if(file.type === '.md') return <MarkdownRenderer file={file} />
}

function ImageRenderer({ file }: { file: AttachmentData }) {
    return <img src={`data:${file.mimeType};base64,${file.content}`} alt={file.name} className="max-w-full w-fit self-center max-h-[80vh]" />
}

function PdfRenderer({ file }: { file: AttachmentData }) {
    return <iframe src={`data:${file.mimeType};base64,${file.content}`} title={file.name} className="w-full h-[80vh]" />
}

function CodeRenderer({ file, editable, setFile }: { file: AttachmentData, editable: boolean, setFile: React.Dispatch<React.SetStateAction<AttachmentData | null>> }) {
    return <Editor
        height="80vh" width="100%"
        language={file.type.slice(1)} value={file.content} onChange={(value) => {
            if(editable) setFile(prev => prev ? { ...prev, content: value || '' } : null)
        }}
        theme="vs-dark"
        options={{ readOnly: !editable, minimap: { enabled: false } }}
    />
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
