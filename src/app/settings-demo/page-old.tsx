'use client';

import { useState, useEffect } from 'react';
import { useAppSettingsContext } from '@/contexts/AppSettingsContext';
import { useToast } from '@/components/ToastProvider';

interface Setting {
  id: string;
  key: string;
  value: string;
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
  createdAt: string;
  updatedAt: string;
}

type SettingType = 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';

export default function SettingsManagementPage() {
  const { settings, refreshSettings } = useAppSettingsContext();
  const { show: showToast } = useToast();
  const [allSettings, setAllSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ key: '', value: '', type: 'STRING' as SettingType });
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ key: '', value: '', type: 'STRING' as SettingType });
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Load all settings from the API
  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings?format=array');
      if (!response.ok) throw new Error('Failed to load settings');
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      
      // Ensure we have an array
      if (Array.isArray(data.settings)) {
        setAllSettings(data.settings);
      } else {
        console.error('Expected array but got:', typeof data.settings, data.settings);
        setAllSettings([]);
      }
    } catch (error) {
      showToast('Failed to load settings', { type: 'error' });
      console.error('Error loading settings:', error);
      setAllSettings([]); // Ensure it's always an array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  // Create new setting
  const handleCreate = async () => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });

      if (!response.ok) throw new Error('Failed to create setting');
      
      showToast('Setting created successfully', { type: 'success' });
      setAddForm({ key: '', value: '', type: 'STRING' });
      setShowAddForm(false);
      await loadSettings();
      refreshSettings();
    } catch (error) {
      showToast('Failed to create setting', { type: 'error' });
      console.error('Error creating setting:', error);
    }
  };

  // Update existing setting
  const handleUpdate = async (id: string) => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...editForm }),
      });

      if (!response.ok) throw new Error('Failed to update setting');
      
      showToast('Setting updated successfully', { type: 'success' });
      setEditingId(null);
      await loadSettings();
      refreshSettings();
    } catch (error) {
      showToast('Failed to update setting', { type: 'error' });
      console.error('Error updating setting:', error);
    }
  };

  // Delete setting
  const handleDelete = async (id: string, key: string) => {
    if (!confirm(`Are you sure you want to delete the setting "${key}"?`)) return;

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Failed to delete setting');
      
      showToast('Setting deleted successfully', { type: 'success' });
      await loadSettings();
      refreshSettings();
    } catch (error) {
      showToast('Failed to delete setting', { type: 'error' });
      console.error('Error deleting setting:', error);
    }
  };

  // Start editing
  const startEdit = (setting: Setting) => {
    setEditingId(setting.id);
    setEditForm({ key: setting.key, value: setting.value, type: setting.type });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ key: '', value: '', type: 'STRING' });
  };

  // Filter settings based on search and type
  const filteredSettings = (Array.isArray(allSettings) ? allSettings : []).filter(setting => {
    const matchesSearch = setting.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         setting.value.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || setting.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Format value for display
  const formatValue = (value: string, type: string) => {
    if (type === 'JSON') {
      try {
        return JSON.stringify(JSON.parse(value), null, 2);
      } catch {
        return value;
      }
    }
    return value;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
              <span className="ml-4 text-lg text-gray-600">Loading settings...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ⚙️ Settings Management
            </h1>
            <p className="text-xl text-gray-600">
              Create, read, update, and delete all application settings
            </p>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search settings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Type Filter */}
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="ALL">All Types</option>
                  <option value="STRING">String</option>
                  <option value="NUMBER">Number</option>
                  <option value="BOOLEAN">Boolean</option>
                  <option value="JSON">JSON</option>
                </select>
              </div>

              {/* Add Button */}
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
              >
                <span className="mr-2">➕</span>
                Add Setting
              </button>
            </div>

            {/* Add Form */}
            {showAddForm && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-4">Add New Setting</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input
                    type="text"
                    placeholder="Setting key"
                    value={addForm.key}
                    onChange={(e) => setAddForm({ ...addForm, key: e.target.value })}
                    className="px-3 py-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <select
                    value={addForm.type}
                    onChange={(e) => setAddForm({ ...addForm, type: e.target.value as SettingType })}
                    className="px-3 py-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="STRING">String</option>
                    <option value="NUMBER">Number</option>
                    <option value="BOOLEAN">Boolean</option>
                    <option value="JSON">JSON</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Setting value"
                    value={addForm.value}
                    onChange={(e) => setAddForm({ ...addForm, value: e.target.value })}
                    className="px-3 py-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreate}
                      disabled={!addForm.key || !addForm.value}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded transition-colors"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Settings Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredSettings.length} of {allSettings.length} settings
            </p>
          </div>

          {/* Settings Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Key
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSettings.map((setting) => (
                    <tr key={setting.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === setting.id ? (
                          <input
                            type="text"
                            value={editForm.key}
                            onChange={(e) => setEditForm({ ...editForm, key: e.target.value })}
                            className="w-full px-2 py-1 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        ) : (
                          <span className="text-sm font-medium text-gray-900">{setting.key}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === setting.id ? (
                          <select
                            value={editForm.type}
                            onChange={(e) => setEditForm({ ...editForm, type: e.target.value as SettingType })}
                            className="px-2 py-1 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            <option value="STRING">String</option>
                            <option value="NUMBER">Number</option>
                            <option value="BOOLEAN">Boolean</option>
                            <option value="JSON">JSON</option>
                          </select>
                        ) : (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            setting.type === 'STRING' ? 'bg-blue-100 text-blue-800' :
                            setting.type === 'NUMBER' ? 'bg-green-100 text-green-800' :
                            setting.type === 'BOOLEAN' ? 'bg-purple-100 text-purple-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {setting.type}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === setting.id ? (
                          <textarea
                            value={editForm.value}
                            onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                            rows={setting.type === 'JSON' ? 4 : 2}
                            className="w-full px-2 py-1 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        ) : (
                          <div className="text-sm text-gray-900 max-w-xs">
                            {setting.type === 'JSON' ? (
                              <pre className="whitespace-pre-wrap text-xs bg-gray-50 p-2 rounded">
                                {formatValue(setting.value, setting.type)}
                              </pre>
                            ) : (
                              <span className={setting.value.length > 50 ? 'truncate' : ''}>
                                {setting.value}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(setting.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {editingId === setting.id ? (
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleUpdate(setting.id)}
                              className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-xs transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => startEdit(setting)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(setting.id, setting.key)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Settings</h3>
              <p className="text-3xl font-bold text-blue-600">{Array.isArray(allSettings) ? allSettings.length : 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">String Settings</h3>
              <p className="text-3xl font-bold text-green-600">
                {Array.isArray(allSettings) ? allSettings.filter(s => s.type === 'STRING').length : 0}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Feature Toggles</h3>
              <p className="text-3xl font-bold text-purple-600">
                {Array.isArray(allSettings) ? allSettings.filter(s => s.type === 'BOOLEAN').length : 0}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">JSON Objects</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {Array.isArray(allSettings) ? allSettings.filter(s => s.type === 'JSON').length : 0}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-8 border border-orange-200">
            <h2 className="text-2xl font-bold text-orange-800 mb-4">🚀 Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => window.location.href = '/admin'}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Admin Dashboard
              </button>
              <button
                onClick={() => window.location.href = '/contact'}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                See Settings in Action
              </button>
              <button
                onClick={refreshSettings}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Refresh Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
