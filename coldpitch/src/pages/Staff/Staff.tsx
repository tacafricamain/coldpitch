import { useEffect, useState } from 'react';
import { Users, UserPlus, Clock, TrendingUp, Activity as ActivityIcon, Edit, Trash2 } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import StaffModal from '../../components/StaffModal/StaffModal';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import PasswordModal from '../../components/PasswordModal/PasswordModal';
import { staffService } from '../../services/staffService';
import type { Staff, ActivityLog } from '../../types';
import { useToast } from '../../components/Toast/ToastContext';

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<Staff | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newStaffCredentials, setNewStaffCredentials] = useState<{ name: string; email: string; password: string } | null>(null);
  const { success, error: showError } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [staffData, logs] = await Promise.all([
        staffService.getAllStaff(),
        staffService.getActivityLogs(undefined, 100),
      ]);
      setStaff(staffData);
      setActivityLogs(logs);
    } catch (err) {
      showError('Load failed', 'Failed to load staff data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler functions
  const handleAddStaff = () => {
    setEditingStaff(null);
    setShowStaffModal(true);
  };

  const handleEditStaff = (staffMember: Staff) => {
    setEditingStaff(staffMember);
    setShowStaffModal(true);
  };

  const handleDeleteStaff = (staffMember: Staff) => {
    setDeletingStaff(staffMember);
    setShowDeleteConfirm(true);
  };

  const handleSaveStaff = async (staffData: Partial<Staff>) => {
    try {
      // Hardcoded current user for demo (replace with actual auth user)
      const currentUserId = staff[0]?.id || 'admin-user-id';
      const currentUserName = staff[0]?.name || 'Admin User';

      if (editingStaff) {
        // Update existing staff
        const updated = await staffService.updateStaff(
          editingStaff.id, 
          staffData,
          currentUserId,
          currentUserName
        );
        setStaff(staff.map(s => s.id === editingStaff.id ? updated : s));
        success('Staff updated', `${staffData.name} has been updated successfully`);
      } else {
        // Add new staff
        const result = await staffService.createStaff(
          staffData,
          currentUserId,
          currentUserName
        );
        setStaff([result.staff, ...staff]);
        
        // Show password modal
        setNewStaffCredentials({
          name: staffData.name || '',
          email: staffData.email || '',
          password: result.password,
        });
        setShowPasswordModal(true);
        
        success(
          'Staff added',
          `${staffData.name} has been added. Login credentials sent to ${staffData.email}`
        );
      }
      
      setShowStaffModal(false);
      setEditingStaff(null);
      
      // Reload activity logs
      const logs = await staffService.getActivityLogs(undefined, 100);
      setActivityLogs(logs);
    } catch (err: any) {
      showError('Save failed', err?.message || 'An error occurred while saving staff member');
      console.error('Staff save error:', err);
      
      // Check if it's a database column error
      if (err?.message?.includes('duty_days') || err?.code === '42703') {
        console.error('⚠️ MISSING COLUMN: duty_days column not found in staff table');
        console.error('📋 Run this SQL in Supabase to fix:');
        console.error('ALTER TABLE staff ADD COLUMN IF NOT EXISTS duty_days TEXT[] DEFAULT \'{}\';');
      }
    }
  };

  const confirmDelete = async () => {
    if (!deletingStaff) return;

    try {
      const currentUserId = staff[0]?.id || 'admin-user-id';
      const currentUserName = staff[0]?.name || 'Admin User';

      await staffService.deleteStaff(deletingStaff.id, currentUserId, currentUserName);
      setStaff(staff.filter(s => s.id !== deletingStaff.id));
      success('Staff deleted', `${deletingStaff.name} has been removed from the team`);
      
      setShowDeleteConfirm(false);
      setDeletingStaff(null);
      
      // Reload activity logs
      const logs = await staffService.getActivityLogs(undefined, 100);
      setActivityLogs(logs);
    } catch (err) {
      showError('Delete failed', 'An error occurred while deleting staff member');
      console.error(err);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getActivityIcon = (action: string) => {
    if (action.includes('created') || action.includes('added')) {
      return <UserPlus className="w-4 h-4" />;
    }
    if (action.includes('updated') || action.includes('edited')) {
      return <Edit className="w-4 h-4" />;
    }
    if (action.includes('deleted')) {
      return <Trash2 className="w-4 h-4" />;
    }
    return <ActivityIcon className="w-4 h-4" />;
  };

  const getActivityColor = (action: string) => {
    if (action.includes('created') || action.includes('added')) {
      return 'text-green-600 bg-green-50';
    }
    if (action.includes('updated') || action.includes('edited')) {
      return 'text-blue-600 bg-blue-50';
    }
    if (action.includes('deleted')) {
      return 'text-red-600 bg-red-50';
    }
    return 'text-gray-600 bg-gray-50';
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-700';
      case 'Sales Manager':
        return 'bg-blue-100 text-blue-700';
      case 'Sales Rep':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getLastLogin = (loginTimes: string[]) => {
    if (!loginTimes || loginTimes.length === 0) return 'Never';
    const lastLogin = new Date(loginTimes[loginTimes.length - 1]);
    const now = new Date();
    const diffMs = now.getTime() - lastLogin.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  // Check if staff logged in today (if today is a duty day)
  const getAttendanceStatus = (member: Staff) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const dutyDays = member.duty_days || [];
    
    // If no duty days set, return null (not tracked)
    if (dutyDays.length === 0) return null;
    
    // If today is not a duty day, return null
    if (!dutyDays.includes(today)) return null;
    
    // Check if logged in today
    const todayDate = new Date().toDateString();
    const loggedInToday = member.login_times.some(time => 
      new Date(time).toDateString() === todayDate
    );
    
    return loggedInToday ? 'present' : 'absent';
  };

  const totalLeads = staff.reduce((sum, s) => sum + s.total_leads_added, 0);
  const activeStaff = staff.filter(s => s.status === 'active').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Staff Management" />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Staff</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{staff.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Active Staff</p>
                <p className="text-2xl font-semibold text-green-600 mt-1">{activeStaff}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Leads Added</p>
                <p className="text-2xl font-semibold text-purple-600 mt-1">{totalLeads}</p>
              </div>
              <UserPlus className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Activities</p>
                <p className="text-2xl font-semibold text-orange-600 mt-1">{activityLogs.length}</p>
              </div>
              <ActivityIcon className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Staff List */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Staff</h3>
              <button
                onClick={handleAddStaff}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Add Staff
              </button>
            </div>

            {isLoading ? (
              <div className="p-12 text-center">
                <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500">Loading staff...</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {staff.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div 
                        className="flex items-center gap-3 flex-1 cursor-pointer"
                        onClick={() => setSelectedStaff(member)}
                      >
                        {member.avatarUrl ? (
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            className="w-12 h-12 rounded-full"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-lg font-medium text-gray-600">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.email}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleColor(member.role)}`}>
                              {member.role}
                            </span>
                            {member.status === 'active' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                                Active
                              </span>
                            )}
                            {(() => {
                              const attendance = getAttendanceStatus(member);
                              if (attendance === 'present') {
                                return (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                                    ✓ Logged in today
                                  </span>
                                );
                              } else if (attendance === 'absent') {
                                return (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                                    ✗ Not logged in yet
                                  </span>
                                );
                              }
                              return null;
                            })()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 ml-4">
                        <div className="text-right text-sm mr-2">
                          <p className="text-gray-500">
                            <Clock className="w-4 h-4 inline mr-1" />
                            {getLastLogin(member.login_times)}
                          </p>
                          <p className="text-gray-900 font-medium mt-1">
                            {member.total_leads_added} leads
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditStaff(member);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit staff"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteStaff(member);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete staff"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-4 max-h-[600px] overflow-y-auto">
              <div className="space-y-4">
                {activityLogs.slice(0, 20).map((log) => (
                  <div key={log.id} className="flex gap-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(log.action)}`}>
                      {getActivityIcon(log.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{log.user_name}</span>{' '}
                        {log.action}
                      </p>
                      {log.details && Object.keys(log.details).length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {JSON.stringify(log.details, null, 2).length > 100
                            ? Object.entries(log.details)
                                .slice(0, 2)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(', ')
                            : JSON.stringify(log.details)}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDateTime(log.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Staff Details Modal */}
        {selectedStaff && (
          <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {selectedStaff.avatarUrl ? (
                      <img
                        src={selectedStaff.avatarUrl}
                        alt={selectedStaff.name}
                        className="w-16 h-16 rounded-full"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-2xl font-medium text-gray-600">
                          {selectedStaff.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{selectedStaff.name}</h3>
                      <p className="text-gray-500">{selectedStaff.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedStaff(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium mt-1 ${getRoleColor(selectedStaff.role)}`}>
                      {selectedStaff.role}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-sm font-medium text-gray-900 mt-1 capitalize">{selectedStaff.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Leads Added</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{selectedStaff.total_leads_added}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Login Count</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{selectedStaff.login_times.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Login</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{getLastLogin(selectedStaff.login_times)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Joined</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{formatDate(selectedStaff.created_at)}</p>
                  </div>
                </div>

                {/* Duty Days */}
                {selectedStaff.duty_days && selectedStaff.duty_days.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Duty Days</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedStaff.duty_days.map((day) => (
                        <span
                          key={day}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Login History */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Logins</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedStaff.login_times.slice(-10).reverse().map((time, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {formatDateTime(time)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity for this staff */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Activity History</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {activityLogs
                      .filter(log => log.user_id === selectedStaff.id)
                      .slice(0, 10)
                      .map((log) => (
                        <div key={log.id} className="flex gap-3 p-2 bg-gray-50 rounded-lg">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(log.action)}`}>
                            {getActivityIcon(log.action)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">{log.action}</p>
                            <p className="text-xs text-gray-500">{formatDateTime(log.timestamp)}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        <StaffModal
          isOpen={showStaffModal}
          onClose={() => {
            setShowStaffModal(false);
            setEditingStaff(null);
          }}
          onSave={handleSaveStaff}
          staff={editingStaff}
        />

        <ConfirmModal
          isOpen={showDeleteConfirm}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setDeletingStaff(null);
          }}
          onConfirm={confirmDelete}
          title="Delete Staff Member"
          message={`Are you sure you want to remove ${deletingStaff?.name} from the team? This action cannot be undone.`}
          confirmText="Delete Staff"
          confirmVariant="danger"
        />

        {newStaffCredentials && (
          <PasswordModal
            isOpen={showPasswordModal}
            onClose={() => {
              setShowPasswordModal(false);
              setNewStaffCredentials(null);
            }}
            staffName={newStaffCredentials.name}
            staffEmail={newStaffCredentials.email}
            password={newStaffCredentials.password}
          />
        )}
      </div>
    </div>
  );
}
