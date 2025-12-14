import { X } from "lucide-react";
import { Status, Task } from "../types";

interface TaskModalProps {
  isOpen: boolean;
  editingTask: Task | null;
  formData: Omit<Task, 'id'>;
  onClose: () => void;
  onSubmit: () => void;
  onFormChange: (data: Partial<Omit<Task, 'id'>>) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  editingTask,
  formData,
  onClose,
  onSubmit,
  onFormChange,
}) => {
  if (!isOpen) return null;

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-800">
            {editingTask ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="task-title" className="block text-sm font-medium text-slate-700 mb-1">
              Title
            </label>
            <input
              id="task-title"
              type="text"
              value={formData.title}
              onChange={(e) => onFormChange({ title: e.target.value })}
              onKeyPress={handleKeyPress}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title"
            />
          </div>
          <div>
            <label
              htmlFor="task-description"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="task-description"
              value={formData.description}
              onChange={(e) => onFormChange({ description: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              placeholder="Enter task description"
            />
          </div>
          <div>
            <label htmlFor="task-status" className="block text-sm font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              id="task-status"
              value={formData.status}
              onChange={(e) => onFormChange({ status: e.target.value as Status })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={onSubmit}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {editingTask ? 'Update' : 'Create'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default TaskModal;