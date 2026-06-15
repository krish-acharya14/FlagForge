import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Background from '../components/Background'
import { maximizeWindow } from '../services/host'
import { useWorkspaceStore } from '../stores/workspaceStore'

export default function Workspace() {
    const navigate = useNavigate()
    const workspaceStore = useWorkspaceStore()

    useEffect(() => {
        if(!workspaceStore.name || !workspaceStore.location) navigate('/')
        const maximize = async() => { await maximizeWindow() }
        maximize()
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
            {/* <button className="mt-2 cursor-pointer px-4 py-2 bg-gray-700 rounded-xl hover:bg-gray-600 transition">View In Explorer</button> */}
            <hr className="my-4 border-gray-700 w-full" />
            <div className="flex flex-col gap-2">
                <div className="flex flex-row justify-between items-center">
                    <h1 className="font-semibold text-gray-400 uppercase tracking-wider">Projects</h1>
                    <button className="cursor-pointer">+ Add</button>
                </div>
                {workspaceStore.projects.length === 0 ?
                    <span className="text-sm line-clamp-1 text-center mt-5 text-gray-300">No projects yet.</span>
                    : workspaceStore.projects.map((project, index) => <button key={index} className="text-left mt-1 px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 transition">{project}</button>)
                }
            </div>
        </aside>
        <main className="flex flex-col items-center justify-center flex-1 p-6">
            <h1 className="text-3xl">Welcome to the FlagForge Workspace!</h1>
            <h2 className="text-xl mt-2 text-gray-200 line-clamp-1">Workspace: {workspaceStore.location.replaceAll('\\', '/')}</h2>
            <span className="text-gray-400 mt-2">You can add / select projects to your workspace using the button on the left.</span>
        </main>
    </div>
}
