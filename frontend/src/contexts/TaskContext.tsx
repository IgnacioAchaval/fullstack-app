import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task } from '../types';
import axios from 'axios';

interface TaskContextType {
  tasks: Task[];
  error: string | null;
  fetchTasks: () => Promise<void>;
  toggleTaskCompletion: (taskId: number, completed: boolean) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      setTasks(response.data.data);
      setError(null);
    } catch (err) {
      setError('Error loading tasks');
    }
  };

  const toggleTaskCompletion = async (taskId: number, completed: boolean) => {
    try {
      const response = await axios.put(`/api/tasks/${taskId}`, { completed });
      setTasks(tasks.map(task => 
        task.id === taskId ? response.data.data : task
      ));
    } catch (err) {
      setError('Error updating task');
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError('Error deleting task');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, error, fetchTasks, toggleTaskCompletion, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}; 