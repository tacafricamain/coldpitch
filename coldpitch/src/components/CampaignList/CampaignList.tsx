import { MoreVertical } from 'lucide-react';
import type { Activity } from '../../types';

interface CampaignListProps {
  activities: Activity[];
}

export default function CampaignList({ activities }: CampaignListProps) {
  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'Email Sent':
        return 'bg-blue-100 text-blue-700';
      case 'Email Opened':
        return 'bg-purple-100 text-purple-700';
      case 'Replied':
        return 'bg-green-100 text-green-700';
      case 'Clicked':
        return 'bg-yellow-100 text-yellow-700';
      case 'Converted':
        return 'bg-pink-100 text-pink-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getTimeLabel = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Now';
    if (hours < 24) return 'Today';
    if (hours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Activity list</h3>
        <button className="p-1 hover:bg-gray-100 rounded">
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-gray-600">
                {activity.prospectName.charAt(0)}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {activity.prospectName}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {activity.campaignName}
                  </p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {getTimeLabel(activity.timestamp)}
                </span>
              </div>
              
              <div className="mt-2">
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getActivityColor(activity.type)}`}>
                  {activity.type}
                </span>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="text-sm font-medium text-gray-900">
                {formatTime(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
