import { faMinus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'
import { closeWindow, minimizeWindow } from '../services/host'

export default function Ribbon() {
    const navigate = useNavigate()

    return <div className="flex flex-row justify-between items-center bg-bg-light border-b border-border">
        <div onClick={() => navigate('/')} className="flex flex-row items-center gap-2 px-4 py-0.05 cursor-pointer">
            <img src="/favicon.ico" alt="FlagForge Logo" className="w-8 h-8" />
            <h1 className="tracking-wider font-bold">FlagForge</h1>
        </div>
        <div className="flex flex-row items-center">
            <button onClick={async() => await minimizeWindow()} className="w-8 h-8 cursor-pointer hover:bg-border transition"><FontAwesomeIcon icon={faMinus} /></button>
            <button onClick={async() => await closeWindow()} className="w-8 h-8 cursor-pointer hover:bg-primary transition"><FontAwesomeIcon icon={faXmark} /></button>
        </div>
    </div>
}
