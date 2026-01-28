/**
 * Fetch a paste by ID
 * GET /api/pastes/:id
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchPaste } from '@/lib/paste';
import { getCurrentTime } from '@/lib/time';
import { initDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Initialize database schema
    await initDatabase();

    // Get paste ID from URL
    const { id } = await params;

    // Get current time (respects TEST_MODE and x-test-now-ms header)
    const currentTime = getCurrentTime(request.headers);

    // Fetch paste (this counts as a view!)
    const paste = await fetchPaste(id, currentTime);

    if (!paste) {
      // Paste not found, expired, or view limit exceeded
      return NextResponse.json(
        { error: 'Paste not found' },
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Return paste data
    return NextResponse.json(
      {
        content: paste.content,
        remaining_views: paste.remaining_views,
        expires_at: paste.expires_at,
      },
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching paste:', error);
    return NextResponse.json(
      { error: 'Failed to fetch paste' },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
