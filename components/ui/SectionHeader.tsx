import React from 'react';

interface SectionHeaderProps {
  title: string;
  className?: string;
}

export default function SectionHeader({ title, className = '' }: SectionHeaderProps) {
  return (
    <div className={`flex items-center gap-4 mb-10 ${className}`}>
      <span className="flex-shrink-0 w-10 h-px bg-[#0F9E59]" />
      <h2 className="flex-shrink-0 text-[#0F9E59] text-sm font-bold tracking-[0.22em] uppercase leading-none">
        {title}
      </h2>
      <span className="flex-shrink-0 w-10 h-px bg-[#0F9E59]" />
    </div>
  );
}
