'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
  customerProfile?: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    phone?: string;
    dietaryPreferences: string[];
    favoritePizzaSizeId?: string;
    favoriteCrustId?: string;
    defaultOrderType: 'PICKUP' | 'DELIVERY';
    marketingOptIn: boolean;
    loyaltyPoints: number;
    totalOrders: number;
    totalSpent: number;
    notes?: string;
  };
  addresses: Address[];
  favorites: FavoritePizza[];
}

interface Address {
  id: string;
  label: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  deliveryInstructions?: string;
  isDefault: boolean;
}

interface FavoritePizza {
  id: string;
  favoriteName: string;
  itemType: string;
  orderCount: number;
  lastOrdered?: string;
}

export default function ProfilePage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    dietaryPreferences: [] as string[],
    defaultOrderType: 'PICKUP' as 'PICKUP' | 'DELIVERY',
    marketingOptIn: false,
    notes: ''
  });

  // New address form
  const [newAddress, setNewAddress] = useState({
    label: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    deliveryInstructions: '',
    isDefault: false
  });
  const [showAddAddress, setShowAddAddress] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    } else if (user) {
      fetchUserProfile();
    }
  }, [user, loading, router]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        
        // Populate form data
        setFormData({
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          firstName: data.user.customerProfile?.firstName || '',
          lastName: data.user.customerProfile?.lastName || '',
          dateOfBirth: data.user.customerProfile?.dateOfBirth ? data.user.customerProfile.dateOfBirth.split('T')[0] : '',
          dietaryPreferences: data.user.customerProfile?.dietaryPreferences || [],
          defaultOrderType: data.user.customerProfile?.defaultOrderType || 'PICKUP',
          marketingOptIn: data.user.customerProfile?.marketingOptIn || false,
          notes: data.user.customerProfile?.notes || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    }
  };

  const handleSaveProfile = async () => {
    setSaveLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone
          },
          profile: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            dateOfBirth: formData.dateOfBirth,
            phone: formData.phone,
            dietaryPreferences: formData.dietaryPreferences,
            defaultOrderType: formData.defaultOrderType,
            marketingOptIn: formData.marketingOptIn,
            notes: formData.notes
          }
        }),
      });

      if (response.ok) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        fetchUserProfile();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleAddAddress = async () => {
    try {
      const response = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAddress),
      });

      if (response.ok) {
        setSuccess('Address added successfully!');
        setShowAddAddress(false);
        setNewAddress({
          label: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          zipCode: '',
          deliveryInstructions: '',
          isDefault: false
        });
        fetchUserProfile();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to add address');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      setError('Failed to add address');
    }
  };

  const toggleDietaryPreference = (preference: string) => {
    setFormData(prev => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(preference)
        ? prev.dietaryPreferences.filter(p => p !== preference)
        : [...prev.dietaryPreferences, preference]
    }));
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All password fields are required');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    setPasswordLoading(true);
    setPasswordError('');
    setPasswordSuccess('');

    try {
      const response = await fetch('/api/auth/customer/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordSuccess('Password updated successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setPasswordError(data.error || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError('Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-orange-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-orange-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-200">Manage your account and preferences</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/20 border border-green-500 text-green-100 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        {/* Profile Stats */}
        {profile?.customerProfile && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">{profile.customerProfile.loyaltyPoints}</div>
              <div className="text-gray-300 text-sm">Loyalty Points</div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{profile.customerProfile.totalOrders}</div>
              <div className="text-gray-300 text-sm">Total Orders</div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">${profile.customerProfile.totalSpent.toFixed(2)}</div>
              <div className="text-gray-300 text-sm">Total Spent</div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{profile.addresses.length}</div>
              <div className="text-gray-300 text-sm">Saved Addresses</div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-black/30 rounded-lg p-1">
          {[
            { id: 'personal', label: 'Personal Info', icon: '👤' },
            { id: 'addresses', label: 'Addresses', icon: '📍' },
            { id: 'favorites', label: 'Favorites', icon: '❤️' },
            { id: 'security', label: 'Security', icon: '🔒' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6">
          {activeTab === 'personal' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Personal Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Default Order Type</label>
                  <select
                    value={formData.defaultOrderType}
                    onChange={(e) => setFormData({ ...formData, defaultOrderType: e.target.value as 'PICKUP' | 'DELIVERY' })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white disabled:opacity-50"
                  >
                    <option value="PICKUP">Pickup</option>
                    <option value="DELIVERY">Delivery</option>
                  </select>
                </div>
              </div>

              {/* Dietary Preferences */}
              <div className="mt-6">
                <label className="block text-gray-300 text-sm font-medium mb-3">Dietary Preferences</label>
                <div className="flex flex-wrap gap-2">
                  {['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'keto', 'low-carb'].map((pref) => (
                    <button
                      key={pref}
                      onClick={() => isEditing && toggleDietaryPreference(pref)}
                      disabled={!isEditing}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        formData.dietaryPreferences.includes(pref)
                          ? 'bg-green-600 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      } ${!isEditing ? 'opacity-50' : ''}`}
                    >
                      {pref.charAt(0).toUpperCase() + pref.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Marketing Opt-in */}
              <div className="mt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.marketingOptIn}
                    onChange={(e) => setFormData({ ...formData, marketingOptIn: e.target.checked })}
                    disabled={!isEditing}
                    className="mr-2 disabled:opacity-50"
                  />
                  <span className="text-gray-300">I want to receive marketing emails and promotions</span>
                </label>
              </div>

              {/* Notes */}
              <div className="mt-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 disabled:opacity-50"
                  placeholder="Any special instructions or notes..."
                />
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saveLoading}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {saveLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Delivery Addresses</h2>
                <button
                  onClick={() => setShowAddAddress(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  + Add Address
                </button>
              </div>

              {/* Address List */}
              <div className="space-y-4">
                {profile?.addresses.map((address) => (
                  <div key={address.id} className="bg-white/10 rounded-lg p-4 border border-white/20">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-white">{address.label}</h3>
                          {address.isDefault && (
                            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">Default</span>
                          )}
                        </div>
                        <p className="text-gray-300">
                          {address.addressLine1}
                          {address.addressLine2 && `, ${address.addressLine2}`}
                        </p>
                        <p className="text-gray-300">{address.city}, {address.state} {address.zipCode}</p>
                        {address.deliveryInstructions && (
                          <p className="text-gray-400 text-sm mt-1">
                            Instructions: {address.deliveryInstructions}
                          </p>
                        )}
                      </div>
                      <button className="text-gray-400 hover:text-red-400 transition-colors">
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Address Form */}
              {showAddAddress && (
                <div className="mt-6 bg-white/5 rounded-lg p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4">Add New Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Label</label>
                      <input
                        type="text"
                        value={newAddress.label}
                        onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                        placeholder="Home, Work, etc."
                        className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-gray-300 text-sm font-medium mb-2">Address Line 1</label>
                      <input
                        type="text"
                        value={newAddress.addressLine1}
                        onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                        placeholder="Street address"
                        className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-gray-300 text-sm font-medium mb-2">Address Line 2 (Optional)</label>
                      <input
                        type="text"
                        value={newAddress.addressLine2}
                        onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                        placeholder="Apartment, suite, etc."
                        className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">City</label>
                      <input
                        type="text"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">State</label>
                      <input
                        type="text"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">ZIP Code</label>
                      <input
                        type="text"
                        value={newAddress.zipCode}
                        onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-gray-300 text-sm font-medium mb-2">Delivery Instructions</label>
                      <textarea
                        value={newAddress.deliveryInstructions}
                        onChange={(e) => setNewAddress({ ...newAddress, deliveryInstructions: e.target.value })}
                        rows={2}
                        placeholder="Gate code, special instructions, etc."
                        className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newAddress.isDefault}
                          onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                          className="mr-2"
                        />
                        <span className="text-gray-300">Set as default address</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => setShowAddAddress(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddAddress}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Add Address
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Favorite Orders</h2>
              
              {profile?.favorites.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🍕</div>
                  <h3 className="text-xl font-semibold text-white mb-2">No favorites yet</h3>
                  <p className="text-gray-400 mb-6">Start ordering to build your favorites list!</p>
                  <button
                    onClick={() => router.push('/build-pizza')}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Build Your First Pizza
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profile?.favorites.map((favorite) => (
                    <div key={favorite.id} className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <h3 className="font-semibold text-white mb-2">{favorite.favoriteName}</h3>
                      <p className="text-gray-400 text-sm mb-2">{favorite.itemType}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">Ordered {favorite.orderCount} times</span>
                        {favorite.lastOrdered && (
                          <span className="text-gray-400">
                            Last: {new Date(favorite.lastOrdered).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <button className="w-full mt-3 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg transition-colors">
                        Order Again
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>
              
              <div className="max-w-md">
                <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                
                {passwordError && (
                  <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded mb-4">
                    {passwordError}
                  </div>
                )}
                
                {passwordSuccess && (
                  <div className="bg-green-500/20 border border-green-500 text-green-100 px-4 py-3 rounded mb-4">
                    {passwordSuccess}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Current Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      >
                        {showPasswords.current ? (
                          <span className="text-gray-400">🙈</span>
                        ) : (
                          <span className="text-gray-400">👁️</span>
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      >
                        {showPasswords.new ? (
                          <span className="text-gray-400">🙈</span>
                        ) : (
                          <span className="text-gray-400">👁️</span>
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Confirm New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      >
                        {showPasswords.confirm ? (
                          <span className="text-gray-400">🙈</span>
                        ) : (
                          <span className="text-gray-400">👁️</span>
                        )}
                      </button>
                    </div>
                    {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                      <p className="mt-1 text-sm text-red-400">Passwords do not match</p>
                    )}
                  </div>

                  <button
                    onClick={handlePasswordChange}
                    disabled={passwordLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword || passwordData.newPassword !== passwordData.confirmPassword}
                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    {passwordLoading ? 'Updating Password...' : 'Update Password'}
                  </button>
                </div>

                <div className="mt-6 bg-white/5 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Password Requirements:</h4>
                  <ul className="space-y-1 text-xs text-gray-400">
                    <li>• At least 6 characters long</li>
                    <li>• Should be unique and not used elsewhere</li>
                    <li>• Mix of letters, numbers recommended</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
