/**
 * Health check endpoint
 * GET /api/healthz
 */

import { NextResponse } from 'next/server';
import { checkDatabaseHealth, initDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Initialize database schema on first request
    await initDatabase();
    
    // Check database connectivity
    const dbHealthy = await checkDatabaseHealth();

    if (!dbHealthy) {
      return NextResponse.json(
        { ok: false, error: 'Database connection failed' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { ok: true },
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { ok: false, error: 'Service unavailable' },
      { 
        status: 503,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
