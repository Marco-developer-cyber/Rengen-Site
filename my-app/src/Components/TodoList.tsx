import React, { useState, useEffect } from 'react';
import { TodoService } from '@/services/api';
import type { Todo } from '@/types/todo';
import { motion } from "framer-motion";

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const data = await TodoService.getAll();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Не удалось загрузить задачи');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    try {
      const newTodo = await TodoService.create({ title: newTodoTitle });
      setTodos([...todos, newTodo]);
      setNewTodoTitle('');
      setError(null);
    } catch (err) {
      setError('Не удалось создать задачу');
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const updatedTodo = await TodoService.updateStatus(id, completed);
      setTodos(todos.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
      setError(null);
    } catch (err) {
      setError('Не удалось обновить статус задачи');
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await TodoService.delete(id);
      setTodos(todos.filter(todo => todo.id !== id));
      setError(null);
    } catch (err) {
      setError('Не удалось удалить задачу');
    }
  };

  const gradientStyle = {
    background: `radial-gradient(circle at ${cursorPos.x}px ${cursorPos.y}px, 
      rgba(0, 194, 209, 0.2) 0%, 
      rgba(26, 0, 51, 0) 70%)`,
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#0C0F3A] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-[#00FFF7] text-xl"
      >
        Загрузка...
      </motion.div>
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0C0F3A]">
      {/* Динамический градиент */}
      <div
        className="cursor-gradient absolute inset-0 z-1 pointer-events-none transition-opacity duration-1000"
        style={gradientStyle}
      />

      {/* Основной контент */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-[#00C2D1] to-[#CE67D3] bg-clip-text text-transparent">
            Список задач
          </h1>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6"
            >
              {error}
            </motion.div>
          )}

          <motion.form
            onSubmit={handleSubmit}
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex gap-3">
              <input
                type="text"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                placeholder="Новая задача"
                className="flex-1 px-4 py-3 rounded-lg bg-[#1A0033] border border-[#00C2D1]/20 text-[#00FFF7] placeholder-[#00FFF7]/50 focus:outline-none focus:border-[#00C2D1] transition-colors duration-300"
              />
              <motion.button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-[#00C2D1] to-[#CE67D3] text-white rounded-lg hover:from-[#00FFF7] hover:to-[#CE67D3] transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(0,194,209,0.5)]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Добавить
              </motion.button>
            </div>
          </motion.form>

          <motion.ul
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {todos.map((todo, index) => (
              <motion.li
                key={todo.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between p-4 bg-[#1A0033] border border-[#00C2D1]/20 rounded-lg transition-all duration-300 hover:border-[#00C2D1]/40 group"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={(e) => toggleTodo(todo.id, e.target.checked)}
                    className="w-5 h-5 rounded border-[#00C2D1] text-[#CE67D3] focus:ring-[#CE67D3] bg-transparent"
                  />
                  <span className={`${todo.completed ? 'line-through text-[#00FFF7]/50' : 'text-[#00FFF7]'} transition-colors duration-300`}>
                    {todo.title}
                  </span>
                </div>
                <motion.button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-400 hover:text-red-300 transition-colors duration-300 opacity-0 group-hover:opacity-100"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  Удалить
                </motion.button>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </div>
  );
};

export default TodoList; 