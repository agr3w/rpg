import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { antecedentes } from "../../../Array/Antecedentes";
import CasinoOutlinedIcon from "@mui/icons-material/CasinoOutlined";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import TranslateIcon from "@mui/icons-material/Translate";
import styles from "./Etapa6.module.css";

const FALLBACK_ANTECEDENTES = [
  {
    nome: "Acólito",
    id: "acolito",
    pericias: "Intuição, Religião",
    ferramentas: "Dois idiomas à sua escolha",
    recurso: "Abrigo dos Fiéis (Você e seus companheiros recebem cura e abrigo em templos de sua fé).",
    equipamento: "Um símbolo sagrado, livro de preces, 5 varetas de incenso, vestes e 15 po.",
    descricao: "Você passou a vida a serviço de um templo, realizando ritos sagrados e prestando sacrifícios."
  },
  {
    nome: "Soldado",
    id: "soldado",
    pericias: "Atletismo, Intimidação",
    ferramentas: "Um conjunto de jogos, veículos terrestres",
    recurso: "Patente Militar (Soldados leais reconhecem sua autoridade militar e prestam auxílio).",
    equipamento: "Insígnia de patente, troféu de um inimigo caído, conjunto de dados de osso, roupas comuns e 10 po.",
    descricao: "A guerra moldou sua juventude. Você foi treinado como oficial ou soldado de infantaria."
  },
  {
    nome: "Criminoso",
    id: "criminoso",
    pericias: "Enganação, Furtividade",
    ferramentas: "Um conjunto de jogos, ferramentas de ladrão",
    recurso: "Contato Criminoso (Você tem um informante de confiança no submundo das cidades).",
    equipamento: "Um pé de cabra, conjunto de roupas escuras comuns com capuz e 15 po.",
    descricao: "Você viveu à margem da lei, aprendendo a sobreviver nas sombras e nos becos escuros."
  },
  {
    nome: "Herói do Povo",
    id: "heroi_povo",
    pericias: "Adestrar Animais, Sobrevivência",
    ferramentas: "Um tipo de ferramenta de artesão, veículos terrestres",
    recurso: "Hospitalidade Rústica (Camponeses e plebeus escondem e alimentam você).",
    equipamento: "Conjunto de ferramentas de artesão, pá, panela de ferro, roupas comuns e 10 po.",
    descricao: "Você se levantou contra tiranos ou monstros para defender os camponeses indefesos."
  },
  {
    nome: "Sábio",
    id: "sabio",
    pericias: "Arcanismo, História",
    ferramentas: "Dois idiomas à sua escolha",
    recurso: "Pesquisador (Quando não sabe de um fato histórico, você sabe exatamente onde encontrá-lo).",
    equipamento: "Vidro de tinta escura, pena, faca pequena, carta com pergunta sem resposta, roupas comuns e 10 po.",
    descricao: "Você passou anos catalogando manuscritos e desvendando mistérios em bibliotecas antigas."
  },
  {
    nome: "Nobre",
    id: "nobre",
    pericias: "História, Persuasão",
    ferramentas: "Um conjunto de jogos, um idioma à escolha",
    recurso: "Privilégio de Posição (Pessoas reconhecem seu berço nobre e você é bem-vindo na alta corte).",
    equipamento: "Conjunto de roupas finas, anel de sinete, pergaminho de linhagem e 25 po.",
    descricao: "Você nasceu com títulos, terras e a responsabilidade de uma família de prestígio aristocrático."
  }
];

