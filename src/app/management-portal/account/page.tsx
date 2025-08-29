'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { useToast } from '@/components/ToastProvider';
import { 
  User, 
  Lock, 
  Shield, 
  Save, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle,
  Settings,
  Mail,
  Calendar
} from 'lucide-react';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  lastLogin?: string;
  employeeProfile?: {
    firstName: string;
    lastName: string;
    position: string;
    department: string;
  };
}

export default function AccountPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [] as string[]
  });

  const router = useRouter();
  const { show } = useToast();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (passwordForm.newPassword) {
      checkPasswordStrength(passwordForm.newPassword);
    }
  }, [passwordForm.newPassword]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.user);
      } else {
        show('Failed to load profile', { type: 'error' });
        router.push('/management-portal/login');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      show('Error loading profile', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const checkPasswordStrength = (password: string) => {
    const checks = [
      { test: password.length >= 8, message: 'At least 8 characters' },
      { test: /[A-Z]/.test(password), message: 'Uppercase letter' },
      { test: /[a-z]/.test(password), message: 'Lowercase letter' },
      { test: /\d/.test(password), message: 'Number' },
      { test: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password), message: 'Special character' }
    ];

    const passed = checks.filter(check => check.test).length;
    const feedback = checks.filter(check => !check.test).map(check => check.message);

    setPasswordStrength({
      score: passed,
      feedback
    });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      show('New passwords do not match', { type: 'error' });
      return;
    }

    if (passwordStrength.score < 4) {
      show('Password does not meet security requirements', { type: 'error' });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        show('Password changed successfully', { type: 'success' });
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        show(data.error || 'Failed to change password', { type: 'error' });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      show('Error changing password', { type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score < 2) return 'bg-red-500';
    if (passwordStrength.score < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score < 2) return 'Weak';
    if (passwordStrength.score < 4) return 'Medium';
    return 'Strong';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Settings className="h-8 w-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">Account Settings</h1>
          </div>
          <p className="text-gray-400">Manage your account information and security settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <User className="h-6 w-6 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Profile Information</h2>
            </div>

            {userProfile && (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">Username</label>
                  <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-gray-300">
                    {userProfile.username}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">Email</label>
                  <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-gray-300">
                    {userProfile.email}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">Role</label>
                  <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {userProfile.role}
                    </span>
                  </div>
                </div>

                {userProfile.employeeProfile && (
                  <>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-1">Name</label>
                      <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-gray-300">
                        {userProfile.employeeProfile.firstName} {userProfile.employeeProfile.lastName}
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-1">Position</label>
                      <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-gray-300">
                        {userProfile.employeeProfile.position}
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-1">Department</label>
                      <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-gray-300">
                        {userProfile.employeeProfile.department}
                      </div>
                    </div>
                  </>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1">Account Created</label>
                    <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-gray-300 text-sm">
                      {new Date(userProfile.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {userProfile.lastLogin && (
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-1">Last Login</label>
                      <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-gray-300 text-sm">
                        {new Date(userProfile.lastLogin).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Change Password */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Lock className="h-6 w-6 text-red-400" />
              <h2 className="text-xl font-semibold text-white">Change Password</h2>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Current Password *</label>
                <div className="relative">
                  <input
                    type={showPassword.current ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                  >
                    {showPassword.current ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">New Password *</label>
                <div className="relative">
                  <input
                    type={showPassword.new ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                  >
                    {showPassword.new ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {passwordForm.newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="flex-1 bg-gray-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                          style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${
                        passwordStrength.score < 2 ? 'text-red-400' : 
                        passwordStrength.score < 4 ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <div className="text-sm text-gray-400">
                        Missing: {passwordStrength.feedback.join(', ')}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Confirm New Password *</label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                  >
                    {showPassword.confirm ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400">Passwords do not match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={saving || passwordStrength.score < 4 || passwordForm.newPassword !== passwordForm.confirmPassword}
                className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Changing Password...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Change Password</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Security Information */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-6 w-6 text-green-400" />
            <h2 className="text-xl font-semibold text-white">Security Guidelines</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-300">Password Requirements:</h3>
              <ul className="space-y-1 text-gray-400 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>At least 8 characters long</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Contains uppercase and lowercase letters</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Contains at least one number</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Contains at least one special character</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-300">Security Tips:</h3>
              <ul className="space-y-1 text-gray-400 text-sm">
                <li className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-400" />
                  <span>Use a unique password for this account</span>
                </li>
                <li className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-400" />
                  <span>Change your password regularly</span>
                </li>
                <li className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-400" />
                  <span>Never share your login credentials</span>
                </li>
                <li className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-400" />
                  <span>Log out when finished</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
