'use client';

import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Column, Status, Task } from './types';
import TaskBoard from './components/TaskBoard';
import TaskModal from './components/TaskModal';


export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<Omit<Task, 'id'>>({
    title: '',
    description: '',
    status: 'todo',
  });
  const [isLoading, setIsLoading] = useState(true);

  const columns: Column[] = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-100 border-gray-300' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-50 border-blue-300' },
    { id: 'done', title: 'Done', color: 'bg-green-50 border-green-300' },
  ];

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/task');
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (task: Task | null = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({ title: task.title, description: task.description, status: task.status });
    } else {
      setEditingTask(null);
      setFormData({ title: '', description: '', status: 'todo' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setFormData({ title: '', description: '', status: 'todo' });
  };

  const handleFormChange = (data: Partial<Omit<Task, 'id'>>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) return;

    try {
      if (editingTask) {
        // Update existing task
        const response = await fetch(`/api/task/${editingTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const updatedTask = await response.json();
          setTasks(tasks.map((t) => (t.id === editingTask.id ? updatedTask : t)));
        }
      } else {
        // Create new task
        const response = await fetch('/api/task', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const result = await response.json();
          setTasks([...tasks, result.task]);
        }
      }
      closeModal();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/task/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTasks(tasks.filter((t) => t.id !== id));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const changeStatus = async (taskId: string, newStatus: Status) => {
    try {
      const response = await fetch(`/api/task/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)));
      }
    } catch (error) {
      console.error('Error changing status:', error);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: Status) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== status) {
      changeStatus(draggedTask.id, status);
    }
    setDraggedTask(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Task Tracker</h1>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Plus size={20} />
            New Task
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-slate-600">Loading tasks...</div>
          </div>
        ) : (
          <TaskBoard
            tasks={tasks}
            columns={columns}
            draggedTask={draggedTask}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onEdit={openModal}
            onDelete={deleteTask}
            onChangeStatus={changeStatus}
          />
        )}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        editingTask={editingTask}
        formData={formData}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onFormChange={handleFormChange}
      />
    </div>
  );
}
