type Props = {
    open: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
}

export default function CreateWorkspaceModal({ open, onClose, onConfirm, title, description }: Props) {    
    return <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-gray-800 p-6 rounded-xl w-lg flex flex-col">
            <h2 className="text-xl font-semibold">{title}</h2>
            <hr className="my-4 border-gray-700" />
            <p className="text-gray-400">{description}</p>
            <div className="flex flex-row mt-6">
                <button onClick={onClose} className="px-4 py-2 border border-gray-400 hover:bg-gray-700 rounded-xl cursor-pointer transition text-white w-full">Cancel</button>
                <button onClick={onConfirm} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-xl cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed text-white w-full ml-4">Confirm</button>
            </div>
        </div>
    </div>
}
