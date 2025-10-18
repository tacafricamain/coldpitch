import { useState, useEffect } from 'react';
import { Plus, Upload, Download, Trash2, Mail } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import ProspectTable from '../../components/ProspectTable/ProspectTable';
import ProspectModal from '../../components/ProspectModal/ProspectModal';
import ImportModal from '../../components/ProspectModal/ImportModal';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import { useToast } from '../../components/Toast/ToastContext';
import { useAuth } from '../../hooks/useAuth';
import { exportToCSV } from '../../utils/csvUtils';
import { prospectService } from '../../services/supabaseProspectService';
import type { Prospect } from '../../types';

export default function Prospects() {
  const { success, error: showError } = useToast();
  const { user } = useAuth();
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProspects, setSelectedProspects] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingProspect, setDeletingProspect] = useState<Prospect | null>(null);
  const [editingProspect, setEditingProspect] = useState<Prospect | null>(null);

  // Load prospects from database
  useEffect(() => {
    loadProspects();
  }, []);

  const loadProspects = async () => {
    try {
      setIsLoading(true);
      const data = await prospectService.getAllProspects();
      setProspects(data);
    } catch (err) {
      showError('Error loading prospects', 'Failed to load prospects from database');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProspects = prospects.filter((prospect) => {
    const matchesSearch =
      prospect.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prospect.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prospect.company?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || prospect.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    try {
      const prospectsToExport = selectedProspects.length > 0
        ? prospects.filter(p => selectedProspects.includes(p.id))
        : prospects;

      if (prospectsToExport.length === 0) {
        showError('No prospects to export', 'Please select at least one prospect');
        return;
      }

      const filename = `prospects_${new Date().toISOString().split('T')[0]}.csv`;
      exportToCSV(prospectsToExport, filename);
      success(
        'Export successful',
        `Exported ${prospectsToExport.length} prospect${prospectsToExport.length > 1 ? 's' : ''}`
      );
    } catch (err) {
      showError('Export failed', 'An error occurred while exporting prospects');
    }
  };

  const handleImport = () => {
    setShowImportModal(true);
  };

  const handleImportComplete = async (importedProspects: Partial<Prospect>[]) => {
    try {
      const newProspects = await prospectService.bulkCreateProspects(importedProspects);
      setProspects([...newProspects, ...prospects]);
      success(
        'Import successful',
        `Imported ${newProspects.length} prospect${newProspects.length > 1 ? 's' : ''}`
      );
      setShowImportModal(false);
    } catch (err) {
      showError('Import failed', 'An error occurred while importing prospects');
      console.error(err);
    }
  };

  const handleBulkDelete = () => {
    if (selectedProspects.length === 0) return;
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await prospectService.bulkDeleteProspects(selectedProspects);
      const remaining = prospects.filter(p => !selectedProspects.includes(p.id));
      setProspects(remaining);
      success(
        'Prospects deleted',
        `Deleted ${selectedProspects.length} prospect${selectedProspects.length > 1 ? 's' : ''}`
      );
      setSelectedProspects([]);
      setShowDeleteConfirm(false);
    } catch (err) {
      showError('Delete failed', 'An error occurred while deleting prospects');
      console.error(err);
    }
  };

  const handleDeleteOne = async (prospect: Prospect) => {
    setDeletingProspect(prospect);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteOne = async () => {
    if (!deletingProspect) return;
    
    try {
      await prospectService.deleteProspect(deletingProspect.id);
      const remaining = prospects.filter(p => p.id !== deletingProspect.id);
      setProspects(remaining);
      success('Prospect deleted', `${deletingProspect.name} has been deleted`);
      setShowDeleteConfirm(false);
      setDeletingProspect(null);
    } catch (err) {
      showError('Delete failed', 'An error occurred while deleting the prospect');
      console.error(err);
    }
  };

  const handleAddProspect = () => {
    setEditingProspect(null);
    setShowAddModal(true);
  };

  const handleEditProspect = (prospect: Prospect) => {
    setEditingProspect(prospect);
    setShowAddModal(true);
  };

  const handleSaveProspect = async (prospectData: Partial<Prospect>) => {
    try {
      if (editingProspect) {
        // Update existing prospect
        const updated = await prospectService.updateProspect(
          editingProspect.id, 
          prospectData,
          user?.id,
          user?.name
        );
        setProspects(prospects.map(p =>
          p.id === editingProspect.id ? updated : p
        ));
        success('Prospect updated', `${prospectData.name} has been updated successfully`);
      } else {
        // Add new prospect
        const newProspect = await prospectService.createProspect(
          prospectData,
          user?.id,
          user?.name
        );
        setProspects([newProspect, ...prospects]);
        success('Prospect added', `${prospectData.name} has been added successfully`);
      }
      setShowAddModal(false);
      setEditingProspect(null);
    } catch (err) {
      showError('Save failed', 'An error occurred while saving the prospect');
      console.error(err);
    }
  };

  const stats = {
    total: prospects.length,
    new: prospects.filter(p => p.status === 'New').length,
    contacted: prospects.filter(p => p.status === 'Contacted').length,
    qualified: prospects.filter(p => p.status === 'Qualified').length,
    converted: prospects.filter(p => p.status === 'Converted').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        title="Prospects"
        onExport={handleExport}
      />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">Total Prospects</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">New</p>
            <p className="text-2xl font-semibold text-blue-600 mt-1">{stats.new}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">Contacted</p>
            <p className="text-2xl font-semibold text-purple-600 mt-1">{stats.contacted}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">Qualified</p>
            <p className="text-2xl font-semibold text-yellow-600 mt-1">{stats.qualified}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">Converted</p>
            <p className="text-2xl font-semibold text-green-600 mt-1">{stats.converted}</p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddProspect}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Prospect
              </button>
              <button
                onClick={handleImport}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
              >
                <Upload className="w-4 h-4" />
                Import CSV
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>

            {selectedProspects.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {selectedProspects.length} selected
                </span>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
                  <Mail className="w-4 h-4" />
                  Send Email
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Prospects Table */}
        {isLoading ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500">Loading prospects...</p>
          </div>
        ) : (
          <ProspectTable
            prospects={filteredProspects}
            onSelect={setSelectedProspects}
            selectedIds={selectedProspects}
            onEdit={handleEditProspect}
            onDelete={handleDeleteOne}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        )}
      </div>

      {/* Modals */}
      <ProspectModal
        isOpen={showAddModal}
        prospect={editingProspect}
        onClose={() => {
          setShowAddModal(false);
          setEditingProspect(null);
        }}
        onSave={handleSaveProspect}
      />

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportComplete}
      />

      <ConfirmModal
        isOpen={showDeleteConfirm}
        title={deletingProspect ? "Delete Prospect" : "Delete Prospects"}
        message={
          deletingProspect
            ? `Are you sure you want to delete ${deletingProspect.name}? This action cannot be undone.`
            : `Are you sure you want to delete ${selectedProspects.length} prospect${
                selectedProspects.length > 1 ? 's' : ''
              }? This action cannot be undone.`
        }
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={deletingProspect ? confirmDeleteOne : confirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setDeletingProspect(null);
        }}
      />
    </div>
  );
}

