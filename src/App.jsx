import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3600/todos")
      .then((response) => setData(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleAdd = async () => {
    if (!newTitle || !newDescription) return;
    try {
      const response = await axios.post("http://localhost:3600/todos", {
        title: newTitle,
        description: newDescription,
      });
      setData((prevData) => [...prevData, response.data]);
      setNewTitle("");
      setNewDescription("");
    } catch (error) {
      console.error("Failed to add the todo", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3600/todos/${id}`);
      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete the todo", error);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3600/todos/${editId}`, {
        title: editTitle,
        description: editDescription,
      });
      setData((prevData) =>
        prevData.map((item) =>
          item.id === editId
            ? { ...item, title: editTitle, description: editDescription }
            : item
        )
      );
      setEditId(null);
      setEditTitle("");
      setEditDescription("");
    } catch (error) {
      console.error("Failed to update the todo", error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-[1200px]">
      <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add a New Todo</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <button
            className="self-start bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mt-2"
            onClick={handleAdd}
          >
            Add Todo
          </button>
        </div>
      </div>

      {data.map((item) => (
        <div
          key={item.id}
          className="p-4 mb-4 border border-gray-300 rounded-lg shadow-sm bg-white"
        >
          {editId === item.id ? (
            <div className="flex flex-col gap-4">
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                  onClick={handleUpdate}
                >
                  Save
                </button>
                <button
                  className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
                  onClick={() => setEditId(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-semibold mb-2">{item.title}</h1>
              <p className="text-gray-700 mb-4">{item.description}</p>
              <div className="flex gap-2">
                <button
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
