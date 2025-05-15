import type { Todo, CreateTodoDto } from '@/types/todo';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const TodoService = {
  async getAll(): Promise<Todo[]> {
    const response = await fetch(`${API_URL}/todos`);
    const data = await response.json();
    return data;
  },

  async create(todo: CreateTodoDto): Promise<Todo> {
    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });
    const data = await response.json();
    return data;
  },

  async updateStatus(id: string, completed: boolean): Promise<Todo> {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    });
    const data = await response.json();
    return data;
  },

  async delete(id: string): Promise<void> {
    await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
    });
  },
}; 