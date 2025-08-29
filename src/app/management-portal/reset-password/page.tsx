'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

export default function ResetPasswordPage() {
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
      const response = await fetch('/api/auth/validate-reset-token', {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordStrength.score < 4) {
      setError('Password does not meet security requirements');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/reset-password', {
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
    if (passwordStrength.score < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score < 2) return 'Weak';
    if (passwordStrength.score < 4) return 'Medium';
    return 'Strong';
  };

  if (tokenValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
            <h2 className="mt-6 text-3xl font-extrabold text-white">Invalid Reset Link</h2>
            <p className="mt-2 text-sm text-gray-400">{error}</p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/management-portal/forgot-password')}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Request a new password reset
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
            <h2 className="mt-6 text-3xl font-extrabold text-white">Password Reset Successful</h2>
            <p className="mt-2 text-sm text-gray-400">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/management-portal/login')}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              >
                Continue to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <button
            onClick={() => router.push('/management-portal/login')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Login</span>
          </button>
          
          <div className="text-center">
            <Lock className="mx-auto h-12 w-12 text-purple-400" />
            <h2 className="mt-6 text-3xl font-extrabold text-white">Reset Your Password</h2>
            <p className="mt-2 text-sm text-gray-400">
              Please enter your new password below.
            </p>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">New Password *</label>
              <div className="relative">
                <input
                  type={showPassword.new ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
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
                <p className="mt-1 text-sm text-red-400">Passwords do not match</p>
              )}
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-400 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading || passwordStrength.score < 4 || password !== confirmPassword}
              className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Resetting Password...</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Reset Password</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security Guidelines */}
        <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
          <h3 className="text-sm font-medium text-gray-300">Password Requirements:</h3>
          <ul className="space-y-1 text-xs text-gray-400">
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-green-400" />
              <span>At least 8 characters long</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-green-400" />
              <span>Contains uppercase and lowercase letters</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-green-400" />
              <span>Contains at least one number</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-green-400" />
              <span>Contains at least one special character</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
