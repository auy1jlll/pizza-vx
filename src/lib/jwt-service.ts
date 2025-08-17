// JWT Improvements Service - Refresh Tokens + Short-lived Access Tokens
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '@/lib/prisma';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  type: 'access' | 'refresh';
}

export class JWTService {
  // Token configuration
  private readonly ACCESS_TOKEN_EXPIRES_IN = '15m'; // 15 minutes
  private readonly REFRESH_TOKEN_EXPIRES_IN = '7d'; // 7 days
  private readonly JWT_ISSUER = 'pizza-builder-app';
  private readonly JWT_AUDIENCE = 'pizza-builder-users';

  // Get current active JWT secret
  private async getCurrentSecret(): Promise<string> {
    try {
      // Try to get from database first
      const activeSecret = await prisma.$queryRaw<any[]>`
        SELECT secret_hash FROM jwt_secrets 
        WHERE is_active = TRUE 
        ORDER BY created_at DESC 
        LIMIT 1
      `;

      if (activeSecret.length > 0) {
        return this.decryptSecret(activeSecret[0].secret_hash);
      }

      // Fallback to environment variable
      return process.env.JWT_SECRET || this.generateNewSecret();
    } catch (error) {
      console.error('[JWT] Failed to get current secret:', error);
      return process.env.JWT_SECRET || this.generateNewSecret();
    }
  }

  // Generate a new JWT secret and store it
  private async generateNewSecret(): Promise<string> {
    try {
      const newSecret = crypto.randomBytes(64).toString('hex');
      const secretHash = this.encryptSecret(newSecret);
      const secretId = `secret_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Deactivate old secrets
      await prisma.$executeRaw`
        UPDATE jwt_secrets SET is_active = FALSE WHERE is_active = TRUE
      `;

      // Store new secret
      await prisma.$executeRaw`
        INSERT INTO jwt_secrets (id, secret_hash, is_active, created_at)
        VALUES (${secretId}, ${secretHash}, TRUE, datetime('now'))
      `;

      console.log('[JWT] New secret generated and stored');
      return newSecret;
    } catch (error) {
      console.error('[JWT] Failed to generate new secret:', error);
      throw new Error('JWT secret generation failed');
    }
  }

  // Encrypt secret for storage
  private encryptSecret(secret: string): string {
    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'fallback-key', 'salt', 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, key);
    
    let encrypted = cipher.update(secret, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return `${iv.toString('hex')}:${encrypted}`;
  }

  // Decrypt secret from storage
  private decryptSecret(encryptedSecret: string): string {
    try {
      const algorithm = 'aes-256-gcm';
      const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'fallback-key', 'salt', 32);
      const [ivHex, encrypted] = encryptedSecret.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const decipher = crypto.createDecipher(algorithm, key);
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('[JWT] Failed to decrypt secret:', error);
      return process.env.JWT_SECRET || 'fallback-secret';
    }
  }

  // Generate token pair (access + refresh)
  async generateTokenPair(payload: Omit<TokenPayload, 'type'>, clientInfo: { ipAddress: string; userAgent: string }): Promise<TokenPair> {
    try {
      const secret = await this.getCurrentSecret();
      const now = new Date();
      
      // Access token (short-lived)
      const accessTokenPayload: TokenPayload = { ...payload, type: 'access' };
      const accessToken = jwt.sign(accessTokenPayload, secret, {
        expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
        issuer: this.JWT_ISSUER,
        audience: this.JWT_AUDIENCE,
        algorithm: 'HS256'
      });

      // Refresh token (long-lived)
      const refreshTokenPayload: TokenPayload = { ...payload, type: 'refresh' };
      const refreshToken = jwt.sign(refreshTokenPayload, secret, {
        expiresIn: this.REFRESH_TOKEN_EXPIRES_IN,
        issuer: this.JWT_ISSUER,
        audience: this.JWT_AUDIENCE,
        algorithm: 'HS256'
      });

      // Store refresh token
      await this.storeRefreshToken(refreshToken, payload.userId, clientInfo);

      const accessTokenExpiresAt = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes
      const refreshTokenExpiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

      return {
        accessToken,
        refreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt
      };
    } catch (error) {
      console.error('[JWT] Failed to generate token pair:', error);
      throw new Error('Token generation failed');
    }
  }

  // Store refresh token in database
  private async storeRefreshToken(refreshToken: string, userId: string, clientInfo: { ipAddress: string; userAgent: string }): Promise<void> {
    try {
      const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      const tokenId = `refresh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      
      // Generate device fingerprint
      const deviceFingerprint = crypto.createHash('md5')
        .update(`${clientInfo.ipAddress}-${clientInfo.userAgent}`)
        .digest('hex');

      await prisma.$executeRaw`
        INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at, ip_address, user_agent, device_fingerprint, created_at)
        VALUES (${tokenId}, ${userId}, ${tokenHash}, ${expiresAt.toISOString()}, ${clientInfo.ipAddress}, ${clientInfo.userAgent}, ${deviceFingerprint}, datetime('now'))
      `;
    } catch (error) {
      console.error('[JWT] Failed to store refresh token:', error);
    }
  }

