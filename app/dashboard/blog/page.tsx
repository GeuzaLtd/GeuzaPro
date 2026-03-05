'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineEye,
} from 'react-icons/hi';
import { DashboardHeader, StatusBadge, AdminTable, PageHeader } from '@/components/dashboard';
import type { Column } from '@/components/dashboard/AdminTable';

export interface BlogPost {
  id: number;
  title: string;
  author: string;
  date: string;
  status: string;
  views: number;
  category: string;
  excerpt: string;
}

export const BLOG_POSTS: BlogPost[] = [
  { id: 1,  title: 'Empowering People with Disabilities: Switching on Inclusive Society for All', author: 'Admin',         date: 'Mar 3, 2026',  status: 'Published', views: 342, category: 'Impact',     excerpt: 'How assistive devices are changing lives across Rwanda...' },
  { id: 2,  title: 'E-Waste to Assistive Devices: The Geuza Story',                              author: 'Jean-Paul H.',  date: 'Feb 28, 2026', status: 'Published', views: 218, category: 'Story',      excerpt: 'Turning electronic waste into mobility solutions...' },
  { id: 3,  title: 'Our Impact in Kigali – 6 Districts Served',                                  author: 'Admin',         date: 'Feb 25, 2026', status: 'Draft',     views: 0,   category: 'Impact',     excerpt: 'A look at our reach across six districts...' },
  { id: 4,  title: 'Sustainable Innovation in Assistive Technology',                             author: 'Aline U.',      date: 'Feb 20, 2026', status: 'Published', views: 156, category: 'Innovation', excerpt: 'How we combine sustainability with accessibility...' },
  { id: 5,  title: 'Partner Spotlight: Working with NGOs in Rwanda',                             author: 'Admin',         date: 'Feb 15, 2026', status: 'Published', views: 97,  category: 'Partners',   excerpt: 'Building bridges with NGO partners nationwide...' },
  { id: 6,  title: 'The Role of Community in Disability Inclusion',                              author: 'Eric N.',       date: 'Feb 10, 2026', status: 'Draft',     views: 0,   category: 'Community',  excerpt: 'Community-led approaches to inclusion and empowerment...' },
  { id: 7,  title: 'How to Donate: A Guide for Individuals and Organizations',                   author: 'Admin',         date: 'Feb 5, 2026',  status: 'Published', views: 203, category: 'Guide',      excerpt: 'Everything you need to know about donating to Geuza...' },
  { id: 8,  title: 'Meet Our Team: The People Behind Geuza',                                    author: 'Admin',         date: 'Jan 30, 2026', status: 'Published', views: 411, category: 'Team',       excerpt: 'The passionate people driving our mission every day...' },
  { id: 9,  title: 'Recycled Electronics: From Waste to Wheelchairs',                           author: 'Marie M.',      date: 'Jan 25, 2026', status: 'Draft',     views: 0,   category: 'Innovation', excerpt: 'Our process for turning e-waste into usable devices...' },
  { id: 10, title: 'Year in Review: Geuza Impact Report 2025',                                  author: 'Admin',         date: 'Jan 15, 2026', status: 'Published', views: 589, category: 'Report',     excerpt: 'A comprehensive look back at our 2025 achievements...' },
];

export default function BlogManagementPage() {
  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const published = posts.filter((p) => p.status === 'Published').length;
  const drafts    = posts.filter((p) => p.status === 'Draft').length;

  const columns: Column<BlogPost>[] = [
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      render: (p) => (
        <div className="max-w-xs">
          <p className="font-medium text-gray-800 line-clamp-1 text-sm">{p.title}</p>
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{p.excerpt}</p>
        </div>
      ),
    },
    { key: 'author',   label: 'Author',   sortable: true, render: (p) => <span className="text-gray-600 text-sm">{p.author}</span> },
    { key: 'category', label: 'Category', sortable: true, render: (p) => (
        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">{p.category}</span>
      ),
    },
    { key: 'status', label: 'Status', render: (p) => <StatusBadge status={p.status} /> },
    { key: 'views',  label: 'Views',  sortable: true, render: (p) => (
        <span className="flex items-center gap-1 text-gray-500 text-sm">
          <HiOutlineEye size={13} className="text-gray-400" />
          {p.views > 0 ? p.views.toLocaleString() : '—'}
        </span>
      ),
    },
    { key: 'date', label: 'Date', sortable: true, render: (p) => <span className="text-gray-400 text-xs whitespace-nowrap">{p.date}</span> },
  ];

  return (
    <>
      <DashboardHeader title="Blog Management" />

      <main className="flex-1 overflow-y-auto px-6 py-6">
        <PageHeader
          title="Blog Posts"
          description="Create and manage your blog content"
          breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Blog' }]}
          action={
            <Link
              href="/dashboard/blog/new"
              className="inline-flex items-center gap-2 bg-[#0F9E59] text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-[#0d8a4d] transition-all shadow-sm shadow-[#0F9E59]/20"
            >
              <HiOutlinePlus size={16} />
              New Post
            </Link>
          }
        />

        {/* Summary strips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Posts',  value: posts.length,    color: '#0F9E59' },
            { label: 'Published',    value: published,       color: '#0F9E59' },
            { label: 'Drafts',       value: drafts,          color: '#FF7900' },
            { label: 'Total Views',  value: posts.reduce((a, p) => a + p.views, 0).toLocaleString(), color: '#3b82f6' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl border border-gray-100 px-5 py-4"
            >
              <p className="text-2xl font-display font-black mb-1" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-gray-400 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <AdminTable
          columns={columns}
          data={posts}
          searchKeys={['title', 'author', 'category']}
          pageSize={7}
          actions={(p) => (
            <>
              <Link
                href={`/dashboard/blog/${p.id}/edit`}
                className="w-8 h-8 rounded-lg bg-[#0F9E59]/10 text-[#0F9E59] hover:bg-[#0F9E59] hover:text-white flex items-center justify-center transition-all"
                title="Edit"
              >
                <HiOutlinePencil size={14} />
              </Link>
              <button
                className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition-all"
                title="Preview"
              >
                <HiOutlineEye size={14} />
              </button>
              <button
                onClick={() => setDeleteId(p.id)}
                className="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-all"
                title="Delete"
              >
                <HiOutlineTrash size={14} />
              </button>
            </>
          )}
        />
      </main>

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleteId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setDeleteId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full z-10 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <HiOutlineTrash size={24} className="text-red-500" />
              </div>
              <h3 className="font-display font-black text-gray-900 text-lg mb-2">Delete Post?</h3>
              <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { setPosts((p) => p.filter((x) => x.id !== deleteId)); setDeleteId(null); }}
                  className="flex-1 py-2.5 rounded-full bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
