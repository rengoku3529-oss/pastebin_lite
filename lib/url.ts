/**
 * URL generation utilities
 */

/**
 * Get the base URL for the application
 * Uses environment variable or falls back to request headers
 */
export function getBaseUrl(request?: Request): string {
  // Check environment variable first
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  // Fall back to request headers (for dynamic detection)
  if (request) {
    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    if (host) {
      return `${protocol}://${host}`;
    }
  }

  // Last resort: return relative URL
  return '';
}

/**
 * Generate a paste URL
 */
export function generatePasteUrl(id: string, baseUrl: string): string {
  return `${baseUrl}/p/${id}`;
}
