import { useState, useEffect } from "react";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

  const fetchTodos = async () => {
    const response = await fetch("http://192.168.1.47:5000/api/todos");
    const data = await response.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTasks = async () => {
    if (task.trim() !== "") {
      const response = await fetch("http://192.168.1.47:5000/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: task, completed: false }),
      });

      if (response.ok) {
        fetchTodos();
        setTask("");
      } else {
        const errorData = await response.json();
        console.error("Error adding task:", errorData.error);
      }
    } else {
      console.error("Task title cannot be empty");
    }
  };

  const deleteTasks = async (id) => {
    await fetch(`http://192.168.1.47:5000/api/todos/${id}`, {
      method: "DELETE",
    });
    fetchTodos();
  };

  const toggleComplete = async (id, completed) => {
    await fetch(`http://192.168.1.47:5000/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
    fetchTodos();
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-6xl m-16 font-bold text-orange-500">Todo List</h1>
      <div className="p-6">
        <input
          className="bg-slate-100 rounded-md p-4 m-4"
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Create a new todo"
        />
        <button
          onClick={addTasks}
          className="bg-orange-500 text-white p-3 m-3 rounded-md font-bold hover:bg-orange-500"
        >
          Add Tasks
        </button>
      </div>
      <div>
        {tasks.length > 0 ? (
          <ul>
            {tasks.map((item) => (
              <div
                className="flex bg-slate-100 m-4 py-4 pl-12 pr-4 rounded-md"
                key={item.id}
              >
                <li
                  className={`self-center font-semibold pr-10 mr-6 grow ${
                    item.completed ? "line-through" : ""
                  }`}
                >
                  {item.title}
                </li>
                <button
                  onClick={() => toggleComplete(item.id, item.completed)}
                  className="bg-green-500 text-white p-2 mx-1 rounded-md font-bold hover:bg-green-600"
                >
                  {item.completed ? "Undo" : "Done"}
                </button>
                <button
                  onClick={() => deleteTasks(item.id)}
                  className="bg-red-500 text-white p-2 mx-1 rounded-md font-bold hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </ul>
        ) : (
          <div>
            <p>No Task Found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
