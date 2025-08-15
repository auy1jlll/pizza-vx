-- Step 3: Pricing Snapshots Implementation
-- Adding price snapshot storage to maintain historical pricing accuracy

-- Create pricing snapshot tables to store component prices at order time
CREATE TABLE IF NOT EXISTS price_snapshots (
    id TEXT PRIMARY KEY,
    orderId TEXT NOT NULL,
    componentType TEXT NOT NULL, -- 'SIZE', 'CRUST', 'SAUCE', 'TOPPING'
    componentId TEXT NOT NULL,
    componentName TEXT NOT NULL,
    snapshotPrice REAL NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
);

-- Create index for fast lookups by order
CREATE INDEX IF NOT EXISTS idx_price_snapshots_order_id ON price_snapshots(orderId);

-- Create index for component lookups
CREATE INDEX IF NOT EXISTS idx_price_snapshots_component ON price_snapshots(componentType, componentId);

-- Create pricing history table for component price changes
CREATE TABLE IF NOT EXISTS pricing_history (
    id TEXT PRIMARY KEY,
    componentType TEXT NOT NULL,
    componentId TEXT NOT NULL,
    componentName TEXT NOT NULL,
    oldPrice REAL,
    newPrice REAL NOT NULL,
    changeReason TEXT,
    changedBy TEXT,
    changedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index for pricing history lookups
CREATE INDEX IF NOT EXISTS idx_pricing_history_component ON pricing_history(componentType, componentId);
CREATE INDEX IF NOT EXISTS idx_pricing_history_date ON pricing_history(changedAt);
