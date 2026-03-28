import Image from 'next/image';
import type { BlogPostDb } from '@/lib/db-blogs';
import { formatBlogDate } from '@/lib/db-blogs';

// Detect if content is HTML (from the Tiptap editor) or plain text (legacy)
function isHtml(s: string): boolean {
  return /<[a-z][\s\S]*>/i.test(s);
}

// Split plain-text content into paragraphs (legacy fallback)
function splitPlain(s: string): string[] {
  return s
    .split(/\n{2,}/)
    .flatMap((chunk) => chunk.split(/\n/))
    .map((p) => p.trim())
    .filter(Boolean);
}

export default function BlogContent({ post }: { post: BlogPostDb }) {
  const authorName   = post.author?.name   ?? 'Geuza';
  const authorAvatar = post.author?.avatar ?? null;
  const category     = post.category?.name ?? null;
  const date         = formatBlogDate(post.publishedAt ?? post.createdAt);

  const contentIsHtml = isHtml(post.content);

  // Estimate read time
  const words    = post.content.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.round(words / 200));

  return (
    <article className="flex flex-col gap-8 min-w-0">

      {/* Category badge */}
      {category && (
        <span className="self-start bg-[#0F9E59]/10 text-[#0F9E59] text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
          {category}
        </span>
      )}

      {/* Title */}
      <h1 className="font-display font-black text-gray-900 text-2xl md:text-3xl lg:text-[2.25rem] leading-tight">
        {post.title}
      </h1>

      {/* Excerpt pull-quote */}
      {post.excerpt && (
        <p className="text-lg text-gray-500 italic leading-relaxed border-l-4 border-[#0F9E59]/40 pl-5 py-1">
          {post.excerpt}
        </p>
      )}

      {/* Author + date + read time */}
      <div className="flex items-center gap-3 flex-wrap pb-6 border-b border-gray-100">
        {authorAvatar ? (
          <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#0F9E59]/20">
            <Image src={authorAvatar} alt={authorName} fill className="object-cover" unoptimized />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full flex-shrink-0 border-2 border-[#0F9E59]/20 bg-[#0F9E59]/10 flex items-center justify-center text-[#0F9E59] font-bold text-sm">
            {authorName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-800">{authorName}</span>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            {date && <span>{date}</span>}
            {date && <span>·</span>}
            <span>{readTime} min read</span>
          </div>
        </div>
      </div>

      {/* Featured image */}
      {post.coverImage && (
        <div className="relative h-[260px] md:h-[380px] rounded-2xl overflow-hidden shadow-md">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>
      )}

      {/* Body — HTML or plain text */}
      {contentIsHtml ? (
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      ) : (
        <div className="blog-content flex flex-col gap-4">
          {splitPlain(post.content).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      )}

    </article>
  );
}
