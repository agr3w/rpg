import React, { useEffect, useState } from "react";
import { useFirestore } from "reactfire";
import { useParams } from "react-router-dom";

const ViewNotePage = () => {
  const firestore = useFirestore();
  const { noteId } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const noteRef = firestore.collection("notes").doc(noteId);
        const noteData = await noteRef.get();

        if (noteData.exists) {
          setNote(noteData.data());
        } else {
          console.log("Note not found");
        }
      } catch (error) {
        console.error("Error fetching note:", error);
      }
    };

    fetchNote();
  }, [firestore, noteId]);

  if (!note) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{note.title}</h1>
      <p>{note.content}</p>
      {/* Aqui você pode exibir a imagem do arquivo de anotação, se houver */}
    </div>
  );
};

export default ViewNotePage;
