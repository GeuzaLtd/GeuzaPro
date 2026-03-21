interface StatusBadgeProps {
  status: string;
}

const STATUS_STYLES: Record<string, string> = {
  published:  'bg-primary/10 text-primary',
  draft:      'bg-gray-100 text-gray-500',
  active:     'bg-primary/10 text-primary',
  inactive:   'bg-gray-100 text-gray-400',
  pending:    'bg-yellow-50 text-yellow-600',
  completed:  'bg-primary/10 text-primary',
  processing: 'bg-blue-50 text-blue-600',
  cancelled:  'bg-red-50 text-red-500',
  refunded:   'bg-secondary/10 text-secondary',
  confirmed:  'bg-primary/10 text-primary',
  failed:     'bg-red-50 text-red-500',
  in_stock:   'bg-primary/10 text-primary',
  low_stock:  'bg-yellow-50 text-yellow-600',
  out_stock:  'bg-red-50 text-red-500',
  admin:      'bg-purple-50 text-purple-600',
  user:       'bg-blue-50 text-blue-600',
  donor:      'bg-secondary/10 text-secondary',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const key = status.toLowerCase().replace(/\s+/g, '_');
  const style = STATUS_STYLES[key] ?? 'bg-gray-100 text-gray-500';
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${style}`}>
      {status}
    </span>
  );
}
