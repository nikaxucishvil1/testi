"use client";
import { useState, useEffect } from "react";
import {
  addNewTodoApp,
  addTask,
  deleteTask,
  deleteTodoApp,
  dowloadFile,
  TodoApp,
} from "./services";
import { Reorder } from "framer-motion";

export default function Home() {
  const [todoApps, setTodoApps] = useState<TodoApp[]>([]);
  const [showColors, setShowColors] = useState(false);
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const res = localStorage.getItem("todoApps");
    if (res) {
      const data = JSON.parse(res);
      setTodoApps(data);
    }
  }, []);
  useEffect(() => {
    if (todoApps.length > 0) {
      localStorage.setItem("todoApps", JSON.stringify(todoApps));
    } else {
      localStorage.removeItem("todoApps");
    }
  }, [todoApps]);

  const colors = ["red", "green", "blue"];

  return (
    <div className="w-full h-screen flex items-center flex-col">
      <div className="w-full flex items-center gap-2 justify-end p-4">
        <div className="flex gap-4 ">
          {showColors &&
            colors &&
            colors.map((color, index) => (
              <button
                onClick={() => {
                  addNewTodoApp(color, todoApps, setTodoApps);
                }}
                key={index}
                className="w-[30px] h-[30px] rounded-full"
                style={{ backgroundColor: color }}
              ></button>
            ))}
        </div>
        <button
          onClick={() => {
            setShowColors(!showColors);
          }}
          className="bg-black text-white w-[40px] h-[40px] flex items-center justify-center rounded-full"
        >
          +
        </button>
        <button
          onClick={() => {
            dowloadFile(todoApps);
          }}
          className="bg-black text-white w-[40px] h-[40px] flex items-center justify-center rounded-full"
        >
          dow
        </button>
      </div>
      <Reorder.Group
        axis="y"
        values={todoApps}
        onReorder={setTodoApps}
        className="flex flex-col p-5 gap-2 w-[50%]"
      >
        {todoApps.length > 0 &&
          todoApps.map((todoApp, todoIndex) => {
            let inputValue = inputValues[todoApp.id] || "";

            return (
              <Reorder.Item
                key={todoApp.id}
                value={todoApp}
                className="w-full min-h-[200px] p-3 flex flex-col items-center justify-center"
                style={{ backgroundColor: todoApp.color }}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={(e) => {
                  const task = e.dataTransfer.getData("task");
                  const originalTodoIndex = parseInt(
                    e.dataTransfer.getData("todoIndex")
                  );
                  if (task && originalTodoIndex !== todoIndex) {
                    setTodoApps((prev) => {
                      const updatedTodoApps = [...prev];
                      const targetApp = updatedTodoApps[todoIndex];
                      const updatedApp = {
                        ...targetApp,
                        tasks: [...targetApp.tasks, task],
                      };
                      updatedTodoApps[todoIndex] = updatedApp;

                      const originalApp = updatedTodoApps[originalTodoIndex];
                      const updatedOriginalApp = {
                        ...originalApp,
                        tasks: originalApp.tasks.filter((t) => t !== task),
                      };
                      updatedTodoApps[originalTodoIndex] = updatedOriginalApp;

                      return updatedTodoApps;
                    });
                  }
                }}
              >
                <div className="w-full h-full flex items-center justify-between">
                  <input
                    type="text"
                    className="border border-black"
                    placeholder="enter task"
                    value={inputValue}
                    onChange={(e) => {
                      const newInputValues = { ...inputValues };
                      newInputValues[todoApp.id] = e.target.value;
                      setInputValues(newInputValues);
                    }}
                  />
                  <button
                    onClick={() => {
                      addTask(inputValue, setTodoApps, todoIndex);
                      const newInputValues = { ...inputValues };
                      newInputValues[todoApp.id] = "";
                      setInputValues(newInputValues);
                    }}
                    className="bg-black text-white p-3 rounded-xl"
                  >
                    add task
                  </button>

                  <button
                    onClick={() => {
                      deleteTodoApp(todoApps, todoIndex, setTodoApps);
                    }}
                    className="bg-black text-white p-3 rounded-xl"
                  >
                    delete todo
                  </button>
                  <button
                    onClick={() => {
                      dowloadFile(todoApp);
                    }}
                    className="bg-black text-white p-3 rounded-xl"
                  >
                    download Todo
                  </button>
                </div>

                <div className="h-full flex flex-wrap items-center justify-center gap-2">
                  {todoApp.tasks.length > 0 &&
                    todoApp.tasks.map((task, taskIndex) => (
                      <div
                        key={task}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("task", task);
                          e.dataTransfer.setData(
                            "todoIndex",
                            todoIndex.toString()
                          );
                        }}
                        onDragEnd={(e) => {
                          e.preventDefault();
                        }}
                        className="text-white bg-black flex items-center justify-center gap-2 p-2 rounded-xl"
                      >
                        <input type="checkbox" name="" id="" />
                        <span>{task}</span>
                        <button
                          onClick={() => {
                            deleteTask(setTodoApps, todoIndex, taskIndex);
                          }}
                          className="w-[25px] h-[25px] bg-white text-black rounded-full flex items-center justify-center"
                        >
                          x
                        </button>
                      </div>
                    ))}
                </div>
              </Reorder.Item>
            );
          })}
      </Reorder.Group>
    </div>
  );
}
