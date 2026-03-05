import Image from 'next/image';
import Link from 'next/link';
import { blogPosts } from '@/lib/blog-posts';

export default function RecentPost() {
  const post = blogPosts[0];

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-8">
          <span className="w-10 h-px bg-[#0F9E59] flex-shrink-0" />
          <h2 className="text-[#0F9E59] text-sm font-bold tracking-[0.22em] uppercase leading-none flex-shrink-0">
            Recent Post
          </h2>
          <span className="w-10 h-px bg-[#0F9E59] flex-shrink-0" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Image */}
          <Link href={`/blog/${post.slug}`} className="block group">
            <div className="relative h-[260px] md:h-[340px] rounded-2xl overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                unoptimized
              />
            </div>
          </Link>

          {/* Content */}
          <div className="flex flex-col justify-center">
            {/* Meta */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <Image src={post.authorAvatar} alt={post.author} fill className="object-cover" unoptimized />
              </div>
              <span className="text-sm text-gray-500">{post.author}</span>
              <span className="text-gray-300">·</span>
              <span className="text-sm text-gray-400">{post.date}</span>
            </div>

            <h3 className="font-display font-bold text-gray-900 text-2xl md:text-3xl leading-snug mb-4">
              {post.title}
            </h3>

            <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-6">
              {post.excerpt}
              {' '}Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>

            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#0F9E59] text-white text-sm font-medium hover:bg-[#0d8a4d] transition-all duration-300 self-start"
            >
              Read More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
