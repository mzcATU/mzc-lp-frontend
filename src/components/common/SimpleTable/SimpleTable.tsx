import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface SimpleTableColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render: (item: T) => React.ReactNode;
}

export type SortOrder = 'asc' | 'desc';

interface SimpleTableProps<T> {
  data: T[];
  columns: SimpleTableColumn<T>[];
  keyExtractor: (item: T) => string | number;
  sortField?: string;
  sortOrder?: SortOrder;
  onSort?: (field: string) => void;
  onRowClick?: (item: T) => void;
  emptyIcon?: React.ReactNode;
  emptyMessage?: string;
  className?: string;
}

export function SimpleTable<T>({
  data,
  columns,
  keyExtractor,
  sortField,
  sortOrder,
  onSort,
  onRowClick,
  emptyIcon,
  emptyMessage = '데이터가 없습니다.',
  className,
}: Readonly<SimpleTableProps<T>>) {
  if (data.length === 0) {
    return (
      <div className="bg-bg-default border border-border rounded-lg">
        <div className="text-center py-12 text-text-secondary">
          {emptyIcon && <div className="mb-3">{emptyIcon}</div>}
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-bg-default border border-border rounded-lg overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-bg-secondary border-b border-border">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-sm font-medium text-text-primary',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.align !== 'center' && column.align !== 'right' && 'text-left'
                  )}
                  style={{ width: column.width }}
                >
                  {column.sortable && onSort ? (
                    <button
                      type="button"
                      onClick={() => onSort(column.key)}
                      className="inline-flex items-center gap-2 hover:opacity-70 transition-opacity"
                    >
                      <span>{column.header}</span>
                      {sortField === column.key && (
                        sortOrder === 'asc' ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )
                      )}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  'border-b border-border last:border-b-0 transition-colors',
                  onRowClick && 'cursor-pointer hover:bg-bg-secondary'
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      'px-4 py-4',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right'
                    )}
                  >
                    {column.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
