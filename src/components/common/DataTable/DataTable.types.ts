import type { ColumnDef } from '@tanstack/react-table';

export interface DataTableLabels {
  columns?: string;
  noResults?: string;
  rowsSelected?: string;
  rowsPerPage?: string;
  pageOf?: string;
  goToFirstPage?: string;
  goToPreviousPage?: string;
  goToNextPage?: string;
  goToLastPage?: string;
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  showColumnToggle?: boolean;
  showPagination?: boolean;
  pageSize?: number;
  labels?: DataTableLabels;
  /** 행 클릭 핸들러 */
  onRowClick?: (row: TData) => void;
}

export interface DataTableColumnHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  column: {
    getIsSorted: () => false | 'asc' | 'desc';
    toggleSorting: (desc?: boolean) => void;
  };
  title: string;
}
