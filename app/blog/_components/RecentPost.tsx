import Image from 'next/image';
import Link from 'next/link';
import type { BlogPostDb } from '@/lib/db-blogs';
import { formatBlogDate } from '@/lib/db-blogs';

export default function RecentPost({ post }: { post: BlogPostDb }) {
  const authorName   = post.author?.name   ?? 'Geuza';
  const authorAvatar = post.author?.avatar ?? null;
  const category     = post.category?.name ?? null;
  const date         = formatBlogDate(post.publishedAt ?? post.createdAt);
  const words        = post.content.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
  const readTime     = Math.max(1, Math.round(words / 200));

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-8">
          <span className="w-10 h-px bg-[#0F9E59] flex-shrink-0" />
          <h2 className="text-[#0F9E59] text-sm font-bold tracking-[0.22em] uppercase leading-none flex-shrink-0">
            Latest Post
          </h2>
          <span className="w-10 h-px bg-[#0F9E59] flex-shrink-0" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-14 items-center">
          {/* Image */}
          <Link href={`/blog/${post.slug}`} className="block group">
            <div className="relative h-[260px] md:h-[360px] rounded-2xl overflow-hidden shadow-md">
              {post.coverImage ? (
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              )}
              {category && (
                <span className="absolute top-4 left-4 bg-[#0F9E59] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                  {category}
                </span>
              )}
            </div>
          </Link>

          {/* Content */}
          <div className="flex flex-col gap-5">
            {/* Meta */}
            <div className="flex items-center gap-3 flex-wrap">
              {authorAvatar ? (
                <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#0F9E59]/20">
                  <Image src={authorAvatar} alt={authorName} fill className="object-cover" unoptimized />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full flex-shrink-0 border-2 border-[#0F9E59]/20 bg-[#0F9E59]/10 flex items-center justify-center text-[#0F9E59] font-bold text-sm">
                  {authorName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-700">{authorName}</span>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  {date && <span>{date}</span>}
                  {date && <span>·</span>}
                  <span>{readTime} min read</span>
                </div>
              </div>
            </div>

            <h3 className="font-display font-bold text-gray-900 text-2xl md:text-3xl leading-snug">
              {post.title}
            </h3>

            {post.excerpt && (
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-5 border-l-4 border-[#0F9E59]/30 pl-4 italic">
                {post.excerpt}
              </p>
            )}

            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0F9E59] text-white text-sm font-semibold hover:bg-[#0d8a4d] transition-all duration-300 self-start shadow-md shadow-[#0F9E59]/20 group/btn"
            >
              Read Full Article
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover/btn:translate-x-1">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
