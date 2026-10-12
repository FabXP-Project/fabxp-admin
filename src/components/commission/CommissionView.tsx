'use client';

import React, { useState } from 'react';
import { Pencil, Check, Plus, X } from 'lucide-react';
import { CommissionDefaults, CustomCommissionOverride } from '../../types/dashboard';

interface CommissionViewProps {
  defaults: CommissionDefaults;
  customOverrides: CustomCommissionOverride[];
  onSaveDefaults: (newDefaults: CommissionDefaults) => void;
  onUpdateOverride: (id: string, newRate: number) => void;
  onAddOverride: (partner: string, category: string, rate: number) => void;
}

export const CommissionView: React.FC<CommissionViewProps> = ({
  defaults,
  customOverrides,
  onSaveDefaults,
  onUpdateOverride,
  onAddOverride,
}) => {
  const [formDefaults, setFormDefaults] = useState<CommissionDefaults>(defaults);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRateValue, setEditRateValue] = useState<number>(0);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New override form state
  const [newPartner, setNewPartner] = useState('');
  const [newCategory, setNewCategory] = useState('Experiences');
  const [newRate, setNewRate] = useState<number>(10);

  const handleStartEdit = (override: CustomCommissionOverride) => {
    setEditingId(override.id);
    setEditRateValue(override.customRate);
  };

  const handleSaveEdit = (id: string) => {
    onUpdateOverride(id, editRateValue);
    setEditingId(null);
  };

  const handleCreateOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartner.trim()) return;
    onAddOverride(newPartner.trim(), newCategory, newRate);
    setNewPartner('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header matching commisions.png */}
      <div>
        <h1 className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight leading-none">
          Commission Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
          Manage default and custom commission rates
        </p>
      </div>

      {/* 2-Card Grid Layout matching commisions.png */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Card: Category Default Rates */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 tracking-tight mb-6">
            Category Default Rates
          </h2>

          <div className="space-y-4">
            {/* Experiences */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-100">
              <span className="text-sm font-semibold text-slate-800">Experiences</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formDefaults.experiences}
                  onChange={(e) =>
                    setFormDefaults({ ...formDefaults, experiences: Number(e.target.value) })
                  }
                  className="w-14 py-1.5 px-2 text-center text-sm font-bold text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
                <span className="text-sm font-medium text-slate-400 w-4">%</span>
              </div>
            </div>

            {/* Stay */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-100">
              <span className="text-sm font-semibold text-slate-800">Stay</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formDefaults.stay}
                  onChange={(e) =>
                    setFormDefaults({ ...formDefaults, stay: Number(e.target.value) })
                  }
                  className="w-14 py-1.5 px-2 text-center text-sm font-bold text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
                <span className="text-sm font-medium text-slate-400 w-4">%</span>
              </div>
            </div>

            {/* Flight */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-100">
              <span className="text-sm font-semibold text-slate-800">Flight</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formDefaults.flight}
                  onChange={(e) =>
                    setFormDefaults({ ...formDefaults, flight: Number(e.target.value) })
                  }
                  className="w-14 py-1.5 px-2 text-center text-sm font-bold text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
                <span className="text-sm font-medium text-slate-400 w-4">%</span>
              </div>
            </div>

            {/* Insurance */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-100">
              <span className="text-sm font-semibold text-slate-800">Insurance</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formDefaults.insurance}
                  onChange={(e) =>
                    setFormDefaults({ ...formDefaults, insurance: Number(e.target.value) })
                  }
                  className="w-14 py-1.5 px-2 text-center text-sm font-bold text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
                <span className="text-sm font-medium text-slate-400 w-4">%</span>
              </div>
            </div>
          </div>

          {/* Full-width Save Button matching commisions.png */}
          <button
            onClick={() => onSaveDefaults(formDefaults)}
            className="w-full mt-6 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-[#0B2545] hover:bg-[#153a65] active:scale-99 transition-all cursor-pointer shadow-xs"
          >
            Save Changes
          </button>
        </div>

        {/* Right Card: Custom Overrides */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Custom Overrides
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-xs font-semibold text-[#0B2545] hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Partner Override</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[12px] font-semibold text-slate-400">
                  <th className="pb-3.5 font-medium">Partner</th>
                  <th className="pb-3.5 font-medium">Category</th>
                  <th className="pb-3.5 font-medium">Custom Rate</th>
                  <th className="pb-3.5 font-medium text-right">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/90 text-sm">
                {customOverrides.map((row) => {
                  const isEditing = editingId === row.id;

                  return (
                    <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Partner */}
                      <td className="py-4 font-bold text-slate-900">
                        {row.partner}
                      </td>

                      {/* Category */}
                      <td className="py-4 text-slate-500">
                        {row.category}
                      </td>

                      {/* Custom Rate */}
                      <td className="py-4 font-semibold text-[#2563EB]">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={editRateValue}
                              onChange={(e) => setEditRateValue(Number(e.target.value))}
                              className="w-14 py-1 px-1.5 text-center text-xs font-bold border border-indigo-300 rounded bg-indigo-50/50"
                              autoFocus
                            />
                            <span className="text-xs">%</span>
                          </div>
                        ) : (
                          <span>{row.customRate}%</span>
                        )}
                      </td>

                      {/* Edit Button */}
                      <td className="py-4 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleSaveEdit(row.id)}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                              title="Save"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(row)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Edit Custom Rate"
                          >
                            <Pencil className="w-4 h-4 stroke-[1.9]" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Partner Override Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Partner Custom Override</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOverride} className="py-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Partner Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Goa Scuba Hub"
                  value={newPartner}
                  onChange={(e) => setNewPartner(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:border-indigo-500"
                >
                  <option value="Experiences">Experiences</option>
                  <option value="Stay">Stay</option>
                  <option value="Flight">Flight</option>
                  <option value="Insurance">Insurance</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Custom Commission Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={newRate}
                  onChange={(e) => setNewRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0B2545] hover:bg-[#153a65] rounded-lg shadow-xs"
                >
                  Add Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
