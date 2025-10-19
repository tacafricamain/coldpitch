import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Squares2X2Icon,
  UsersIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useAppStore } from '../../stores/useAppStore';
import { useAuth } from '../../hooks/useAuth';
import { useState, useEffect } from 'react';

const menuItems = [
  { icon: Squares2X2Icon, label: 'Dashboard', path: '/dashboard' },
  { icon: UsersIcon, label: 'Prospects', path: '/prospects' },
  { icon: DocumentTextIcon, label: 'Invoices', path: '/invoices' },
  { icon: BuildingOfficeIcon, label: 'Clients', path: '/clients' },
  { icon: UserGroupIcon, label: 'Staff', path: '/staff' },
  { icon: Cog6ToothIcon, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-30 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="font-semibold text-lg text-gray-700">ColdPitch</span>
          </div>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          {sidebarCollapsed ? (
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-gray-600 font-medium">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'User Name'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          )}
        </div>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          title={sidebarCollapsed ? 'Logout' : undefined}
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );

  // Mobile Bottom Navigation
  const MobileBottomNav = () => {
    // Define the main 3 nav items to show in bottom bar
    const mainNavItems = [
      menuItems.find(item => item.path === '/dashboard'),
      menuItems.find(item => item.path === '/prospects'),
      menuItems.find(item => item.path === '/clients'),
    ].filter(Boolean); // Remove any undefined items

    return (
      <>
        {/* Bottom Navigation Bar - Glassy White with Backdrop Blur */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200/50 shadow-lg z-50">
          <div 
            className="flex items-center justify-around px-2 py-2.5 pb-safe"
            style={{ paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom))' }}
          >
            {mainNavItems.map((item) => {
              if (!item) return null;
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                    isActive ? 'text-green-600' : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-6 h-6 transition-transform ${isActive ? 'scale-110' : ''}`} />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}
            
            {/* More button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all duration-200 text-gray-700 hover:text-gray-900 active:scale-95"
            >
              <Bars3Icon className="w-6 h-6" />
              <span className="text-xs font-medium">More</span>
            </button>
          </div>
        </div>

      {/* Mobile Menu Overlay - Smooth Swipe Up Animation */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[60] animate-fadeIn"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl animate-slideUp"
            onClick={(e) => e.stopPropagation()}
            style={{ 
              paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
              maxHeight: '85vh',
              overflowY: 'auto'
            }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            <div className="px-6 pb-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Menu</h3>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-semibold text-lg">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.name || 'User Name'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              </div>

              {/* All Menu Items */}
              <nav className="space-y-1 mb-4">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-green-50 text-green-600 shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50 active:scale-[0.98]'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 bg-green-600 rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Logout Button */}
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition-all duration-200 active:scale-[0.98]"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
      </>
    );
  };

  return (
    <>
      <div className="hidden md:block">
        <DesktopSidebar />
      </div>
      <div className="md:hidden">
        <MobileBottomNav />
      </div>
    </>
  );
}
