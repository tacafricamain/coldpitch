import api from './api';
import type { Prospect } from '../types';

export const prospectService = {
  // Get all prospects with optional filters
  getProspects: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    tags?: string[];
  }) => {
    const response = await api.get('/prospects', { params });
    return response.data;
  },

  // Get single prospect by ID
  getProspect: async (id: string) => {
    const response = await api.get(`/prospects/${id}`);
    return response.data;
  },

  // Create new prospect
  createProspect: async (data: Partial<Prospect>) => {
    const response = await api.post('/prospects', data);
    return response.data;
  },

  // Update prospect
  updateProspect: async (id: string, data: Partial<Prospect>) => {
    const response = await api.put(`/prospects/${id}`, data);
    return response.data;
  },

  // Delete prospect
  deleteProspect: async (id: string) => {
    const response = await api.delete(`/prospects/${id}`);
    return response.data;
  },

  // Import prospects from CSV
  importProspects: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/prospects/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Update prospect status
  updateStatus: async (id: string, status: Prospect['status']) => {
    const response = await api.patch(`/prospects/${id}/status`, { status });
    return response.data;
  },

  // Bulk actions
  bulkDelete: async (ids: string[]) => {
    const response = await api.post('/prospects/bulk-delete', { ids });
    return response.data;
  },

  bulkUpdateStatus: async (ids: string[], status: Prospect['status']) => {
    const response = await api.post('/prospects/bulk-update-status', { ids, status });
    return response.data;
  },
};
