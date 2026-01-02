import React, { createContext, useContext, useState, useEffect } from "react";
import { database, storage, auth } from "./firebaseConfig";

const AssetContext = createContext();

export const useAssetContext = () => useContext(AssetContext);

export const AssetProvider = ({ children }) => {
  const [publicAssets, setPublicAssets] = useState({});
  const [userAssets, setUserAssets] = useState([]);
  const [loadingAssets, setLoadingAssets] = useState(false);

  // Carregar Assets Públicos (Simulação ou busca real)
  const fetchPublicAssets = async () => {
    // Aqui você buscaria do seu nó 'public_assets' no Firebase
    // Estrutura esperada: { tokens: [{url, name}, ...], enemies: [...], scenery: [...] }
    
    // Exemplo estático para começar (depois conectamos ao banco real se tiver)
    const mockAssets = {
      tokens: [
        { id: "t1", name: "Guerreiro", url: "https://cdn-icons-png.flaticon.com/512/3408/3408506.png" },
        { id: "t2", name: "Mago", url: "https://cdn-icons-png.flaticon.com/512/3408/3408545.png" }
      ],
      enemies: [
        { id: "e1", name: "Goblin", url: "https://cdn-icons-png.flaticon.com/512/3063/3063039.png" },
        { id: "e2", name: "Dragão", url: "https://cdn-icons-png.flaticon.com/512/3063/3063169.png" }
      ],
      scenery: [
        { id: "s1", name: "Árvore", url: "https://cdn-icons-png.flaticon.com/512/490/490091.png" },
        { id: "s2", name: "Pedra", url: "https://cdn-icons-png.flaticon.com/512/6963/6963837.png" }
      ]
    };
    setPublicAssets(mockAssets);
  };

  // Carregar Assets do Usuário
  const fetchUserAssets = () => {
    const user = auth.currentUser;
    if (!user) return;

    const assetsRef = database.ref(`user_assets/${user.uid}`);
    assetsRef.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
        setUserAssets(list);
      } else {
        setUserAssets([]);
      }
    });
    return () => assetsRef.off();
  };

  // Upload de Asset Pessoal
  const uploadAsset = async (file) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não logado");

    setLoadingAssets(true);
    try {
      // 1. Upload para Storage
      const storageRef = storage.ref();
      const fileRef = storageRef.child(`user_assets/${user.uid}/${Date.now()}_${file.name}`);
      await fileRef.put(file);
      const url = await fileRef.getDownloadURL();

      // 2. Salvar referência no Database
      await database.ref(`user_assets/${user.uid}`).push({
        name: file.name,
        url: url,
        type: "user_upload",
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Erro no upload:", error);
      throw error;
    } finally {
      setLoadingAssets(false);
    }
  };

  const deleteAsset = async (assetId, fileName) => {
      // Implementar deleção se necessário (remover do storage e do db)
      // Por simplicidade, vamos remover só do DB agora
      const user = auth.currentUser;
      if(!user) return;
      await database.ref(`user_assets/${user.uid}/${assetId}`).remove();
  }

  useEffect(() => {
    fetchPublicAssets();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchUserAssets();
      else setUserAssets([]);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AssetContext.Provider value={{ publicAssets, userAssets, uploadAsset, deleteAsset, loadingAssets }}>
      {children}
    </AssetContext.Provider>
  );
};