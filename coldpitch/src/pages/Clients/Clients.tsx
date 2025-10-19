import { useEffect, useState } from 'react';
import { Building2, Calendar, DollarSign, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import { clientService } from '../../services/clientService';
import type { ClientProject } from '../../types';
import ClientProjectModal from '../../components/ClientProjectModal/ClientProjectModal';

export default function Clients() {
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ClientProject | undefined>();
  const [stats, setStats] = useState({
    total_projects: 0,
    active_renewals: 0,
    paid_renewals: 0,
    pending_renewals: 0,
    overdue_renewals: 0,
    total_revenue: 0,
    renewal_revenue: 0,
  });

  useEffect(() => {
    loadProjects();
    loadStats();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [filterStatus, projects]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await clientService.getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await clientService.getProjectStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const filterProjects = () => {
    if (filterStatus === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.renewal_status === filterStatus));
    }
  };

  const handleAddProject = () => {
    setSelectedProject(undefined);
    setShowModal(true);
  };

  const handleEditProject = (project: ClientProject) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleSaveProject = async () => {
    await loadProjects();
    await loadStats();
    setShowModal(false);
  };

  const handleMarkAsPaid = async (project: ClientProject) => {
    try {
      await clientService.markRenewalAsPaid(project.id, project.renewal_amount || 0);
      await loadProjects();
      await loadStats();
    } catch (error) {
      console.error('Error marking as paid:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      Paid: 'bg-green-100 text-green-700',
      Pending: 'bg-yellow-100 text-yellow-700',
      Overdue: 'bg-red-100 text-red-700',
      Cancelled: 'bg-gray-100 text-gray-700',
      'N/A': 'bg-gray-100 text-gray-500',
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'Pending':
        return <Clock className="w-4 h-4" />;
      case 'Overdue':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const isRenewalSoon = (renewalDate?: string) => {
    if (!renewalDate) return false;
    const date = new Date(renewalDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    return date <= thirtyDaysFromNow && date >= today;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Client Projects" />

      <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Add Project Button */}
          <div className="mb-4">
            <button
              onClick={handleAddProject}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
            >
              + New Project
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs md:text-sm text-gray-600">Total Projects</p>
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{stats.total_projects}</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs md:text-sm text-gray-600">Active Renewals</p>
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{stats.active_renewals}</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs md:text-sm text-gray-600">Paid Renewals</p>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{stats.paid_renewals}</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs md:text-sm text-gray-600">Renewal Revenue</p>
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-lg md:text-xl font-bold text-gray-900">{formatCurrency(stats.renewal_revenue)}</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="border-b border-gray-200 overflow-x-auto">
              <div className="flex gap-1 p-2 min-w-max">
                {['All', 'Pending', 'Paid', 'Overdue', 'N/A'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      filterStatus === status
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Projects Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client & Project
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Renewal
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        Loading projects...
                      </td>
                    </tr>
                  ) : filteredProjects.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        No projects found
                      </td>
                    </tr>
                  ) : (
                    filteredProjects.map((project) => (
                      <tr
                        key={project.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleEditProject(project)}
                      >
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{project.client_name}</p>
                            <p className="text-sm text-gray-500">{project.project_name}</p>
                            <span className={`md:hidden inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusBadge(project.renewal_status)}`}>
                              {getStatusIcon(project.renewal_status)}
                              {project.renewal_status}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm text-gray-900">{project.project_type}</span>
                            {project.renewal_type && project.renewal_type !== 'None' && (
                              <span className="text-xs text-gray-500">{project.renewal_type}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <div className="flex flex-col gap-1">
                            {project.next_renewal_date ? (
                              <>
                                <span className="text-sm text-gray-900">{formatDate(project.next_renewal_date)}</span>
                                {isRenewalSoon(project.next_renewal_date) && project.renewal_status === 'Pending' && (
                                  <span className="text-xs text-orange-600 font-medium">Due soon!</span>
                                )}
                              </>
                            ) : (
                              <span className="text-sm text-gray-400">N/A</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-gray-900">
                              {formatCurrency(project.renewal_amount || project.amount)}
                            </span>
                            {project.payment_status === 'Paid' && (
                              <span className="text-xs text-green-600">Paid {formatDate(project.last_payment_date)}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(project.renewal_status)}`}>
                            {getStatusIcon(project.renewal_status)}
                            {project.renewal_status}
                          </span>
                        </td>
                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                          {project.renewal_status === 'Pending' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsPaid(project);
                              }}
                              className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors"
                            >
                              Mark Paid
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <ClientProjectModal
          project={selectedProject}
          onClose={() => setShowModal(false)}
          onSave={handleSaveProject}
        />
      )}
    </div>
  );
}
