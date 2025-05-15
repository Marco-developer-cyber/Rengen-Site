import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import todosRouter from './routes/todos';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/todos', todosRouter);

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the backend API',
    endpoints: {
      todos: '/api/todos'
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 