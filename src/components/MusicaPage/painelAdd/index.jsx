import React, { useState } from "react";
import { Button, Modal, TextField, MenuItem } from "@mui/material";
import { FaPlus } from "react-icons/fa";
import styles from "./AddMusicButton.module.css";
import { useMusicContext } from "APIs/MusicContext";
import { storage, auth } from "APIs/firebaseConfig";

const AddMusicButton = ({ onMusicAdded }) => {
  const { adicionarMusica, categorias } = useMusicContext();
  const [arquivo, setArquivo] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [imagem, setImagem] = useState(null);
  const [categoria, setCategoria] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleArquivoChange = (e) => setArquivo(e.target.files[0] || null);
  const handleImagemChange = (e) => setImagem(e.target.files[0] || null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleTituloChange = (event) => setTitulo(event.target.value);
  const handleCategoriaChange = (event) => setCategoria(event.target.value);

  const handleCancelar = () => {
    setTitulo("");
    setCategoria("");
    setImagem(null);
    setArquivo(null);
    handleClose();
  };

  const handleAdicionarMusica = async () => {
    if (!arquivo || !titulo || !imagem || !categoria) return;
    setIsUploading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Usuário não autenticado.");
        return;
      }
      const userID = user.uid;
      const storageRef = storage.ref();

      const arquivoRef = storageRef.child(
        `arquivos/musicas/${userID}/${arquivo.name}`
      );
      await arquivoRef.put(arquivo);
      const urlDoArquivo = await arquivoRef.getDownloadURL();

      const imagemRef = storageRef.child(`imagens/${userID}/${imagem.name}`);
      await imagemRef.put(imagem);
      const imagemUrl = await imagemRef.getDownloadURL();

      const novaMusica = {
        titulo: titulo,
        categoria: categoria,
        nomeArquivoAudio: arquivo.name,
        nomeArquivoImagem: imagem.name,
        urlDoArquivo,
        imagemUrl,
      };

      await adicionarMusica(novaMusica);
      if (typeof onMusicAdded === "function") onMusicAdded();
      setTitulo("");
      setCategoria("");
      setImagem(null);
      setArquivo(null);
      handleClose();
    } catch (err) {
      console.error("Erro ao adicionar música:", err);
      alert("Erro ao adicionar música.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <Button onClick={handleOpen}>
        <FaPlus size={12} /> Adicionar Música
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        className={styles.modalContainer}
      >
        <div className={styles.modalContent}>
          <h2 className={styles.modalTitle}>Adicionar Música</h2>
          <TextField
            label="Título"
            variant="outlined"
            value={titulo}
            onChange={handleTituloChange}
            fullWidth
            className={styles.inputField}
          />
          <TextField
            select
            label="Categoria"
            variant="outlined"
            value={categoria}
            onChange={handleCategoriaChange}
            fullWidth
            className={styles.inputField}
          >
            {categorias.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>

          <div className={styles.divLabel}>
            <label className={imagem ? styles.InputSelected : styles.InputButton}>
              <span className={styles.customFileInputButton}>
                {imagem ? "Imagem Selecionada" : "Selecionar Imagem"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImagemChange}
                className={styles.fileInput}
              />
            </label>

            <label className={arquivo ? styles.InputSelected : styles.InputButton}>
              <span className={styles.customFileInputButton}>
              {arquivo ? "Arquivo Selecionado" : "Selecionar Arquivo"}
              </span>
              <input
                type="file"
                accept="audio/*"
                onChange={handleArquivoChange}
                className={styles.fileInput}
              />
            </label>
          </div>

          <div className={styles.buttonGroup}>
            <Button
              variant="contained"
              onClick={handleCancelar}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAdicionarMusica}
              disabled={isUploading}
            >
              {isUploading ? "Carregando..." : "Adicionar Música"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddMusicButton;
