import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SUBRACES_DATA, getSubracesByRace } from "../../../Array/SubracesDetailedData";
import styles from "./Etapa3.module.css";

// Ícones profissionais (substituindo todos os emojis)
import BoltIcon from "@mui/icons-material/Bolt";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import MilitaryTechOutlinedIcon from "@mui/icons-material/MilitaryTechOutlined";
import LanguageIcon from "@mui/icons-material/Language";
import BuildCircleOutlinedIcon from "@mui/icons-material/BuildCircleOutlined";
import FlareIcon from "@mui/icons-material/Flare";

const normalizeStr = (str) =>
  String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export default function Etapa3({
  characterData = {},
  updateCharacterData,
  // Props para compatibilidade com FichaPage
  raca,
  racaId,
  SubRaca,
  setSubRaca,
  handleSubRacaChange,
  detalhesSubRaca,
  idiomaOption = [],
  setIdiomaAltoElfoSelecioando,
  IdiomaAltoElfo,
  Engenhocas,
  setEngenhocas,
}) {
  // 1. Identifica a raça atual selecionada na Etapa 2
  const currentRaceNameOrId =
    characterData.racaId || characterData.raca || racaId || raca || "anao";
  const availableSubraces = getSubracesByRace(currentRaceNameOrId);

  const subRacaProp = characterData.subRacaId || characterData.subRaca || SubRaca || "";

  // 2. Proteção Anti-Bug de Estado:
  // Se sub-raça for de outra raça ou inexistente, seleciona a primeira válida da raça
  const validInitialSubrace =
    availableSubraces.find(
      (sub) =>
        sub.id === subRacaProp ||
        normalizeStr(sub.name) === normalizeStr(subRacaProp)
    ) || availableSubraces[0] || SUBRACES_DATA.anao_colina;

  const [selectedSubId, setSelectedSubId] = useState(validInitialSubrace.id);
  const [activeTab, setActiveTab] = useState("tracos"); // 'tracos' | 'lore' | 'proficiencias'

  // Mantém a sub-raça atual renderizada
  const currentSubrace =
    availableSubraces.find((sub) => sub.id === selectedSubId) ||
    availableSubraces[0] ||
    SUBRACES_DATA.anao_colina;

  // Dispara atualização segura quando o usuário troca no select
  const handleSelectSubrace = (subId) => {
    const sub = availableSubraces.find((s) => s.id === subId);
    if (!sub) return;

    setSelectedSubId(subId);

    if (updateCharacterData) {
      updateCharacterData({
        subRaca: sub.name,
        subRacaId: sub.id,
        // Se a sub-raça conceder deslocamento maior (ex: Elfo da Floresta 10.5m), atualiza
        deslocamento: sub.quickStats?.speed || characterData.deslocamento,
      });
    }

    if (handleSubRacaChange) {
      handleSubRacaChange(sub.name);
    } else if (setSubRaca) {
      setSubRaca(sub.name);
    }
  };

  // Garante sincronização se o usuário trocou de raça na Etapa 2 e entrou na Etapa 3
  useEffect(() => {
    const isCurrentValid = availableSubraces.some(
      (sub) => sub.id === selectedSubId
    );

    if (!isCurrentValid && availableSubraces.length > 0) {
      handleSelectSubrace(availableSubraces[0].id);
    } else if ((updateCharacterData || handleSubRacaChange || setSubRaca) && !subRacaProp) {
      handleSelectSubrace(validInitialSubrace.id);
    }
  }, [currentRaceNameOrId]);

  return (
    <div className={styles.container}>
      <header className={styles.headerTitle}>
        <h2>SELECIONE UMA SUB-RAÇA</h2>
        <p className={styles.parentRaceNotice}>
          Linhagens e especializações da raça:{" "}
          <strong>{characterData.raca || raca || "Selecionada"}</strong>
        </p>
        <div className={styles.headerDivider} />
      </header>

      {/* Input de Seleção Blindado */}
      <div className={styles.selectContainer}>
        <label className={styles.selectLabel} htmlFor="subrace-select">
          Sub-Raça / Linhagem Escolhida
        </label>
        <div className={styles.selectBox}>
          <select
            id="subrace-select"
            className={styles.styledSelect}
            value={currentSubrace.id}
            onChange={(e) => handleSelectSubrace(e.target.value)}
          >
            {availableSubraces.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Banner Rápido com Imagem e Pílulas */}
      <motion.div
        key={`subrace-hero-${currentSubrace.id}`}
        className={styles.subraceHeroBanner}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
      >
        <div className={styles.portraitWrapper}>
          <img
            src={currentSubrace.image}
            alt={currentSubrace.name}
            className={styles.subracePortrait}
          />
          <div className={styles.portraitOverlay} />
        </div>

        <div className={styles.heroSummary}>
          <div className={styles.heroNameRow}>
            <h3>{currentSubrace.name}</h3>
            <span className={styles.badgePill}>
              {availableSubraces.length > 1 ? "Especialização" : "Linhagem Única"}
            </span>
          </div>

          <p className={styles.heroQuote}>"{currentSubrace.quote}"</p>

          {/* Grade de Pílulas de Bônus da Sub-Raça com Ícones Profissionais */}
          <div className={styles.pillsGrid}>
            <div className={styles.statPill}>
              <span className={styles.pillIcon} title="Bônus de Atributo">
                <BoltIcon />
              </span>
              <div>
                <small>Bônus Atributo</small>
                <strong>{currentSubrace.quickStats.abilityBonus}</strong>
              </div>
            </div>

            <div className={styles.statPill}>
              <span className={styles.pillIcon} title="Deslocamento">
                <DirectionsRunIcon />
              </span>
              <div>
                <small>Deslocamento</small>
                <strong>{currentSubrace.quickStats.speed}</strong>
              </div>
            </div>

            {currentSubrace.quickStats.hpBonus && (
              <div className={styles.statPill}>
                <span className={styles.pillIcon} title="Pontos de Vida">
                  <FavoriteIcon />
                </span>
                <div>
                  <small>Pontos de Vida</small>
                  <strong>{currentSubrace.quickStats.hpBonus}</strong>
                </div>
              </div>
            )}

            {currentSubrace.quickStats.armorProf && (
              <div className={styles.statPill}>
                <span className={styles.pillIcon} title="Proficiência com Armaduras">
                  <ShieldOutlinedIcon />
                </span>
                <div>
                  <small>Armaduras</small>
                  <strong>{currentSubrace.quickStats.armorProf}</strong>
                </div>
              </div>
            )}

            {currentSubrace.quickStats.extraSpell && (
              <div className={styles.statPill}>
                <span className={styles.pillIcon} title="Magia Inata">
                  <AutoFixHighIcon />
                </span>
                <div>
                  <small>Magia</small>
                  <strong>{currentSubrace.quickStats.extraSpell}</strong>
                </div>
              </div>
            )}

            {currentSubrace.quickStats.stealth && (
              <div className={styles.statPill}>
                <span className={styles.pillIcon} title="Furtividade">
                  <VisibilityOffIcon />
                </span>
                <div>
                  <small>Furtividade</small>
                  <strong>{currentSubrace.quickStats.stealth}</strong>
                </div>
              </div>
            )}

            {currentSubrace.quickStats.darkvision && (
              <div className={styles.statPill}>
                <span className={styles.pillIcon} title="Visão no Escuro">
                  <VisibilityIcon />
                </span>
                <div>
                  <small>Visão Escuro</small>
                  <strong>{currentSubrace.quickStats.darkvision}</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Abas Temáticas de Detalhamento com Ícones Profissionais */}
      <nav className={styles.tabsNav}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "tracos" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("tracos")}
        >
          <ShieldOutlinedIcon className={styles.tabIcon} />
          <span>Traços da Sub-Raça</span>
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "lore" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("lore")}
        >
          <AutoStoriesOutlinedIcon className={styles.tabIcon} />
          <span>Origem & Sociedade</span>
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "proficiencias" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("proficiencias")}
        >
          <MilitaryTechOutlinedIcon className={styles.tabIcon} />
          <span>Armas & Habilidades</span>
        </button>
      </nav>

      {/* Painel com Efeito de Pergaminho */}
      <div className={styles.tabContentPanel}>
        <AnimatePresence mode="wait">
          {activeTab === "tracos" && (
            <motion.div
              key="sub-tracos"
              className={styles.traitsList}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.18 }}
            >
              {currentSubrace.traits.map((trait, index) => (
                <div key={index} className={styles.traitCard}>
                  <h4>
                    <FlareIcon className={styles.traitBullet} />
                    {trait.name}
                  </h4>
                  <p>{trait.desc}</p>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "lore" && (
            <motion.div
              key="sub-lore"
              className={styles.loreContainer}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.18 }}
            >
              <div className={styles.loreBlock}>
                <strong>Origem & Linhagens Famosas:</strong>
                <p>{currentSubrace.lore.origin}</p>
              </div>

              <div className={styles.loreBlock}>
                <strong>Comportamento & Cultura:</strong>
                <p>{currentSubrace.lore.culture}</p>
              </div>
            </motion.div>
          )}

          {activeTab === "proficiencias" && (
            <motion.div
              key="sub-prof"
              className={styles.profContainer}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.18 }}
            >
              <div className={styles.profRow}>
                <span className={styles.profLabel}>Armas Inatas:</span>
                <p>{currentSubrace.proficiencies.weapons}</p>
              </div>

              <div className={styles.profRow}>
                <span className={styles.profLabel}>Armaduras:</span>
                <p>{currentSubrace.proficiencies.armors}</p>
              </div>

              <div className={styles.profRow}>
                <span className={styles.profLabel}>Magias / Características Inatas:</span>
                <p>{currentSubrace.proficiencies.spells}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Opções Adicionais Condicionais da Sub-Raça */}
      {currentSubrace.id === "alto_elfo" &&
        idiomaOption &&
        idiomaOption.length > 0 && (
          <div className={styles.extraOptionsBox}>
            <span className={styles.extraOptionsTitle}>
              <LanguageIcon sx={{ fontSize: "1.1rem", color: "#8c6a46" }} />
              <span>Idioma Adicional do Alto Elfo</span>
            </span>
            <div className={styles.selectBox}>
              <select
                className={styles.styledSelectSmall}
                value={IdiomaAltoElfo || ""}
                onChange={(e) =>
                  setIdiomaAltoElfoSelecioando &&
                  setIdiomaAltoElfoSelecioando(e.target.value)
                }
              >
                <option value="">Selecione um idioma adicional</option>
                {idiomaOption.map((idioma) => (
                  <option key={idioma} value={idioma}>
                    {idioma}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

      {currentSubrace.id === "gnomo_rochas" &&
        setEngenhocas &&
        detalhesSubRaca?.Engenhoca &&
        Array.isArray(detalhesSubRaca.Engenhoca) && (
          <div className={styles.extraOptionsBox}>
            <span className={styles.extraOptionsTitle}>
              <BuildCircleOutlinedIcon sx={{ fontSize: "1.1rem", color: "#8c6a46" }} />
              <span>Engenhocas do Gnomo das Rochas</span>
            </span>
            <div className={styles.selectBox}>
              <select
                className={styles.styledSelectSmall}
                value={Engenhocas || ""}
                onChange={(e) => setEngenhocas(e.target.value)}
              >
                <option value="">Selecione uma engenhoca</option>
                {detalhesSubRaca.Engenhoca.map((eng, idx) => (
                  <option key={idx} value={eng}>
                    {eng}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
    </div>
  );
}
