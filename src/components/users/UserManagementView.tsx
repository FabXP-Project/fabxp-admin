'use client';

import React, { useState } from 'react';
import { Plus, Eye, Pencil, Ban, CheckCircle2, X } from 'lucide-react';
import { UserManagementItem } from '../../types/dashboard';

interface UserManagementViewProps {
  users: UserManagementItem[];
  onAddUser: (user: Omit<UserManagementItem, 'id' | 'listingsCount'>) => void;
  onToggleStatus: (id: string) => void;
  onUpdateUser: (id: string, updated: Partial<UserManagementItem>) => void;
  searchFilter?: string;
  onNavigateAddProvider?: () => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  users,
  onAddUser,
  onToggleStatus,
  onUpdateUser,
  searchFilter = '',
  onNavigateAddProvider,
}) => {
  const [activeTab, setActiveTab] = useState<'Experience Providers' | 'Partners'>('Experience Providers');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUserForView, setSelectedUserForView] = useState<UserManagementItem | null>(null);
  const [editingUser, setEditingUser] = useState<UserManagementItem | null>(null);

  // New user form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<'Provider' | 'Partner'>('Provider');

  const filteredUsers = users.filter((u) => {
    // Tab filter
    if (activeTab === 'Experience Providers' && u.role !== 'Provider') return false;
    if (activeTab === 'Partners' && u.role !== 'Partner') return false;

    // Search filter
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.toLowerCase().includes(q)
    );
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    onAddUser({
      name: newName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim() || '+91 99999 00000',
      role: newRole,
      status: 'Active',
    });

    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    onUpdateUser(editingUser.id, editingUser);
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header matching user.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight leading-none">
            User Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
            Manage experience providers and partners
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onNavigateAddProvider && activeTab === 'Experience Providers' && (
            <button
              onClick={onNavigateAddProvider}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0B2545] hover:bg-[#153a65] active:scale-98 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.2]" />
              <span>Add Provider</span>
            </button>
          )}

          {/* Violet "+ Quick Add" button matching user.png */}
          <button
            onClick={() => {
              setNewRole(activeTab === 'Experience Providers' ? 'Provider' : 'Partner');
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-[#5850EC] bg-[#EEF2FF] hover:bg-[#E0E7FF] active:scale-98 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.2]" />
            <span>Quick Add</span>
          </button>
        </div>
      </div>

      {/* Main Table Card matching user.png */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        {/* Filter Segmented Control Tabs */}
        <div className="bg-[#F8FAFC] border border-slate-100/90 p-1 rounded-xl inline-flex items-center gap-1 mb-6">
          {(['Experience Providers', 'Partners'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[12px] font-semibold text-slate-400">
                <th className="pb-3.5 font-medium">Name</th>
                <th className="pb-3.5 font-medium">Role</th>
                <th className="pb-3.5 font-medium">Email</th>
                <th className="pb-3.5 font-medium">Phone</th>
                <th className="pb-3.5 font-medium">Listings</th>
                <th className="pb-3.5 font-medium">Status</th>
                <th className="pb-3.5 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/90 text-sm">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Name */}
                    <td className="py-4 font-bold text-slate-900 tracking-tight">
                      {user.name}
                    </td>

                    {/* Role */}
                    <td className="py-4 text-slate-500">
                      {user.role}
                    </td>

                    {/* Email */}
                    <td className="py-4 text-slate-600">
                      {user.email}
                    </td>

                    {/* Phone */}
                    <td className="py-4 text-slate-600 font-mono text-xs sm:text-sm">
                      {user.phone}
                    </td>

                    {/* Listings */}
                    <td className="py-4 font-bold text-slate-900 tabular-nums pl-4">
                      {user.listingsCount}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 whitespace-nowrap">
                      {user.status === 'Active' ? (
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-[#E8F8EE] text-[#16A34A] border border-[#C5EAD0]/60">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA]/60">
                          Suspended
                        </span>
                      )}
                    </td>

                    {/* Actions: Eye, Pencil, Ban matching user.png */}
                    <td className="py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* View */}
                        <button
                          onClick={() => setSelectedUserForView(user)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 stroke-[1.9]" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => setEditingUser(user)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4 stroke-[1.9]" />
                        </button>

                        {/* Toggle Suspend/Activate */}
                        <button
                          onClick={() => onToggleStatus(user.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            user.status === 'Active'
                              ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={user.status === 'Active' ? 'Suspend User' : 'Activate User'}
                        >
                          <Ban className="w-4 h-4 stroke-[1.9]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-sm">
                    No users found for this category or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add New {newRole}</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="py-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Name / Entity
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Coastal Adventures"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'Provider' | 'Partner')}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:border-indigo-500"
                >
                  <option value="Provider">Provider</option>
                  <option value="Partner">Partner</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. contact@coastal.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. +91 98765 43210"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#5850EC] hover:bg-[#4E44D4] rounded-lg shadow-xs"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Edit {editingUser.name}</h3>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="py-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={editingUser.phone}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Status
                </label>
                <select
                  value={editingUser.status}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      status: e.target.value as 'Active' | 'Suspended',
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:border-indigo-500"
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#5850EC] hover:bg-[#4E44D4] rounded-lg shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {selectedUserForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">{selectedUserForView.name}</h3>
              <button
                onClick={() => setSelectedUserForView(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Role</span>
                <span className="font-semibold text-slate-700">{selectedUserForView.role}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Email</span>
                <span className="font-semibold text-slate-700">{selectedUserForView.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Phone</span>
                <span className="font-semibold text-slate-700">{selectedUserForView.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Live Listings</span>
                <span className="font-bold text-slate-900">{selectedUserForView.listingsCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Account Status</span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    selectedUserForView.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {selectedUserForView.status}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedUserForView(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
