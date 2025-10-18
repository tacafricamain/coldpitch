import api from './api';

export const dashboardService = {
  // Get dashboard KPIs
  getKPIs: async () => {
    const response = await api.get('/dashboard/kpis');
    return response.data;
  },

  // Get chart data for overview
  getChartData: async (period: 'week' | 'month' | 'quarter' | 'year' = 'month') => {
    const response = await api.get('/dashboard/chart', { params: { period } });
    return response.data;
  },

  // Get recent activities
  getActivities: async (limit: number = 10) => {
    const response = await api.get('/dashboard/activities', { params: { limit } });
    return response.data;
  },
};
