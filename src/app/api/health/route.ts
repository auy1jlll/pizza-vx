import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Enhanced health endpoint with comprehensive diagnostics
export async function GET(request: Request) {
  const started = Date.now();
  const url = new URL(request.url);
  const mode = url.searchParams.get('mode') || 'full';
  const payload: any = { 
    ok: true, 
    ts: started, 
    mode,
    uptime: Math.floor(process.uptime()),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
    },
    pid: process.pid,
    nodeVersion: process.version,
    environment: process.env.NODE_ENV
  };
  
  console.log('[HEALTH] Incoming request mode=', mode);
  
  try {
    if (mode !== 'lite') {
      try {
        // Test database connection with timeout
        const dbTest = await Promise.race([
          prisma.$queryRaw`SELECT 1 as test, NOW() as timestamp`,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Database timeout')), 5000)
          )
        ]);
        
        payload.database = 'connected';
        payload.orm = 'ok';
        payload.dbResponse = dbTest;
        
        // Additional connection pool test
        try {
          await prisma.user.count();
          payload.userTableAccess = 'ok';
        } catch (e) {
          payload.userTableAccess = 'fail';
          payload.userTableError = (e as Error).message;
        }
        
      } catch (e) {
        payload.database = 'disconnected';
        payload.orm = 'fail';
        payload.ormError = (e as Error).message;
        payload.ok = false;
        console.error('[HEALTH] Database check failed:', e);
      }
    } else {
      payload.database = 'skipped';
    }
    
    payload.latencyMs = Date.now() - started;
    return NextResponse.json(payload, { status: payload.ok ? 200 : 503 });
    
  } catch (fatal) {
    console.error('[HEALTH] Fatal handler error:', fatal);
    return NextResponse.json({ 
      ok: false, 
      fatal: (fatal as Error).message, 
      ts: started,
      latencyMs: Date.now() - started
    }, { status: 500 });
  }
}
