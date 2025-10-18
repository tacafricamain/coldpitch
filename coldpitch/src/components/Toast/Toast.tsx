import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import type { ToastMessage } from './ToastContext';

interface ToastProps extends ToastMessage {
  onClose: () => void;
}

export default function Toast({ type, title, message, onClose, duration }: ToastProps) {
  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 md:w-5 md:h-5 w-4 h-4 text-green-500" />,
    error: <XCircle className="w-5 h-5 md:w-5 md:h-5 w-4 h-4 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 md:w-5 md:h-5 w-4 h-4 text-yellow-500" />,
    info: <Info className="w-5 h-5 md:w-5 md:h-5 w-4 h-4 text-blue-500" />,
  };

  const colors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <div
      className={`${colors[type]} border rounded-lg p-3 md:p-4 shadow-lg flex items-start gap-2 md:gap-3 animate-slide-in max-w-xs md:max-w-sm`}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs md:text-sm font-semibold text-gray-900">{title}</p>
        {message && <p className="text-xs md:text-sm text-gray-600 mt-1">{message}</p>}
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-3 h-3 md:w-4 md:h-4" />
      </button>
    </div>
  );
}
