import React, { createContext, useContext, useState } from 'react';

const FileContext = createContext();

export const useFileContext = () => useContext(FileContext);

export const FileProvider = ({ children }) => {
  const [arquivos, setArquivos] = useState([]);

  const adicionarArquivo = (file) => {
    const novoArquivo = { id: Date.now(), file };
    setArquivos([...arquivos, novoArquivo]);
  };

  const deletarArquivo = (id) => {
    const novaListaArquivos = arquivos.filter((arquivo) => arquivo.id !== id);
    setArquivos(novaListaArquivos);
  };

  return (
    <FileContext.Provider value={{ arquivos, adicionarArquivo, deletarArquivo }}>
      {children}
    </FileContext.Provider>
  );
};
