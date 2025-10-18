import { Search, Bell, Plus, Download } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';

interface NavbarProps {
  title?: string;
  greeting?: string;
  onNewCampaign?: () => void;
  onExport?: () => void;
  newButtonText?: string;
}

export default function Navbar({
  title = 'Dashboard',
  greeting,
  onNewCampaign,
  onExport,
  newButtonText = 'Create new',
}: NavbarProps) {
  const { user } = useAppStore();

  const getGreeting = () => {
    if (greeting) return greeting;
    
    const hour = new Date().getHours();
    const userName = user?.name?.split(' ')[0] || 'there';
    
    if (hour < 12) return `Good Morning, ${userName}!`;
    if (hour < 18) return `Good Afternoon, ${userName}!`;
    return `Good Evening, ${userName}!`;
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 md:px-6 py-4">
        {/* Greeting */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg md:text-2xl font-semibold text-gray-900">
            ☀️ <span className="hidden sm:inline">{getGreeting()}</span>
            <span className="sm:hidden">Hello!</span>
          </h1>
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search (Mobile) */}
            <button className="p-2 hover:bg-gray-100 rounded-lg md:hidden">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            
            {/* Notifications */}
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Title and Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base md:text-lg font-medium text-gray-900">{title}</h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1 hidden md:block">
              Overview of all of your prospects and campaigns
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search (Desktop) */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64 text-gray-900"
              />
            </div>

            {/* Export Button */}
            {onExport && (
              <button
                onClick={onExport}
                className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm md:text-base text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            )}

            {/* Create New Campaign */}
            {onNewCampaign && (
              <button
                onClick={onNewCampaign}
                className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm md:text-base bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">{newButtonText}</span>
                <span className="sm:hidden">New</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
