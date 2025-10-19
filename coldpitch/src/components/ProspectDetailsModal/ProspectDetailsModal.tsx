import { XMarkIcon, EnvelopeIcon, PhoneIcon, BuildingOfficeIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';
import type { Prospect } from '../../types';
import { ChatBubbleBottomCenterIcon } from '@heroicons/react/16/solid';

interface ProspectDetailsModalProps {
  isOpen: boolean;
  prospect: Prospect | null;
  onClose: () => void;
  onEdit: (prospect: Prospect) => void;
}

export default function ProspectDetailsModal({
  isOpen,
  prospect,
  onClose,
  onEdit,
}: ProspectDetailsModalProps) {
  if (!isOpen || !prospect) return null;

  // Format WhatsApp number (remove spaces, dashes, parentheses)
  const formatWhatsAppNumber = (phone: string) => {
    // Remove all non-numeric characters except +
    let cleaned = phone.replace(/[^\d+]/g, '');
    
    // If number doesn't start with +, assume it needs country code
    // You can customize this based on your needs
    if (!cleaned.startsWith('+')) {
      // If it starts with 0, remove it (common in many countries)
      if (cleaned.startsWith('0')) {
        cleaned = cleaned.substring(1);
      }
      // Add default country code if needed (e.g., +234 for Nigeria)
      // cleaned = '+234' + cleaned;
    }
    
    return cleaned;
  };

  const openWhatsApp = (phone: string) => {
    const formattedNumber = formatWhatsAppNumber(phone);
    const message = encodeURIComponent(`Hi ${prospect.name}, I'd like to discuss a business opportunity with ${prospect.company || 'your company'}.`);
    
    // WhatsApp Business deep link
    // Format: https://wa.me/1234567890?text=Hello
    const whatsappUrl = `https://wa.me/${formattedNumber}?text=${message}`;
    
    // Open in new tab/window
    window.open(whatsappUrl, '_blank');
  };

  const getStatusColor = (status: Prospect['status']) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-700';
      case 'Contacted':
        return 'bg-purple-100 text-purple-700';
      case 'Replied':
        return 'bg-green-100 text-green-700';
      case 'Qualified':
        return 'bg-yellow-100 text-yellow-700';
      case 'Converted':
        return 'bg-pink-100 text-pink-700';
      case 'Unsubscribed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Prospect Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Section */}
          <div className="flex items-start gap-4">
            {prospect.avatarUrl ? (
              <img
                src={prospect.avatarUrl}
                alt={prospect.name}
                className="w-20 h-20 rounded-full"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <span className="text-2xl font-semibold text-white">
                  {prospect.name.charAt(0)}
                </span>
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900">{prospect.name}</h3>
              {/* <p className="text-gray-600 mt-1">{prospect.position || 'Position not specified'}</p> */}
              <div className="mt-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(prospect.status)}`}>
                  {prospect.status}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-gray-900">Contact Information</h4>
            <div className="space-y-3 bg-gray-50 rounded-xl p-4">
              {prospect.email && (
                <div className="flex items-center gap-3">
                  <EnvelopeIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <a href={`mailto:${prospect.email}`} className="text-gray-700 hover:text-green-600">
                    {prospect.email}
                  </a>
                </div>
              )}
              {prospect.phone && (
                <div className="flex items-center gap-3">
                  <PhoneIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <a href={`tel:${prospect.phone}`} className="text-gray-700 hover:text-green-600">
                    {prospect.phone}
                  </a>
                </div>
              )}
              {prospect.whatsapp && (
                <div className="flex items-center gap-3">
                  <ChatBubbleBottomCenterIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <button
                    onClick={() => openWhatsApp(prospect.whatsapp!)}
                    className="text-gray-700 hover:text-green-600 flex items-center gap-2 transition-colors"
                  >
                    <span>{prospect.whatsapp}</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      Open WhatsApp
                    </span>
                  </button>
                </div>
              )}
              {prospect.company && (
                <div className="flex items-center gap-3">
                  <BuildingOfficeIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-700">{prospect.company}</span>
                </div>
              )}
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-gray-900">Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <CalendarIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Date Added</span>
                </div>
                <p className="text-gray-900 font-medium">{prospect.dateAdded}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <UserIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Prospect ID</span>
                </div>
                <p className="text-gray-900 font-medium font-mono text-sm">{prospect.id}</p>
              </div>
            </div>
          </div>

          {/* Notes - Commented out since notes field doesn't exist in Prospect type */}
          {/* {prospect.notes && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-900">Notes</h4>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{prospect.notes}</p>
              </div>
            </div>
          )} */}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                onEdit(prospect);
                onClose();
              }}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
            >
              Edit Prospect
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
