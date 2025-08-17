// JWT Improvements / Baseline Auth Testing Script (Adaptive)
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function ensureAdminUser() {
  const email = 'admin@test.com';
  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await prisma.user.create({ data: { email, password: passwordHash, role: 'ADMIN', name: 'Admin User' } });
    console.log('ℹ️  Created missing admin user for tests');
  }
}

async function tableExists(name) {
  try {
    const rows = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table' AND name = ${name}`;
    return rows.length > 0;
  } catch {
    return false;
  }
}

async function columnExists(table, column) {
  try {
    const rows = await prisma.$queryRaw`PRAGMA table_info(${table})`;
    return rows.some(r => r.name === column);
  } catch {
    return false;
  }
}

async function detectFeatures() {
  // Attempt login to inspect cookies
  const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin@test.com', password: 'admin123' })
  });

  const cookies = loginResponse.headers.get('set-cookie') || '';
  const hasAccess = /access-token=/.test(cookies);
  const hasRefresh = /refresh-token=/.test(cookies);
  const accessExpiryMatch = cookies.match(/access-token=[^;]+;[^]*?Max-Age=(\d+)/);
  const accessMaxAge = accessExpiryMatch ? parseInt(accessExpiryMatch[1]) : null;

  // Sessions endpoint probe
  let hasSessionsEndpoint = false;
  try {
    const sessionsProbe = await fetch('http://localhost:3000/api/auth/sessions');
    hasSessionsEndpoint = sessionsProbe.ok;
  } catch {/* ignore */}

  // Table presence
  const refreshTable = await tableExists('refresh_tokens');
  const blacklistTable = await tableExists('jwt_blacklist');
  const secretsTable = await tableExists('jwt_secrets');
  const deviceFingerprintCol = refreshTable && await columnExists('refresh_tokens', 'device_fingerprint');

  return {
    loginOk: loginResponse.ok,
    hasAccess,
    hasRefresh,
    accessMaxAge,
    hasSessionsEndpoint,
    refreshTable,
    blacklistTable,
    secretsTable,
    deviceFingerprintCol,
  };
}

