import { useState, useEffect } from 'react';
import { ArrowDownTrayIcon, DevicePhoneMobileIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const isIOSDevice = /iPhone|iPad|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Listen for beforeinstallprompt event (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show prompt if not already dismissed
    if (isIOSDevice) {
      const dismissed = localStorage.getItem('ios-install-dismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt && !isIOS) return;

    if (deferredPrompt) {
      // Android/Desktop install
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowPrompt(false);
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (isIOS) {
      localStorage.setItem('ios-install-dismissed', 'true');
    }
  };

  // Don't show if already installed or dismissed
  if (isInstalled || !showPrompt) return null;

  return (
    <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl p-4 shadow-lg border border-primary-400">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <DevicePhoneMobileIcon className="w-6 h-6" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold mb-1">Install ColdPitch App</h3>
          
          {isIOS ? (
            <div className="text-xs space-y-2">
              <p className="opacity-90">Add to your home screen for a better experience:</p>
              <ol className="space-y-1 opacity-90 pl-4 list-decimal">
                <li>Tap the <span className="font-semibold">Share</span> button in Safari</li>
                <li>Scroll and tap <span className="font-semibold">"Add to Home Screen"</span></li>
                <li>Tap <span className="font-semibold">Add</span> to confirm</li>
              </ol>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs opacity-90">
                Install our app for quick access, offline support, and a native app experience.
              </p>
              <button
                onClick={handleInstallClick}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Install Now
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Dismiss"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
