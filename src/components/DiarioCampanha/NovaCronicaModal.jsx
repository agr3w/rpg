import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ShieldIcon from "@mui/icons-material/Shield";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { CHRONICLE_TEMPLATES } from "./chronicleTemplates";
import styles from "./NovaCronicaModal.module.css";

export default function NovaCronicaModal({
  isOpen,
  onClose,
  onSave,
  availableCharacters = [] // Lista de fichas vindas do Contexto (ex: { id, nome, classe, nivel })
}) {
  const [selectedTemplate, setSelectedTemplate] = useState("adventure");
  const [sessionNumber, setSessionNumber] = useState("");
  const [title, setTitle] = useState("");
  const [inGameDate, setInGameDate] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState(CHRONICLE_TEMPLATES.adventure.defaultTags);
  const [content, setContent] = useState(CHRONICLE_TEMPLATES.adventure.body);
  const [participatingCharIds, setParticipatingCharIds] = useState([]);
  const [showOverwriteWarning, setShowOverwriteWarning] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // Pré-selecionar todas as fichas disponíveis por padrão
      setParticipatingCharIds(availableCharacters.map((c) => c.id || c.nome));
    }
  }, [isOpen, availableCharacters]);

  // Lógica de troca de modelo com trava de segurança
  const handleTemplateChange = (newTemplateKey) => {
    const isDirty =
      content.trim().length > 0 &&
      content !== CHRONICLE_TEMPLATES[selectedTemplate].body;

    if (isDirty) {
      setPendingTemplate(newTemplateKey);
      setShowOverwriteWarning(true);
    } else {
      applyTemplate(newTemplateKey);
    }
  };

  const applyTemplate = (key) => {
    const template = CHRONICLE_TEMPLATES[key];
    if (!template) return;
    setSelectedTemplate(key);
    setContent(template.body);
    // Unifica as tags padrão do modelo mantendo as customizadas
    setTags((prev) => Array.from(new Set([...prev, ...template.defaultTags])));
    setShowOverwriteWarning(false);
    setPendingTemplate(null);
  };

  // Gerenciamento de Tags (Pills)
  const handleAddTag = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const cleanTag = tagInput.replace(",", "").trim();
      if (cleanTag && !tags.includes(cleanTag)) {
        setTags([...tags, cleanTag]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Toggle de personagens presentes
  const toggleCharacterPresence = (charId) => {
    setParticipatingCharIds((prev) =>
      prev.includes(charId) ? prev.filter((id) => id !== charId) : [...prev, charId]
    );
  };

  const resetForm = () => {
    setSelectedTemplate("adventure");
    setSessionNumber("");
    setTitle("");
    setInGameDate("");
    setTagInput("");
    setTags(CHRONICLE_TEMPLATES.adventure.defaultTags);
    setContent(CHRONICLE_TEMPLATES.adventure.body);
    setShowOverwriteWarning(false);
    setPendingTemplate(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      sessionNumber: sessionNumber.trim() ? Number(sessionNumber) : null,
      title: title.trim(),
      inGameDate: inGameDate.trim(),
      createdAt: new Date().toISOString(),
      templateUsed: selectedTemplate,
      tags,
      content,
      participatingCharacters: participatingCharIds
    });

    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.modalOverlay} onClick={onClose}>
          <motion.div
            className={styles.modalParchment}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className={styles.modalHeader}>
              <div className={styles.headerTitleGroup}>
                <span className={styles.headerRune}>ᛟ</span>
                <h2>Nova Crônica de Sessão</h2>
                <span className={styles.headerRune}>ᛟ</span>
              </div>
              <p className={styles.headerSubtitle}>
                Registre eventos, tesouros e o destino dos heróis no tomo da campanha.
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.formBody}>
              {/* Seletor de Modelo */}
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Modelo de Registro</label>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.styledSelect}
                    value={selectedTemplate}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                  >
                    {Object.values(CHRONICLE_TEMPLATES).map((tmpl) => (
                      <option key={tmpl.id} value={tmpl.id}>
                        {tmpl.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Linha Tripla: Número da Sessão + Título + Data In-Game */}
              <div className={styles.rowGridThree}>
                <div className={styles.fieldGroupSmall}>
                  <label className={styles.fieldLabel}>Sessão Nº</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Ex: 12"
                    className={styles.styledInput}
                    value={sessionNumber}
                    onChange={(e) => setSessionNumber(e.target.value)}
                  />
                </div>

                <div className={styles.fieldGroupMain}>
                  <label className={styles.fieldLabel}>Título do Capítulo / Sessão *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: A Queda da Cidadela das Sombras"
                    className={styles.styledInput}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className={styles.fieldGroupSmall}>
                  <label className={styles.fieldLabel}>Data em Jogo</label>
                  <input
                    type="text"
                    placeholder="Ex: 14 de Mirtul"
                    className={styles.styledInput}
                    value={inGameDate}
                    onChange={(e) => setInGameDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Vínculo de Fichas / Heróis Presentes */}
              {availableCharacters.length > 0 && (
                <div className={styles.fieldGroup}>
                  <div className={styles.labelWithBadge}>
                    <label className={styles.fieldLabel}>Heróis Presentes na Sessão</label>
                    <span className={styles.charsCountBadge}>
                      {participatingCharIds.length} de {availableCharacters.length}
                    </span>
                  </div>
                  <div className={styles.characterPillsContainer}>
                    {availableCharacters.map((char) => {
                      const id = char.id || char.nome;
                      const isPresent = participatingCharIds.includes(id);
                      return (
                        <button
                          key={id}
                          type="button"
                          className={`${styles.charPill} ${isPresent ? styles.charPillActive : ""}`}
                          onClick={() => toggleCharacterPresence(id)}
                        >
                          {isPresent ? (
                            <ShieldIcon sx={{ fontSize: "0.95rem" }} />
                          ) : (
                            <PersonOutlineIcon sx={{ fontSize: "0.95rem" }} />
                          )}
                          <span className={styles.charName}>{char.nome}</span>
                          {char.classe && <small className={styles.charClass}>({char.classe})</small>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tags em Pílula */}
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Tags da Sessão <small>(Pressione Enter ou vírgula)</small>
                </label>
                <div className={styles.tagsInputContainer}>
                  <div className={styles.tagBadgesList}>
                    {tags.map((tag) => (
                      <span key={tag} className={styles.tagBadge}>
                        #{tag}
                        <button
                          type="button"
                          className={styles.tagRemoveBtn}
                          onClick={() => handleRemoveTag(tag)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Adicionar tag..."
                    className={styles.ghostTagInput}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                  />
                </div>
              </div>

              {/* Conteúdo com Estrutura Markdown */}
              <div className={styles.fieldGroup}>
                <div className={styles.labelWithBadge}>
                  <label className={styles.fieldLabel}>Crônica & Anotações</label>
                  <small className={styles.editorHint}>Aceita marcação Markdown (**, -)</small>
                </div>
                <textarea
                  rows="11"
                  required
                  className={styles.styledTextarea}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Descreva aqui os triunfos, combates e derrotas desta sessão..."
                />
              </div>

              {/* Ações Inferiores */}
              <div className={styles.modalActions}>
                <button type="button" className={styles.btnCancel} onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className={styles.btnConfirm}>
                  <span>Salvar no Grimório</span>
                  <span className={styles.btnRune}>✦</span>
                </button>
              </div>
            </form>

            {/* Modal/Aviso de Sobrescrita de Template */}
            <AnimatePresence>
              {showOverwriteWarning && (
                <motion.div
                  className={styles.warningOverlay}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className={styles.warningBox}>
                    <h4>Substituir Conteúdo?</h4>
                    <p>
                      Você já escreveu anotações nesta crônica. Deseja substituir tudo pelo novo modelo
                      ou cancelar a troca?
                    </p>
                    <div className={styles.warningActions}>
                      <button
                        type="button"
                        className={styles.btnWarningCancel}
                        onClick={() => {
                          setShowOverwriteWarning(false);
                          setPendingTemplate(null);
                        }}
                      >
                        Manter Meu Texto
                      </button>
                      <button
                        type="button"
                        className={styles.btnWarningConfirm}
                        onClick={() => applyTemplate(pendingTemplate)}
                      >
                        Aplicar Novo Modelo
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
