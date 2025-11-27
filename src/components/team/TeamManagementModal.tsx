import React, { useState, useEffect } from 'react';
import { X, Users, Mail, Shield, Trash2, UserPlus, Crown, Settings } from 'lucide-react';
import { Organization, OrganizationMember, Invitation } from '../../types/organization';
import { organizationService } from '../../services/organizationService';
import toast from 'react-hot-toast';

interface TeamManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  organization: Organization;
}

export const TeamManagementModal: React.FC<TeamManagementModalProps> = ({
  isOpen,
  onClose,
  organization,
}) => {
  const [activeTab, setActiveTab] = useState<'members' | 'invitations'>('members');
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'editor' | 'viewer' | 'member'>('member');

  const roles = [
    { value: 'owner', label: 'Owner', description: 'Full access and billing management' },
    { value: 'admin', label: 'Admin', description: 'Can manage team and settings' },
    { value: 'editor', label: 'Editor', description: 'Can edit assets and data' },
    { value: 'viewer', label: 'Viewer', description: 'Read-only access' },
    { value: 'member', label: 'Member', description: 'Standard access' },
  ];

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [membersData, invitationsData] = await Promise.all([
        organizationService.getOrganizationMembers(organization.id),
        // Load invitations would go here
        Promise.resolve([]), // Placeholder
      ]);
      setMembers(membersData);
      setInvitations(invitationsData);
    } catch (error) {
      toast.error('Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    try {
      await organizationService.inviteUser(organization.id, inviteEmail, inviteRole);
      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      setInviteRole('member');
      loadData();
    } catch (error) {
      toast.error('Failed to send invitation');
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await organizationService.updateMemberRole(organization.id, userId, newRole);
      toast.success('Role updated successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;

    try {
      await organizationService.removeMember(organization.id, userId);
      toast.success('Member removed successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to remove member');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'admin': return <Settings className="h-4 w-4 text-red-600" />;
      case 'editor': return <Shield className="h-4 w-4 text-blue-600" />;
      default: return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'admin': return 'text-red-600 bg-red-50 border-red-200';
      case 'editor': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'viewer': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-command-blue-600 to-action-cyan-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-outfit font-bold">Team Management</h2>
                <p className="text-sm opacity-90">{organization.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('members')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'members'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Members ({members.length})
            </button>
            <button
              onClick={() => setActiveTab('invitations')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'invitations'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Invitations ({invitations.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'members' && (
            <div className="space-y-6">
              {/* Invite Form */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Invite New Member</h3>
                <form onSubmit={handleInviteUser} className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {roles.filter(r => r.value !== 'owner').map(role => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite
                  </button>
                </form>
              </div>

              {/* Members List */}
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  </div>
                ) : (
                  members.map((member) => (
                    <div key={member.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {member.user?.full_name || member.user?.email}
                            </div>
                            <div className="text-sm text-gray-500">{member.user?.email}</div>
                            <div className="text-xs text-gray-400">
                              Joined {new Date(member.joined_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            {getRoleIcon(member.role)}
                            <select
                              value={member.role}
                              onChange={(e) => handleUpdateRole(member.user_id, e.target.value)}
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(member.role)}`}
                              disabled={member.role === 'owner'}
                            >
                              {roles.map(role => (
                                <option 
                                  key={role.value} 
                                  value={role.value}
                                  disabled={role.value === 'owner' && member.role !== 'owner'}
                                >
                                  {role.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          {member.role !== 'owner' && (
                            <button
                              onClick={() => handleRemoveMember(member.user_id)}
                              className="text-red-600 hover:text-red-700 p-1"
                              title="Remove member"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'invitations' && (
            <div className="space-y-4">
              {invitations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No pending invitations</p>
                </div>
              ) : (
                invitations.map((invitation) => (
                  <div key={invitation.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <Mail className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{invitation.email}</div>
                          <div className="text-sm text-gray-500">
                            Invited {new Date(invitation.created_at).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400">
                            Expires {new Date(invitation.expires_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(invitation.role)}`}>
                          {invitation.role}
                        </span>
                        <button
                          onClick={() => {/* Cancel invitation */}}
                          className="text-red-600 hover:text-red-700 p-1"
                          title="Cancel invitation"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer with Role Descriptions */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="text-sm text-gray-600">
            <h4 className="font-medium mb-2">Role Permissions:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {roles.slice(0, 4).map(role => (
                <div key={role.value} className="flex items-start space-x-2">
                  {getRoleIcon(role.value)}
                  <div>
                    <span className="font-medium">{role.label}:</span>
                    <span className="ml-1">{role.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};