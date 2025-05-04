import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task } from '../types';
import axios from 'axios';

interface TaskContextType {
  tasks: Task[];
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  toggleTaskCompletion: (taskId: string, completed: boolean) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
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

  const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await axios.post<{ data: Task }>('/api/tasks', task);
      setTasks([...tasks, response.data.data]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    try {
      const response = await axios.put<{ data: Task }>(`/api/tasks/${taskId}`, { completed });
      setTasks(tasks.map(task => 
        task.id === taskId ? response.data.data : task
      ));
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, error, fetchTasks, addTask, toggleTaskCompletion, deleteTask }}>
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