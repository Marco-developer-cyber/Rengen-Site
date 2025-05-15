import express from 'express';
import { Todo, CreateTodoDto } from '../types';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory storage for todos
let todos: Todo[] = [];

// Get all todos
router.get('/', (req, res) => {
  res.json(todos);
});

// Create a new todo
router.post('/', (req, res) => {
  const { title }: CreateTodoDto = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTodo: Todo = {
    id: uuidv4(),
    title,
    completed: false,
    createdAt: new Date()
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Update todo status
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  const todo = todos.find(t => t.id === id);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  todo.completed = completed;
  res.json(todo);
});

// Delete todo
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const todoIndex = todos.findIndex(t => t.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  todos = todos.filter(t => t.id !== id);
  res.status(204).send();
});

export default router; 