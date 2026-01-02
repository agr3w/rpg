import React, { createContext, useContext, useState, useEffect } from "react";
import { database, auth, storage } from "./firebaseConfig";

const MapContext = createContext();

export const useMapContext = () => useContext(MapContext);

export const MapProvider = ({ children }) => {
  const [userMaps, setUserMaps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar mapas do usuário (Corrigido para ouvir Auth)
  useEffect(() => {
    // O onAuthStateChanged garante que só buscamos quando o user estiver pronto
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const mapsRef = database.ref(`maps/${user.uid}`);
        
        const handleValue = (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const loadedMaps = Object.entries(data).map(([id, mapData]) => ({
              id,
              ...mapData
            }));
            setUserMaps(loadedMaps);
          } else {
            setUserMaps([]);
          }
          setLoading(false);
        };

        mapsRef.on("value", handleValue);
        
        // Cleanup do listener do banco ao desmontar ou deslogar
        return () => mapsRef.off("value", handleValue);
      } else {
        // Se não tem user, limpa tudo
        setUserMaps([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // --- ATUALIZADO: Recebe config e arquivo de imagem opcional ---
  const createNewMap = async (config, imageFile) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Cartógrafo não identificado.");

    let backgroundUrl = "";

    // Se houver imagem, faz upload
    if (imageFile) {
      const storageRef = storage.ref();
      const fileRef = storageRef.child(`maps_backgrounds/${user.uid}/${Date.now()}_${imageFile.name}`);
      await fileRef.put(imageFile);
      backgroundUrl = await fileRef.getDownloadURL();
    }

    const newMap = {
      name: config.name || "Terra Desconhecida",
      createdAt: new Date().toISOString(),
      elements: [], 
      // Configurações visuais e físicas do grid
      gridConfig: { 
        cellSize: config.cellSize || 50, // Novo parâmetro
        width: config.width || 20,  // Em células (ex: 20x20)
        height: config.height || 15 
      },
      theme: config.theme || "paper", // paper, stone, grass, water
      backgroundImage: backgroundUrl // Salva a URL
    };

    const ref = await database.ref(`maps/${user.uid}`).push(newMap);
    return ref.key; // Retorna o ID para redirecionarmos
  };

  // --- NOVA FUNÇÃO: Atualizar Configurações e Imagem ---
  const updateMapSettings = async (mapId, newConfig, newImageFile) => {
    const user = auth.currentUser;
    if (!user) return;

    const updates = {
      lastUpdated: new Date().toISOString(),
      ...newConfig // Espalha name, gridConfig, theme, etc.
    };

    // Se tiver nova imagem, faz upload e atualiza a URL
    if (newImageFile) {
      const storageRef = storage.ref();
      const fileRef = storageRef.child(`maps_backgrounds/${user.uid}/${Date.now()}_${newImageFile.name}`);
      await fileRef.put(newImageFile);
      updates.backgroundImage = await fileRef.getDownloadURL();
    }

    await database.ref(`maps/${user.uid}/${mapId}`).update(updates);
  };

  // --- NOVA FUNÇÃO: Deletar Mapa ---
  const deleteMap = async (mapId) => {
    const user = auth.currentUser;
    if (!user) return;
    
    // Nota: Idealmente deletaríamos a imagem do Storage também, 
    // mas para simplificar vamos focar no banco de dados por enquanto.
    await database.ref(`maps/${user.uid}/${mapId}`).remove();
  };

  // Salvar dados do mapa (Auto-save)
  const saveMapState = async (mapId, elements) => {
    const user = auth.currentUser;
    if (!user) return;
    
    await database.ref(`maps/${user.uid}/${mapId}`).update({
      elements: elements,
      lastUpdated: new Date().toISOString()
    });
  };

  return (
    <MapContext.Provider value={{ userMaps, createNewMap, saveMapState, deleteMap, updateMapSettings, loading }}>
      {children}
    </MapContext.Provider>
  );
};