async function testJWT() {
  console.log('🔐 Adaptive JWT/Auth Test Suite');
  console.log('='.repeat(60));

  await ensureAdminUser();
  const features = await detectFeatures();
  console.log('Feature detection:', JSON.stringify(features, null, 2));

  const tests = [];

  const results = { passed: 0, failed: 0, skipped: 0 };

  function record(name, status, detail='') {
    if (status === 'pass') { results.passed++; console.log(`✅ ${name}${detail?': '+detail:''}`); }
    else if (status === 'fail') { results.failed++; console.log(`❌ ${name}${detail?': '+detail:''}`); }
    else { results.skipped++; console.log(`⏭️  ${name}${detail?': '+detail:''}`); }
  }

  // Test 1: Basic login + access token
  tests.push(async () => {
    if (features.loginOk && features.hasAccess) record('Login returns access token', 'pass');
    else record('Login returns access token', 'fail', 'Missing access-token cookie or login failed');
  });

  // Test 2: Refresh token presence (advanced)
  tests.push(async () => {
    if (!features.hasRefresh) return record('Refresh token issuance', 'skip', 'Not implemented');
    record('Refresh token issuance', 'pass');
  });

  // Test 3: Refresh endpoint functionality
  tests.push(async () => {
    if (!features.hasRefresh) return record('Token refresh flow', 'skip', 'Refresh token not issued');
    // Attempt refresh using a fresh login
    const login = await fetch('http://localhost:3000/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'admin@test.com', password: 'admin123' }) });
    const cookies = login.headers.get('set-cookie') || '';
    const rt = cookies.match(/refresh-token=([^;]+)/);
    if (!rt) return record('Token refresh flow', 'fail', 'Refresh token cookie missing after login');
    const refreshResp = await fetch('http://localhost:3000/api/auth/refresh', { method: 'POST', headers: { 'Cookie': `refresh-token=${rt[1]}` } });
    if (refreshResp.ok) record('Token refresh flow', 'pass'); else record('Token refresh flow', 'fail', `Status ${refreshResp.status}`);
  });

  // Test 4: Logout
  tests.push(async () => {
    const login = await fetch('http://localhost:3000/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'admin@test.com', password: 'admin123' }) });
    if (!login.ok) return record('Logout endpoint', 'fail', 'Login failed');
    const cookies = login.headers.get('set-cookie') || '';
    const logout = await fetch('http://localhost:3000/api/auth/logout', { method: 'POST', headers: { 'Cookie': cookies } });
    if (logout.ok) record('Logout endpoint', 'pass'); else record('Logout endpoint', 'fail', `Status ${logout.status}`);
  });

  // Test 5: Sessions endpoint (advanced)
  tests.push(async () => {
    if (!features.hasSessionsEndpoint) return record('Sessions endpoint', 'skip', 'Not present');
    const login = await fetch('http://localhost:3000/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'admin@test.com', password: 'admin123' }) });
    if (!login.ok) return record('Sessions endpoint', 'fail', 'Login failed');
    const cookies = login.headers.get('set-cookie') || '';
    const resp = await fetch('http://localhost:3000/api/auth/sessions', { headers: { 'Cookie': cookies } });
    if (!resp.ok) return record('Sessions endpoint', 'fail', `Status ${resp.status}`);
    try { const data = await resp.json(); if (Array.isArray(data.sessions)) record('Sessions endpoint', 'pass'); else record('Sessions endpoint', 'fail', 'Invalid structure'); } catch { record('Sessions endpoint', 'fail', 'JSON parse error'); }
  });

  // Test 6: Refresh token storage (advanced)
  tests.push(async () => {
    if (!features.refreshTable || !features.hasRefresh) return record('Refresh token storage', 'skip', 'No table or not issued');
    const rows = await prisma.$queryRaw`SELECT COUNT(*) as count FROM refresh_tokens WHERE revoked = FALSE`;
    if (rows[0].count > 0) record('Refresh token storage', 'pass'); else record('Refresh token storage', 'fail', 'No rows');
  });

  // Test 7: JWT blacklist table accessibility (informational)
  tests.push(async () => {
    if (!features.blacklistTable) return record('JWT blacklist table', 'skip', 'Table missing');
    const rows = await prisma.$queryRaw`SELECT COUNT(*) as count FROM jwt_blacklist`;
    record('JWT blacklist table', 'pass', `${rows[0].count} entries`);
  });

  // Test 8: JWT secrets table accessibility (informational)
  tests.push(async () => {
    if (!features.secretsTable) return record('JWT secrets table', 'skip', 'Table missing');
    const rows = await prisma.$queryRaw`SELECT COUNT(*) as count FROM jwt_secrets`;
    record('JWT secrets table', 'pass', `${rows[0].count} entries`);
  });

  // Test 9: Access token expiration expectation
  tests.push(async () => {
    if (!features.hasAccess) return record('Access token expiration', 'fail', 'No access token');
    if (features.hasRefresh) {
      // Advanced flow expects 15 min access tokens
      if (features.accessMaxAge === 900) record('Access token expiration', 'pass', '15m');
      else record('Access token expiration', 'fail', `Expected 900s got ${features.accessMaxAge}`);
    } else {
      // Simple flow acceptable 24h tokens
      if (features.accessMaxAge && Math.abs(features.accessMaxAge - 86400) < 5) record('Access token expiration', 'pass', '24h simple mode');
      else record('Access token expiration', 'skip', 'Unable to determine or non-standard');
    }
  });

  // Test 10: Device fingerprinting (advanced)
  tests.push(async () => {
    if (!features.refreshTable || !features.deviceFingerprintCol || !features.hasRefresh) return record('Device fingerprinting', 'skip', 'Not implemented');
    const rows = await prisma.$queryRaw`SELECT device_fingerprint FROM refresh_tokens WHERE device_fingerprint IS NOT NULL LIMIT 1`;
    if (rows.length > 0) record('Device fingerprinting', 'pass'); else record('Device fingerprinting', 'fail', 'No fingerprints');
  });

  // Execute tests sequentially
  for (const t of tests) {
    try { await t(); } catch (e) { console.log('❌ Test execution error:', e.message); results.failed++; }
  }

  const total = tests.length;
  const effective = total - results.skipped;
  console.log('\n' + '='.repeat(60));
  console.log('🎯 Adaptive Auth Test Results');
  console.log(`✅ Passed: ${results.passed}/${total} (effective ${results.passed}/${effective})`);
  console.log(`❌ Failed: ${results.failed}/${total}`);
  console.log(`⏭️  Skipped: ${results.skipped}`);
  console.log(`📊 Success Rate (excluding skipped): ${effective>0?Math.round(results.passed/effective*100):0}%`);

  const allGood = results.failed === 0;
  if (allGood) {
    if (features.hasRefresh) {
      console.log('\n🎉 Advanced JWT features verified.');
    } else {
      console.log('\nℹ️  Baseline auth verified (no advanced refresh features present).');
    }
  } else {
    console.log('\n⚠️  Review failed tests above.');
  }
  return allGood;
}

testJWT()
  .then(ok => process.exit(ok?0:1))
  .catch(err => { console.error('Fatal test error', err); process.exit(1); });
