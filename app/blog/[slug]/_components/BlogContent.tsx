import Image from 'next/image';
import type { BlogPost } from '@/lib/blog-posts';

export default function BlogContent({ post }: { post: BlogPost }) {
  return (
    <article className="flex flex-col gap-6">
      {/* Featured image */}
      <div className="relative h-[280px] md:h-[360px] rounded-2xl overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
          unoptimized
        />
      </div>

      {/* Author + date */}
      <div className="flex items-center gap-3">
        <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#0F9E59]/20">
          <Image src={post.authorAvatar} alt={post.author} fill className="object-cover" unoptimized />
        </div>
        <span className="text-sm font-medium text-gray-700">{post.author}</span>
        <span className="text-gray-300 text-sm">·</span>
        <div className="flex items-center gap-1.5 text-gray-400 text-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {post.date}
        </div>
      </div>

      {/* Title */}
      <h1 className="font-display font-black text-gray-900 text-2xl md:text-3xl lg:text-4xl leading-tight">
        {post.fullTitle}
      </h1>

      {/* Body — first half */}
      <div className="flex flex-col gap-4">
        {post.content.slice(0, Math.ceil(post.content.length / 2)).map((para, i) => (
          <p key={i} className="text-gray-600 text-sm md:text-base leading-relaxed">
            {para}
          </p>
        ))}
      </div>

      {/* Gallery */}
      {post.gallery.length > 0 && (
        <div className="mt-2">
          <h2 className="font-display font-bold text-gray-900 text-xl mb-4">Gallery</h2>
          <div className="grid grid-cols-2 gap-3">
            {post.gallery.map((src, i) => (
              <div key={i} className="relative h-36 md:h-44 rounded-xl overflow-hidden">
                <Image
                  src={src}
                  alt={`Gallery image ${i + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Body — second half */}
      <div className="flex flex-col gap-4">
        {post.content.slice(Math.ceil(post.content.length / 2)).map((para, i) => (
          <p key={i} className="text-gray-600 text-sm md:text-base leading-relaxed">
            {para}
          </p>
        ))}
      </div>
    </article>
  );
}
