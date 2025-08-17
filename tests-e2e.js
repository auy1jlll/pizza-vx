/*
 End-to-end scenario test harness.
 Scenarios covered:
 1. Health check
 2. Admin login success + protected endpoint access
 3. Admin login rate limiting (exceed attempts)
 4. Create several orders until checkout limit triggers
 5. Fetch admin orders list
 6. Update an order status
 7. Global assertions summary

 Usage:
   # Ensure dev server running on some port (3000 default or shows alternative)
   # Ensure admin user exists: node create-admin.js
   node tests-e2e.js

 Set BASE_URL env to override (e.g., http://localhost:3004)
*/

const BASE = process.env.BASE_URL || 'http://localhost:3000';

function log(section, msg) { console.log(`\n=== ${section} ===\n${msg}`); }

async function req(path, opts = {}) {
  const res = await fetch(BASE + path, opts).catch(e => ({ networkError: e }));
  if (res.networkError) return { ok: false, status: 0, error: res.networkError.message };
  let bodyText = await res.text();
  let json;
  try { json = JSON.parse(bodyText); } catch {}
  return { ok: res.ok, status: res.status, json, bodyText, headers: res.headers };
}

async function scenario() {
  const summary = { passed: [], failed: [] };

  // 1. Health
  const health = await req('/api/health');
  if (health.ok && health.json?.ok) summary.passed.push('health'); else summary.failed.push('health');
  console.log('Health:', health.status, health.json);

  // 2. Admin login success
  const loginRes = await req('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin@pizzabuilder.com', password: 'admin123' })
  });
  let adminCookies = '';
  if (loginRes.status === 200 && loginRes.headers.get('set-cookie')) {
    adminCookies = loginRes.headers.get('set-cookie');
  }
  if (loginRes.status === 200) summary.passed.push('admin-login'); else summary.failed.push('admin-login');
  console.log('Admin login:', loginRes.status, loginRes.json?.user?.email);

  // 3. Rate limit auth (send extra failed attempts with wrong password)
  let rlTriggered = false;
  for (let i = 0; i < 11; i++) {
    const bad = await req('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin@pizzabuilder.com', password: 'WRONGPASS' })
    });
    if (bad.status === 429) { rlTriggered = true; break; }
  }
  if (rlTriggered) summary.passed.push('auth-rate-limit'); else summary.failed.push('auth-rate-limit');
  console.log('Auth rate limit triggered:', rlTriggered);

  // 4. Create orders until limit (5 allowed, 6th should 429)
  let checkout429 = false;
  let lastOrderId;
  for (let i = 1; i <= 6; i++) {
    const orderBody = {
      orderType: 'PICKUP',
      customer: { name: 'Test User', email: `t${Date.now()}@ex.com`, phone: '5555555555' },
      items: [],
      subtotal: 0,
      deliveryFee: 0,
      tax: 0,
      total: 0
    };
    const o = await req('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderBody) });
    if (o.status === 429) { checkout429 = true; break; }
    if (o.json?.data?.id) lastOrderId = o.json.data.id;
  }
  if (checkout429) summary.passed.push('checkout-rate-limit'); else summary.failed.push('checkout-rate-limit');
  console.log('Checkout rate limit triggered:', checkout429);

  // 5. Fetch admin orders list (requires auth cookie)
  const ordersList = await req('/api/admin/orders', { headers: { Cookie: adminCookies } });
  if (ordersList.status === 200 && Array.isArray(ordersList.json?.orders)) summary.passed.push('admin-orders-list'); else summary.failed.push('admin-orders-list');
  console.log('Admin orders list status:', ordersList.status, 'count:', ordersList.json?.orders?.length);

  // 6. Update an order status (if we got one)
  if (lastOrderId) {
    const upd = await req('/api/admin/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json', Cookie: adminCookies }, body: JSON.stringify({ orderId: lastOrderId, status: 'CONFIRMED' }) });
    if (upd.status === 200 && upd.json?.order?.status === 'CONFIRMED') summary.passed.push('admin-order-update'); else summary.failed.push('admin-order-update');
    console.log('Order update status:', upd.status);
  } else {
    summary.failed.push('admin-order-update');
  }

  // Summary
  log('RESULTS', `Passed: ${summary.passed.length}, Failed: ${summary.failed.length}\n✔ ${summary.passed.join(', ') || 'None'}\n✖ ${summary.failed.join(', ') || 'None'}`);
  if (summary.failed.length) process.exitCode = 1;
}

scenario();
