import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Health endpoint with optional ?mode=lite to skip DB checks
export async function GET(request: Request) {
  const started = Date.now();
  const url = new URL(request.url);
  const mode = url.searchParams.get('mode') || 'full';
  const payload: any = { ok: true, ts: started, mode };
  console.log('[HEALTH] Incoming request mode=', mode);
  try {
    if (mode !== 'lite') {
      try {
        await prisma.user.count();
        payload.orm = 'ok';
      } catch (e) {
        payload.orm = 'fail';
        payload.ormError = (e as Error).message;
        payload.ok = false;
      }
      if (payload.orm !== 'ok') {
        try {
          await prisma.$queryRaw`SELECT 1`;
          payload.raw = 'ok';
        } catch (e) {
          payload.raw = 'fail';
            payload.rawError = (e as Error).message;
          payload.ok = false;
        }
      }
    } else {
      payload.skipped = 'db';
    }
    payload.latencyMs = Date.now() - started;
    return NextResponse.json(payload, { status: payload.ok ? 200 : 500 });
  } catch (fatal) {
    console.error('[HEALTH] Fatal handler error:', fatal);
    return NextResponse.json({ ok: false, fatal: (fatal as Error).message, ts: started }, { status: 500 });
  }
}
