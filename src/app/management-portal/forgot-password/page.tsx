'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSent(true);
      } else {
        setError(data.error || 'Failed to send reset email');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            <Mail className="mx-auto h-12 w-12 text-purple-400" />
            <h2 className="mt-6 text-3xl font-extrabold text-white">
              {sent ? 'Check Your Email' : 'Forgot Password?'}
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              {sent 
                ? "We've sent password reset instructions to your email address."
                : "Enter your email address and we'll send you a link to reset your password."
              }
            </p>
          </div>
        </div>

        {!sent ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-12 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:z-10 sm:text-sm"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
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
                disabled={loading}
                className="group relative w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Reset Link</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-8 p-6 bg-green-900/20 border border-green-500/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <div>
                <h3 className="text-lg font-medium text-green-400">Email Sent Successfully</h3>
                <p className="text-green-300 text-sm mt-1">
                  Check your inbox and click the reset link to continue.
                </p>
              </div>
            </div>
            
            <div className="mt-4 space-y-2 text-sm text-gray-300">
              <p>• The reset link will expire in 1 hour</p>
              <p>• Check your spam folder if you don't see the email</p>
              <p>• Contact support if you continue having issues</p>
            </div>
            
            <button
              onClick={() => {
                setSent(false);
                setEmail('');
                setError('');
              }}
              className="mt-4 text-purple-400 hover:text-purple-300 text-sm transition-colors"
            >
              Send another reset email
            </button>
          </div>
        )}

        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Remember your password?{' '}
            <button
              onClick={() => router.push('/management-portal/login')}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
