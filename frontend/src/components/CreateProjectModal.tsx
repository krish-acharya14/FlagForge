// import { useState } from 'react'
// import { createProject } from '../services/host'
// import { useWorkspaceStore } from '../stores/workspaceStore'

// type Props = {
//     open: boolean
//     onClose: () => void
// }

// export default function CreateProjectModal({ open, onClose }: Props) {
//     const workspaceStore = useWorkspaceStore()
//     const [projectTitle, setProjectTitle] = useState('')
    
//     const handleCancel = () => {
//         setProjectTitle('')
//         onClose()
//     // }

//     const handleCreate = async() => {
//         if(projectTitle.trim() === '') return
//         const project = await createProject(projectTitle, workspaceStore.location)
//         if(project) {
//             workspaceStore.setProjects([...workspaceStore.projects, project])
//             setProjectTitle('')
//         }
//         onClose()
//     }

//     return <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
//         <div className="bg-gray-800 p-6 rounded-xl w-lg flex flex-col">
//             <h2 className="text-xl font-semibold">Create New Project</h2>
//             <hr className="my-4 border-gray-700" />
//             <label htmlFor="workspaceName" className="mb-2">Project Name</label>
//             <input id="workspaceName" type="text" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} className="w-full p-2 rounded-xl bg-gray-700 border border-gray-600 text-white" placeholder="Enter project name" />
//             <div className="flex flex-row mt-6">
//                 <button onClick={handleCancel} className="px-4 py-2 border border-gray-400 hover:bg-gray-700 rounded-xl cursor-pointer transition text-white w-full">Cancel</button>
//                 <button onClick={handleCreate} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-xl cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed text-white w-full ml-4" disabled={!projectTitle}>Create</button>
//             </div>
//         </div>
//     </div>
// }
