import { Edit2, GripVertical, Trash2, Eye } from 'lucide-react';
import { Status, Task } from '../types';
import { useState } from 'react';

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

  const getNextStatus = (current: Status): Status => {
    const statuses: Status[] = ['todo', 'in-progress', 'done'];
    const idx = statuses.indexOf(current);
    return statuses[(idx + 1) % statuses.length];
  };

  // Check if description needs truncation (more than 5 lines worth of text)
  const MAX_CHARS = 200; // Approximately 5 lines
  const needsTruncation = task.description && task.description.length > MAX_CHARS;
  const truncatedDescription = needsTruncation
    ? task.description.substring(0, MAX_CHARS) + '...'
    : task.description;

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
              onClick={() => onDelete(task.id)}
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

      {/* View Full Description Modal */}
      {isViewModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setIsViewModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">{task.title}</h2>
                <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                  {columns.find((c) => c.id === task.status)?.title}
                </span>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="border-t border-slate-200 pt-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Description</h3>
              <p className="text-slate-600 whitespace-pre-wrap break-words">{task.description}</p>
            </div>
            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  onEdit(task);
                }}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Edit Task
              </button>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="flex-1 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard;
