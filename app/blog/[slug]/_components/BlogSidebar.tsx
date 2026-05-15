import Image from 'next/image';
import Link from 'next/link';
import type { BlogPostDb } from '@/lib/db-blogs';
import { formatBlogDate } from '@/lib/db-blogs';

export default function BlogSidebar({ posts }: { posts: BlogPostDb[] }) {
  return (
    <aside className="flex flex-col gap-6">
      <h2 className="font-display font-bold text-gray-900 text-lg">Other Blog Posts</h2>

      <div className="flex flex-col gap-4">
        {posts.map((post) => {
          const date = formatBlogDate(post.publishedAt ?? post.createdAt);
          const authorName = post.author?.name ?? 'Geuza';
          return (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex gap-3 items-start"
            >
              {/* Thumbnail */}
              <div className="relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No img
                  </div>
                )}
              </div>

              {/* Meta */}
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-[#0F9E59] transition-colors">
                  {post.title}
                </p>
                {date && (
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {date}
                  </div>
                )}
                <p className="text-xs text-gray-400">{authorName}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
