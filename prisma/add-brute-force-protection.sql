-- Security Enhancement 2: Brute Force Protection
-- Adding login attempt tracking and account lockout functionality

-- Create table to track login attempts
CREATE TABLE IF NOT EXISTS login_attempts (
    id TEXT PRIMARY KEY,
    ip_address TEXT NOT NULL,
    email TEXT,
    success BOOLEAN NOT NULL DEFAULT FALSE,
    attempt_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_agent TEXT,
    country TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create table for account lockouts
CREATE TABLE IF NOT EXISTS account_lockouts (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    ip_address TEXT,
    locked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    unlock_at DATETIME NOT NULL,
    attempt_count INTEGER NOT NULL DEFAULT 0,
    lockout_reason TEXT DEFAULT 'FAILED_LOGIN_ATTEMPTS',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indices for performance
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_login_attempts_time ON login_attempts(attempt_time);
CREATE INDEX IF NOT EXISTS idx_login_attempts_success ON login_attempts(success);

CREATE INDEX IF NOT EXISTS idx_account_lockouts_email ON account_lockouts(email);
CREATE INDEX IF NOT EXISTS idx_account_lockouts_ip ON account_lockouts(ip_address);
CREATE INDEX IF NOT EXISTS idx_account_lockouts_unlock ON account_lockouts(unlock_at);

-- Create table for security events (for monitoring)
CREATE TABLE IF NOT EXISTS security_events (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL, -- 'FAILED_LOGIN', 'ACCOUNT_LOCKED', 'SUSPICIOUS_ACTIVITY', etc.
    ip_address TEXT,
    email TEXT,
    details TEXT, -- JSON string with additional details
    severity TEXT DEFAULT 'LOW', -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_security_events_type ON security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_ip ON security_events(ip_address);
CREATE INDEX IF NOT EXISTS idx_security_events_time ON security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
