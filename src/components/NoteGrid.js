import React, { useEffect, useState, useRef } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import NoteCard from "./NoteCard";
import NotePopup from "./NotePopup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "bootstrap"; // Ensure you import Modal from Bootstrap

const NoteGrid = () => {
  const [notes, setNotes] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageTokens, setPageTokens] = useState({});
  const modalRef = useRef(null); // Ref to hold modal instance

  useEffect(() => {
    fetchTotalNotes();
    fetchNotes(true, 1);
  }, []);

  useEffect(() => {
    modalRef.current = new Modal(document.getElementById("noteModal")); // Initialize modal once
  }, []);

  const fetchTotalNotes = async () => {
    try {
      const notesSnapshot = await getDocs(collection(db, "notes"));
      const totalDocs = notesSnapshot.size;
      setTotalPages(Math.ceil(totalDocs / 6));
    } catch (error) {
      console.error("Error fetching total notes:", error);
    }
  };

  const fetchNotes = async (reset = false, page = 1) => {
    try {
      let q = query(
        collection(db, "notes"),
        orderBy("pinned", "desc"),
        orderBy("createdAt", "desc"),
        limit(6)
      );

      if (page > 1) {
        q = query(
          collection(db, "notes"),
          orderBy("pinned", "desc"),
          orderBy("createdAt", "desc"),
          startAfter(pageTokens[page - 1]),
          limit(6)
        );
      }

      const querySnapshot = await getDocs(q);
      const fetchedNotes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNotes(fetchedNotes);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

      setPageTokens((prevTokens) => ({
        ...prevTokens,
        [page]: querySnapshot.docs[querySnapshot.docs.length - 1],
      }));
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handlePin = async (note) => {
    try {
      const noteRef = doc(db, "notes", note.id);
      await updateDoc(noteRef, { pinned: !note.pinned });
      fetchNotes(true, currentPage);
      toast.success(
        `Note ${note.pinned ? "unpinned" : "pinned"} successfully`
      );
    } catch (error) {
      toast.error("Failed to update note");
      console.error("Error pinning note:", error);
    }
  };

  const handleDelete = async (noteId) => {
    try {
      const noteRef = doc(db, "notes", noteId);
      await deleteDoc(noteRef);
      fetchNotes(true, currentPage);
      toast.success("Note deleted successfully");
    } catch (error) {
      toast.error("Failed to delete note");
      console.error("Error deleting note:", error);
    }
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    modalRef.current.show(); // Show the modal using the current instance
  };

  const handleSaveNote = async (updatedNote) => {
    try {
      const noteRef = doc(db, "notes", updatedNote.id);
      await updateDoc(noteRef, updatedNote);
      fetchNotes(true, currentPage);
      toast.success("Note updated successfully");
      handleCloseModal(); // Close modal after save
    } catch (error) {
      toast.error("Failed to update note");
      console.error("Error updating note:", error);
    }
  };

  const handleCloseModal = () => {
    setSelectedNote(null);
    modalRef.current.hide(); // Hide the modal using the current instance
  };

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      fetchNotes(true, page);
    }
  };

  return (
    <>
      <div className="container d-flex gap-2 justify-content-center mt-3">
        <div className="row gap-4 justify-content-center">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onPin={handlePin}
              onDelete={handleDelete}
              onClick={handleNoteClick}
            />
          ))}
        </div>
      </div>
      <div className="container justify-content-center d-flex p-3 mt-3">
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
        {selectedNote && (
          <NotePopup
            note={selectedNote}
            onSave={handleSaveNote}
            onClose={handleCloseModal}
          />
        )}
      </div>
      <div
        className="modal fade"
        id="noteModal"
        tabIndex="-1"
        aria-labelledby="noteModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="noteModalLabel">
                Edit Note
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleCloseModal}
              ></button>
            </div>
            <div className="modal-body">
              {selectedNote && (
                <>
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={selectedNote.title}
                    onChange={(e) =>
                      setSelectedNote({
                        ...selectedNote,
                        title: e.target.value,
                      })
                    }
                    placeholder="Title"
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={selectedNote.tagline}
                    onChange={(e) =>
                      setSelectedNote({
                        ...selectedNote,
                        tagline: e.target.value,
                      })
                    }
                    placeholder="Tagline"
                  />
                  <textarea
                    className="form-control"
                    value={selectedNote.body}
                    onChange={(e) =>
                      setSelectedNote({
                        ...selectedNote,
                        body: e.target.value,
                      })
                    }
                    placeholder="Body"
                    rows="5"
                  />
                </>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleDelete(selectedNote.id)}
              >
                Delete
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleSaveNote(selectedNote)}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoteGrid;
