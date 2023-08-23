import { app } from "APIs/firebaseConfig"; // Importe a configuração do Firebase

export const deleteArrayFolder = async (folderId) => {
  const foldersRef = app.database().ref("folders"); // Substitua "folders" pelo caminho correto

  try {
    await foldersRef.child(folderId).remove();
    alert("Folder removed from array successfully");
  } catch (error) {
    alert("Error removing folder from array:", error);
  }
};
