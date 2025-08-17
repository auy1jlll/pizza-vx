// Simple manual test script for new in-memory rate limiters
// Usage: start dev or prod server, then: node test-rate-limits.js
// Adjust ATTEMPTS if you change limiter thresholds.

const ATTEMPTS_AUTH = 12; // authLimiter max = 10 per 15m
const ATTEMPTS_CHECKOUT = 7; // orderLimiter max = 5 per 5m
const ATTEMPTS_ADMIN = 105; // adminLimiter max = 100 per 15m

const BASE = process.env.BASE_URL || 'http://localhost:3000';

async function tryAuth() {
  console.log('\n[AUTH] Testing auth login limiter');
  for (let i = 1; i <= ATTEMPTS_AUTH; i++) {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'nope@example.com', password: 'badpass' })
    }).catch(e => ({ error: e }));
    if (res.error) { console.error('Request failed', res.error); continue; }
    const text = await res.text();
    console.log(`Attempt ${i}: status=${res.status}${res.status===429 ? ' (RATE LIMITED)' : ''}`);
    if (i === ATTEMPTS_AUTH) console.log('Last response body snippet:', text.slice(0,120));
  }
}

async function tryCheckout() {
  console.log('\n[CHECKOUT] Testing order checkout limiter');
  for (let i = 1; i <= ATTEMPTS_CHECKOUT; i++) {
    const res = await fetch(`${BASE}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [],
        customer: { name: 'Test', phone: '0000000000' },
        delivery: null,
        orderType: 'PICKUP',
        paymentMethod: 'CASH',
        subtotal: 0,
        deliveryFee: 0,
        tax: 0,
        total: 0,
        notes: 'rate limit test'
      })
    }).catch(e => ({ error: e }));
    if (res.error) { console.error('Request failed', res.error); continue; }
    console.log(`Attempt ${i}: status=${res.status}${res.status===429 ? ' (RATE LIMITED)' : ''}`);
  }
}

async function tryAdmin() {
  console.log('\n[ADMIN] Testing admin sizes GET limiter (no auth token so expect 401/429 interplay)');
  for (let i = 1; i <= ATTEMPTS_ADMIN; i++) {
    const res = await fetch(`${BASE}/api/admin/sizes`).catch(e => ({ error: e }));
    if (res.error) { console.error('Request failed', res.error); continue; }
    if (i % 10 === 0 || res.status === 429) {
      console.log(`Attempt ${i}: status=${res.status}${res.status===429 ? ' (RATE LIMITED)' : ''}`);
      if (res.status === 429) break;
    }
  }
}

(async () => {
  await tryAuth();
  await tryCheckout();
  await tryAdmin();
  console.log('\nDone. Inspect statuses above to confirm limiter behavior.');
})();