  // Verify and decode token
  async verifyToken(token: string, expectedType: 'access' | 'refresh' = 'access'): Promise<TokenPayload | null> {
    try {
      // Check if token is blacklisted
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      const blacklisted = await prisma.$queryRaw<any[]>`
        SELECT id FROM jwt_blacklist 
        WHERE token_hash = ${tokenHash} AND expires_at > datetime('now')
      `;

      if (blacklisted.length > 0) {
        console.log('[JWT] Token is blacklisted');
        return null;
      }

      const secret = await this.getCurrentSecret();
      const decoded = jwt.verify(token, secret, {
        issuer: this.JWT_ISSUER,
        audience: this.JWT_AUDIENCE,
        algorithms: ['HS256']
      }) as TokenPayload;

      if (decoded.type !== expectedType) {
        console.log(`[JWT] Token type mismatch. Expected: ${expectedType}, Got: ${decoded.type}`);
        return null;
      }

      // Update last used time for refresh tokens
      if (expectedType === 'refresh') {
        await this.updateRefreshTokenUsage(tokenHash);
      }

      return decoded;
    } catch (error) {
      console.error('[JWT] Token verification failed:', error);
      return null;
    }
  }

  // Update refresh token last used time
  private async updateRefreshTokenUsage(tokenHash: string): Promise<void> {
    try {
      await prisma.$executeRaw`
        UPDATE refresh_tokens 
        SET last_used_at = datetime('now')
        WHERE token_hash = ${tokenHash} AND revoked = FALSE
      `;
    } catch (error) {
      console.error('[JWT] Failed to update refresh token usage:', error);
    }
  }

  // Refresh access token using refresh token
  async refreshAccessToken(refreshToken: string, clientInfo: { ipAddress: string; userAgent: string }): Promise<{ accessToken: string; expiresAt: Date } | null> {
    try {
      // Verify refresh token
      const payload = await this.verifyToken(refreshToken, 'refresh');
      if (!payload) {
        return null;
      }

      // Check if refresh token exists and is valid
      const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      const storedToken = await prisma.$queryRaw<any[]>`
        SELECT user_id, expires_at, revoked FROM refresh_tokens 
        WHERE token_hash = ${tokenHash}
      `;

      if (storedToken.length === 0 || storedToken[0].revoked || new Date(storedToken[0].expires_at) < new Date()) {
        console.log('[JWT] Refresh token invalid or expired');
        return null;
      }

      // Generate new access token
      const secret = await this.getCurrentSecret();
      const accessTokenPayload: TokenPayload = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        type: 'access'
      };

      const accessToken = jwt.sign(accessTokenPayload, secret, {
        expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
        issuer: this.JWT_ISSUER,
        audience: this.JWT_AUDIENCE,
        algorithm: 'HS256'
      });

      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      // Update refresh token usage
      await this.updateRefreshTokenUsage(tokenHash);

      return { accessToken, expiresAt };
    } catch (error) {
      console.error('[JWT] Failed to refresh access token:', error);
      return null;
    }
  }

  // Revoke refresh token
  async revokeRefreshToken(refreshToken: string, reason: string = 'LOGOUT'): Promise<void> {
    try {
      const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      
      await prisma.$executeRaw`
        UPDATE refresh_tokens 
        SET revoked = TRUE, revoked_at = datetime('now')
        WHERE token_hash = ${tokenHash}
      `;

      console.log(`[JWT] Refresh token revoked: ${reason}`);
    } catch (error) {
      console.error('[JWT] Failed to revoke refresh token:', error);
    }
  }

  // Blacklist access token
  async blacklistToken(token: string, reason: string = 'LOGOUT'): Promise<void> {
    try {
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      const decoded = jwt.decode(token) as any;
      const blacklistId = `blacklist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const expiresAt = new Date(decoded.exp * 1000);

      await prisma.$executeRaw`
        INSERT INTO jwt_blacklist (id, token_hash, expires_at, reason, user_id, created_at)
        VALUES (${blacklistId}, ${tokenHash}, ${expiresAt.toISOString()}, ${reason}, ${decoded.userId || null}, datetime('now'))
      `;

      console.log(`[JWT] Token blacklisted: ${reason}`);
    } catch (error) {
      console.error('[JWT] Failed to blacklist token:', error);
    }
  }

  // Clean up expired tokens
  async cleanupExpiredTokens(): Promise<void> {
    try {
      const now = new Date();
      
      await Promise.all([
        prisma.$executeRaw`DELETE FROM refresh_tokens WHERE expires_at < datetime('now')`,
        prisma.$executeRaw`DELETE FROM jwt_blacklist WHERE expires_at < datetime('now')`,
        prisma.$executeRaw`DELETE FROM jwt_secrets WHERE expires_at IS NOT NULL AND expires_at < datetime('now')`
      ]);

      console.log('[JWT] Expired tokens cleaned up');
    } catch (error) {
      console.error('[JWT] Failed to cleanup expired tokens:', error);
    }
  }

  // Get user's active sessions
  async getUserSessions(userId: string): Promise<any[]> {
    try {
      const sessions = await prisma.$queryRaw<any[]>`
        SELECT id, ip_address, user_agent, device_fingerprint, created_at, last_used_at
        FROM refresh_tokens 
        WHERE user_id = ${userId} AND revoked = FALSE AND expires_at > datetime('now')
        ORDER BY last_used_at DESC
      `;

      return sessions;
    } catch (error) {
      console.error('[JWT] Failed to get user sessions:', error);
      return [];
    }
  }
}
