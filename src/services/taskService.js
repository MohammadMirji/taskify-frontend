import axios from "axios";

const API_URL = "http://localhost:3000/api/tasks";

const getConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all tasks
export const getTasks = async () => {
  return await axios.get(API_URL, getConfig());
};

// Get a single task
export const getTask = async (id) => {
  return await axios.get(`${API_URL}/${id}`, getConfig());
};

// Create a new task
export const createTask = async (taskData) => {
  return await axios.post(API_URL, taskData, getConfig());
};

// Update a task
export const updateTask = async (id, updatedData) => {
  return await axios.put(`${API_URL}/${id}`, updatedData, getConfig());
};

// Delete a task
export const deleteTask = async (id) => {
  return await axios.delete(`${API_URL}/${id}`, getConfig());
};
