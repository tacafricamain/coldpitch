import { useState, useEffect } from 'react';
import { X, Users, Mail, Calendar, Eye } from 'lucide-react';
import type { Campaign, Prospect } from '../../types';
import { supabase } from '../../lib/supabase';

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (campaign: Partial<Campaign>) => Promise<void>;
  campaign?: Campaign;
  mode: 'create' | 'edit';
}

export default function CampaignModal({ isOpen, onClose, onSave, campaign, mode }: CampaignModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<Campaign['type']>('Email');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState<Campaign['status']>('Draft');
  const [scheduledDate, setScheduledDate] = useState('');
  const [selectedProspects, setSelectedProspects] = useState<string[]>([]);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load prospects
  useEffect(() => {
    if (isOpen) {
      loadProspects();
    }
  }, [isOpen]);

  // Populate form when editing
  useEffect(() => {
    if (campaign && mode === 'edit') {
      setName(campaign.name);
      setType(campaign.type);
      setSubject(campaign.subject || '');
      setBody(campaign.body);
      setStatus(campaign.status);
      setScheduledDate(campaign.scheduled_date || '');
      setSelectedProspects(campaign.prospect_ids || []);
    } else {
      resetForm();
    }
  }, [campaign, mode, isOpen]);

  const loadProspects = async () => {
    try {
      const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .order('name');

      if (error) throw error;
      setProspects(data || []);
    } catch (error) {
      console.error('Error loading prospects:', error);
    }
  };

  const resetForm = () => {
    setName('');
    setType('Email');
    setSubject('');
    setBody('');
    setStatus('Draft');
    setScheduledDate('');
    setSelectedProspects([]);
    setSearchQuery('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave({
        name,
        type,
        subject,
        body,
        status,
        scheduled_date: scheduledDate || undefined,
        prospect_ids: selectedProspects,
      });
      
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error saving campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleProspect = (prospectId: string) => {
    setSelectedProspects(prev =>
      prev.includes(prospectId)
        ? prev.filter(id => id !== prospectId)
        : [...prev, prospectId]
    );
  };

  const selectAllProspects = () => {
    const filteredIds = filteredProspects.map(p => p.id);
    setSelectedProspects(filteredIds);
  };

  const deselectAllProspects = () => {
    setSelectedProspects([]);
  };

  const filteredProspects = prospects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full my-8 max-h-[95vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-lg">
          <h2 className="text-2xl font-semibold text-gray-900">
            {mode === 'create' ? 'Create New Campaign' : 'Edit Campaign'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Campaign Details */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-600" />
              Campaign Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                  placeholder="e.g., Q1 Cold Outreach"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign Type *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as Campaign['type'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                >
                  <option value="Email">Email</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Multi-Channel">Multi-Channel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Campaign['status'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                >
                  <option value="Draft">Draft</option>
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Scheduled Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                />
              </div>
            </div>

            {type === 'Email' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Subject *
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    placeholder="e.g., Boost Your Sales with Our Solution"
                    required={type === 'Email'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Body *
                  </label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 min-h-[200px]"
                    placeholder="Hi {{name}},&#10;&#10;I noticed your company {{company}} and wanted to reach out...&#10;&#10;Use {{name}}, {{company}}, {{email}} as variables."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tip: Use {`{{name}}`}, {`{{company}}`}, {`{{email}}`} as variables
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>

                {showPreview && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Email Preview</h4>
                    <div className="bg-white p-4 rounded border border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Subject:</strong> {subject || '(No subject)'}
                      </p>
                      <div className="text-sm text-gray-900 whitespace-pre-wrap">
                        {body || '(Empty body)'}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Prospect Selection */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-purple-600" />
              Select Recipients ({selectedProspects.length} selected)
            </h3>

            <div className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search prospects..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              />
            </div>

            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={selectAllProspects}
                className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
              >
                Select All ({filteredProspects.length})
              </button>
              <button
                type="button"
                onClick={deselectAllProspects}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Deselect All
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
              {filteredProspects.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No prospects found
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredProspects.map((prospect) => (
                    <label
                      key={prospect.id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedProspects.includes(prospect.id)}
                        onChange={() => toggleProspect(prospect.id)}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{prospect.name}</p>
                        <p className="text-xs text-gray-500">
                          {prospect.email || 'No email'} {prospect.company && `• ${prospect.company}`}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {selectedProspects.length} prospect{selectedProspects.length !== 1 ? 's' : ''} selected
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || selectedProspects.length === 0}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : mode === 'create' ? 'Create Campaign' : 'Update Campaign'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
