'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

export default function CustomerResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [] as string[]
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
      setTokenValid(false);
      return;
    }
    
    validateToken();
  }, [token]);

  useEffect(() => {
    if (password) {
      checkPasswordStrength(password);
    }
  }, [password]);

  const validateToken = async () => {
    try {
      const response = await fetch('/api/auth/customer/validate-reset-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        setTokenValid(true);
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid or expired reset link');
        setTokenValid(false);
      }
    } catch (error) {
      console.error('Token validation error:', error);
      setError('Network error. Please try again.');
      setTokenValid(false);
    }
  };

  const checkPasswordStrength = (password: string) => {
    const checks = [
      { test: password.length >= 6, message: 'At least 6 characters' },
      { test: /[A-Z]/.test(password), message: 'Uppercase letter' },
      { test: /[a-z]/.test(password), message: 'Lowercase letter' },
      { test: /\d/.test(password), message: 'Number' }
    ];

    const passed = checks.filter(check => check.test).length;
    const feedback = checks.filter(check => !check.test).map(check => check.message);

    setPasswordStrength({
      score: passed,
      feedback
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/customer/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token,
          newPassword: password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score < 2) return 'bg-red-500';
    if (passwordStrength.score < 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score < 2) return 'Weak';
    if (passwordStrength.score < 3) return 'Medium';
    return 'Strong';
  };

  if (tokenValid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-orange-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-orange-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-lg shadow-2xl p-8">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
              <h2 className="mt-6 text-2xl font-bold text-gray-900">Invalid Reset Link</h2>
              <p className="mt-2 text-sm text-gray-600">{error}</p>
              <div className="mt-6 space-y-4">
                <button
                  onClick={() => router.push('/auth/forgot-password')}
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-medium py-2 px-4 rounded-md transition-all duration-300"
                >
                  Request New Reset Link
                </button>
                <Link
                  href="/auth/login"
                  className="block text-center text-orange-600 hover:text-orange-700 font-medium py-2 px-4 transition-colors"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-orange-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-lg shadow-2xl p-8">
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
              <h2 className="mt-6 text-2xl font-bold text-gray-900">Password Reset Successful</h2>
              <p className="mt-2 text-sm text-gray-600">
                Your password has been successfully reset. You can now log in with your new password.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/auth/login')}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-4 rounded-md transition-all duration-300"
                >
                  Continue to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-orange-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div>
            <Link
              href="/auth/login"
              className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </Link>
            
            <div className="text-center">
              <Lock className="mx-auto h-12 w-12 text-orange-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Password</h2>
              <p className="text-gray-600 mb-8">
                Please choose a strong password for your account.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword.new ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pr-12"
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
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                          style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${
                        passwordStrength.score < 2 ? 'text-red-500' : 
                        passwordStrength.score < 3 ? 'text-yellow-500' : 'text-green-500'
                      }`}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <div className="text-sm text-gray-500">
                        Missing: {passwordStrength.feedback.join(', ')}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showPassword.confirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pr-12"
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
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">Passwords do not match</p>
                )}
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || password.length < 6 || password !== confirmPassword}
              className="w-full flex justify-center items-center space-x-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold py-3 px-4 rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>

          {/* Password Requirements */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4 space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Password Requirements:</h3>
            <ul className="space-y-1 text-xs text-gray-600">
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>At least 6 characters long</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Contains uppercase and lowercase letters</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Contains at least one number</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
