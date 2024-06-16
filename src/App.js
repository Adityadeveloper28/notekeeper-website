import React from "react";
import AddNote from "./components/AddNote";
import NoteGrid from "./components/NoteGrid";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    
    <div className="App bg-dark">
      <nav class="navbar bg-body-dark  border-bottom">
        <div class="container-fluid">
          <a class="navbar-brand text-white" href="#" style={{fontFamily:"Oswald"}}>
            Note Keeper{" "}
          </a>
        </div>
      </nav>
      <AddNote />
      <NoteGrid />
      <ToastContainer />
    </div>
  );
}

export default App;
