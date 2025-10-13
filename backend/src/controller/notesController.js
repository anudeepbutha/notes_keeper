import Note from "../models/noteModel.js";

// GET all notes for logged-in user
// In notesController.js - getAllNotes function
export async function getAllNotes(req, res) {
  try {
    console.log("User ID:", req.user.id); // Add this
    const notes = await Note.find({ userId: req.user.id });
    console.log("Notes found:", notes); // Add this
    res.status(200).json(
      notes.map(note => ({
        id: note._id,
        title: note.title,
        content: note.content
      }))
    );
  } catch (error) {
    console.error("Error in getAllNotes:", error); // Add this
    res.status(500).json({ error: error.message });
  }
}

// POST create note for logged-in user
export async function createNotes(req, res) {
  const { title, content } = req.body;
  if (!title || !content)
    return res.status(400).json({ error: "Title and content required" });

  try {
    const note = await Note.create({ title, content, userId: req.user.id });
    res.status(201).json({
      id: note._id,
      title: note.title,
      content: note.content
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// PUT update note by id (only if belongs to user)
export async function updateNotes(req, res) {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title || !content)
    return res.status(400).json({ error: "Title and content required" });

  try {
    const note = await Note.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { title, content },
      { new: true }
    );

    if (!note) return res.status(404).json({ error: "Note not found" });

    res.status(200).json({
      id: note._id,
      title: note.title,
      content: note.content
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// DELETE note by id (only if belongs to user)
export async function deleteNotes(req, res) {
  const { id } = req.params;

  try {
    const note = await Note.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!note) return res.status(404).json({ error: "Note not found" });

    res.status(200).json({
      id: note._id,
      title: note.title,
      content: note.content
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
