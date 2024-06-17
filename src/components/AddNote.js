import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import png1 from "../images/add.png";
import "./placeholder.css"
const AddNote = () => {
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [body, setBody] = useState("");

  const handleAddNote = async () => {
    try {
      await addDoc(collection(db, "notes"), {
        title,
        tagline,
        body,
        pinned: false,
        createdAt: new Date(),
      });
      setTitle("");
      setTagline("");
      setBody("");
      toast.success("Note added successfully!");
      window.location.reload()
    } catch (error) {
      toast.error("Failed to add note");
    }
  };

  return (
    <div className="container-fluid justify-content-center d-flex text-white">
     
      <div className="container justify-content-center p-3 border mt-5 border-black rounded ms-1 me-2" style={{fontFamily:"Oswald"}}>
        <div class="mb-3">
          <label for="exampleFormControlInput1" class="form-label">
            Title
          </label>
          <input
            type="text"
            class="form-control border-dark custom-placeholder bg-black text-white"
            id="exampleFormControlInput1"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div class="mb-3">
          <label for="exampleFormControlInput1" class="form-label">
            Tagline
          </label>
          <input
            type="text"
            class="form-control border-dark custom-placeholder bg-black text-white"
            id="exampleFormControlInput2"
            placeholder="Tagline"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />
        </div>
        <div class="mb-3">
          <label for="exampleFormControlTextarea1" class="form-label">
            Body
          </label>
          <textarea
            class="form-control border-black custom-placeholder bg-black text-white"
            id="exampleFormControlTextarea1"
            rows="3"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          ></textarea>
        </div>
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <button class="btn btn-primary btn-lg " type="button" onClick={handleAddNote} style={{fontFamily:"Oswald"}}>
            <span>
              <img src={png1} alt="add" style={{ width: "32px" }} />
            </span>{" "}
            &nbsp; Add note
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNote;
