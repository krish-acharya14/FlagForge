import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkspaceStore } from '../stores/workspaceStore'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { loadChallenges } from '../services/host'
import CreateChallengeModal from '../components/CreateChallengeModal'
// import { headingsPlugin, MDXEditor } from '@mdxeditor/editor'
// import '@mdxeditor/editor/style.css'

export default function Workspace() {
    const navigate = useNavigate()
    const workspaceStore = useWorkspaceStore()
    const [challenges, setChallenges] = useState(workspaceStore.challenges)
    const [createChallengeModalOpen, setCreateChallengeModalOpen] = useState(false)

    useEffect(() => {
        if(!workspaceStore.name) navigate('/')
        load()
    }, [])

    const load = async() => {
        const fetchedChallenges = await loadChallenges(workspaceStore.location)
        setChallenges(fetchedChallenges)
        workspaceStore.setChallenges(fetchedChallenges)
    }

    return <div className="h-screen flex">
        <aside className="flex flex-col gap-2 w-[20vw] p-6 bg-bg-light border-r border-border">
            <h1 className="font-semibold uppercase tracking-wider">Workspace</h1>
            <span className="text-sm line-clamp-1 text-muted">{workspaceStore.name}</span>
            {workspaceStore.location && (
                <span className="text-xs text-muted line-clamp-1 break-all">
                    {workspaceStore.location.replaceAll('\\', '/')}
                </span>
            )}
            <hr className="my-2 border-border" />
            <div className="flex flex-row justify-between items-center">
                <h1 className="font-semibold uppercase tracking-wider">Challenges</h1>
                <button onClick={() => setCreateChallengeModalOpen(true)} className="cursor-pointer text-muted"><FontAwesomeIcon icon={faPlus} /></button>
            </div>
            {challenges.length === 0
                ? <span className="text-sm text-muted">No challenges found.</span>
                : challenges.map(challenge => <button
                    key={challenge.id}
                    onClick={() => workspaceStore.setActiveChallenge(challenge)}
                    className={`text-left w-full p-2 rounded-xl line-clamp-1 cursor-pointer ${workspaceStore.activeChallenge?.id === challenge.id ? 'bg-primary' : 'bg-border/50 hover:bg-border'} transition`}
                >{challenge.title}</button>)
            }
        </aside>
        {!workspaceStore.activeChallenge
        ? <main className="flex flex-col items-center justify-center flex-1 p-6">
            <h1 className="text-3xl">Welcome to your Workspace!</h1>
            <h2 className="text-xl mt-2 text-muted/90">{workspaceStore.name}</h2>
            <span className="text-muted mt-2">Your CTF workspace is ready.</span>
        </main>
        : <div className="flex flex-col gap-2 p-6 flex-1">
            <h1 className="text-4xl">{workspaceStore.activeChallenge.title}</h1>
            <hr className="my-2 border-border" />
            <div className="flex flex-row gap-4 flex-wrap items-center">
                {workspaceStore.activeChallenge.tags.map(tag => <span key={tag} className="text-sm bg-primary/50 outline-2 outline-dashed cursor-pointer outline-primary p-2 rounded-full">{tag}</span>)}
                <span className="text-sm bg-border/50 outline-2 outline-dashed cursor-pointer outline-border p-2 rounded-full">+ Add Tag</span>
            </div>
            <hr className="my-2 border-border" />
            <h2 className="text-2xl">Description</h2>
            {/* <MDXEditor markdown="" plugins={[headingsPlugin()]} /> */}
        </div>}
        <CreateChallengeModal open={createChallengeModalOpen} onClose={() => setCreateChallengeModalOpen(false)} onCreate={load} />
    </div>
}
