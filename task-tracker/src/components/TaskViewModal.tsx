import { Status, Task } from '../types';

interface Column {
  id: Status;
  title: string;
  color: string;
}

interface TaskViewModalProps {
  isOpen: boolean;
  task: Task;
  columns: Column[];
  onClose: () => void;
  onEdit: () => void;
}

const TaskViewModal: React.FC<TaskViewModalProps> = ({
  isOpen,
  task,
  columns,
  onClose,
  onEdit,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
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
            onClick={onClose}
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
            onClick={onEdit}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Edit Task
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskViewModal;
