import { saveAs } from "file-saver";
import { useState } from "react";

export interface TodoApp {
  id: number;
  color: string;
  tasks: string[];
}

export const addNewTodoApp = (
  color: string,
  todoApps: any[],
  setTodoApps: React.Dispatch<React.SetStateAction<TodoApp[]>>
) => {
  const newTodoApp = {
    id: todoApps.length
      ? Math.max(...todoApps.map((todoApp) => todoApp.id)) + 1
      : 1,
    color: color,
    tasks: [],
  };
  setTodoApps((prev) => [...prev, newTodoApp]);
};

export const deleteTodoApp = (
  todoApps: TodoApp[],
  AppIndex: number,
  setTodoApps: React.Dispatch<React.SetStateAction<TodoApp[]>>
) => {
  const deletedTodoApps = todoApps.filter((_, index) => index !== AppIndex);
  setTodoApps(deletedTodoApps);
};

export const addTask = (
  task: string,
  setTodoApps: React.Dispatch<React.SetStateAction<TodoApp[]>>,
  appIndex: number
) => {
  if (task.trim() === "") {
    alert("enter task");
  } else {
    setTodoApps((prev: TodoApp[]) => {
      const updatedTodoApps = [...prev];
      const targetApp = updatedTodoApps[appIndex];
      const updatedApp = {
        ...targetApp,
        tasks: [...targetApp.tasks, task],
      };
      updatedTodoApps[appIndex] = updatedApp;
      return updatedTodoApps;
    });
  }
};

export const deleteTask = (
  setTodoApps: React.Dispatch<React.SetStateAction<TodoApp[]>>,
  appIndex: number,
  taskIndex: number
) => {
  setTodoApps((prev: TodoApp[]) => {
    const updatedTodoApps = [...prev];
    const targetApp = updatedTodoApps[appIndex];
    const updatedApp = {
      ...targetApp,
      tasks: [
        ...targetApp.tasks.slice(0, taskIndex),
        ...targetApp.tasks.slice(taskIndex + 1),
      ],
    };
    updatedTodoApps[appIndex] = updatedApp;

    return updatedTodoApps;
  });
};

export const dowloadFile = (data: any) => {
  if (data.length !== 0) {
    const resArr = JSON.stringify(data);
    const blob = new Blob([resArr], { type: "text/plain" });
    saveAs(blob, "data.txt");
  } else {
    alert("no todos to download");
  }
};

export const handleDragStart = (task: string, appIndex: number) => {
  const dataTransfer = {
    task,
    appIndex,
  };
  return dataTransfer;
};

export const handleDrop = (
  setTodoApps: React.Dispatch<React.SetStateAction<TodoApp[]>>,
  appIndex: number,
  dataTransfer: any
) => {
  const { task, originalAppIndex } = dataTransfer;

  setTodoApps((prev: TodoApp[]) => {
    const updatedTodoApps = [...prev];
    const targetApp = updatedTodoApps[appIndex];
    const updatedApp = {
      ...targetApp,
      tasks: [...targetApp.tasks, task],
    };
    updatedTodoApps[appIndex] = updatedApp;

    const originalApp = updatedTodoApps[originalAppIndex];
    const updatedOriginalApp = {
      ...originalApp,
      tasks: originalApp.tasks.filter((t) => t !== task),
    };
    updatedTodoApps[originalAppIndex] = updatedOriginalApp;

    return updatedTodoApps;
  });
};
