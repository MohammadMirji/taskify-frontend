import React, { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../services/taskService";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import "./Tasks.css";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState("Low");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getTasks();
      setTasks(response.data.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Please enter a title");
    try {
      await createTask({ title, description, priority });
      setTitle("");
      setDescription("");
      setPriority("Low");
      fetchTasks();
      toast.success("Task added successfully!");
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to add task!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(id);
      fetchTasks();
      toast.success("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task!");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditPriority(task.priority);
  };

  const handleUpdate = async (id) => {
    try {
      await updateTask(id, {
        title: editTitle,
        description: editDescription,
        priority: editPriority,
      });
      setEditingTask(null);
      fetchTasks();
      toast.success("Task updated successfully!");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task!");
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await updateTask(task._id, { completed: !task.completed });
      fetchTasks();
      toast.success("Task status updated!");
    } catch (error) {
      console.error("Error toggling completion:", error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === "completed"
        ? task.completed
        : filter === "pending"
        ? !task.completed
        : true;

    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  if (loading) return <Loader />;

  return (
    <div className="tasks-container">
      <h2 className="tasks-title">Taskify — Task List</h2>

      {/* Add Task Form */}
      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="task-input"
        />
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="task-textarea"
        ></textarea>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="task-select"
        >
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>
        <button type="submit" className="btn btn-primary">
          Add Task
        </button>
      </form>

      {/* Filters */}
      <div className="filter-buttons">
        <button
          onClick={() => setFilter("all")}
          className={`btn ${filter === "all" ? "btn-active" : ""}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`btn ${filter === "completed" ? "btn-active" : ""}`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`btn ${filter === "pending" ? "btn-active" : ""}`}
        >
          Pending
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #d0d7e1",
  borderRadius: "8px",
  fontSize: "0.95rem",
  background: "#f9fbff",
  transition: "all 0.2s ease-in-out",
  marginBottom: "20px",
}}

      />

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <p className="no-tasks">No tasks found.</p>
      ) : (
        <ul className="task-list">
          {filteredTasks.map((task) => (
            <li
              key={task._id}
              className={`task-item ${task.completed ? "completed" : ""}`}
            >
              {editingTask === task._id ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={{
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #d0d7e1",
  borderRadius: "8px",
  fontSize: "0.95rem",
  background: "#f9fbff",
  transition: "all 0.2s ease-in-out",
  marginBottom: "20px",
}}
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="task-textarea"
                    style={{
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #d0d7e1",
  borderRadius: "8px",
  fontSize: "0.95rem",
  background: "#f9fbff",
  transition: "all 0.2s ease-in-out",
  marginBottom: "20px",
}}
                  ></textarea>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                    className="task-select"
                    style={{
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #d0d7e1",
  borderRadius: "8px",
  fontSize: "0.95rem",
  background: "#f9fbff",
  transition: "all 0.2s ease-in-out",
  marginBottom: "20px",
}}
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleUpdate(task._id)}
                      className="btn btn-save"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingTask(null)}
                      className="btn btn-cancel"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="task-content">
                    <strong>{task.title}</strong> — {task.description}
                    <span className={`priority ${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="action-buttons">
                    <button onClick={() => handleEdit(task)} className="btn btn-edit">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(task._id)} className="btn btn-delete">
                      Delete
                    </button>
                    <button
                      onClick={() => handleToggleComplete(task)}
                      className={`btn ${
                        task.completed ? "btn-incomplete" : "btn-complete"
                      }`}
                    >
                      {task.completed ? "Mark Incomplete" : "Mark Complete"}
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Tasks;
