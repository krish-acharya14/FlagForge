import { Outlet } from 'react-router-dom'
import Ribbon from './components/Ribbon'

export default function RootLayout() {
    return <div className="flex flex-col h-screen">
        <Ribbon />
        <Outlet />
    </div>
}
