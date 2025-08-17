// Instrumentation: attaches diagnostic listeners once per server start
export async function register() {
  if ((globalThis as any).__INSTRUMENTED__) return;
  (globalThis as any).__INSTRUMENTED__ = true;
  const isEdge = typeof (globalThis as any).EdgeRuntime !== 'undefined';
  console.log('[INSTRUMENT] Registering diagnostics at', new Date().toISOString(), 'edge?', isEdge);

  // Only attach Node.js listeners in Node.js runtime, not Edge Runtime
  if (!isEdge && typeof globalThis !== 'undefined' && 'process' in globalThis) {
    try {
      // Use dynamic access to avoid static analysis issues with Edge Runtime
      const proc = (globalThis as any).process;
      if (proc && proc.on && proc.versions && proc.versions.node) {
        proc.on('exit', (code: number) => {
          const uptime = proc.uptime ? proc.uptime().toFixed(1) : 'unknown';
          console.log('[INSTRUMENT][exit]', code, 'uptimeSec', uptime);
        });
        proc.on('beforeExit', (code: number) => console.log('[INSTRUMENT][beforeExit]', code));
        proc.on('SIGINT', () => console.log('[INSTRUMENT][signal] SIGINT'));
        proc.on('SIGTERM', () => console.log('[INSTRUMENT][signal] SIGTERM'));
        proc.on('uncaughtException', (err: Error) => console.error('[INSTRUMENT][uncaughtException]', err));
        proc.on('unhandledRejection', (reason: any) => console.error('[INSTRUMENT][unhandledRejection]', reason));
        console.log('[INSTRUMENT] Node listeners attached');
      }
    } catch (err) {
      console.warn('[INSTRUMENT] Failed attaching Node listeners', err);
    }
  } else {
    console.log('[INSTRUMENT] Edge runtime detected; skipping Node process listeners');
  }

  // Lightweight heartbeat every 30s to detect silent death (will stop if process is killed)
  try {
    const interval = setInterval(() => {
      console.log('[INSTRUMENT][heartbeat]', Date.now());
    }, 30000);
    // Avoid keeping event loop alive unnecessarily in production; clear in 10 minutes automatically
    setTimeout(() => clearInterval(interval), 10 * 60 * 1000).unref?.();
  } catch {}
}
