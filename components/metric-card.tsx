import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  format?: 'currency' | 'percent' | 'number';
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel = 'vs last year',
  format = 'number',
  className,
}: MetricCardProps) {
  const formattedValue = formatValue(value, format);
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className={cn('bg-card rounded-lg p-5 card-shadow card-shadow-hover', className)}>
      <div className="text-xs tracking-wide text-muted-foreground mb-2">
        {title}
      </div>
      <div className="font-sans text-2xl md:text-3xl font-semibold text-foreground tabular-nums">
        {formattedValue}
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-1.5 mt-2">
          <span
            className={cn(
              'text-sm font-medium tabular-nums',
              isPositive ? 'text-positive' : 'text-negative'
            )}
          >
            {isPositive ? '+' : ''}
            {change.toFixed(1)}%
          </span>
          <span className="text-xs text-muted-foreground">{changeLabel}</span>
        </div>
      )}
    </div>
  );
}

function formatValue(
  value: string | number,
  format: 'currency' | 'percent' | 'number'
): string {
  if (typeof value === 'string') return value;

  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    case 'percent':
      return `${value.toFixed(1)}%`;
    case 'number':
    default:
      return new Intl.NumberFormat('en-CA').format(value);
  }
}
