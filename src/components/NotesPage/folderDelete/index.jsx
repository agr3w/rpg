import { app } from "APIs/firebaseConfig"; // Importe a configuração do Firebase

export const deleteArrayFolder = async (folderId) => {
    const foldersRef = app.database().ref("folders"); // Substitua "folders" pelo caminho correto
  
    try {
      await foldersRef.child(folderId).remove();
      console.log("Folder removed from array successfully");
    } catch (error) {
      console.error("Error removing folder from array:", error);
    }
  };