/**
 * Create a new paste
 * POST /api/pastes
 */

import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { createPaste, initDatabase } from '@/lib/db';
import { validateCreatePaste } from '@/lib/validation';
import { calculateExpiresAt, getCurrentTime } from '@/lib/time';
import { getBaseUrl, generatePasteUrl } from '@/lib/url';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Initialize database schema
    await initDatabase();

    // Parse request body
    const body = await request.json();

    // Validate input
    const validation = validateCreatePaste(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const { content, ttl_seconds, max_views } = validation.data;

    // Generate unique ID
    const id = nanoid(10);

    // Get current time (respects TEST_MODE)
    const currentTime = getCurrentTime(request.headers);

    // Calculate expiry if TTL is provided
    const expiresAt = ttl_seconds 
      ? calculateExpiresAt(ttl_seconds, currentTime)
      : null;

    // Create paste in database
    await createPaste(id, content, expiresAt, max_views ?? null);

    // Generate URL
    const baseUrl = getBaseUrl(request);
    const url = generatePasteUrl(id, baseUrl);

    return NextResponse.json(
      { id, url },
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating paste:', error);
    return NextResponse.json(
      { error: 'Failed to create paste' },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
