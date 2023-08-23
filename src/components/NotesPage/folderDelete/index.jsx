import { app } from "APIs/firebaseConfig"; // Importe a configuração do Firebase

export const deleteArrayFolder = async (folderId) => {
  const foldersRef = app.database().ref("folders"); // Substitua "folders" pelo caminho correto

  try {
    alert("Folder removed from array successfully");
    await foldersRef.child(folderId).remove();
  } catch (error) {
    alert("Error removing folder from array:", error);
  }
};
