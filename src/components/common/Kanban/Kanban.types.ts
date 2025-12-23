export interface KanbanItem {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
  assignee?: {
    name: string;
    avatar?: string;
  };
}

export interface KanbanColumn {
  id: string;
  title: string;
  color?: string;
  items: KanbanItem[];
}

export interface KanbanCardProps {
  item: KanbanItem;
  onEdit?: (item: KanbanItem) => void;
  onDelete?: (item: KanbanItem) => void;
  isDragging?: boolean;
}

export interface KanbanColumnProps {
  column: KanbanColumn;
  onAddItem?: (columnId: string) => void;
  onEditItem?: (item: KanbanItem) => void;
  onDeleteItem?: (item: KanbanItem) => void;
  className?: string;
}

export interface KanbanBoardProps {
  columns: KanbanColumn[];
  onAddItem?: (columnId: string) => void;
  onEditItem?: (item: KanbanItem) => void;
  onDeleteItem?: (item: KanbanItem) => void;
  onMoveItem?: (
    itemId: string,
    sourceColumnId: string,
    targetColumnId: string
  ) => void;
  className?: string;
}
