import { useState } from 'react';
import { Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import type { Prospect } from '../../types';

interface ProspectTableProps {
  prospects: Prospect[];
  onSelect?: (ids: string[]) => void;
  selectedIds?: string[];
  onEdit?: (prospect: Prospect) => void;
  onDelete?: (prospect: Prospect) => void;
  onView?: (prospect: Prospect) => void;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  statusFilter?: string;
  onStatusFilterChange?: (value: string) => void;
}

export default function ProspectTable({
  prospects,
  onSelect,
  selectedIds = [],
  onEdit,
  onDelete,
  onView,
  searchQuery = '',
  onSearchChange,
  statusFilter = 'all',
  onStatusFilterChange,
}: ProspectTableProps) {
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    if (selectAll) {
      onSelect?.([]);
    } else {
      onSelect?.(prospects.map((p) => p.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelect?.(selectedIds.filter((sid) => sid !== id));
    } else {
      onSelect?.([...selectedIds, id]);
    }
  };

  const getStatusColor = (status: Prospect['status']) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-700';
      case 'Contacted':
        return 'bg-purple-100 text-purple-700';
      case 'Replied':
        return 'bg-green-100 text-green-700';
      case 'Qualified':
        return 'bg-yellow-100 text-yellow-700';
      case 'Converted':
        return 'bg-pink-100 text-pink-700';
      case 'Unsubscribed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-3 md:p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">Prospect list</h3>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <div className="relative flex-shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-gray-900 w-40 sm:w-auto"
              />
            </div>
            
            <button className="hidden md:flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm text-gray-700 whitespace-nowrap">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            
            <select 
              value={statusFilter}
              onChange={(e) => onStatusFilterChange?.(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-gray-900 flex-shrink-0"
            >
              <option value="all">All</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Replied">Replied</option>
              <option value="Converted">Converted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left hidden md:table-cell">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Date Added
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Prospect ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {prospects.map((prospect) => (
              <tr 
                key={prospect.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onView?.(prospect)}
              >
                <td className="px-4 py-4 hidden md:table-cell" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(prospect.id)}
                    onChange={() => handleSelectOne(prospect.id)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    {prospect.avatarUrl ? (
                      <img
                        src={prospect.avatarUrl}
                        alt={prospect.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {prospect.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{prospect.company || 'N/A'}</p>
                      <p className="text-sm text-gray-500">{prospect.email}</p>
                      <span className={`md:hidden inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(prospect.status)}`}>
                        {prospect.status}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900 hidden md:table-cell">
                  {prospect.dateAdded}
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(prospect.status)}`}>
                    {prospect.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500 hidden md:table-cell">
                  {prospect.id}
                </td>
                <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1">
                    {onView && (
                      <button
                        onClick={() => onView(prospect)}
                        className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(prospect)}
                        className="p-2 hover:bg-green-50 rounded-lg text-green-600 transition-colors"
                        title="Edit Prospect"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(prospect)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                        title="Delete Prospect"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {prospects.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-500">No prospects found</p>
        </div>
      )}
    </div>
  );
}
