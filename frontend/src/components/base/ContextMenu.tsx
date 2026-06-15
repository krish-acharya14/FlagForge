type MenuItem = {
    name: string
    action: () => void
}

type Props = {
    items: MenuItem[]
    open: boolean
    onClose: () => void
    x: number
    y: number
}

export default function ContextMenu({ items, open, onClose, x, y }: Props) {
    return <div onClick={onClose} className={`fixed inset-0 z-50 ${open ? '' : 'hidden pointer-events-none'}`}>
        <div className="absolute bg-gray-800 rounded-xl w-xs flex flex-col min-w-max" style={{ top: y, left: x }}>
            {items.map((item, index) => <button key={index} onClick={item.action} className="text-left px-4 py-2 rounded-xl hover:bg-gray-700 transition">{item.name}</button>)}
        </div>
    </div>
}
