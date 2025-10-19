import { Plus, Download } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import NotificationsDropdown from '../NotificationsDropdown/NotificationsDropdown';

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
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40 md:static">
      <div className="px-4 md:px-6 py-4">
        {/* Greeting - Desktop only */}
        <div className="hidden md:flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            ☀️ {getGreeting()}
          </h1>
          <div className="flex items-center gap-3">
            {/* Notifications Dropdown */}
            <NotificationsDropdown />
          </div>
        </div>

        {/* Mobile: Title and Notification */}
        <div className="flex md:hidden items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <NotificationsDropdown />
        </div>

        {/* Title and Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="hidden md:block">
            <h2 className="text-lg font-medium text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Overview of all of your prospects and campaigns
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
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
