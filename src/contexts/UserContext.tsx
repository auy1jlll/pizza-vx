'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  adminLogin: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check if we're on an admin page
      const isAdminPage = typeof window !== 'undefined' && window.location.pathname.startsWith('/management-portal');
      
      // Try admin auth first if on admin page, otherwise try customer auth
      const authEndpoint = isAdminPage ? '/api/auth/me' : '/api/auth/customer/me';
      
      const response = await fetch(authEndpoint, {
        credentials: 'include'
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      } else if (isAdminPage) {
        // If admin auth failed, try customer auth as fallback
        const customerResponse = await fetch('/api/auth/customer/me', {
          credentials: 'include'
        });
        if (customerResponse.ok) {
          const customerData = await customerResponse.json();
          setUser(customerData.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/customer/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return { success: true };
      } else {
        // Handle API error responses
        let errorMessage = 'Invalid email or password';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || 'Invalid email or password';
        } catch (parseError) {
          // If JSON parsing fails, use default message
          errorMessage = 'Invalid email or password';
        }
        return { success: false, error: errorMessage };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      // If it's a network error or other non-API error
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        return { success: false, error: 'Unable to connect to server. Please try again.' };
      }
      // Return a generic error message
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  };

  const adminLogin = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return { success: true };
      } else {
        // Handle API error responses
        let errorMessage = 'Invalid username or password';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || 'Invalid username or password';
        } catch (parseError) {
          // If JSON parsing fails, use default message
          errorMessage = 'Invalid username or password. Please try again.';
        }
        return { success: false, error: errorMessage };
      }
    } catch (error: any) {
      console.error('Admin login error:', error);
      // If it's a network error or other non-API error
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        return { success: false, error: 'Unable to connect to server. Please try again.' };
      }
      // Return a generic error message
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/customer/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return { success: true };
      } else {
        // Handle API error responses
        let errorMessage = 'Registration failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || 'Registration failed';
        } catch (parseError) {
          // If JSON parsing fails, use default message
          errorMessage = 'Registration failed. Please try again.';
        }
        return { success: false, error: errorMessage };
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      // If it's a network error or other non-API error
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        return { success: false, error: 'Unable to connect to server. Please try again.' };
      }
      // Return a generic error message
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/customer/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const refreshUser = async (): Promise<void> => {
    await checkAuth();
  };

  return (
    <UserContext.Provider value={{
      user,
      loading,
      login,
      adminLogin,
      register,
      logout,
      refreshUser
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
