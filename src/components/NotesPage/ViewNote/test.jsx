import React from "react";
import { Link } from "react-router-dom";

const NotesList = ({ notes }) => {
  return (
    <div>
      <h2>Lista de Notas</h2>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <Link to={`/view-note/${note.id}`}>{note.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotesList;
