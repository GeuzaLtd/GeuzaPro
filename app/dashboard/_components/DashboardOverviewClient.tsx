'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  HiOutlineCube, HiOutlineShoppingCart, HiOutlineUsers,
  HiOutlineHeart, HiOutlineDocumentText, HiOutlineTrendingUp, HiOutlinePencil,
} from 'react-icons/hi';
import { DashboardHeader, StatCard, StatusBadge, PageHeader } from '@/components/dashboard';

interface RecentOrder { id: string; customer: string; item: string; status: string; date: string }
interface RecentBlog  { id: number; title: string; status: string; date: string }
interface Props {
  stats: {
    productCount: number; orderCount: number; userCount: number;
    blogCount: number; donationTotal: number;
    recentOrders: RecentOrder[]; recentBlogs: RecentBlog[];
  };
}

export default function DashboardOverviewClient({ stats }: Props) {
  const STATS = [
    { label: 'Total Products',   value: String(stats.productCount),                       icon: HiOutlineCube,         color: '#0F9E59' },
    { label: 'Active Orders',    value: String(stats.orderCount),                          icon: HiOutlineShoppingCart, color: '#3b82f6' },
    { label: 'Registered Users', value: String(stats.userCount),                           icon: HiOutlineUsers,        color: '#8b5cf6' },
    { label: 'Total Donations',  value: `RWF ${stats.donationTotal.toLocaleString()}`,    icon: HiOutlineHeart,        color: '#FF7900' },
    { label: 'Blog Posts',       value: String(stats.blogCount),                           icon: HiOutlineDocumentText, color: '#0F9E59' },
    { label: 'Lives Empowered',  value: '65+',                                             icon: HiOutlineTrendingUp,   color: '#ec4899' },
  ];

  return (
    <>
      <DashboardHeader title="Overview" subtitle={`Welcome back — ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`} />
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <PageHeader title="Dashboard" description="Your platform at a glance" breadcrumbs={[{ label: 'Dashboard' }]} />
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {STATS.map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-gray-800 text-base">Recent Orders</h3>
              <Link href="/dashboard/orders" className="text-xs text-primary font-semibold hover:underline">View all →</Link>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {stats.recentOrders.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-10">No orders yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                      {['Order','Customer','Item','Status','Date'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((o, i) => (
                      <motion.tr key={o.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors">
                        <td className="px-4 py-3 font-semibold text-primary text-xs">{o.id}</td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{o.customer}</td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{o.item}</td>
                        <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                        <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{o.date}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-gray-800 text-base">Recent Posts</h3>
              <Link href="/dashboard/blog" className="text-xs text-primary font-semibold hover:underline">View all →</Link>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
              {stats.recentBlogs.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-10">No posts yet.</p>
              ) : stats.recentBlogs.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.07 }} className="px-5 py-4 hover:bg-gray-50/80 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2 flex-1">{p.title}</p>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-400">{p.date}</p>
                    <Link href="/dashboard/blog" className="text-xs text-primary hover:underline flex items-center gap-1"><HiOutlinePencil size={11} /> Edit</Link>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-6">
              <h3 className="font-display font-bold text-gray-800 text-base mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'New Post',    href: '/dashboard/blog/new',     color: '#0F9E59', icon: HiOutlineDocumentText },
                  { label: 'Add Product', href: '/dashboard/products/new', color: '#3b82f6', icon: HiOutlineCube },
                  { label: 'View Orders', href: '/dashboard/orders',       color: '#FF7900', icon: HiOutlineShoppingCart },
                  { label: 'All Users',   href: '/dashboard/users',        color: '#8b5cf6', icon: HiOutlineUsers },
                ].map(a => (
                  <Link key={a.label} href={a.href} className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all group">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: `${a.color}15` }}>
                      <a.icon size={18} style={{ color: a.color }} />
                    </div>
                    <span className="text-xs font-semibold text-gray-600">{a.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
