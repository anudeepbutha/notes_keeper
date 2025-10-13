import Note from "../models/noteModel.js";

// GET all notes for logged-in user -> [ { id, title } ]
export async function getAllNotes(req, res) {
  try {
    const notes = await Note.find({ userId: req.user.id });
    res.status(200).json(
      notes.map(note => ({
        id: note._id,
        title: note.title
      }))
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// POST create note for logged-in user -> { id, title }
export async function createNotes(req, res) {
  const { title } = req.body;
  if (!title)
    return res.status(400).json({ error: "Title required" });

  try {
    const note = await Note.create({ title, userId: req.user.id });
    res.status(201).json({
      id: note._id,
      title: note.title
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// PUT update note by id -> { id, title }
export async function updateNotes(req, res) {
  const { id } = req.params;
  const { title } = req.body;

  if (!title)
    return res.status(400).json({ error: "Title required" });

  try {
    const note = await Note.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { title },
      { new: true }
    );

    if (!note) return res.status(404).json({ error: "Note not found" });

    res.status(200).json({
      id: note._id,
      title: note.title
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// DELETE note by id -> {}
export async function deleteNotes(req, res) {
  const { id } = req.params;

  try {
    const note = await Note.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!note) return res.status(404).json({ error: "Note not found" });

    res.status(200).json({});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
