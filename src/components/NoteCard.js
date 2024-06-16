import React from "react";
import PropTypes from "prop-types";

const NoteCard = ({ note, onClick, onPin, onDelete }) => {
  return (
    <div className="card bg-black text-light" style={{ width: "20rem" }}>
      <div className="card-body">
        <h5 className="card-title fs-3 fw-bold">{note.title}</h5>
        <h6 className="card-subtitle mb-2  fs-4 text-danger">{note.tagline}</h6>
        <p className="card-text fs-5  text-warning">{note.body}</p>
        <div className="card-footer d-flex justify-content-bottom">
          <button className="btn btn-primary me-2" onClick={() => onClick(note)}>
            Edit
          </button>
          <button className="btn btn-secondary me-2" onClick={() => onPin(note)}>
            {note.pinned ? "Unpin" : "Pin"}
          </button>
          <button className="btn btn-danger" onClick={() => onDelete(note.id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

NoteCard.propTypes = {
  note: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  onPin: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default NoteCard;
