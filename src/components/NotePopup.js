import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NotePopup = ({ note, onClose, onSave, onDelete }) => {
  const [title, setTitle] = useState(note.title);
  const [tagline, setTagline] = useState(note.tagline);
  const [body, setBody] = useState(note.body);

  useEffect(() => {
    setTitle(note.title);
    setTagline(note.tagline);
    setBody(note.body);
  }, [note]);

  const handleSave = async () => {
    try {
      const noteRef = doc(db, 'notes', note.id);
      await updateDoc(noteRef, { title, tagline, body });
      onSave();
      toast.success('updated succussfully')
      onClose();
    } catch (error) {
      toast.error('Failed to update note');
      console.error('Failed to update note', error);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(note.id);
      onClose();
    } catch (error) {
      toast.error('Failed to delete note');
      console.error('Failed to delete note', error);
    }
  };

  return (
    <div className="modal fade" id="noteModal" tabIndex="-1" aria-labelledby="noteModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="noteModalLabel">Edit Note</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              className="form-control mb-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />
            <input
              type="text"
              className="form-control mb-2"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Tagline"
            />
            <textarea
              className="form-control"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Body"
              rows="5"
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>Save changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotePopup;
