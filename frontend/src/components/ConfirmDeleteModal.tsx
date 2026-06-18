type Props = {
    open: boolean
    onClose: () => void
    onConfirm: () => void
}

export default function ConfirmDeleteModal({ open, onClose, onConfirm }: Props) {
    const handleConfirm = () => {
        onConfirm()
        onClose()
    }

    return <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-bg-light p-6 rounded-xl w-lg flex flex-col">
            <h2 className="text-xl font-semibold">Confirm Delete</h2>
            <hr className="my-4 border-border" />
            <p>Are you sure you want to delete this challenge? This action cannot be undone.</p>
            <div className="flex flex-row mt-6">
                <button onClick={onClose} className="px-4 py-2 border border-border hover:bg-border/30 rounded-xl cursor-pointer transition w-full">Cancel</button>
                <button onClick={handleConfirm} className="px-4 py-2 bg-primary/90 hover:bg-primary rounded-xl cursor-pointer transition w-full ml-4">Delete</button>
            </div>
        </div>
    </div>
}
