import React from 'react';

interface SectionHeaderProps {
  title: string;
  className?: string;
}

export default function SectionHeader({ title, className = '' }: SectionHeaderProps) {
  return (
    <div className={`flex items-center gap-4 mb-10 ${className}`}>
      <span className="flex-shrink-0 w-10 h-px bg-primary" />
      <h2 className="flex-shrink-0 text-primary text-sm font-bold tracking-[0.22em] uppercase leading-none">
        {title}
      </h2>
      <span className="flex-shrink-0 w-10 h-px bg-primary" />
    </div>
  );
}
