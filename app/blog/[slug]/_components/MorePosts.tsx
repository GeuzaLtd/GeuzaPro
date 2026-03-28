import Image from 'next/image';
import Link from 'next/link';
import type { BlogPostDb } from '@/lib/db-blogs';
import { formatBlogDate } from '@/lib/db-blogs';

export default function MorePosts({ posts }: { posts: BlogPostDb[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="py-14 md:py-20 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">

        {/* Heading */}
        <div className="flex items-center gap-4 mb-10">
          <span className="w-10 h-px bg-[#0F9E59] flex-shrink-0" />
          <h2 className="text-[#0F9E59] text-sm font-bold tracking-[0.22em] uppercase leading-none flex-shrink-0">
            More from Our Blog
          </h2>
          <span className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((post) => {
            const date       = formatBlogDate(post.publishedAt ?? post.createdAt);
            const authorName = post.author?.name ?? 'Geuza';
            const category   = post.category?.name ?? null;
            const words      = post.content.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
            const readTime   = Math.max(1, Math.round(words / 200));

            return (
              <article
                key={post.id}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Image */}
                <Link href={`/blog/${post.slug}`} className="block flex-shrink-0">
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    )}
                    {/* Category badge over image */}
                    {category && (
                      <span className="absolute top-3 left-3 bg-[#0F9E59] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                        {category}
                      </span>
                    )}
                  </div>
                </Link>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5 gap-3">

                  {/* Author + date */}
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="font-medium text-gray-500">{authorName}</span>
                    {date && (
                      <>
                        <span>·</span>
                        <span>{date}</span>
                      </>
                    )}
                    <span>·</span>
                    <span>{readTime} min read</span>
                  </div>

                  {/* Title */}
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="font-display font-bold text-gray-900 text-base leading-snug hover:text-[#0F9E59] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                  )}

                  {/* CTA */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-auto pt-2 inline-flex items-center gap-1.5 text-[#0F9E59] text-sm font-semibold hover:gap-3 transition-all duration-200 group/link"
                  >
                    Read More
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover/link:translate-x-1">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* View all link */}
        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full border-2 border-[#0F9E59] text-[#0F9E59] text-sm font-bold hover:bg-[#0F9E59] hover:text-white transition-all duration-300"
          >
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  );
}
