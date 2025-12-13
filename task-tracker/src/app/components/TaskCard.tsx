import { Edit2, GripVertical, Trash2, Eye } from 'lucide-react';
import { Status, Task } from '../types';
import { useState } from 'react';
import TaskViewModal from './TaskViewModal';
import DeleteConfirmModal from './DeleteConfirmModal';

interface Column {
  id: Status;
  title: string;
  color: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onChangeStatus: (taskId: string, newStatus: Status) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, task: Task) => void;
  columns: Column[];
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onChangeStatus,
  onDragStart,
  columns,
}) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const getNextStatus = (current: Status): Status => {
    const statuses: Status[] = ['todo', 'in-progress', 'done'];
    const idx = statuses.indexOf(current);
    return statuses[(idx + 1) % statuses.length];
  };

  // Check if description needs truncation 
  const MAX_CHARS = 100;
  const needsTruncation = task.description && task.description.length > MAX_CHARS;
  const truncatedDescription = needsTruncation
    ? task.description.substring(0, MAX_CHARS) + '...'
    : task.description;

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(task.id);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, task)}
        className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 cursor-move hover:shadow-md transition-shadow"
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-start gap-2 flex-1">
            <GripVertical size={18} className="text-slate-400 mt-1 flex-shrink-0" />
            <h3 className="font-semibold text-slate-800 break-words">{task.title}</h3>
          </div>
          <div className="flex gap-1 ml-2 flex-shrink-0">
            <button
              onClick={() => onEdit(task)}
              className="text-blue-600 hover:bg-blue-50 p-1 rounded transition-colors"
              aria-label="Edit task"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={handleDeleteClick}
              className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
              aria-label="Delete task"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        {task.description && (
          <div className="mb-3">
            <p className="text-sm text-slate-600 break-words whitespace-pre-wrap">
              {truncatedDescription}
            </p>
            {needsTruncation && (
              <button
                onClick={() => setIsViewModalOpen(true)}
                className="text-xs text-blue-600 hover:text-blue-800 mt-1 flex items-center gap-1"
              >
                <Eye size={14} />
                View more
              </button>
            )}
          </div>
        )}
        <button
          onClick={() => onChangeStatus(task.id, getNextStatus(task.status))}
          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded transition-colors"
        >
          Move to {columns.find((c) => c.id === getNextStatus(task.status))?.title}
        </button>
      </div>

      <TaskViewModal
        isOpen={isViewModalOpen}
        task={task}
        columns={columns}
        onClose={() => setIsViewModalOpen(false)}
        onEdit={() => {
          setIsViewModalOpen(false);
          onEdit(task);
        }}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        taskTitle={task.title}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default TaskCard;
