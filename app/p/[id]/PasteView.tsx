'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PasteViewProps {
  paste: {
    content: string;
    remaining_views: number | null;
    expires_at: string | null;
  };
  pasteId: string;
}

export default function PasteView({ paste, pasteId }: PasteViewProps) {
  const [copied, setCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  // Update countdown timer
  useEffect(() => {
    if (!paste.expires_at) return;

    const updateTimer = () => {
      const now = new Date();
      const expires = new Date(paste.expires_at!);
      const diff = expires.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('Expired');
        return;
      }

      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours % 24}h ${minutes % 60}m`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes % 60}m ${seconds % 60}s`);
      } else if (minutes > 0) {
        setTimeRemaining(`${minutes}m ${seconds % 60}s`);
      } else {
        setTimeRemaining(`${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [paste.expires_at]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(paste.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <Link
            href="/"
            className="text-terminal-cyan hover:text-terminal-green transition-colors flex items-center gap-2"
          >
            <span className="text-xl">←</span>
            <span className="font-semibold">Create New Paste</span>
          </Link>

          <div className="text-gray-500 text-sm font-mono">
            ID: {pasteId}
          </div>
        </div>

        {/* Metadata Bar */}
        <div className="card-terminal mb-6 animate-slide-up">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            {/* Views Remaining */}
            {paste.remaining_views !== null && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">👁️ Views Remaining:</span>
                <span className="text-terminal-cyan font-bold">
                  {paste.remaining_views}
                </span>
              </div>
            )}

            {/* Time Remaining */}
            {paste.expires_at && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">⏱️ Expires In:</span>
                <span className={`font-bold ${timeRemaining === 'Expired' ? 'text-terminal-red' : 'text-terminal-green'}`}>
                  {timeRemaining || 'Calculating...'}
                </span>
              </div>
            )}

            {/* No Constraints */}
            {paste.remaining_views === null && !paste.expires_at && (
              <div className="text-gray-500">
                ∞ No expiry constraints
              </div>
            )}
          </div>
        </div>

        {/* Content Display */}
        <div className="card-terminal animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-terminal-cyan">
              {'>'} PASTE_CONTENT
            </h2>
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-terminal-surface border border-terminal-cyan/30 text-terminal-cyan rounded hover:bg-terminal-cyan/10 hover:border-terminal-cyan transition-all text-sm font-semibold"
            >
              {copied ? '✓ Copied!' : '□ Copy'}
            </button>
          </div>

          {/* Content - XSS Safe */}
          <div className="code-block">
            <pre className="whitespace-pre-wrap break-words text-gray-200 leading-relaxed">
              {paste.content}
            </pre>
          </div>
        </div>

        {/* Warning Message */}
        {(paste.remaining_views !== null || paste.expires_at) && (
          <div className="mt-6 p-4 bg-terminal-yellow/5 border border-terminal-yellow/30 rounded-lg animate-fade-in">
            <p className="text-terminal-yellow text-sm">
              ⚠️ <strong>Warning:</strong> This paste has constraints and will become unavailable once{' '}
              {paste.remaining_views !== null && paste.expires_at && 'either the view limit is reached or it expires'}
              {paste.remaining_views !== null && !paste.expires_at && 'the view limit is reached'}
              {!paste.remaining_views && paste.expires_at && 'it expires'}
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
