import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RACES_DATA } from "../../../Array/RacesDetailedData";
import styles from "./Etapa2.module.css";

// Ícones profissionais (substituindo emojis)
import BoltIcon from "@mui/icons-material/Bolt";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import StraightenIcon from "@mui/icons-material/Straighten";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import LanguageIcon from "@mui/icons-material/Language";

const normalizeStr = (str) =>
  String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export default function Etapa2({
  characterData = {},
  updateCharacterData,
  raca,
  setRaca,
  setSubRaca,
  idiomaRacaSelecionado,
  setIdiomaRacaSelecionado,
  idiomaRacaSelecionado2,
  setIdiomaRacaSelecionado2,
  idiomaOption = [],
}) {
  const racaProp = characterData.racaId || characterData.raca || raca || "";

  // Inicialização segura do seletor para evitar tela em branco
  const initialRaceKey =
    Object.keys(RACES_DATA).find(
      (key) =>
        normalizeStr(key) === normalizeStr(racaProp) ||
        normalizeStr(RACES_DATA[key].name) === normalizeStr(racaProp)
    ) || "anao";

  const [selectedKey, setSelectedKey] = useState(initialRaceKey);
  const [activeTab, setActiveTab] = useState("tracos"); // 'tracos' | 'lore' | 'nomes'

  const currentRace = RACES_DATA[selectedKey] || RACES_DATA.anao;

  // Sincroniza a seleção com o estado global da ficha
  const handleSelectRace = (key) => {
    const race = RACES_DATA[key];
    if (!race) return;

    setSelectedKey(key);

    if (updateCharacterData) {
      updateCharacterData({
        raca: race.name,
        racaId: race.id,
        subRaca: "",
        deslocamento: race.quickStats.speed,
        tamanho: race.quickStats.size,
      });
    }

    if (setRaca) {
      setRaca(race.name);
    }

    if (setSubRaca) {
      setSubRaca("");
    }
  };

  // Garante sincronização se o componente for montado com dados existentes
  useEffect(() => {
    const currentVal = characterData.raca || raca;
    if (!currentVal) {
      handleSelectRace("anao");
    } else {
      const match = Object.keys(RACES_DATA).find(
        (key) =>
          normalizeStr(key) === normalizeStr(currentVal) ||
          normalizeStr(RACES_DATA[key].name) === normalizeStr(currentVal)
      );
      if (match && match !== selectedKey) {
        setSelectedKey(match);
      }
    }
  }, [characterData.raca, raca]);

  return (
    <div className={styles.container}>
      <header className={styles.headerTitle}>
        <h2>ESCOLHA SUA RAÇA</h2>
        <div className={styles.headerDivider} />
      </header>

      {/* Input de Seleção Blindado */}
      <div className={styles.selectContainer}>
        <label className={styles.selectLabel} htmlFor="race-select">
          Raça Selecionada
        </label>
        <div className={styles.selectBox}>
          <select
            id="race-select"
            className={styles.styledSelect}
            value={selectedKey}
            onChange={(e) => handleSelectRace(e.target.value)}
          >
            {Object.values(RACES_DATA).map((race) => (
              <option key={race.id} value={race.id}>
                {race.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cartão de Visualização Rápida no Topo */}
      <motion.div
        key={`banner-${currentRace.id}`}
        className={styles.raceHeroBanner}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.portraitWrapper}>
          <img
            src={currentRace.image}
            alt={currentRace.name}
            className={styles.racePortrait}
          />
          <div className={styles.portraitOverlay} />
        </div>

        <div className={styles.heroSummary}>
          <div className={styles.heroNameRow}>
            <h3>{currentRace.name}</h3>
            <span className={styles.subraceIndicator}>
              {currentRace.quickStats.subraces.length > 1
                ? `${currentRace.quickStats.subraces.length} Sub-raças disponíveis`
                : "Linhagem Direta"}
            </span>
          </div>

          <p className={styles.heroQuote}>"{currentRace.quote}"</p>

          {/* Pílulas de Estatísticas Rápidas com Ícones Reais */}
          <div className={styles.pillsGrid}>
            <div className={styles.statPill}>
              <BoltIcon className={styles.pillIcon} />
              <div>
                <small>Bônus</small>
                <strong>{currentRace.quickStats.abilityBonus}</strong>
              </div>
            </div>

            <div className={styles.statPill}>
              <DirectionsRunIcon className={styles.pillIcon} />
              <div>
                <small>Deslocamento</small>
                <strong>{currentRace.quickStats.speed}</strong>
              </div>
            </div>

            <div className={styles.statPill}>
              <StraightenIcon className={styles.pillIcon} />
              <div>
                <small>Porte</small>
                <strong>{currentRace.quickStats.size.split(" ")[0]}</strong>
              </div>
            </div>

            <div className={styles.statPill}>
              <VisibilityIcon className={styles.pillIcon} />
              <div>
                <small>Visão Escuro</small>
                <strong>{currentRace.quickStats.darkvision}</strong>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navegação de Abas Internas com Ícones */}
      <nav className={styles.tabsNav}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "tracos" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("tracos")}
        >
          <ShieldOutlinedIcon className={styles.tabIcon} />
          <span>Traços Raciais</span>
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "lore" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("lore")}
        >
          <AutoStoriesOutlinedIcon className={styles.tabIcon} />
          <span>Cultura & Costumes</span>
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "nomes" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("nomes")}
        >
          <BadgeOutlinedIcon className={styles.tabIcon} />
          <span>Sugestões de Nomes</span>
        </button>
      </nav>

      {/* Painel de Conteúdo com Transição */}
      <div className={styles.tabContentPanel}>
        <AnimatePresence mode="wait">
          {activeTab === "tracos" && (
            <motion.div
              key="tab-tracos"
              className={styles.traitsList}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              {currentRace.traits.map((trait, index) => (
                <div key={index} className={styles.traitCard}>
                  <h4>✦ {trait.name}</h4>
                  <p>{trait.desc}</p>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "lore" && (
            <motion.div
              key="tab-lore"
              className={styles.loreContainer}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.loreBlock}>
                <strong>Comportamento & Visão de Mundo:</strong>
                <p>{currentRace.lore.behavior}</p>
              </div>

              <div className={styles.loreBlock}>
                <strong>Aparência & Porte Físico:</strong>
                <p>{currentRace.lore.appearance}</p>
              </div>

              <div className={styles.loreBlock}>
                <strong>Sociedade & Organização:</strong>
                <p>{currentRace.lore.society}</p>
              </div>
            </motion.div>
          )}

          {activeTab === "nomes" && (
            <motion.div
              key="tab-nomes"
              className={styles.namesContainer}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.namesGroup}>
                <span className={styles.nameCategoryLabel}>Nomes Masculinos Comuns:</span>
                <div className={styles.nameChipsList}>
                  {currentRace.names.male.map((name, i) => (
                    <span key={i} className={styles.nameChip}>{name}</span>
                  ))}
                </div>
              </div>

              <div className={styles.namesGroup}>
                <span className={styles.nameCategoryLabel}>Nomes Femininos Comuns:</span>
                <div className={styles.nameChipsList}>
                  {currentRace.names.female.map((name, i) => (
                    <span key={i} className={styles.nameChip}>{name}</span>
                  ))}
                </div>
              </div>

              <div className={styles.namesGroup}>
                <span className={styles.nameCategoryLabel}>Sobrenomes & Clãs:</span>
                <div className={styles.nameChipsList}>
                  {currentRace.names.clans.map((clan, i) => (
                    <span key={i} className={`${styles.nameChip} ${styles.clanChip}`}>{clan}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Seleção de Idiomas Extras Condicionais (Humano / Meio-Elfo) */}
      {(currentRace.id === "humano" || currentRace.id === "meio-elfo") &&
        idiomaOption &&
        idiomaOption.length > 0 && (
          <div className={styles.extraLanguagesBox}>
            <span className={styles.extraLanguagesTitle}>
              <LanguageIcon sx={{ fontSize: "1.1rem", color: "#8c6a46" }} />
              <span>Idiomas Adicionais da Raça ({currentRace.name})</span>
            </span>
            <div className={styles.extraLanguagesGrid}>
              <div className={styles.selectBox}>
                <label className={styles.selectLabel}>Idioma Extra 1</label>
                <select
                  className={styles.styledSelectSmall}
                  value={idiomaRacaSelecionado || ""}
                  onChange={(e) =>
                    setIdiomaRacaSelecionado && setIdiomaRacaSelecionado(e.target.value)
                  }
                >
                  <option value="">Selecione um idioma</option>
                  {idiomaOption.map((idioma) => (
                    <option key={idioma} value={idioma}>
                      {idioma}
                    </option>
                  ))}
                </select>
              </div>

              {currentRace.id === "meio-elfo" && (
                <div className={styles.selectBox}>
                  <label className={styles.selectLabel}>Idioma Extra 2</label>
                  <select
                    className={styles.styledSelectSmall}
                    value={idiomaRacaSelecionado2 || ""}
                    onChange={(e) =>
                      setIdiomaRacaSelecionado2 && setIdiomaRacaSelecionado2(e.target.value)
                    }
                  >
                    <option value="">Selecione um idioma</option>
                    {idiomaOption.map((idioma) => (
                      <option key={idioma} value={idioma}>
                        {idioma}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
}
