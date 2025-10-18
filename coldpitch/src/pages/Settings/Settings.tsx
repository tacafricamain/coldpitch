import { useEffect, useState } from 'react';
import { Save, User, Bell, Key, Users } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import { settingsService } from '../../services/settingsService';
import type { Settings as SettingsType } from '../../types';
import { useToast } from '../../components/Toast/ToastContext';
import { useAuth } from '../../hooks/useAuth';

export default function Settings() {
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'api' | 'team'>('profile');
  const { success, error: showError } = useToast();
  const { user, isLoading: authLoading } = useAuth();

  // Get user ID from auth context
  const userId = user?.id;

  useEffect(() => {
    // Only load settings when we have a valid user ID and auth is not loading
    if (userId && !authLoading) {
      console.log('Loading settings for user:', userId);
      loadSettings();
    } else if (!authLoading && !userId) {
      console.error('No user ID available after auth loaded');
      setIsLoading(false);
      showError('Auth error', 'Please log in again');
    }
  }, [userId, authLoading]);

  const loadSettings = async () => {
    if (!userId) {
      console.error('loadSettings called without userId');
      return;
    }
    
    console.log('Fetching settings for userId:', userId);
    setIsLoading(true);
    try {
      const data = await settingsService.getSettings(userId);
      console.log('Settings fetched:', data);
      
      if (data) {
        setSettings(data);
      } else {
        console.log('No settings found, creating defaults...');
        // Create default settings
        const defaultSettings: Partial<SettingsType> = {
          user_id: userId,
          profile: {
            name: user?.name || 'Admin User',
            email: user?.email || 'hello@spex.com.ng',
            timezone: 'UTC',
          },
          notifications: {
            email_notifications: true,
            browser_notifications: true,
            new_reply_alert: true,
            daily_summary: false,
            weekly_report: false,
          },
          api_keys: {},
          team_settings: {
            auto_assign_leads: false,
          },
        };
        
        console.log('Creating settings with:', defaultSettings);
        const created = await settingsService.upsertSettings(userId, defaultSettings);
        console.log('Settings created:', created);
        setSettings(created);
      }
    } catch (err) {
      console.error('❌ Error loading settings:', err);
      showError('Load failed', 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!settings || !userId) return;
    setIsSaving(true);
    try {
      await settingsService.updateProfile(userId, settings.profile);
      success('Saved', 'Profile settings updated successfully');
    } catch (err) {
      showError('Save failed', 'Failed to update profile settings');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    if (!settings || !userId) return;
    setIsSaving(true);
    try {
      await settingsService.updateNotifications(userId, settings.notifications);
      success('Saved', 'Notification settings updated successfully');
    } catch (err) {
      showError('Save failed', 'Failed to update notification settings');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveApiKeys = async () => {
    if (!settings || !userId) return;
    setIsSaving(true);
    try {
      await settingsService.updateApiKeys(userId, settings.api_keys);
      success('Saved', 'API keys updated successfully');
    } catch (err) {
      showError('Save failed', 'Failed to update API keys');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveTeamSettings = async () => {
    if (!settings || !userId) return;
    setIsSaving(true);
    try {
      await settingsService.updateTeamSettings(userId, settings.team_settings);
      success('Saved', 'Team settings updated successfully');
    } catch (err) {
      showError('Save failed', 'Failed to update team settings');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const updateProfile = (field: keyof SettingsType['profile'], value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      profile: {
        ...settings.profile,
        [field]: value,
      },
    });
  };

  const updateNotification = (field: keyof SettingsType['notifications'], value: boolean) => {
    if (!settings) return;
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [field]: value,
      },
    });
  };

  const updateApiKey = (field: keyof SettingsType['api_keys'], value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      api_keys: {
        ...settings.api_keys,
        [field]: value,
      },
    });
  };

  const updateTeamSetting = (field: keyof SettingsType['team_settings'], value: string | boolean) => {
    if (!settings) return;
    setSettings({
      ...settings,
      team_settings: {
        ...settings.team_settings,
        [field]: value,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar title="Settings" />
        <div className="p-12 text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Settings" />

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-4">
              {/* Sidebar */}
              <div className="col-span-1 bg-gray-50 border-r border-gray-200 p-4">
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    Profile
                  </button>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'notifications'
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Bell className="w-5 h-5" />
                    Notifications
                  </button>
                  <button
                    onClick={() => setActiveTab('api')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'api'
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Key className="w-5 h-5" />
                    API Keys
                  </button>
                  <button
                    onClick={() => setActiveTab('team')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'team'
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    Team Settings
                  </button>
                </nav>
              </div>

              {/* Content */}
              <div className="col-span-3 p-6">
                {/* Profile Tab */}
                {activeTab === 'profile' && settings && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={settings.profile.name || ''}
                            onChange={(e) => updateProfile('name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={settings.profile.email || ''}
                            onChange={(e) => updateProfile('email', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={settings.profile.phone || ''}
                            onChange={(e) => updateProfile('phone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Timezone
                          </label>
                          <select
                            value={settings.profile.timezone || 'UTC'}
                            onChange={(e) => updateProfile('timezone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                          >
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">Eastern Time</option>
                            <option value="America/Chicago">Central Time</option>
                            <option value="America/Denver">Mountain Time</option>
                            <option value="America/Los_Angeles">Pacific Time</option>
                            <option value="Europe/London">London</option>
                            <option value="Europe/Paris">Paris</option>
                            <option value="Asia/Tokyo">Tokyo</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && settings && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                            <p className="text-sm text-gray-500">Receive notifications via email</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notifications.email_notifications}
                              onChange={(e) => updateNotification('email_notifications', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Browser Notifications</p>
                            <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notifications.browser_notifications}
                              onChange={(e) => updateNotification('browser_notifications', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                          <div>
                            <p className="text-sm font-medium text-gray-900">New Reply Alerts</p>
                            <p className="text-sm text-gray-500">Get notified when prospects reply</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notifications.new_reply_alert}
                              onChange={(e) => updateNotification('new_reply_alert', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Daily Summary</p>
                            <p className="text-sm text-gray-500">Receive a daily summary of activities</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notifications.daily_summary}
                              onChange={(e) => updateNotification('daily_summary', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Weekly Report</p>
                            <p className="text-sm text-gray-500">Receive a weekly performance report</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notifications.weekly_report}
                              onChange={(e) => updateNotification('weekly_report', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleSaveNotifications}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}

                {/* API Keys Tab */}
                {activeTab === 'api' && settings && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">API Keys</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            OpenAI API Key
                          </label>
                          <input
                            type="password"
                            value={settings.api_keys.openai_key || ''}
                            onChange={(e) => updateApiKey('openai_key', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                            placeholder="sk-..."
                          />
                          <p className="text-xs text-gray-500 mt-1">Used for AI-powered pitch generation</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            SendGrid API Key
                          </label>
                          <input
                            type="password"
                            value={settings.api_keys.sendgrid_key || ''}
                            onChange={(e) => updateApiKey('sendgrid_key', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                            placeholder="SG..."
                          />
                          <p className="text-xs text-gray-500 mt-1">Used for sending email campaigns</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Twilio API Key
                          </label>
                          <input
                            type="password"
                            value={settings.api_keys.twilio_key || ''}
                            onChange={(e) => updateApiKey('twilio_key', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                            placeholder="AC..."
                          />
                          <p className="text-xs text-gray-500 mt-1">Used for SMS and WhatsApp campaigns</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleSaveApiKeys}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}

                {/* Team Settings Tab */}
                {activeTab === 'team' && settings && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Settings</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Company Name
                          </label>
                          <input
                            type="text"
                            value={settings.team_settings.company_name || ''}
                            onChange={(e) => updateTeamSetting('company_name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                            placeholder="Acme Inc."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Company Website
                          </label>
                          <input
                            type="url"
                            value={settings.team_settings.company_website || ''}
                            onChange={(e) => updateTeamSetting('company_website', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                            placeholder="https://example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Default Email Signature
                          </label>
                          <textarea
                            value={settings.team_settings.default_email_signature || ''}
                            onChange={(e) => updateTeamSetting('default_email_signature', e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                            placeholder="Best regards,&#10;John Doe&#10;CEO, Acme Inc."
                          />
                        </div>
                        <div className="flex items-center justify-between py-3 border-t border-gray-200">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Auto-assign Leads</p>
                            <p className="text-sm text-gray-500">Automatically distribute new leads among team members</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.team_settings.auto_assign_leads}
                              onChange={(e) => updateTeamSetting('auto_assign_leads', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleSaveTeamSettings}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
