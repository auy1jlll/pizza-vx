const fs = require('fs');
const path = require('path');

// Workspace state tracking to prevent accidental data loss
class WorkspaceProtector {
  constructor() {
    this.stateFile = path.join(__dirname, '.workspace-state.json');
    this.loadState();
  }

  loadState() {
    try {
      if (fs.existsSync(this.stateFile)) {
        this.state = JSON.parse(fs.readFileSync(this.stateFile, 'utf8'));
      } else {
        this.state = {
          lastBackup: null,
          lastRestore: null,
          developmentMode: false,
          protectedSince: null,
          recentChanges: []
        };
      }
    } catch (error) {
      console.warn('⚠️ Could not load workspace state, creating new state');
      this.state = {
        lastBackup: null,
        lastRestore: null,
        developmentMode: false,
        protectedSince: null,
        recentChanges: []
      };
    }
  }

  saveState() {
    try {
      fs.writeFileSync(this.stateFile, JSON.stringify(this.state, null, 2));
    } catch (error) {
      console.warn('⚠️ Could not save workspace state:', error.message);
    }
  }

  startDevelopment() {
    this.state.developmentMode = true;
    this.state.protectedSince = new Date().toISOString();
    this.saveState();
    console.log('🛡️ Development mode activated - workspace protected from accidental restores');
  }

  stopDevelopment() {
    this.state.developmentMode = false;
    this.state.protectedSince = null;
    this.saveState();
    console.log('✅ Development mode deactivated');
  }

  recordBackup(backupFile) {
    this.state.lastBackup = {
      file: backupFile,
      timestamp: new Date().toISOString()
    };
    this.saveState();
  }

  recordRestore(backupFile) {
    this.state.lastRestore = {
      file: backupFile,
      timestamp: new Date().toISOString()
    };
    this.saveState();
  }

  recordChange(type, description) {
    const change = {
      type,
      description,
      timestamp: new Date().toISOString()
    };
    
    this.state.recentChanges.push(change);
    
    // Keep only last 50 changes
    if (this.state.recentChanges.length > 50) {
      this.state.recentChanges = this.state.recentChanges.slice(-50);
    }
    
    this.saveState();
  }

  checkProtection() {
    if (this.state.developmentMode) {
      const protectedSince = new Date(this.state.protectedSince);
      const duration = Math.round((Date.now() - protectedSince.getTime()) / (1000 * 60));
      
      console.log('🛡️ WORKSPACE PROTECTED');
      console.log(`   Protected since: ${protectedSince.toLocaleString()}`);
      console.log(`   Duration: ${duration} minutes`);
      console.log(`   Recent changes: ${this.state.recentChanges.length}`);
      
      return true;
    }
    return false;
  }

  getRecentChanges(minutesBack = 30) {
    const cutoff = new Date(Date.now() - minutesBack * 60 * 1000);
    return this.state.recentChanges.filter(change => 
      new Date(change.timestamp) > cutoff
    );
  }

  showStatus() {
    console.log('\n📊 Workspace Status');
    console.log('==================');
    console.log(`Development Mode: ${this.state.developmentMode ? '🛡️ ACTIVE' : '❌ Inactive'}`);
    
    if (this.state.lastBackup) {
      const backupAge = Math.round((Date.now() - new Date(this.state.lastBackup.timestamp).getTime()) / (1000 * 60));
      console.log(`Last Backup: ${backupAge} minutes ago`);
    } else {
      console.log('Last Backup: Never');
    }
    
    if (this.state.lastRestore) {
      const restoreAge = Math.round((Date.now() - new Date(this.state.lastRestore.timestamp).getTime()) / (1000 * 60));
      console.log(`Last Restore: ${restoreAge} minutes ago`);
    } else {
      console.log('Last Restore: Never');
    }

    const recentChanges = this.getRecentChanges();
    console.log(`Recent Changes: ${recentChanges.length} in last 30 minutes`);
    
    if (recentChanges.length > 0) {
      console.log('\nRecent activity:');
      recentChanges.slice(-5).forEach(change => {
        const time = new Date(change.timestamp).toLocaleTimeString();
        console.log(`  ${time} - ${change.type}: ${change.description}`);
      });
    }
  }
}

// Usage in other scripts
const protector = new WorkspaceProtector();

// Command line interface
if (require.main === module) {
  const command = process.argv[2];
  
  switch(command) {
    case 'start':
      protector.startDevelopment();
      break;
    case 'stop':
      protector.stopDevelopment();
      break;
    case 'status':
      protector.showStatus();
      break;
    case 'protect':
      if (protector.checkProtection()) {
        console.log('⚠️ Cannot proceed - workspace is protected');
        console.log('Use "node workspace-protector.js stop" to disable protection');
        process.exit(1);
      }
      break;
    default:
      console.log('Usage:');
      console.log('  node workspace-protector.js start     # Start development protection');
      console.log('  node workspace-protector.js stop      # Stop development protection');
      console.log('  node workspace-protector.js status    # Show workspace status');
      console.log('  node workspace-protector.js protect   # Check if protected (exit 1 if protected)');
  }
}

module.exports = { WorkspaceProtector, protector };
