'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  HiOutlineArrowLeft,
  HiOutlineSave,
  HiOutlineEye,
  HiOutlinePlus,
  HiOutlineX,
} from 'react-icons/hi';
import { DashboardHeader, PageHeader } from '@/components/dashboard';
import ImageUploadSlot from '@/components/dashboard/ImageUploadSlot';
import BlogEditor from '@/components/dashboard/BlogEditor';
import BlogPreview from '@/components/dashboard/BlogPreview';
import { createBlog } from '@/actions/blogs';
import { useRouter } from 'next/navigation';

const CATEGORIES = ['Impact', 'Story', 'Innovation', 'Partners', 'Community', 'Guide', 'Team', 'Report'];

const fieldVariants = {
  hidden:   { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }),
};

export default function NewBlogPostPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title:    '',
    excerpt:  '',
    author:   'Admin',
    category: 'Impact',
    status:   'Draft',
    tags:     [] as string[],
  });
  const [content, setContent]       = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [tagInput, setTagInput]     = useState('');
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [preview, setPreview]       = useState(false);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    setTagInput('');
  };
  const removeTag = (t: string) => setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }));

  const handleSave = async (status: string) => {
    if (!form.title.trim()) return;
    setSaving(true);
    await createBlog({
      title:   form.title,
      content,
      excerpt: form.excerpt,
      status:  status === 'Published' ? 'published' : 'draft',
      ...(coverImage ? { coverImage } : {}),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    setForm((f) => ({ ...f, status }));
    router.push('/dashboard/blog');
  };

  return (
    <>
      <DashboardHeader title="New Blog Post" />

      {/* Preview overlay */}
      {preview && (
        <BlogPreview
          title={form.title}
          excerpt={form.excerpt}
          content={content}
          coverImage={coverImage}
          author={form.author}
          category={form.category}
          onClose={() => setPreview(false)}
        />
      )}

      <main className="flex-1 overflow-y-auto bg-gray-50">
        {/* Top action bar */}
        <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
          <Link
            href="/dashboard/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium"
          >
            <HiOutlineArrowLeft size={15} />
            Back to Blog Posts
          </Link>
          <div className="flex items-center gap-3">
            {saved && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs text-[#0F9E59] font-semibold"
              >
                ✓ Saved
              </motion.span>
            )}
            <button
              onClick={() => setPreview(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
            >
              <HiOutlineEye size={14} />
              Preview
            </button>
            <button
              onClick={() => handleSave('Draft')}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-60"
            >
              <HiOutlineSave size={14} />
              Save Draft
            </button>
            <button
              onClick={() => handleSave('Published')}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#0F9E59] text-white text-sm font-bold hover:bg-[#0d8a4d] transition-all shadow-sm shadow-[#0F9E59]/20 disabled:opacity-60"
            >
              {saving && (
                <motion.span
                  className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white block"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
              )}
              Publish
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          <PageHeader
            title="Create New Post"
            description="Write and publish a new blog article"
            breadcrumbs={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Blog', href: '/dashboard/blog' },
              { label: 'New Post' },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Main content ── */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Title */}
              <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Post Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Enter an engaging title..."
                    className="w-full text-2xl font-display font-black text-gray-900 placeholder-gray-300 focus:outline-none bg-transparent"
                  />
                </div>
              </motion.div>

              {/* Cover image */}
              <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Cover Image</label>
                  <ImageUploadSlot
                    value={coverImage}
                    onChange={(url) => setCoverImage(url)}
                    isPrimary
                    size="lg"
                    folder="geuza/blog"
                  />
                </div>
              </motion.div>

              {/* Excerpt */}
              <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Excerpt</label>
                  <textarea
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    placeholder="A short summary shown on the blog listing page..."
                    rows={3}
                    className="w-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent resize-none leading-relaxed"
                  />
                  <p className="text-xs text-gray-300 mt-2 text-right">{form.excerpt.length} / 200</p>
                </div>
              </motion.div>

              {/* Rich text editor */}
              <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
                <div>
                  <div className="flex items-center justify-between mb-3 px-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Content</label>
                    <span className="text-xs text-gray-400">Use the toolbar to format. Click the 🖼 icon to insert images.</span>
                  </div>
                  <BlogEditor
                    content={content}
                    onChange={setContent}
                    placeholder="Start writing your article here..."
                  />
                </div>
              </motion.div>

            </div>

            {/* ── Sidebar ── */}
            <div className="flex flex-col gap-5">

              {/* Publish */}
              <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible">
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Publish</p>
                  <div className="flex flex-col gap-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Status</span>
                      <span className="text-sm font-semibold text-gray-700">{form.status}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Author</span>
                      <span className="text-sm font-semibold text-[#0F9E59]">{form.author}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                    <button onClick={() => setPreview(true)}
                      className="w-full py-2.5 rounded-full border border-primary/30 text-primary text-sm font-semibold hover:bg-primary/5 transition-all flex items-center justify-center gap-2">
                      <HiOutlineEye size={14} /> Preview
                    </button>
                    <button onClick={() => handleSave('Published')} disabled={saving}
                      className="w-full py-2.5 rounded-full bg-[#0F9E59] text-white text-sm font-bold hover:bg-[#0d8a4d] transition-all">
                      Publish Now
                    </button>
                    <button onClick={() => handleSave('Draft')} disabled={saving}
                      className="w-full py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
                      Save as Draft
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Category */}
              <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="visible">
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Category</p>
                  <div className="flex flex-col gap-1.5">
                    {CATEGORIES.map((c) => (
                      <label key={c} className="flex items-center gap-3 cursor-pointer group py-1" onClick={() => setForm({ ...form, category: c })}>
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${form.category === c ? 'bg-[#0F9E59] border-[#0F9E59]' : 'border-gray-300 group-hover:border-[#0F9E59]/50'}`}>
                          {form.category === c && (
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                          )}
                        </div>
                        <span className={`text-sm transition-colors ${form.category === c ? 'text-gray-900 font-semibold' : 'text-gray-500 group-hover:text-gray-700'}`}>{c}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Author */}
              <motion.div custom={6} variants={fieldVariants} initial="hidden" animate="visible">
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Author</p>
                  <input type="text" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0F9E59]/10 focus:border-[#0F9E59] transition-all" />
                </div>
              </motion.div>

              {/* Tags */}
              <motion.div custom={7} variants={fieldVariants} initial="hidden" animate="visible">
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Tags</p>
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {form.tags.map((t) => (
                      <span key={t} className="inline-flex items-center gap-1 bg-[#0F9E59]/10 text-[#0F9E59] text-xs font-semibold px-2.5 py-1 rounded-full">
                        {t}
                        <button onClick={() => removeTag(t)} className="hover:text-red-500 transition-colors"><HiOutlineX size={10} /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                      placeholder="Add tag..."
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0F9E59] transition-all" />
                    <button onClick={addTag} className="w-9 h-9 rounded-xl bg-[#0F9E59]/10 text-[#0F9E59] hover:bg-[#0F9E59] hover:text-white flex items-center justify-center transition-all">
                      <HiOutlinePlus size={15} />
                    </button>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </main>
    </>
  );
}
