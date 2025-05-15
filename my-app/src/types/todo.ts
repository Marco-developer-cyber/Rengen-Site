export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface CreateTodoDto {
  title: string;
} 