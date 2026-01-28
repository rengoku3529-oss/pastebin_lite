'use client';

import { useState, FormEvent } from 'react';

export default function HomePage() {
  const [content, setContent] = useState('');
  const [ttlSeconds, setTtlSeconds] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pasteUrl, setPasteUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPasteUrl('');
    setCopied(false);

    try {
      const body: {
        content: string;
        ttl_seconds?: number;
        max_views?: number;
      } = { content };

      if (ttlSeconds) {
        body.ttl_seconds = parseInt(ttlSeconds, 10);
      }
      if (maxViews) {
        body.max_views = parseInt(maxViews, 10);
      }

      const response = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create paste');
      }

      setPasteUrl(data.url);
      
      // Clear form
      setContent('');
      setTtlSeconds('');
      setMaxViews('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (pasteUrl) {
      await navigator.clipboard.writeText(pasteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setPasteUrl('');
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold text-terminal-cyan glow-cyan mb-3">
            {'>'} PASTEBIN_LITE
          </h1>
          <p className="text-gray-400 text-lg">
            Share code & text with optional expiry
          </p>
        </div>

        {/* Main Card */}
        <div className="card-terminal animate-slide-up">
          {!pasteUrl ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Content Input */}
              <div>
                <label htmlFor="content" className="block text-sm font-semibold text-terminal-cyan mb-2">
                  CONTENT <span className="text-terminal-red">*</span>
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="# Paste your code or text here..."
                  className="textarea-terminal"
                  required
                  disabled={loading}
                />
                <div className="mt-2 text-xs text-gray-500">
                  {content.length} characters
                </div>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* TTL Input */}
                <div>
                  <label htmlFor="ttl" className="block text-sm font-semibold text-terminal-green mb-2">
                    TIME-TO-LIVE (seconds)
                  </label>
                  <input
                    id="ttl"
                    type="number"
                    value={ttlSeconds}
                    onChange={(e) => setTtlSeconds(e.target.value)}
                    placeholder="e.g., 3600 (1 hour)"
                    min="1"
                    className="input-terminal"
                    disabled={loading}
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    Optional: Paste expires after X seconds
                  </div>
                </div>

                {/* Max Views Input */}
                <div>
                  <label htmlFor="views" className="block text-sm font-semibold text-terminal-green mb-2">
                    MAX VIEWS
                  </label>
                  <input
                    id="views"
                    type="number"
                    value={maxViews}
                    onChange={(e) => setMaxViews(e.target.value)}
                    placeholder="e.g., 5"
                    min="1"
                    className="input-terminal"
                    disabled={loading}
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    Optional: Paste deleted after X views
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-terminal-red/10 border border-terminal-red rounded-lg">
                  <p className="text-terminal-red text-sm">⚠ {error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !content.trim()}
                className="btn-terminal-primary w-full"
              >
                {loading ? '⟳ CREATING...' : '→ CREATE PASTE'}
              </button>
            </form>
          ) : (
            /* Success View */
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <div className="text-6xl mb-4">✓</div>
                <h2 className="text-2xl font-bold text-terminal-green mb-2">
                  Paste Created Successfully!
                </h2>
                <p className="text-gray-400">
                  Share this URL to view your paste
                </p>
              </div>

              {/* URL Display */}
              <div className="relative">
                <input
                  type="text"
                  value={pasteUrl}
                  readOnly
                  className="input-terminal pr-24 text-terminal-cyan"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                  onClick={handleCopy}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-terminal-cyan/20 border border-terminal-cyan text-terminal-cyan rounded text-sm font-semibold hover:bg-terminal-cyan/30 transition-colors"
                >
                  {copied ? '✓ Copied!' : '□ Copy'}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <a
                  href={pasteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-terminal flex-1 text-center"
                >
                  → View Paste
                </a>
                <button
                  onClick={handleReset}
                  className="btn-terminal-primary flex-1"
                >
                  + Create Another
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Pastes with constraints will self-destruct automatically</p>
          <p className="mt-2">Built with Next.js + Neon Postgres</p>
        </div>
      </div>
    </div>
  );
}
