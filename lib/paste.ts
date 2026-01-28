/**
 * Paste business logic - handles fetching with constraints
 */

import { getPaste, decrementViews, type Paste } from './db';
import { isExpired } from './time';

export interface PasteResult {
  content: string;
  remaining_views: number | null;
  expires_at: string | null;
}

/**
 * Fetch a paste and apply constraints (expiry, view limits)
 * Returns null if paste is unavailable (not found, expired, or view limit exceeded)
 * 
 * IMPORTANT: This function counts as a view!
 */
export async function fetchPaste(
  id: string,
  currentTime: Date
): Promise<PasteResult | null> {
  // Get the paste from database
  const paste = await getPaste(id);
  
  if (!paste) {
    return null; // Paste not found
  }

  // Check if paste has expired (TTL constraint)
  if (paste.expires_at && isExpired(paste.expires_at, currentTime)) {
    return null; // Paste expired
  }

  // Check if paste has view limit
  if (paste.remaining_views !== null) {
    // Check if views are exhausted BEFORE decrementing
    if (paste.remaining_views <= 0) {
      return null; // View limit exceeded
    }

    // Atomically decrement the view count
    const updatedPaste = await decrementViews(id);
    
    if (!updatedPaste) {
      // This means another request exhausted the views concurrently
      return null;
    }

    // Return with updated view count
    return {
      content: updatedPaste.content,
      remaining_views: updatedPaste.remaining_views,
      expires_at: updatedPaste.expires_at ? updatedPaste.expires_at.toISOString() : null,
    };
  }

  // No view limit - return as-is
  return {
    content: paste.content,
    remaining_views: null,
    expires_at: paste.expires_at ? paste.expires_at.toISOString() : null,
  };
}

/**
 * Get paste metadata without counting as a view
 * Used for displaying metadata on the view page
 */
export async function getPasteMetadata(id: string): Promise<Paste | null> {
  return getPaste(id);
}
