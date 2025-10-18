import { useState, useEffect } from 'react';
import { Trash2, Edit, Send, BarChart3, Users, Mail, Eye } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import CampaignModal from '../../components/CampaignModal/CampaignModal';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import { useToast } from '../../components/Toast/ToastContext';
import { campaignService } from '../../services/campaignService';
import { useAuth } from '../../hooks/useAuth';
import type { Campaign } from '../../types';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | undefined>();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);
  const [sendingCampaignId, setSendingCampaignId] = useState<string | null>(null);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [selectedStats, setSelectedStats] = useState<any>(null);
  
  const { showToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const data = await campaignService.getCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error('Error loading campaigns:', error);
      showToast('error', 'Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = () => {
    setModalMode('create');
    setSelectedCampaign(undefined);
    setModalOpen(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setModalMode('edit');
    setSelectedCampaign(campaign);
    setModalOpen(true);
  };

  const handleSaveCampaign = async (campaignData: Partial<Campaign>) => {
    try {
      if (modalMode === 'create') {
        await campaignService.createCampaign({
          ...campaignData,
          created_by: user?.id || '',
          created_by_name: user?.name || 'Unknown',
        } as any);
        showToast('success', 'Campaign created successfully');
      } else if (selectedCampaign) {
        await campaignService.updateCampaign(
          selectedCampaign.id,
          campaignData,
          user?.id || '',
          user?.name || 'Unknown'
        );
        showToast('success', 'Campaign updated successfully');
      }
      
      await loadCampaigns();
    } catch (error) {
      console.error('Error saving campaign:', error);
      showToast('error', 'Failed to save campaign');
      throw error;
    }
  };

  const handleDeleteClick = (campaign: Campaign) => {
    setCampaignToDelete(campaign);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!campaignToDelete) return;

    try {
      await campaignService.deleteCampaign(
        campaignToDelete.id,
        user?.id || '',
        user?.name || 'Unknown'
      );
      showToast('success', 'Campaign deleted successfully');
      await loadCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      showToast('error', 'Failed to delete campaign');
    } finally {
      setDeleteModalOpen(false);
      setCampaignToDelete(null);
    }
  };

  const handleSendBulkEmails = async (campaignId: string) => {
    try {
      setSendingCampaignId(campaignId);
      const result = await campaignService.sendBulkEmails(
        campaignId,
        user?.id || '',
        user?.name || 'Unknown'
      );
      
      showToast(
        result.failed > 0 ? 'warning' : 'success',
        'Bulk emails sent!',
        `${result.sent} sent, ${result.failed} failed`
      );
      
      await loadCampaigns();
    } catch (error: any) {
      console.error('Error sending bulk emails:', error);
      showToast('error', 'Failed to send bulk emails', error.message);
    } finally {
      setSendingCampaignId(null);
    }
  };

  const handleViewStats = async (campaign: Campaign) => {
    try {
      const stats = await campaignService.getCampaignStats(campaign.id);
      setSelectedStats({ ...campaign, ...stats });
      setStatsModalOpen(true);
    } catch (error) {
      console.error('Error loading campaign stats:', error);
      showToast('error', 'Failed to load campaign statistics');
    }
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Draft':
        return 'bg-gray-100 text-gray-700';
      case 'Paused':
        return 'bg-yellow-100 text-yellow-700';
      case 'Completed':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: Campaign['type']) => {
    switch (type) {
      case 'Email':
        return <Mail className="w-4 h-4" />;
      case 'LinkedIn':
        return <Users className="w-4 h-4" />;
      case 'Multi-Channel':
        return <BarChart3 className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Campaigns" onNewCampaign={handleCreateCampaign} />
      
      <div className="p-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {campaigns.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {campaigns.filter(c => c.status === 'Active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Send className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Sent</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {campaigns.reduce((sum, c) => sum + (c.sent || 0), 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Replies</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {campaigns.reduce((sum, c) => sum + (c.replied || 0), 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Campaigns List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">All Campaigns</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="text-gray-500 mt-4">Loading campaigns...</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="p-12 text-center">
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
              <p className="text-gray-500 mb-6">Create your first campaign to start reaching prospects</p>
              <button
                onClick={handleCreateCampaign}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Create Campaign
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipients
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Opened
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Replied
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            {getTypeIcon(campaign.type)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                            <div className="text-xs text-gray-500">{campaign.created_by_name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{campaign.type}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {campaign.totalProspects}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {campaign.sent || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {campaign.opened || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {campaign.replied || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(campaign.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewStats(campaign)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Stats"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleSendBulkEmails(campaign.id)}
                            disabled={sendingCampaignId === campaign.id || campaign.status === 'Completed'}
                            className="text-green-600 hover:text-green-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                            title="Send Bulk Emails"
                          >
                            {sendingCampaignId === campaign.id ? (
                              <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleEditCampaign(campaign)}
                            className="text-purple-600 hover:text-purple-900"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(campaign)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Campaign Modal */}
      <CampaignModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveCampaign}
        campaign={selectedCampaign}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Campaign"
        message={`Are you sure you want to delete "${campaignToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
      />

      {/* Stats Modal */}
      {statsModalOpen && selectedStats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Campaign Statistics</h2>
              <button
                onClick={() => setStatsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-700">Campaign Name:</span>
                <span className="font-medium text-gray-900">{selectedStats.name}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-700">Total Recipients:</span>
                <span className="font-medium text-gray-900">{selectedStats.totalProspects}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-700">Emails Sent:</span>
                <span className="font-medium text-gray-900">{selectedStats.sent}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-700">Opened:</span>
                <span className="font-medium text-gray-900">
                  {selectedStats.opened} ({selectedStats.openRate.toFixed(1)}%)
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-700">Replied:</span>
                <span className="font-medium text-gray-900">
                  {selectedStats.replied} ({selectedStats.replyRate.toFixed(1)}%)
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-700">Converted:</span>
                <span className="font-medium text-gray-900">
                  {selectedStats.converted} ({selectedStats.conversionRate.toFixed(1)}%)
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-700">Status:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedStats.status)}`}>
                  {selectedStats.status}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setStatsModalOpen(false)}
                className="w-full px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
