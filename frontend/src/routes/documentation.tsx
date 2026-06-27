import { faBook } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { codeBlockPlugin, codeMirrorPlugin, headingsPlugin, imagePlugin, linkPlugin, listsPlugin, MDXEditor, quotePlugin, thematicBreakPlugin } from '@mdxeditor/editor'
import { useState } from 'react'

const files = import.meta.glob('/docs/**/*.md', {
    query: '?raw',
    import: 'default',
    eager: true
})

const mdPlugins = [
    headingsPlugin(),
    listsPlugin(),
    quotePlugin(),
    linkPlugin(),
    thematicBreakPlugin(),
    imagePlugin({ disableImageResize: true }),
    codeBlockPlugin({ defaultCodeBlockLanguage: 'text' }),
    codeMirrorPlugin({
        codeBlockLanguages: {
            text: 'Text',
            bash: 'Bash',
            python: 'Python'
        }
    })
]

type ParsedDoc = {
    metadata: Record<string, string>
    content: string
}

function parseFrontmatter(markdown: string): ParsedDoc {
    const match = markdown.match(/^---\r\n([\s\S]*?)\r\n---\r\n([\s\S]*)$/)
    if(!match) return { metadata: {}, content: markdown }

    const [, frontmatter, content] = match
    const metadata = Object.fromEntries(
        frontmatter.split('\r\n')
        .map(line => line.split(':').map(part => part.trim()))
        .filter(parts => parts.length >= 2)
        .map(([key, ...value]) => [key, value.join(':').trim()])
    )
    return { metadata, content }
}

export default function Documentation() {
    const [selectedDoc, setSelectedDoc] = useState<string | null>(null)
    
    const documents = Object.entries(files).map(([path, content]) => {
        const parsed = parseFrontmatter(content as string)
        return {
            path,
            name: parsed.metadata.title || path.split('/').pop()?.replace('.md', '') || '',
            category: parsed.metadata.category || 'Uncategorized',
            content: parsed.content,
            metadata: parsed.metadata
        }
    })

    const indexDoc = documents.find(doc => doc.path === '/docs/index.md')
    const filteredDocuments = documents.filter(doc => doc.path !== '/docs/index.md')

    const currentDoc = filteredDocuments.find(doc => doc.path === selectedDoc)?.content ?? indexDoc?.content ?? 'No document selected.'

    return <div className="min-h-[calc(100vh-3rem)] flex">
        <aside className="flex flex-col gap-2 w-[20vw] bg-bg-light border-r border-border p-6 max-h-[calc(100vh-3rem)]">
            <h1 className="font-semibold uppercase tracking-wider flex items-center gap-2">
                <FontAwesomeIcon icon={faBook} className="text-muted text-sm" />
                Documentation
            </h1>
            <hr className="my-2 border-border" />
            <div className="flex flex-col gap-2">
                {Array.from(new Set(filteredDocuments.map(doc => doc.category))).map(category => (
                    <div key={category} className="flex flex-col gap-2">
                        <h2 className="font-semibold text-sm uppercase tracking-wider text-muted">{category}</h2>
                        <div className="flex flex-col gap-2">
                            {filteredDocuments.filter(doc => doc.category === category).map(doc => (
                                <button
                                    key={doc.path}
                                    onClick={() => setSelectedDoc(doc.path)}
                                    className={`flex items-start gap-3 text-left p-3 rounded-xl bg-bg border ${selectedDoc === doc.path ? 'border-primary' : 'border-border hover:border-primary/40 hover:bg-border/20'} cursor-pointer transition`}
                                >{doc.name}</button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
        <main className="flex-1 p-6 flex flex-col max-h-[calc(100vh-3rem)] overflow-y-auto!">
            <MDXEditor
                key={currentDoc}
                className="border border-border rounded-xl bg-bg-light"
                contentEditableClassName="text-text! p-4!"
                markdown={currentDoc}
                plugins={mdPlugins}
                readOnly
            />
        </main>
    </div>
}
