import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Background from '../components/Background'
import { maximizeWindow } from '../services/host'
import { useWorkspaceStore } from '../stores/workspaceStore'

export default function Workspace() {
    const navigate = useNavigate()
    const workspaceStore = useWorkspaceStore()

    useEffect(() => {
        if(!workspaceStore.name) navigate('/')
        const load = async() => {
            await maximizeWindow()
        }
        load()
    }, [])

    return <div className="relative h-screen flex text-white">
        <div className="absolute inset-0 -z-10"><Background /></div>
        <aside className="flex flex-col w-64 p-6 bg-gray-800/85 opacity-70 rounded-r-xl">
            <div onClick={() => navigate('/')} className="flex flex-row items-center gap-2 cursor-pointer">
                <img src="/favicon.ico" className="w-12 h-12" />
                <span className="tracking-wider font-bold text-xl">FlagForge</span>
            </div>
            <hr className="my-4 border-gray-700 w-full" />
            <h1 className="font-semibold text-gray-400 uppercase tracking-wider">Workspace</h1>
            <span className="text-sm line-clamp-1 text-gray-300">{workspaceStore.name}</span>
            {workspaceStore.location && (
                <span className="text-xs text-gray-500 mt-1 line-clamp-1 break-all">
                    {workspaceStore.location.replaceAll('\\', '/')}
                </span>
            )}
        </aside>
        <main className="flex flex-col items-center justify-center flex-1 p-6">
            <h1 className="text-3xl">Welcome to your Workspace!</h1>
            <h2 className="text-xl mt-2 text-gray-200">{workspaceStore.name}</h2>
            <span className="text-gray-400 mt-2">Your CTF workspace is ready.</span>
        </main>
    </div>
}
