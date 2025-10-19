import { useEffect, useState } from 'react';
import { Users, Receipt, UserCog, DollarSign, Clock } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import { prospectService } from '../../services/supabaseProspectService';
import { invoiceService } from '../../services/invoiceService';
import { staffService } from '../../services/staffService';
import { clientService } from '../../services/clientService';
import { useAuth } from '../../hooks/useAuth';
import type { Prospect, Staff } from '../../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProspects: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    activeStaff: 0,
  });
  const [recentStaffLogins, setRecentStaffLogins] = useState<Staff[]>([]);
  const [recentProspects, setRecentProspects] = useState<Prospect[]>([]);
  const [prospectsByStatus, setProspectsByStatus] = useState<{ name: string; value: number; color: string }[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      console.log('Loading dashboard data...');
      
      const [prospects, invoiceStats, staff, renewalRevenue] = await Promise.all([
        prospectService.getAllProspects(),
        invoiceService.getInvoiceStats(),
        staffService.getAllStaff(),
        clientService.getRenewalRevenue(),
      ]);

      console.log('Dashboard data loaded:', { prospects, invoiceStats, staff, renewalRevenue });

      // Calculate stats - include renewal revenue in total revenue
      setStats({
        totalProspects: prospects.length,
        totalInvoices: invoiceStats.total_invoices,
        totalRevenue: invoiceStats.total_revenue + renewalRevenue,
        activeStaff: staff.filter((s: Staff) => s.status === 'active').length,
      });

      // Get recent staff logins (staff with login times, sorted by most recent)
      const staffWithLogins = staff
        .filter((s: Staff) => s.login_times && s.login_times.length > 0)
        .sort((a: Staff, b: Staff) => {
          const aLast = a.login_times?.[a.login_times.length - 1] || '';
          const bLast = b.login_times?.[b.login_times.length - 1] || '';
          return new Date(bLast).getTime() - new Date(aLast).getTime();
        })
        .slice(0, 5);
      setRecentStaffLogins(staffWithLogins);

      // Get 5 most recent prospects
      const sortedProspects = [...prospects].sort((a, b) => 
        new Date(b.dateAdded || 0).getTime() - new Date(a.dateAdded || 0).getTime()
      ).slice(0, 5);
      setRecentProspects(sortedProspects);

      // Calculate prospects by status for pie chart
      const statusCounts = {
        New: prospects.filter((p: Prospect) => p.status === 'New').length,
        Contacted: prospects.filter((p: Prospect) => p.status === 'Contacted').length,
        Replied: prospects.filter((p: Prospect) => p.status === 'Replied').length,
        Converted: prospects.filter((p: Prospect) => p.status === 'Converted').length,
      };

      setProspectsByStatus([
        { name: 'New', value: statusCounts.New, color: '#3B82F6' },
        { name: 'Contacted', value: statusCounts.Contacted, color: '#8B5CF6' },
        { name: 'Replied', value: statusCounts.Replied, color: '#10B981' },
        { name: 'Converted', value: statusCounts.Converted, color: '#F59E0B' },
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Set empty/default values on error
      setStats({
        totalProspects: 0,
        totalInvoices: 0,
        totalRevenue: 0,
        activeStaff: 0,
      });
      setRecentStaffLogins([]);
      setRecentProspects([]);
      setProspectsByStatus([
        { name: 'New', value: 0, color: '#3B82F6' },
        { name: 'Contacted', value: 0, color: '#8B5CF6' },
        { name: 'Replied', value: 0, color: '#10B981' },
        { name: 'Converted', value: 0, color: '#F59E0B' },
      ]);
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

  const getFirstName = (fullName?: string) => {
    if (!fullName) return 'Admin';
    return fullName.split(' ')[0];
  };

  const formatLastLogin = (loginTimes?: string[]) => {
    if (!loginTimes || loginTimes.length === 0) return 'Never';
    const lastLogin = loginTimes[loginTimes.length - 1];
    const date = new Date(lastLogin);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Dashboard" />

      <div className="p-4 md:p-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-4 md:p-6 text-white shadow-sm">
          <h1 className="text-xl md:text-2xl font-bold">Welcome back, {getFirstName(user?.name)}! 👋</h1>
          <p className="text-purple-100 text-sm mt-1">Here's what's happening with your business today.</p>
        </div>

        {/* Main KPI Cards - Light backgrounds like Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {/* Total Prospects */}
          <div className="bg-blue-50 hover:bg-blue-100 rounded-xl p-4 md:p-6 transition-colors border border-blue-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">Total Prospects</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{loading ? '...' : stats.totalProspects}</p>
            </div>
          </div>

          {/* Total Invoices */}
          <div className="bg-green-50 hover:bg-green-100 rounded-xl p-4 md:p-6 transition-colors border border-green-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <Receipt className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">Total Invoices</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{loading ? '...' : stats.totalInvoices}</p>
            </div>
          </div>

          {/* Active Staff */}
          <div className="bg-orange-50 hover:bg-orange-100 rounded-xl p-4 md:p-6 transition-colors border border-orange-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                <UserCog className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">Active Staff</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{loading ? '...' : stats.activeStaff}</p>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-purple-50 hover:bg-purple-100 rounded-xl p-4 md:p-6 transition-colors border border-purple-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-xs md:text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-lg md:text-xl font-bold text-gray-900">{loading ? '...' : formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>

        {/* Charts and Lists Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Prospects Pie Chart */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prospects Overview</h3>
            {!loading && prospectsByStatus.some(s => s.value > 0) ? (
              <div style={{ width: '100%', height: '256px', minHeight: '256px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={prospectsByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {prospectsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                <p>{loading ? 'Loading...' : 'No prospects data'}</p>
              </div>
            )}
          </div>

          {/* Recent Staff Logins */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Staff Logins</h3>
            {recentStaffLogins.length > 0 ? (
              <div className="space-y-3">
                {recentStaffLogins.map((staff) => (
                  <div key={staff.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-gray-600">
                        {staff.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{staff.name}</p>
                      <p className="text-xs text-gray-500">{staff.email}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {formatLastLogin(staff.login_times)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No recent logins</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Prospects */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Prospects</h3>
          {recentProspects.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-xs font-medium text-gray-600">Name</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-gray-600 hidden md:table-cell">Email</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-gray-600 hidden sm:table-cell">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProspects.map((prospect) => (
                    <tr key={prospect.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2 text-sm text-gray-900">{prospect.name}</td>
                      <td className="py-3 px-2 text-sm text-gray-600 hidden md:table-cell">{prospect.email}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          prospect.status === 'New' ? 'bg-blue-100 text-blue-700' :
                          prospect.status === 'Contacted' ? 'bg-purple-100 text-purple-700' :
                          prospect.status === 'Replied' ? 'bg-green-100 text-green-700' :
                          prospect.status === 'Converted' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {prospect.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-600 hidden sm:table-cell">{prospect.source || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>No recent prospects</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
