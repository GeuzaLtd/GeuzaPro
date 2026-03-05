import Link from 'next/link';
import { ReactNode } from 'react';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  action?: ReactNode;
}

export default function PageHeader({ title, description, breadcrumbs, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-gray-300 text-xs">/</span>}
                {b.href ? (
                  <Link
                    href={b.href}
                    className="text-xs text-gray-400 hover:text-[#0F9E59] transition-colors font-medium"
                  >
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-xs text-gray-600 font-medium">{b.label}</span>
                )}
              </span>
            ))}
          </div>
        )}
        <h2 className="font-display font-black text-gray-900 text-2xl">{title}</h2>
        {description && (
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0 ml-4">{action}</div>}
    </div>
  );
}
