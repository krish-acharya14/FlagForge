import { faFileCirclePlus } from '@fortawesome/free-solid-svg-icons/faFileCirclePlus'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {
    open: boolean
}

export default function AddAttachmentsOverlay({ open }: Props) {
    return <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-bg-light p-6 rounded-xl w-lg flex flex-col">
            <h2 className="text-xl font-semibold">Add Attachments</h2>
            <hr className="my-4 border-border" />
            <div className="flex flex-row gap-5 items-center">
                <FontAwesomeIcon icon={faFileCirclePlus} className="text-[8rem]" />
                <p className="text-center">Drag and Drop Attachments to Add to the Current Challenge.</p>
            </div>
        </div>
    </div>
}
