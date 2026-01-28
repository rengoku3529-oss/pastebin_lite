/**
 * Time utilities with TEST_MODE support for deterministic testing
 */

/**
 * Get the current time, respecting TEST_MODE and x-test-now-ms header
 * This is CRITICAL for passing automated tests
 */
export function getCurrentTime(headers: Headers): Date {
  // Check if TEST_MODE is enabled
  if (process.env.TEST_MODE === '1') {
    const testNowMs = headers.get('x-test-now-ms');
    if (testNowMs) {
      const timestamp = parseInt(testNowMs, 10);
      if (!isNaN(timestamp)) {
        return new Date(timestamp);
      }
    }
  }
  
  // Default: use real system time
  return new Date();
}

/**
 * Calculate expiry timestamp from TTL seconds
 */
export function calculateExpiresAt(ttlSeconds: number, baseTime: Date = new Date()): Date {
  return new Date(baseTime.getTime() + ttlSeconds * 1000);
}

/**
 * Check if a paste has expired
 */
export function isExpired(expiresAt: Date | null, currentTime: Date): boolean {
  if (!expiresAt) return false;
  return currentTime >= expiresAt;
}

/**
 * Format time remaining for display
 */
export function formatTimeRemaining(expiresAt: Date): string {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  
  if (diff <= 0) return 'Expired';
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}
