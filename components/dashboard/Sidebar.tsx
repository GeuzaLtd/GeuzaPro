'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  HiOutlineHome,
  HiOutlineDocumentText,
  HiOutlineCube,
  HiOutlineShoppingCart,
  HiOutlineUsers,
  HiOutlineHeart,
  HiOutlineCog,
  HiOutlineLogout,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineUserGroup,
  HiOutlineMail,
  HiOutlineOfficeBuilding,
  HiOutlineStar,
  HiOutlinePhotograph,
  HiOutlineTag,
} from 'react-icons/hi';
import Image from 'next/image';

const NAV_ITEMS = [
  { href: '/dashboard',              label: 'Overview',      icon: HiOutlineHome },
  { href: '/dashboard/blog',         label: 'Blog Posts',    icon: HiOutlineDocumentText },
  { href: '/dashboard/products',     label: 'Products',      icon: HiOutlineCube },
  { href: '/dashboard/categories',   label: 'Categories',    icon: HiOutlineTag },
  { href: '/dashboard/orders',       label: 'Orders',        icon: HiOutlineShoppingCart },
  { href: '/dashboard/users',        label: 'Users',         icon: HiOutlineUsers },
  { href: '/dashboard/employees',    label: 'Employees',     icon: HiOutlineUserGroup },
  { href: '/dashboard/donations',    label: 'Donations',     icon: HiOutlineHeart },
  { href: '/dashboard/partners',     label: 'Partners',      icon: HiOutlineOfficeBuilding },
  { href: '/dashboard/testimonials', label: 'Testimonials',  icon: HiOutlineStar },
  { href: '/dashboard/hero-images',  label: 'Hero Images',   icon: HiOutlinePhotograph },
  { href: '/dashboard/messages',     label: 'Messages',      icon: HiOutlineMail },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen bg-gray-900 flex flex-col sticky top-0 overflow-hidden flex-shrink-0 z-40"
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-white/10 flex-shrink-0">
        {!collapsed && (
          <Link href="/" className="flex flex-col min-w-0">
            <Image
              src="/images/logo.png"
              alt="Geuza Logo"
              width={60}
              height={15}
              className="object-contain"
            />
            <span className="text-[10px] text-white/30 mt-0.5 whitespace-nowrap">Admin Dashboard</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all ml-auto flex-shrink-0"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <HiChevronRight size={14} /> : <HiChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                active
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-white/50 hover:text-white hover:bg-white/8'
              }`}
            >
              <Icon size={19} className="flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium whitespace-nowrap">{label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-white/10 px-2 py-3 flex flex-col gap-1">
        <Link
          href="/dashboard/settings"
          title={collapsed ? 'Settings' : undefined}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/8 transition-all"
        >
          <HiOutlineCog size={19} className="flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Settings</span>}
        </Link>
        <button
          title={collapsed ? 'Sign Out' : undefined}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all w-full"
        >
          <HiOutlineLogout size={19} className="flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
        </button>

        {/* Admin profile */}
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-3 mt-1 border-t border-white/10">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              AD
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white leading-none truncate">Admin User</p>
              <p className="text-[10px] text-white/30 mt-0.5">Super Admin</p>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
