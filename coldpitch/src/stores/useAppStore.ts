import { create } from 'zustand';
import type { KPI, Prospect, Campaign, Activity, ChartDataPoint, User } from '../types';

interface AppState {
  // User
  user: User | null;
  setUser: (user: User | null) => void;

  // Dashboard
  kpis: KPI | null;
  setKpis: (kpis: KPI) => void;
  
  chartData: ChartDataPoint[];
  setChartData: (data: ChartDataPoint[]) => void;
  
  activities: Activity[];
  setActivities: (activities: Activity[]) => void;

  // Prospects
  prospects: Prospect[];
  setProspects: (prospects: Prospect[]) => void;
  selectedProspects: string[];
  setSelectedProspects: (ids: string[]) => void;

  // Campaigns
  campaigns: Campaign[];
  setCampaigns: (campaigns: Campaign[]) => void;
  activeCampaign: Campaign | null;
  setActiveCampaign: (campaign: Campaign | null) => void;

  // UI State
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // User
  user: null,
  setUser: (user) => set({ user }),

  // Dashboard
  kpis: null,
  setKpis: (kpis) => set({ kpis }),
  
  chartData: [],
  setChartData: (data) => set({ chartData: data }),
  
  activities: [],
  setActivities: (activities) => set({ activities }),

  // Prospects
  prospects: [],
  setProspects: (prospects) => set({ prospects }),
  selectedProspects: [],
  setSelectedProspects: (ids) => set({ selectedProspects: ids }),

  // Campaigns
  campaigns: [],
  setCampaigns: (campaigns) => set({ campaigns }),
  activeCampaign: null,
  setActiveCampaign: (campaign) => set({ activeCampaign: campaign }),

  // UI State
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
