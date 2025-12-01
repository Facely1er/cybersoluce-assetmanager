import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Shield, 
  Calendar,
  Activity,
  Crown,
  Search,
  MoreHorizontal
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AuthModal } from '../auth/AuthModal';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer' | 'member';
  status: 'active' | 'inactive' | 'pending';
  last_sign_in?: Date;
  created_at: Date;
  organization?: string;
}

export const UserManagement: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Demo mode - simulate user data
      const currentUser = user || null;
      const demoUsers: User[] = [
        {
          id: '1',
          email: currentUser?.email || 'demo@example.com',
          full_name: (currentUser?.user_metadata as { full_name?: string })?.full_name || 'Demo User',
          role: 'owner',
          status: 'active',
          last_sign_in: new Date(),
          created_at: new Date(),
          organization: 'Demo Organization'
        },
        {
          id: '2',
          email: 'admin@example.com',
          full_name: 'Admin User',
          role: 'admin',
          status: 'active',
          last_sign_in: new Date(Date.now() - 1000 * 60 * 60 * 2),
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
          organization: 'Demo Organization'
        },
        {
          id: '3',
          email: 'editor@example.com',
          full_name: 'Editor User',
          role: 'editor',
          status: 'active',
          last_sign_in: new Date(Date.now() - 1000 * 60 * 60 * 24),
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
          organization: 'Demo Organization'
        },
        {
          id: '4',
          email: 'viewer@example.com',
          full_name: 'Viewer User',
          role: 'viewer',
          status: 'inactive',
          last_sign_in: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
          organization: 'Demo Organization'
        }
      ];
      setUsers(demoUsers);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = (Array.isArray(users) ? users : []).filter(user => {
    if (!user || !user.email) return false;
    
    const matchesSearch = !searchQuery || 
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.full_name && user.full_name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const safeUsers = Array.isArray(users) ? users : [];
  const userStats = {
    total: safeUsers.length,
    active: safeUsers.filter(u => u && u.status === 'active').length,
    admins: safeUsers.filter(u => u && (u.role === 'admin' || u.role === 'owner')).length,
    recent: safeUsers.filter(u => {
      if (!u || !u.last_sign_in) return false;
      try {
        const dayAgo = new Date(Date.now() - 1000 * 60 * 60 * 24);
        const lastSignIn = u.last_sign_in instanceof Date ? u.last_sign_in : new Date(u.last_sign_in);
        return lastSignIn >= dayAgo;
      } catch {
        return false;
      }
    }).length
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'admin': return <Shield className="h-4 w-4 text-red-600" />;
      case 'editor': return <Edit className="h-4 w-4 text-command-blue-600" />;
      case 'viewer': return <Users className="h-4 w-4 text-gray-600" />;
      default: return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'admin': return 'text-red-600 bg-red-50 border-red-200';
      case 'editor': return 'text-command-blue-600 bg-command-blue-50 border-command-blue-200';
      case 'viewer': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'inactive': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleEditUser = (user: User) => {
    // In a real implementation, this would open an edit modal
    // For now, we'll show a toast with edit options
    toast.success(`Edit user: ${user.email}`, {
      duration: 3000,
      icon: '✏️',
    });
  };

  const handleDeleteUser = async (userId: string) => {
    if (!userId) return;
    
    const safeUsers = Array.isArray(users) ? users : [];
    const userToDelete = safeUsers.find(u => u && u.id === userId);
    if (!userToDelete) {
      toast.error('User not found');
      setShowDeleteConfirm(null);
      return;
    }

    if (userToDelete.role === 'owner') {
      toast.error('Cannot remove the owner account');
      setShowDeleteConfirm(null);
      return;
    }

    try {
      // In a real implementation, this would call an API
      setUsers(safeUsers.filter(u => u && u.id !== userId));
      toast.success(`User ${userToDelete.email || 'Unknown'} has been removed`);
      setShowDeleteConfirm(null);
    } catch {
      toast.error('Failed to remove user');
      setShowDeleteConfirm(null);
    }
  };

  const handleMoreOptions = (user: User) => {
    // In a real implementation, this would open a dropdown menu
    toast.success(`More options for: ${user.email}`, {
      duration: 2000,
      icon: '⚙️',
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-command-blue-600 to-action-cyan-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-outfit font-bold mb-2 flex items-center">
              <Users className="h-8 w-8 mr-3" />
              User Management
            </h1>
            <p className="text-lg opacity-90 mb-4">
              Manage user accounts, roles, and permissions
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <span>{userStats.total} Total Users</span>
              </div>
              <div className="flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                <span>{userStats.active} Active</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                <span>{userStats.admins} Administrators</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats.total}</div>
                <div className="text-xs">Users</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-3xl font-outfit font-bold text-gray-900 dark:text-white">{userStats.total}</p>
            </div>
            <div className="p-3 bg-command-blue-50 dark:bg-command-blue-900/20 rounded-lg">
              <Users className="h-6 w-6 text-command-blue-600 dark:text-command-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
              <p className="text-3xl font-outfit font-bold text-green-600 dark:text-green-400">{userStats.active}</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Administrators</p>
              <p className="text-3xl font-outfit font-bold text-purple-600 dark:text-purple-400">{userStats.admins}</p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Activity</p>
              <p className="text-3xl font-outfit font-bold text-orange-600 dark:text-orange-400">{userStats.recent}</p>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-command-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-command-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              aria-label="Filter by role"
            >
              <option value="">All Roles</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
              <option value="member">Member</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-command-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              aria-label="Filter by status"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <button
            onClick={() => setShowAuthModal(true)}
            className="inline-flex items-center px-4 py-2 bg-command-blue-600 dark:bg-command-blue-500 text-white rounded-lg hover:bg-command-blue-700 dark:hover:bg-command-blue-600 transition-colors"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Invite User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-command-blue-600 dark:border-command-blue-400"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Last Sign In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Member Since</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-command-blue-100 dark:bg-command-blue-900/20 rounded-full flex items-center justify-center mr-4">
                          <Users className="h-5 w-5 text-command-blue-600 dark:text-command-blue-400" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {user.full_name || 'No name'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getRoleIcon(user.role)}
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {user.last_sign_in ? (() => {
                        try {
                          const lastSignIn = user.last_sign_in instanceof Date 
                            ? user.last_sign_in 
                            : new Date(user.last_sign_in);
                          return isNaN(lastSignIn.getTime()) 
                            ? 'Invalid Date' 
                            : format(lastSignIn, 'MMM dd, yyyy HH:mm');
                        } catch {
                          return 'Invalid Date';
                        }
                      })() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {(() => {
                        try {
                          const createdAt = user.created_at instanceof Date 
                            ? user.created_at 
                            : new Date(user.created_at);
                          return isNaN(createdAt.getTime()) 
                            ? 'Invalid Date' 
                            : format(createdAt, 'MMM dd, yyyy');
                        } catch {
                          return 'Invalid Date';
                        }
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-command-blue-600 dark:text-command-blue-400 hover:text-command-blue-900 dark:hover:text-command-blue-300 transition-colors"
                          title="Edit user"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {user.role !== 'owner' && (
                          <>
                            {showDeleteConfirm === user.id ? (
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 px-2 py-1 text-xs font-medium transition-colors"
                                  title="Confirm removal"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setShowDeleteConfirm(null)}
                                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 px-2 py-1 text-xs font-medium transition-colors"
                                  title="Cancel"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setShowDeleteConfirm(user.id)}
                                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
                                title="Remove user"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </>
                        )}
                        <button
                          onClick={() => handleMoreOptions(user)}
                          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors"
                          title="More options"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && !loading && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No users found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery || roleFilter || statusFilter
              ? 'Try adjusting your search criteria'
              : 'Get started by inviting team members to your organization'
            }
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="inline-flex items-center px-4 py-2 bg-command-blue-600 dark:bg-command-blue-500 text-white rounded-lg hover:bg-command-blue-700 dark:hover:bg-command-blue-600 transition-colors"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Invite First User
          </button>
        </div>
      )}

      {/* Auth Modal for Invitations */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};