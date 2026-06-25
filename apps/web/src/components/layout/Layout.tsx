import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import CommandPalette from '@/components/ui/CommandPalette'
import { useCommandPalette } from '@/hooks/useCommandPalette'

export default function Layout() {
  const { open, close } = useCommandPalette()

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
      <CommandPalette open={open} onClose={close} />
    </div>
  )
}
