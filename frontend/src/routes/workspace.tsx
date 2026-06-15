import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Background from '../components/Background'
import ConfirmDialog from '../components/base/ConfirmDialog'
import ContextMenu from '../components/base/ContextMenu'
import CreateProjectModal from '../components/CreateProjectModal'
import { deleteProject, loadProjects, maximizeWindow } from '../services/host'
import { useWorkspaceStore } from '../stores/workspaceStore'

export default function Workspace() {
    const navigate = useNavigate()
    const workspaceStore = useWorkspaceStore()
    const [projectModal, setProjectModal] = useState(false)
    const [contextMenu, setContextMenu] = useState({ open: false, x: 0, y: 0 })
    const [selectedProject, setSelectedProject] = useState<string | null>(null)
    const [confirmDelete, setConfirmDelete] = useState(false)

    const projectActions = [
        { name: 'Edit', action: () => {} },
        { name: 'Delete', action: () => setConfirmDelete(true) }
    ]

    useEffect(() => {
        if(!workspaceStore.name || !workspaceStore.location) navigate('/')
        const load = async() => {
            await maximizeWindow()
            const projects = await loadProjects(workspaceStore.location)
            if(projects) workspaceStore.setProjects(projects)
        }
        load()
    }, [])

    const handleDeleteProject = async() => {
        if(!selectedProject) return
        await deleteProject(workspaceStore.location + '\\' + workspaceStore.projects.find(p => p.id === selectedProject)?.name)
        workspaceStore.setProjects(workspaceStore.projects.filter(p => p.id !== selectedProject))
        setConfirmDelete(false)
    }

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
                    <button onClick={() => setProjectModal(true)} className="cursor-pointer">+ Add</button>
                </div>
                {workspaceStore.projects.length === 0 ?
                    <span className="text-sm line-clamp-1 text-center mt-5 text-gray-300">No projects yet.</span>
                    : workspaceStore.projects.map((project, index) => <button key={index} onContextMenu={(e) => {
                        e.preventDefault()
                        setContextMenu({ open: true, x: e.clientX, y: e.clientY })
                        setSelectedProject(project.id)
                    }} className="text-left mt-1 px-4 py-2 rounded-xl cursor-pointer bg-gray-700 hover:bg-gray-600 transition">{project.name}</button>)
                }
            </div>
        </aside>
        <main className="flex flex-col items-center justify-center flex-1 p-6">
            <h1 className="text-3xl">Welcome to the FlagForge Workspace!</h1>
            <h2 className="text-xl mt-2 text-gray-200 line-clamp-1">Workspace: {workspaceStore.location.replaceAll('\\', '/')}</h2>
            <span className="text-gray-400 mt-2">You can add / select projects to your workspace using the button on the left.</span>
        </main>
        <CreateProjectModal open={projectModal} onClose={() => setProjectModal(false)} />
        <ContextMenu items={projectActions} open={contextMenu.open} onClose={() => setContextMenu({ open: false, x: 0, y: 0 })} x={contextMenu.x} y={contextMenu.y} />
        <ConfirmDialog open={confirmDelete} onClose={() => setConfirmDelete(false)} onConfirm={handleDeleteProject} title="Delete Project" description={`Are you sure you want to delete the project "${workspaceStore.projects.find(p => p.id === selectedProject)?.name}"? This action cannot be undone.`} />
    </div>
}
