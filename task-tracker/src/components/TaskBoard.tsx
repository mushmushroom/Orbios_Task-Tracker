import { Column, Status, Task } from '../types';
import TaskCard from './TaskCard';

interface TaskBoardProps {
  tasks: Task[];
  columns: Column[];
  draggedTask: Task | null;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, task: Task) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, status: Status) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onChangeStatus: (taskId: string, newStatus: Status) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  columns,
  draggedTask,
  onDragStart,
  onDragOver,
  onDrop,
  onEdit,
  onDelete,
  onChangeStatus,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {columns.map((column) => (
        <div
          key={column.id}
          className={`${column.color} rounded-xl border-2 p-4 min-h-[400px] transition-all ${
            draggedTask && draggedTask.status !== column.id ? 'ring-2 ring-blue-400' : ''
          }`}
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, column.id)}
        >
          <h2 className="text-xl font-semibold mb-4 text-slate-700">{column.title}</h2>
          <div className="space-y-3">
            {tasks
              .filter((t) => t.status === column.id)
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  columns={columns}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onChangeStatus={onChangeStatus}
                  onDragStart={onDragStart}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;
