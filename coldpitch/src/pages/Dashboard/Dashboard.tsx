import { useEffect } from 'react';
import { Users, Send, MessageSquare, TrendingUp } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import KpiCard from '../../components/KpiCard/KpiCard';
import OverviewChart from '../../components/Chart/OverviewChart';
import CampaignList from '../../components/CampaignList/CampaignList';
import ProspectTable from '../../components/ProspectTable/ProspectTable';
import { useAppStore } from '../../stores/useAppStore';

// Mock data - In production, this would come from your API
const mockKPIs = {
  totalProspects: 579,
  prospectChange: 16,
  totalCampaigns: 54,
  campaignChange: 10,
  totalSent: 8399,
  sentChange: 28,
  replyRate: 12.5,
  replyRateChange: 12,
  openRate: 45.2,
  openRateChange: 8,
  conversionRate: 3.2,
  conversionRateChange: 15,
};

const mockChartData = [
  { date: 'Jan', sent: 100, opened: 75, replied: 20 },
  { date: 'Feb', sent: 150, opened: 110, replied: 35 },
  { date: 'Mar', sent: 130, opened: 95, replied: 28 },
  { date: 'Apr', sent: 180, opened: 140, replied: 45 },
  { date: 'May', sent: 170, opened: 130, replied: 42 },
  { date: 'Jun', sent: 200, opened: 160, replied: 55 },
];

const mockActivities = [
  {
    id: '1',
    prospectName: 'Brooklyn Simmons',
    prospectAvatar: '',
    campaignName: 'Allergy Testing',
    type: 'Email Sent' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    time: '10:30',
  },
  {
    id: '2',
    prospectName: 'Courtney Henry',
    prospectAvatar: '',
    campaignName: 'Routine Lab Tests',
    type: 'Replied' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    time: '10:00',
  },
  {
    id: '3',
    prospectName: 'Sarah Miller Olivia',
    prospectAvatar: '',
    campaignName: 'Chronic Disease Management',
    type: 'Email Opened' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    time: '15:00',
  },
  {
    id: '4',
    prospectName: 'Esther Howard',
    prospectAvatar: '',
    campaignName: 'Allergy Testing',
    type: 'Clicked' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    time: '14:00',
  },
  {
    id: '5',
    prospectName: 'Arlene McCoy',
    prospectAvatar: '',
    campaignName: 'Routine Lab Tests',
    type: 'Converted' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    time: '11:30',
  },
  {
    id: '6',
    prospectName: 'Jane Cooper',
    prospectAvatar: '',
    campaignName: 'Acute Illness',
    type: 'Email Sent' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    time: '10:00',
  },
];

const mockProspects = [
  {
    id: '#OMT23AA',
    name: 'Brooklyn Simmons',
    email: 'brooklyn@example.com',
    company: 'Male',
    role: '29 years old',
    hasSocials: false,
    modeOfReachout: 'Email' as const,
    status: 'Contacted' as const,
    tags: [],
    dateAdded: '1995-03-18',
    source: 'Cardiology',
  },
  {
    id: '#AT456BB',
    name: 'Anthony Johnson',
    email: 'anthony@example.com',
    company: 'Male',
    role: '27 years old',
    hasSocials: false,
    modeOfReachout: 'Email' as const,
    status: 'New' as const,
    tags: [],
    dateAdded: '1997-03-18',
    source: 'Cardiology',
  },
  {
    id: '#EA789CC',
    name: 'Sarah Miller Olivia',
    email: 'sarah@example.com',
    company: 'Female',
    role: '35 years old',
    hasSocials: false,
    modeOfReachout: 'Email' as const,
    status: 'Qualified' as const,
    tags: [],
    dateAdded: '1987-03-18',
    source: 'Oncology',
  },
];

export default function Dashboard() {
  const { setKpis, setChartData, setActivities, setProspects } = useAppStore();

  useEffect(() => {
    // In production, fetch data from API
    setKpis(mockKPIs);
    setChartData(mockChartData);
    setActivities(mockActivities);
    setProspects(mockProspects);
  }, [setKpis, setChartData, setActivities, setProspects]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        title="Dashboard"
        onNewCampaign={() => console.log('Create campaign')}
        onExport={() => console.log('Export data')}
      />

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard
            title="Total Prospects"
            value={mockKPIs.totalProspects}
            change={mockKPIs.prospectChange}
            icon={Users}
            link="/prospects"
          />
          <KpiCard
            title="Total Campaigns"
            value={mockKPIs.totalCampaigns}
            change={mockKPIs.campaignChange}
            icon={Send}
            link="/campaigns"
          />
          <KpiCard
            title="Total Sent"
            value={mockKPIs.totalSent.toLocaleString()}
            change={mockKPIs.sentChange}
            icon={MessageSquare}
          />
          <KpiCard
            title="Reply Rate"
            value={`${mockKPIs.replyRate}%`}
            change={mockKPIs.replyRateChange}
            icon={TrendingUp}
          />
        </div>

        {/* Overview Chart and Activity List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <OverviewChart data={mockChartData} />
          </div>
          <div>
            <CampaignList activities={mockActivities} />
          </div>
        </div>

        {/* Prospect Table */}
        <ProspectTable prospects={mockProspects} />
      </div>
    </div>
  );
}
