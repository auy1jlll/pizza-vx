// Brute Force Protection Service
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface LoginAttempt {
  ipAddress: string;
  email?: string;
  success: boolean;
  userAgent?: string;
  country?: string;
}

export interface SecurityEvent {
  eventType: 'FAILED_LOGIN' | 'ACCOUNT_LOCKED' | 'SUSPICIOUS_ACTIVITY' | 'RATE_LIMIT_EXCEEDED' | 'BRUTE_FORCE_DETECTED';
  ipAddress?: string;
  email?: string;
  details?: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export class BruteForceProtectionService {
  // Configuration
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION_MINUTES = 15;
  private readonly ATTEMPT_WINDOW_MINUTES = 15;
  private readonly PROGRESSIVE_LOCKOUT = true;

  // Record a login attempt
  async recordLoginAttempt(attempt: LoginAttempt): Promise<void> {
    try {
      const attemptId = `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await prisma.$executeRaw`
        INSERT INTO login_attempts (id, ip_address, email, success, user_agent, country, attempt_time, created_at)
        VALUES (${attemptId}, ${attempt.ipAddress}, ${attempt.email || null}, ${attempt.success}, ${attempt.userAgent || null}, ${attempt.country || null}, datetime('now'), datetime('now'))
      `;

      // If failed attempt, check for brute force
      if (!attempt.success) {
        await this.checkForBruteForce(attempt.ipAddress, attempt.email);
      }
    } catch (error) {
      console.error('[SECURITY] Failed to record login attempt:', error);
    }
  }

  // Check if an IP or email is currently locked out
  async isLockedOut(ipAddress: string, email?: string): Promise<{ locked: boolean; unlockAt?: Date; reason?: string }> {
    try {
      const now = new Date();
      
      // Check for active lockouts
      const emailCondition = email ? `OR email = '${email}'` : '';
      const lockouts = await prisma.$queryRaw<any[]>`
        SELECT unlock_at, lockout_reason, attempt_count
        FROM account_lockouts 
        WHERE (ip_address = ${ipAddress} ${emailCondition})
        AND unlock_at > datetime('now')
        ORDER BY unlock_at DESC
        LIMIT 1
      `;

      if (lockouts.length > 0) {
        const lockout = lockouts[0];
        return {
          locked: true,
          unlockAt: new Date(lockout.unlock_at),
          reason: `Account locked due to ${lockout.attempt_count} failed login attempts`
        };
      }

      return { locked: false };
    } catch (error) {
      console.error('[SECURITY] Failed to check lockout status:', error);
      return { locked: false };
    }
  }

  // Get recent failed attempts count
  async getRecentFailedAttempts(ipAddress: string, email?: string): Promise<number> {
    try {
      const windowStart = new Date(Date.now() - this.ATTEMPT_WINDOW_MINUTES * 60 * 1000);
      
      const attempts = await prisma.$queryRaw<{ count: number }[]>`
        SELECT COUNT(*) as count
        FROM login_attempts 
        WHERE (ip_address = ${ipAddress} ${email ? `OR email = ${email}` : ''})
        AND success = FALSE
        AND attempt_time > ${windowStart.toISOString()}
      `;

      return attempts[0]?.count || 0;
    } catch (error) {
      console.error('[SECURITY] Failed to get recent failed attempts:', error);
      return 0;
    }
  }

  // Check for brute force and apply lockout if necessary
  private async checkForBruteForce(ipAddress: string, email?: string): Promise<void> {
    try {
      const failedCount = await this.getRecentFailedAttempts(ipAddress, email);
      
      if (failedCount >= this.MAX_FAILED_ATTEMPTS) {
        await this.lockAccount(ipAddress, email, failedCount);
        
        // Log security event
        await this.logSecurityEvent({
          eventType: 'BRUTE_FORCE_DETECTED',
          ipAddress,
          email,
          details: JSON.stringify({ 
            failedAttempts: failedCount,
            timeWindow: `${this.ATTEMPT_WINDOW_MINUTES} minutes`
          }),
          severity: 'HIGH'
        });

        console.log(`[SECURITY ALERT] Brute force detected - IP: ${ipAddress}, Email: ${email || 'N/A'}, Attempts: ${failedCount}`);
      }
    } catch (error) {
      console.error('[SECURITY] Failed to check for brute force:', error);
    }
  }

  // Lock an account/IP
  private async lockAccount(ipAddress: string, email?: string, attemptCount: number = 0): Promise<void> {
    try {
      // Progressive lockout: longer lockouts for repeat offenders
      let lockoutMinutes = this.LOCKOUT_DURATION_MINUTES;
      if (this.PROGRESSIVE_LOCKOUT) {
        lockoutMinutes = Math.min(lockoutMinutes * Math.ceil(attemptCount / this.MAX_FAILED_ATTEMPTS), 60 * 24); // Max 24 hours
      }

      const lockoutId = `lockout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const unlockAt = new Date(Date.now() + lockoutMinutes * 60 * 1000);

      await prisma.$executeRaw`
        INSERT INTO account_lockouts (id, email, ip_address, unlock_at, attempt_count, lockout_reason, created_at)
        VALUES (${lockoutId}, ${email || null}, ${ipAddress}, ${unlockAt.toISOString()}, ${attemptCount}, 'FAILED_LOGIN_ATTEMPTS', datetime('now'))
      `;

      // Log security event
      await this.logSecurityEvent({
        eventType: 'ACCOUNT_LOCKED',
        ipAddress,
        email,
        details: JSON.stringify({
          lockoutDuration: `${lockoutMinutes} minutes`,
          attemptCount,
          unlockAt: unlockAt.toISOString()
        }),
        severity: 'HIGH'
      });

      console.log(`[SECURITY] Account locked - IP: ${ipAddress}, Email: ${email || 'N/A'}, Duration: ${lockoutMinutes} minutes`);
    } catch (error) {
      console.error('[SECURITY] Failed to lock account:', error);
    }
  }

  // Log security events
  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await prisma.$executeRaw`
        INSERT INTO security_events (id, event_type, ip_address, email, details, severity, created_at)
        VALUES (${eventId}, ${event.eventType}, ${event.ipAddress || null}, ${event.email || null}, ${event.details || null}, ${event.severity || 'LOW'}, datetime('now'))
      `;
    } catch (error) {
      console.error('[SECURITY] Failed to log security event:', error);
    }
  }

  // Get security statistics
  async getSecurityStats(hours: number = 24): Promise<any> {
    try {
      const since = new Date(Date.now() - hours * 60 * 60 * 1000);

      const [loginAttempts, failedAttempts, lockouts, securityEvents] = await Promise.all([
        prisma.$queryRaw`SELECT COUNT(*) as count FROM login_attempts WHERE attempt_time > ${since.toISOString()}`,
        prisma.$queryRaw`SELECT COUNT(*) as count FROM login_attempts WHERE attempt_time > ${since.toISOString()} AND success = FALSE`,
        prisma.$queryRaw`SELECT COUNT(*) as count FROM account_lockouts WHERE created_at > ${since.toISOString()}`,
        prisma.$queryRaw`SELECT event_type, COUNT(*) as count FROM security_events WHERE created_at > ${since.toISOString()} GROUP BY event_type`
      ]);

      return {
        totalLoginAttempts: (loginAttempts as any)[0]?.count || 0,
        failedLoginAttempts: (failedAttempts as any)[0]?.count || 0,
        accountLockouts: (lockouts as any)[0]?.count || 0,
        securityEvents: securityEvents || [],
        timeWindow: `${hours} hours`
      };
    } catch (error) {
      console.error('[SECURITY] Failed to get security stats:', error);
      return null;
    }
  }

  // Clean up old records (for maintenance)
  async cleanupOldRecords(daysToKeep: number = 30): Promise<void> {
    try {
      const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);

      await Promise.all([
        prisma.$executeRaw`DELETE FROM login_attempts WHERE created_at < ${cutoffDate.toISOString()}`,
        prisma.$executeRaw`DELETE FROM account_lockouts WHERE created_at < ${cutoffDate.toISOString()} AND unlock_at < datetime('now')`,
        prisma.$executeRaw`DELETE FROM security_events WHERE created_at < ${cutoffDate.toISOString()}`
      ]);

      console.log(`[SECURITY] Cleaned up records older than ${daysToKeep} days`);
    } catch (error) {
      console.error('[SECURITY] Failed to cleanup old records:', error);
    }
  }
}
