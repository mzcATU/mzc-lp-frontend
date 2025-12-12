"use client";

import { MoreHorizontal, Plus, GripVertical } from "lucide-react";

import { cn } from "./utils";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Badge } from "./badge";
import { ScrollArea } from "./scroll-area";

// Types
export interface KanbanItem {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  priority?: "low" | "medium" | "high";
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

// Kanban Card
interface KanbanCardProps {
  item: KanbanItem;
  onEdit?: (item: KanbanItem) => void;
  onDelete?: (item: KanbanItem) => void;
  isDragging?: boolean;
}

function KanbanCard({ item, onEdit, onDelete, isDragging }: KanbanCardProps) {
  const priorityColors = {
    low: "bg-blue-100 text-blue-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
  };

  return (
    <Card
      className={cn(
        "cursor-grab active:cursor-grabbing transition-shadow",
        isDragging && "shadow-lg ring-2 ring-primary"
      )}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
            <h4 className="text-sm font-medium">{item.title}</h4>
          </div>
          {(onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(item)}>
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={() => onDelete(item)}
                    className="text-destructive"
                  >
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {item.description && (
          <p className="mt-2 text-xs text-muted-foreground line-clamp-2 ml-6">
            {item.description}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2 ml-6">
          {item.priority && (
            <Badge
              variant="secondary"
              className={cn("text-xs", priorityColors[item.priority])}
            >
              {item.priority}
            </Badge>
          )}
          {item.tags?.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {item.assignee && (
          <div className="mt-3 flex items-center gap-2 ml-6">
            {item.assignee.avatar ? (
              <img
                src={item.assignee.avatar}
                alt={item.assignee.name}
                className="h-5 w-5 rounded-full"
              />
            ) : (
              <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs">
                {item.assignee.name[0]}
              </div>
            )}
            <span className="text-xs text-muted-foreground">
              {item.assignee.name}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Kanban Column
interface KanbanColumnProps {
  column: KanbanColumn;
  onAddItem?: (columnId: string) => void;
  onEditItem?: (item: KanbanItem) => void;
  onDeleteItem?: (item: KanbanItem) => void;
  className?: string;
}

function KanbanColumnComponent({
  column,
  onAddItem,
  onEditItem,
  onDeleteItem,
  className,
}: KanbanColumnProps) {
  return (
    <div className={cn("flex flex-col w-[300px] shrink-0", className)}>
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {column.color && (
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: column.color }}
                />
              )}
              <CardTitle className="text-sm font-medium">
                {column.title}
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                {column.items.length}
              </Badge>
            </div>
            {onAddItem && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onAddItem(column.id)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 pt-0">
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="space-y-3 pr-3">
              {column.items.map((item) => (
                <KanbanCard
                  key={item.id}
                  item={item}
                  onEdit={onEditItem}
                  onDelete={onDeleteItem}
                />
              ))}
              {column.items.length === 0 && (
                <div className="flex items-center justify-center h-20 border-2 border-dashed rounded-md">
                  <p className="text-xs text-muted-foreground">No items</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

// Kanban Board
interface KanbanBoardProps {
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

function KanbanBoard({
  columns,
  onAddItem,
  onEditItem,
  onDeleteItem,
  className,
}: KanbanBoardProps) {
  return (
    <div className={cn("flex gap-4 overflow-x-auto pb-4", className)}>
      {columns.map((column) => (
        <KanbanColumnComponent
          key={column.id}
          column={column}
          onAddItem={onAddItem}
          onEditItem={onEditItem}
          onDeleteItem={onDeleteItem}
        />
      ))}
    </div>
  );
}

export { KanbanBoard, KanbanColumnComponent as KanbanColumn, KanbanCard };
export type { KanbanBoardProps, KanbanColumnProps, KanbanCardProps };
