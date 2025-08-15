import { BaseService } from './base';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

export class AuthService extends BaseService {
  
  // Authenticate user login
  async authenticate(credentials: AuthCredentials): Promise<{ user: UserProfile; token: string }> {
    try {
      const { email, password } = credentials;

      // Find user by email
      const user = await this.db.user.findUnique({
        where: { email }
      });

      if (!user || !user.password) {
        throw new Error('Invalid credentials');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      };
    } catch (error) {
      this.handleError(error, 'Authentication');
    }
  }

  // Verify JWT token
  async verifyToken(token: string): Promise<UserProfile> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      
      // Get fresh user data
      const user = await this.db.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      };
    } catch (error) {
      this.handleError(error, 'Token Verification');
    }
  }

  // Register new user (for customer registration)
  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<{ user: UserProfile; token: string }> {
    try {
      // Check if user already exists
      const existingUser = await this.db.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // Create user
      const user = await this.db.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: 'CUSTOMER'
        }
      });

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      };
    } catch (error) {
      this.handleError(error, 'User Registration');
    }
  }

  // Check if user has admin privileges
  async isAdmin(userId: string): Promise<boolean> {
    try {
      const user = await this.db.user.findUnique({
        where: { id: userId },
        select: { role: true }
      });

      return user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
    } catch (error) {
      return false;
    }
  }

  // Update user profile
  async updateProfile(userId: string, updates: {
    name?: string;
    email?: string;
  }): Promise<UserProfile> {
    try {
      const user = await this.db.user.update({
        where: { id: userId },
        data: {
          ...updates,
          updatedAt: new Date()
        }
      });

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      };
    } catch (error) {
      this.handleError(error, 'Update Profile');
    }
  }

  // Change password
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = await this.db.user.findUnique({
        where: { id: userId }
      });

      if (!user || !user.password) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      // Update password
      await this.db.user.update({
        where: { id: userId },
        data: { 
          password: hashedNewPassword,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      this.handleError(error, 'Change Password');
    }
  }
}