export default function Etapa6({
  characterData = {},
  updateCharacterData,
  antecedente,
  setAntecedente,
  antecedentesOptions = [],
  itensDaAntecedencia = [],
  idiomaDoAntecedente = "",
  setIdiomaAntecedente,
  idiomaDoAntecendente2 = "",
  setIdiomaAntecendente2,
  idiomaOption = [],
}) {
  const rawList = Array.isArray(antecedentes) && antecedentes.length > 0 ? antecedentes : FALLBACK_ANTECEDENTES;

  const currentSelectionName = characterData.antecedente || antecedente || "Acólito";

  const normalize = (s) =>
    String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const currentAntecedente =
    rawList.find(
      (a) => normalize(a.nome || a.name) === normalize(currentSelectionName)
    ) ||
    FALLBACK_ANTECEDENTES.find(
      (a) => normalize(a.nome) === normalize(currentSelectionName)
    ) ||
    rawList[0] ||
    FALLBACK_ANTECEDENTES[0];

  const handleSelect = (nome) => {
    const item =
      rawList.find((a) => normalize(a.nome || a.name) === normalize(nome)) ||
      FALLBACK_ANTECEDENTES.find((a) => normalize(a.nome) === normalize(nome));

    const desc =
      item?.descricao ||
      item?.desc ||
      item?.CaracteristicaDoAntecedente?.caracteristicasSugeridas ||
      item?.CaracteristicaDoAntecedente?.CaracteristicaTexto1 ||
      "";

    if (updateCharacterData) {
      updateCharacterData({
        antecedente: nome,
        antecedenteDetalhes: desc,
      });
    }
    if (setAntecedente) {
      setAntecedente(nome);
    }
  };

  const handleRandom = () => {
    const randomIndex = Math.floor(Math.random() * rawList.length);
    const chosen = rawList[randomIndex];
    handleSelect(chosen.nome || chosen.name);
  };

  useEffect(() => {
    if (!characterData.antecedente && !antecedente) {
      handleSelect("Acólito");
    }
  }, []);

  const selectedName = currentAntecedente.nome || currentAntecedente.name || "Acólito";

  // Perícias formatadas
  const periciasTexto =
    currentAntecedente.pericias ||
    currentAntecedente.skills ||
    (Array.isArray(currentAntecedente.proficienciaPericia)
      ? currentAntecedente.proficienciaPericia.join(", ")
      : "Duas perícias da vocação");

  // Ferramentas formatadas
  const ferramentasTexto =
    currentAntecedente.ferramentas ||
    currentAntecedente.tools ||
    (Array.isArray(currentAntecedente.proficienciaFerramentasAntecedente)
      ? currentAntecedente.proficienciaFerramentasAntecedente.join(", ")
      : "Idiomas e kits temáticos");

  // Recurso formatado
  const recursoTexto =
    currentAntecedente.recurso ||
    (currentAntecedente.CaracteristicaDoAntecedente
      ? `${currentAntecedente.CaracteristicaDoAntecedente.LabelCaracteristicaTexto1 || "Característica"}: ${
          currentAntecedente.CaracteristicaDoAntecedente.CaracteristicaTexto1 || ""
        }`
      : null);

  const descTexto =
    currentAntecedente.descricao ||
    currentAntecedente.desc ||
    currentAntecedente.CaracteristicaDoAntecedente?.caracteristicasSugeridas ||
    "A vocação e a experiência que moldaram a vida do herói antes da jornada.";

  // Idiomas concedidos
  const precisaDoisIdiomas = ["Acólito", "Sábio"].includes(selectedName);
  const precisaUmIdioma = ["Artesão de Guilda", "Eremita", "Forasteiro", "Nobre"].includes(selectedName);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>ANTECEDENTE & ORIGEM</h2>
        <p className={styles.subtitle}>
          "A vida que você levava antes de atender ao chamado das lendas e do perigo."
        </p>
        <div className={styles.divider} />
      </header>

      {/* Seletor com Botão de Aleatório */}
      <div className={styles.inputGroup}>
        <div className={styles.labelRow}>
          <label className={styles.label} htmlFor="antecedente-select">
            Antecedente do Personagem
          </label>
          <button
            type="button"
            className={styles.btnRandom}
            onClick={handleRandom}
            title="Sortear um antecedente"
          >
            <CasinoOutlinedIcon sx={{ fontSize: "0.95rem" }} />
            <span>Aleatório</span>
          </button>
        </div>

        <div className={styles.selectWrapper}>
          <select
            id="antecedente-select"
            className={styles.styledSelect}
            value={selectedName}
            onChange={(e) => handleSelect(e.target.value)}
          >
            {rawList.map((a, idx) => {
              const name = a.nome || a.name;
              return (
                <option key={idx} value={name}>
                  {name}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Cartão Informativo do Antecedente */}
      <motion.div
        key={selectedName}
        className={styles.detailCard}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <p className={styles.descText}>{descTexto}</p>

        <div className={styles.benefitsGrid}>
          <div className={styles.benefitItem}>
            <span className={styles.benefitIcon} title="Perícias">
              <TrackChangesIcon sx={{ fontSize: "1.2rem" }} />
            </span>
            <div>
              <small>Perícias Concedidas</small>
              <strong>{periciasTexto}</strong>
            </div>
          </div>

          <div className={styles.benefitItem}>
            <span className={styles.benefitIcon} title="Ferramentas">
              <HandymanOutlinedIcon sx={{ fontSize: "1.2rem" }} />
            </span>
            <div>
              <small>Ferramentas / Idiomas</small>
              <strong>{ferramentasTexto}</strong>
            </div>
          </div>
        </div>

        {recursoTexto && (
          <div className={styles.featureBox}>
            <strong>✦ Recurso Especial:</strong>
            <p>{recursoTexto}</p>
          </div>
        )}

        {/* Seleção de Idiomas Concedidos quando aplicável */}
        {(precisaDoisIdiomas || precisaUmIdioma) && idiomaOption.length > 0 && (
          <div className={styles.languagesBox}>
            <span className={styles.languagesTitle}>
              <TranslateIcon sx={{ fontSize: "1rem", color: "#58180d" }} />
              <span>Idiomas Adicionais da Origem</span>
            </span>

            <div className={styles.languagesGrid}>
              <div className={styles.languageSelectRow}>
                <label>Idioma 1</label>
                <select
                  className={styles.styledSelectSmall}
                  value={idiomaDoAntecedente}
                  onChange={(e) => setIdiomaAntecedente?.(e.target.value)}
                >
                  <option value="">Escolher idioma...</option>
                  {idiomaOption.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
              </div>

              {precisaDoisIdiomas && (
                <div className={styles.languageSelectRow}>
                  <label>Idioma 2</label>
                  <select
                    className={styles.styledSelectSmall}
                    value={idiomaDoAntecendente2}
                    onChange={(e) => setIdiomaAntecendente2?.(e.target.value)}
                  >
                    <option value="">Escolher idioma...</option>
                    {idiomaOption.map((op) => (
                      <option key={op} value={op}>
                        {op}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
