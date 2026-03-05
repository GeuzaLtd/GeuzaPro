import Image from 'next/image';
import Link from 'next/link';
import { blogPosts } from '@/lib/blog-posts';

export default function OtherPosts() {
  // All posts except the first (recent post)
  const posts = blogPosts.slice(1);

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-10">
          <span className="w-10 h-px bg-[#0F9E59] flex-shrink-0" />
          <h2 className="text-[#0F9E59] text-sm font-bold tracking-[0.22em] uppercase leading-none flex-shrink-0">
            Other Posts
          </h2>
          <span className="w-10 h-px bg-[#0F9E59] flex-shrink-0" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Image */}
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="relative h-48 overflow-hidden">
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
              <div className="flex flex-col flex-1 p-5">
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="font-display font-bold text-gray-900 text-base leading-snug mb-2 hover:text-[#0F9E59] transition-colors">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1 mb-5">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="w-full inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#0F9E59] text-white text-sm font-medium hover:bg-[#0d8a4d] transition-all duration-300"
                >
                  Read More
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
