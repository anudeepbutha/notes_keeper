import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearAuth } from "../App/slices/authSlice";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingNote, setEditingNote] = useState(null);

  const homeurl = "http://localhost:5001";

  // Fetch notes on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // Helper to get JWT token from localStorage
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  // Fetch notes for logged-in user
  async function fetchNotes() {
    try {
      const res = await fetch(`${homeurl}/todos`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      });
      if (!res.ok) throw new Error("Failed to fetch notes");
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    }
  }

  // Create or update a note
  async function handleCreateOrUpdate() {
    try {
      const options = {
        method: editingNote ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ title, content }),
      };

      const url = `${homeurl}/todos${editingNote ? `/${editingNote.id}` : ""}`;
      const res = await fetch(url, options);
      if (!res.ok) throw new Error("Failed to save note");

      setTitle("");
      setContent("");
      setEditingNote(null);
      fetchNotes();
    } catch (err) {
      console.error("Failed to save note", err);
    }
  }

  // Delete a note
  async function handleDelete(id) {
    try {
      const res = await fetch(`${homeurl}/todos/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });
      if (!res.ok) throw new Error("Failed to delete note");
      fetchNotes();
    } catch (err) {
      console.error("Failed to delete note", err);
    }
  }

  // Edit a note
  function handleEdit(note) {
    setTitle(note.title);
    setContent(note.content);
    setEditingNote(note);
  }

  // Logout function
  function handleLogout() {
    localStorage.removeItem("token");
    dispatch(clearAuth()); // Clear Redux state
    navigate("/");
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Notes</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="bg-white p-4 mb-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <button 
          onClick={handleCreateOrUpdate}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          {editingNote ? "Update Note" : "Create Note"}
        </button>
      </div>

      <div className="grid gap-4">
        {notes.map((note) => (
          <div key={note.id} className="border p-2 rounded">
            <h2 className="text-lg font-semibold">{note.title}</h2>
            <p className="text-gray-700">{note.content}</p>
            <div className="flex gap-2 mt-2">
              <button 
                onClick={() => handleEdit(note)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(note.id)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}