import { useEffect, useState } from 'react';
import { Users, Send, TrendingUp, Receipt, UserCog, DollarSign, Activity } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import { prospectService } from '../../services/prospectService';
import { campaignService } from '../../services/campaignService';
import { invoiceService } from '../../services/invoiceService';
import { staffService } from '../../services/staffService';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProspects: 0,
    totalCampaigns: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    totalStaff: 0,
    activeStaff: 0,
    recentActivity: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [prospects, campaigns, invoiceStats, staff] = await Promise.all([
        prospectService.getProspects(),
        campaignService.getCampaigns(),
        invoiceService.getInvoiceStats(),
        staffService.getAllStaff(),
      ]);

      setStats({
        totalProspects: prospects.length,
        totalCampaigns: campaigns.length,
        totalInvoices: invoiceStats.total_invoices,
        totalRevenue: invoiceStats.total_revenue,
        totalStaff: staff.length,
        activeStaff: staff.filter(s => s.status === 'active').length,
        recentActivity: staff.reduce((sum, s) => sum + (s.total_leads_added || 0), 0),
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar
        title="Dashboard"
        onNewCampaign={() => console.log('Create campaign')}
        onExport={() => console.log('Export data')}
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 md:p-8 text-white shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome Back! 👋</h1>
          <p className="text-purple-100 text-sm md:text-base">Here's what's happening with your business today.</p>
        </div>

        {/* Main KPI Cards - Colorful & Beautiful */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {/* Total Prospects */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 md:p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Users className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 opacity-70" />
            </div>
            <p className="text-xs md:text-sm opacity-90 mb-1">Total Prospects</p>
            <p className="text-2xl md:text-3xl font-bold">{loading ? '...' : stats.totalProspects}</p>
          </div>

          {/* Total Campaigns */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 md:p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Send className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 opacity-70" />
            </div>
            <p className="text-xs md:text-sm opacity-90 mb-1">Campaigns</p>
            <p className="text-2xl md:text-3xl font-bold">{loading ? '...' : stats.totalCampaigns}</p>
          </div>

          {/* Total Invoices */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 md:p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Receipt className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <DollarSign className="w-4 h-4 md:w-5 md:h-5 opacity-70" />
            </div>
            <p className="text-xs md:text-sm opacity-90 mb-1">Invoices</p>
            <p className="text-2xl md:text-3xl font-bold">{loading ? '...' : stats.totalInvoices}</p>
          </div>

          {/* Total Staff */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 md:p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <UserCog className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <Activity className="w-4 h-4 md:w-5 md:h-5 opacity-70" />
            </div>
            <p className="text-xs md:text-sm opacity-90 mb-1">Active Staff</p>
            <p className="text-2xl md:text-3xl font-bold">{loading ? '...' : `${stats.activeStaff}/${stats.totalStaff}`}</p>
          </div>
        </div>

        {/* Secondary Stats - Revenue & Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Total Revenue */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : formatCurrency(stats.totalRevenue)}</p>
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  From {stats.totalInvoices} invoices
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Total Leads Added</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.recentActivity}</p>
                <p className="text-xs text-pink-600 mt-1 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  By {stats.activeStaff} active staff members
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => window.location.href = '/prospects'}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <Users className="w-6 h-6 text-blue-600" />
              <span className="text-xs md:text-sm font-medium text-blue-900">View Prospects</span>
            </button>
            <button
              onClick={() => window.location.href = '/campaigns'}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
            >
              <Send className="w-6 h-6 text-purple-600" />
              <span className="text-xs md:text-sm font-medium text-purple-900">Campaigns</span>
            </button>
            <button
              onClick={() => window.location.href = '/invoices'}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
            >
              <Receipt className="w-6 h-6 text-green-600" />
              <span className="text-xs md:text-sm font-medium text-green-900">Invoices</span>
            </button>
            <button
              onClick={() => window.location.href = '/staff'}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors"
            >
              <UserCog className="w-6 h-6 text-orange-600" />
              <span className="text-xs md:text-sm font-medium text-orange-900">Manage Staff</span>
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">System Status</h3>
              <p className="text-sm text-gray-300">All systems operational</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
