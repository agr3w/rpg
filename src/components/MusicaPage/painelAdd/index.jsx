import React, { useState } from "react";
import { Button, Modal, TextField, MenuItem } from "@mui/material";
import { FaPlus } from "react-icons/fa";
import styles from "./AddMusicButton.module.css"; // Substitua pelo estilo apropriado
import { useMusicContext } from "APIs/MusicContext";
import { app } from "APIs/firebaseConfig"; // Importe a configuração do Firebase

const AddMusicButton = ({ onMusicAdded }) => {
  const { adicionarMusica, categorias } = useMusicContext();
  const [arquivo, setArquivo] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [imagem, setImagem] = useState(null);
  const [categoria, setCategoria] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [open, setOpen] = useState(false);

//   const categorias = ["Rock", "Pop", "Eletrônica", "Hip Hop", "Clássica"]; // Adicione as categorias desejadas

  const handleArquivoChange = (e) => {
    setArquivo(e.target.files[0]);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTituloChange = (event) => {
    setTitulo(event.target.value);
  };

  const handleCategoriaChange = (event) => {
    setCategoria(event.target.value);
  };

  const handleImagemChange = (event) => {
    setImagem(event.target.files[0]);
  };

  const handleAdicionarMusica = async () => {
    if (arquivo && titulo && imagem && categoria) {
      setIsUploading(true);
  
      const storage = app.storage();
      const storageRef = storage.ref();
  
      const arquivoRef = storageRef.child(`arquivos/musicas/${arquivo.name}`);
      await arquivoRef.put(arquivo);
      const urlDoArquivo = await arquivoRef.getDownloadURL();
  
      const imagemRef = storageRef.child(`imagens/${imagem.name}`);
      await imagemRef.put(imagem);
      const imagemUrl = await imagemRef.getDownloadURL();
  
      const novaMusica = {
        id: app.database().ref().child("musicas").push().key,
        titulo: titulo,
        categoria: categoria,
        nomeArquivoAudio: arquivo.name, // Adicione o nome real do arquivo de áudio
        nomeArquivoImagem: imagem.name, // Adicione o nome real do arquivo de imagem
        urlDoArquivo: urlDoArquivo,
        imagemUrl: imagemUrl,
      };
  
      adicionarMusica(novaMusica);
      setIsUploading(false);
  
      setTitulo("");
      setCategoria("");
      setImagem(null);
      setArquivo(null);
      handleClose();
    }
  };
  

  return (
    <div>
      <Button onClick={handleOpen}>
        <FaPlus size={12} /> Adicionar Música
      </Button>
      <Modal open={open} onClose={handleClose}>
        <div className={styles.modal}>
          <h2>Adicionar Música</h2>
          <TextField
            label="Título"
            variant="outlined"
            value={titulo}
            onChange={handleTituloChange}
            fullWidth
          />
          <TextField
            select
            label="Categoria"
            variant="outlined"
            value={categoria}
            onChange={handleCategoriaChange}
            fullWidth
          >
            {categorias.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
          <input
            type="file"
            accept="image/*"
            onChange={handleImagemChange}
          />
          <input
            type="file"
            accept="audio/*"
            onChange={handleArquivoChange}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAdicionarMusica}
            disabled={isUploading}
          >
            {isUploading ? "Carregando..." : "Adicionar Música"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AddMusicButton;
