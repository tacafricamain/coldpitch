import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import { useAppStore } from '../stores/useAppStore';

export default function Layout() {
  const { sidebarCollapsed } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div
        className={`transition-all duration-300 md:${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        } pb-20 md:pb-0`}
      >
        <Outlet />
      </div>
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <Sidebar />
      </div>
    </div>
  );
}
