import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import './NotesSection.css';

const NotesSection = ({ notes: initialNotes, lectureId, isAdmin }) => {
  const [notes, setNotes] = useState(initialNotes);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editingNote, setEditingNote] = useState(null);

  const handleCreateNote = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/api/v1/notes/${lectureId}`, newNote);
      setNotes([data.note, ...notes]);
      setNewNote({ title: '', content: '' });
      toast.success('Note created successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating note');
    }
  };

  const handleUpdateNote = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `/api/v1/notes/${editingNote._id}`,
        editingNote
      );
      setNotes(notes.map(note => 
        note._id === editingNote._id ? data.note : note
      ));
      setEditingNote(null);
      toast.success('Note updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await axios.delete(`/api/v1/notes/${noteId}`);
      setNotes(notes.filter(note => note._id !== noteId));
      toast.success('Note deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting note');
    }
  };

  return (
    <div className="notes-section">
      {isAdmin && (
        <form 
          className="note-form"
          onSubmit={editingNote ? handleUpdateNote : handleCreateNote}
        >
          <input
            type="text"
            placeholder="Note Title"
            value={editingNote ? editingNote.title : newNote.title}
            onChange={(e) => 
              editingNote 
                ? setEditingNote({...editingNote, title: e.target.value})
                : setNewNote({...newNote, title: e.target.value})
            }
            required
          />
          <textarea
            placeholder="Note Content"
            value={editingNote ? editingNote.content : newNote.content}
            onChange={(e) => 
              editingNote
                ? setEditingNote({...editingNote, content: e.target.value})
                : setNewNote({...newNote, content: e.target.value})
            }
            required
          />
          <div className="form-buttons">
            <button type="submit">
              {editingNote ? 'Update Note' : 'Add Note'}
            </button>
            {editingNote && (
              <button 
                type="button" 
                onClick={() => setEditingNote(null)}
                className="cancel-button"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      <div className="notes-list">
        {notes.length === 0 ? (
          <p className="no-notes">No notes available for this lecture.</p>
        ) : (
          notes.map(note => (
            <div key={note._id} className="note-card">
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              {isAdmin && (
                <div className="note-actions">
                  <button 
                    onClick={() => setEditingNote(note)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteNote(note._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesSection; 