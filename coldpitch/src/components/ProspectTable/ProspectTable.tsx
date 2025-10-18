import { useState, useRef, useEffect } from 'react';
import { Search, Filter, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900">Prospect list</h3>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-gray-900"
              />
            </div>
            
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm text-gray-700">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            
            <select 
              value={statusFilter}
              onChange={(e) => onStatusFilterChange?.(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-gray-900"
            >
              <option value="all">All status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Replied">Replied</option>
              <option value="Qualified">Qualified</option>
              <option value="Converted">Converted</option>
              <option value="Unsubscribed">Unsubscribed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Added
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prospect ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {prospects.map((prospect) => (
              <tr key={prospect.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
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
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {prospect.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{prospect.company || 'N/A'}</p>
                      <p className="text-sm text-gray-500">{prospect.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {prospect.dateAdded}
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(prospect.status)}`}>
                    {prospect.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {prospect.id}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2 relative">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(prospect)}
                        className="p-1 hover:bg-blue-50 rounded text-blue-600"
                        title="Edit prospect"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    <div className="relative" ref={openMenuId === prospect.id ? menuRef : null}>
                      <button
                        onClick={() => setOpenMenuId(openMenuId === prospect.id ? null : prospect.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>

                      {/* Dropdown Menu */}
                      {openMenuId === prospect.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                          {onView && (
                            <button
                              onClick={() => {
                                onView(prospect);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                          )}
                          {onEdit && (
                            <button
                              onClick={() => {
                                onEdit(prospect);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Edit Prospect
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => {
                                onDelete(prospect);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </div>
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
