import { faBoxOpen, faFile, faFolder, faFolderTree, faSpinner, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { codeBlockPlugin, codeMirrorPlugin, headingsPlugin, linkPlugin, listsPlugin, MDXEditor, quotePlugin, thematicBreakPlugin } from '@mdxeditor/editor'
import { Editor } from '@monaco-editor/react'
import JSZip from 'jszip'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { sendCommand } from '../services/host'
import { useWorkspaceStore } from '../stores/workspaceStore'
import { Commands } from '../utils/commands'

type AttachmentData = {
    name: string
    content: string
    type: string
    mimeType: string
}

export const CODE_TYPES = [
    '.c', '.cpp', '.py', '.js', '.java', '.html', '.css', '.json', '.txt', '.ts', '.tsx', '.xml', '.yml', '.yaml',
    '.ini', '.bat', '.sh', '.ps1', '.rb', '.go', '.rs', '.php', '.pl', '.swift', '.kt', '.lua', '.r', '.sql', '.asm',
    '.s', '.h', '.hpp', '.cs', '.fs', '.vb', '.vbs', '.vba', '.clj', '.cljs', '.groovy', '.dart', '.erl', '.ex', '.exs',
    '.hs', '.jl', '.lisp', '.scm', '.tcl', '.vhdl', '.asm', '.s', '.h', '.hpp', '.cs', '.fs', '.vb', '.vbs', '.vba',
    '.clj', '.cljs', '.groovy', '.dart', '.erl', '.ex', '.exs', '.hs', '.jl', '.lisp', '.scm', '.tcl', '.vhdl'
] as const

const mdPlugins = [
    headingsPlugin(),
    listsPlugin(),
    quotePlugin(),
    linkPlugin(),
    thematicBreakPlugin(),
    codeBlockPlugin({ defaultCodeBlockLanguage: 'text' }),
    codeMirrorPlugin({
        codeBlockLanguages: {
            text: 'Text',
            bash: 'Bash',
            python: 'Python'
        }
    })
]

export const renderer = (open: boolean, file: AttachmentData | null, editable: boolean, setFile: React.Dispatch<React.SetStateAction<AttachmentData | null>>) => {
    if(!open) return null
    if(!file) return <div className="flex flex-col items-center gap-2 p-6 flex-1">
        <p className="text-muted self-center">Loading attachment...</p>
    </div>

    if(CODE_TYPES.includes(file.type as typeof CODE_TYPES[number])) return <CodeRenderer file={file} editable={editable} setFile={setFile} />
    if(file.mimeType.startsWith('image/')) return <ImageRenderer file={file} />
    if(file.mimeType === 'application/pdf') return <PdfRenderer file={file} />
    if(file.mimeType.startsWith('audio/')) return <AudioRenderer file={file} />
    if(file.mimeType.startsWith('video/')) return <VideoRenderer file={file} />
    if(file.type === '.md') return <MarkdownRenderer file={file} />
    if(file.type === '.zip') return <ZipRenderer file={file} /> 
}

function ImageRenderer({ file }: { file: AttachmentData }) {
    return <img src={`data:${file.mimeType};base64,${file.content}`} alt={file.name} className="max-w-full w-fit self-center max-h-[80vh]" />
}

function PdfRenderer({ file }: { file: AttachmentData }) {
    return <iframe src={`data:${file.mimeType};base64,${file.content}`} title={file.name} className="w-full h-[80vh]" />
}

function CodeRenderer({ file, editable, setFile }: { file: AttachmentData, editable: boolean, setFile: React.Dispatch<React.SetStateAction<AttachmentData | null>> }) {
    let language = file.type.slice(1)
    switch(file.type.slice(1)) {
        case 'py': language = 'python'; break
        case 'js': case 'jsx': language = 'javascript'; break
        case 'ts': case 'tsx': language = 'typescript'; break
        case 'cs': language = 'csharp'; break
        case 'kt': language = 'kotlin'; break
        case 'ps1': language = 'powershell'; break
        case 'rb': language = 'ruby'; break
        case 'rs': language = 'rust'; break
        case 'pl': language = 'perl'; break
        case 'sh': language = 'shell'; break
    }

    return <Editor
        height="80vh" width="100%"
        language={language} value={file.content} onChange={(value) => {
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
        plugins={mdPlugins}
        readOnly
    />
}

type ZipEntry = {
    path: string
    name: string
    isDir: boolean
    depth: number
    size?: number
}

function formatBytes(bytes?: number) {
    if(bytes === undefined) return ''
    if(bytes === 0) return '0 B'
    const units = ['B', 'KB', 'MB', 'GB']
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
    return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

function ZipRenderer({ file }: { file: AttachmentData }) {
    const workspaceStore = useWorkspaceStore() 
    const [entries, setEntries] = useState<ZipEntry[] | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [extractingAll, setExtractingAll] = useState(false) 

    useEffect(() => {
        let cancelled = false
        setEntries(null)
        setError(null)

        JSZip.loadAsync(file.content, { base64: true })
            .then(zip => {
                if(cancelled) return

                const list: ZipEntry[] = Object.values(zip.files)
                    .filter(entry => entry.name !== '')
                    .map(entry => {
                        const segments = entry.name.replace(/\/$/, '').split('/')
                        return {
                            path: entry.name,
                            name: segments[segments.length - 1],
                            isDir: entry.dir,
                            depth: segments.length - 1,
                            size: (entry as any)._data?.uncompressedSize as number | undefined
                        }
                    })
                    .sort((a, b) => a.path.localeCompare(b.path))

                setEntries(list)
            })
            .catch(() => {
                if(cancelled) return
                setError('Unable to read this archive. It may be encrypted, corrupted, or in an unsupported format.')
            })

        return () => { cancelled = true }
    }, [file.content])

    const handleExtractAll = async () => {
        if(!workspaceStore.activeChallenge) return

        setExtractingAll(true)
        try {
            await sendCommand(Commands.ExtractZip, {
                path: workspaceStore.path,
                challengeId: workspaceStore.activeChallenge.id,
                name: file.name
            })
            toast.success(`Extracted into the same folder as "${file.name}"`)
            await workspaceStore.loadChallenges()
        } catch(err) {
            toast.error(err instanceof Error ? err.message : 'Failed to extract archive.')
        } finally {
            setExtractingAll(false)
        }
    }

    if(error) return <div className="flex flex-col items-center gap-2 p-6 flex-1 text-center">
        <FontAwesomeIcon icon={faTriangleExclamation} className="text-primary text-2xl" />
        <p className="text-muted">{error}</p>
    </div>

    if(!entries) return <div className="flex flex-col items-center gap-2 p-6 flex-1">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-muted" />
        <p className="text-muted">Reading archive...</p>
    </div>

    const fileCount = entries.filter(e => !e.isDir).length
    const totalSize = entries.reduce((sum, e) => sum + (e.isDir ? 0 : e.size || 0), 0)

    if(fileCount === 0) return <div className="flex flex-col items-center gap-2 p-6 flex-1">
        <FontAwesomeIcon icon={faBoxOpen} className="text-muted text-2xl" />
        <p className="text-muted">This archive is empty.</p>
    </div>

    return <div className="flex flex-col border border-border rounded-xl bg-bg-light overflow-hidden">
        <div className="flex flex-row items-center justify-between px-4 py-2.5 border-b border-border text-sm">
            <span className="text-muted">{fileCount} {fileCount === 1 ? 'file' : 'files'} &middot; {formatBytes(totalSize)} uncompressed</span>
            <button
                onClick={handleExtractAll}
                disabled={extractingAll}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-primary/90 hover:bg-primary rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 transition"
            >
                <FontAwesomeIcon icon={extractingAll ? faSpinner : faFolderTree} className={extractingAll ? 'animate-spin' : ''} />
                {extractingAll ? 'Extracting...' : 'Extract All'}
            </button>
        </div>
        <div className="flex flex-col max-h-[70vh] overflow-y-auto">
            {entries.map(entry => <div
                key={entry.path}
                className="flex flex-row items-center gap-2 px-4 py-2 text-sm"
                style={{ paddingLeft: `${1 + entry.depth * 1.25}rem` }}
            >
                <FontAwesomeIcon icon={entry.isDir ? faFolder : faFile} className={`shrink-0 ${entry.isDir ? 'text-muted' : 'text-primary'}`} />
                <span className="flex-1 truncate font-mono text-xs">{entry.name}</span>
                {!entry.isDir && <span className="text-xs text-muted shrink-0">{formatBytes(entry.size)}</span>}
            </div>)}
        </div>
    </div>
}
