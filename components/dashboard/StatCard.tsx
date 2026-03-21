'use client';

import { motion } from 'framer-motion';
import { ElementType } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  icon: ElementType;
  color?: string;
  index?: number;
}

export default function StatCard({
  label,
  value,
  change,
  positive = true,
  icon: Icon,
  color = 'var(--color-primary)',
  index = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-100/80 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        {change && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              positive
                ? 'text-primary bg-primary/10'
                : 'text-red-500 bg-red-50'
            }`}
          >
            {positive ? '↑' : '↓'} {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-display font-black text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-400 font-medium">{label}</p>
    </motion.div>
  );
}
