'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineBell, HiOutlineSearch } from 'react-icons/hi';

const NOTIFICATIONS = [
  { id: 1, text: 'New order #1042 has been placed', time: '2 min ago', unread: true },
  { id: 2, text: 'Blog post "E-waste Impact" published', time: '1 hr ago', unread: true },
  { id: 3, text: 'New donation received: RWF 50,000', time: '3 hrs ago', unread: false },
  { id: 4, text: 'User Jean-Paul joined the platform', time: '5 hrs ago', unread: false },
];

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export default function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const [showNotif, setShowNotif] = useState(false);
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <header className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white sticky top-0 z-30">
      <div>
        <h1 className="font-display font-bold text-gray-900 text-lg leading-none">{title}</h1>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-100 focus-within:border-[#0F9E59]/40 focus-within:ring-2 focus-within:ring-[#0F9E59]/10 transition-all">
          <HiOutlineSearch size={14} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-gray-600 placeholder-gray-400 focus:outline-none w-32"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-all"
            aria-label="Notifications"
          >
            <HiOutlineBell size={17} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#FF7900] rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotif && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotif(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-11 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">Notifications</p>
                    {unread > 0 && (
                      <span className="text-xs font-medium text-[#0F9E59]">{unread} new</span>
                    )}
                  </div>
                  {NOTIFICATIONS.map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 flex gap-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                        n.unread ? 'bg-[#0F9E59]/[0.03]' : ''
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          n.unread ? 'bg-[#0F9E59]' : 'bg-gray-200'
                        }`}
                      />
                      <div>
                        <p className="text-sm text-gray-700 leading-snug">{n.text}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-100" />

        {/* Admin avatar */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0F9E59] to-[#1bc870] flex items-center justify-center text-white text-xs font-bold">
            AD
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-gray-800 leading-none">Admin User</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
