import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearAuth } from "../App/slices/authSlice";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [editingNote, setEditingNote] = useState(null);

  const homeurl = "http://localhost:5001";

  // Fetch notes on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // Fetch notes for logged-in user -> [ { id, title } ]
  async function fetchNotes() {
    try {
      const res = await fetch(`${homeurl}/todos`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch notes");
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    }
  }

  // Create or Update a note
  async function handleCreateOrUpdate() {
    if (!title.trim()) return;

    try {
      const method = editingNote ? "PUT" : "POST";
      const url = editingNote 
        ? `${homeurl}/todos/${editingNote.id}` 
        : `${homeurl}/todos`;

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Failed to save note");

      setTitle("");
      setEditingNote(null);
      fetchNotes();
    } catch (err) {
      console.error("Failed to save note", err);
    }
  }

  // Edit a note
  function handleEdit(note) {
    setTitle(note.title);
    setEditingNote(note);
  }

  // Cancel editing
  function handleCancel() {
    setTitle("");
    setEditingNote(null);
  }

  // Delete a note -> {}
  async function handleDelete(id) {
    try {
      const res = await fetch(`${homeurl}/todos/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete note");
      fetchNotes();
    } catch (err) {
      console.error("Failed to delete note", err);
    }
  }

  // Logout function -> {}
  async function handleLogout() {
    try {
      await fetch(`${homeurl}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout request failed", err);
    } finally {
      dispatch(clearAuth());
      navigate("/");
    }
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

      <div className="bg-white p-4 mb-4 shadow rounded">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <div className="flex gap-2">
          <button 
            onClick={handleCreateOrUpdate}
            className={`${
              editingNote 
                ? 'bg-blue-500 hover:bg-blue-600' 
                : 'bg-green-500 hover:bg-green-600'
            } text-white px-4 py-2 rounded flex-1`}
          >
            {editingNote ? "Update Note" : "Create Note"}
          </button>
          {editingNote && (
            <button 
              onClick={handleCancel}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {notes.map((note) => (
          <div key={note.id} className="border p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{note.title}</h2>
              <div className="flex gap-2">
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
          </div>
        ))}
      </div>
    </div>
  );
}