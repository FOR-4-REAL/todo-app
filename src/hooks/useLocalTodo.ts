// hooks/useLocalTodo.ts
import { useEffect, useState } from "react";
import type { Category, TodoItem, TodoStorage } from "@/types/todo";

const STORAGE_KEY = "todo-app-storage";

const getInitial = (): TodoStorage => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
};

export const useLocalTodo = (date: string) => {
  const [data, setData] = useState<TodoStorage>(getInitial());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const getTodos = (category: Category): TodoItem[] => {
    return data[date]?.[category] ?? [];
  };

  const addTodo = (category: Category, text: string) => {
    const newTodo: TodoItem = {
      id: crypto.randomUUID(),
      text,
      done: false,
    };
    const updated = {
      ...data,
      [date]: {
        ...data[date],
        [category]: [...getTodos(category), newTodo].slice(0, 10),
      },
    };
    setData(updated);
  };

  const toggleTodo = (category: Category, id: string) => {
    const updatedTodos = getTodos(category).map((todo) =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    );
    setData({
      ...data,
      [date]: {
        ...data[date],
        [category]: updatedTodos,
      },
    });
  };

  const removeTodo = (category: Category, id: string) => {
    const updated = getTodos(category).filter((todo) => todo.id !== id);
    setData({
      ...data,
      [date]: {
        ...data[date],
        [category]: updated,
      },
    });
  };

  return { getTodos, addTodo, toggleTodo, removeTodo };
};
