'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HiOutlineX, HiOutlineEye } from 'react-icons/hi';

interface Props {
  title:      string;
  excerpt:    string;
  content:    string;
  coverImage: string | null;
  author:     string;
  category:   string;
  onClose:    () => void;
}

export default function BlogPreview({
  title, excerpt, content, coverImage, author, category, onClose,
}: Props) {
  // Prevent body scroll while preview is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  // Estimate read time (avg 200 wpm)
  const words = content.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.round(words / 200));

  const modal = (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-white">
      {/* Preview header bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <HiOutlineEye size={16} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Preview Mode</p>
            <p className="text-xs text-gray-400">This is how your post will look to readers</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all"
        >
          <HiOutlineX size={18} />
        </button>
      </div>

      {/* Scrollable preview area */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-3xl mx-auto bg-white min-h-full">

          {/* Hero image */}
          {coverImage ? (
            <div className="relative h-[320px] md:h-[440px] overflow-hidden">
              <Image
                src={coverImage}
                alt={title || 'Cover'}
                fill
                className="object-cover"
                unoptimized
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              {/* Category badge */}
              {category && (
                <span className="absolute top-6 left-6 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  {category}
                </span>
              )}
            </div>
          ) : (
            <div className="h-20 bg-gradient-to-r from-primary/10 to-primary/5 flex items-center px-8 pt-8">
              {category && (
                <span className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  {category}
                </span>
              )}
            </div>
          )}

          {/* Content area */}
          <div className="px-8 md:px-12 py-10">

            {/* Title */}
            <h1 className="font-display font-black text-gray-900 text-3xl md:text-4xl leading-tight mb-5">
              {title || <span className="text-gray-300">No title yet…</span>}
            </h1>

            {/* Author / meta row */}
            <div className="flex items-center gap-4 pb-6 mb-8 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-base flex-shrink-0">
                {author ? author.charAt(0).toUpperCase() : 'A'}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{author || 'Admin'}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{today}</span>
                  <span>·</span>
                  <span>{readTime} min read</span>
                </div>
              </div>
            </div>

            {/* Excerpt */}
            {excerpt && (
              <p className="text-lg text-gray-500 italic leading-relaxed mb-8 border-l-4 border-primary/30 pl-4">
                {excerpt}
              </p>
            )}

            {/* Blog body */}
            {content && content !== '<p></p>' ? (
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-gray-300">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="mb-3 opacity-40">
                  <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
                </svg>
                <p className="text-sm font-medium">Start writing to see a preview</p>
              </div>
            )}

            {/* Footer spacing */}
            <div className="h-16" />
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
