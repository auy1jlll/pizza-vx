-- Security Enhancement 3: JWT Improvements
-- Adding refresh token storage and JWT session management

-- Create table for refresh tokens
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_used_at DATETIME,
    revoked BOOLEAN DEFAULT FALSE,
    revoked_at DATETIME,
    ip_address TEXT,
    user_agent TEXT,
    device_fingerprint TEXT,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create table for JWT blacklist (for revoked tokens)
CREATE TABLE IF NOT EXISTS jwt_blacklist (
    id TEXT PRIMARY KEY,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    revoked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    reason TEXT DEFAULT 'LOGOUT',
    user_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create table for JWT secrets rotation
CREATE TABLE IF NOT EXISTS jwt_secrets (
    id TEXT PRIMARY KEY,
    secret_hash TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    last_used_at DATETIME
);

-- Create indices for performance
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_revoked ON refresh_tokens(revoked);

CREATE INDEX IF NOT EXISTS idx_jwt_blacklist_token_hash ON jwt_blacklist(token_hash);
CREATE INDEX IF NOT EXISTS idx_jwt_blacklist_expires_at ON jwt_blacklist(expires_at);
CREATE INDEX IF NOT EXISTS idx_jwt_blacklist_user_id ON jwt_blacklist(user_id);

CREATE INDEX IF NOT EXISTS idx_jwt_secrets_active ON jwt_secrets(is_active);
CREATE INDEX IF NOT EXISTS idx_jwt_secrets_expires_at ON jwt_secrets(expires_at);
