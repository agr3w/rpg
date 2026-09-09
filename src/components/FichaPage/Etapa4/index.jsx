import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CLASSES_DATA } from "../../../Array/ClassesDetailedData";
import { armas } from "../../../Array/Armas";
import HabilidadeDetalheModal from "./HabilidadeDetalheModal";
import styles from "./Etapa4.module.css";

// Ícones profissionais (substituindo todos os emojis)
import CasinoOutlinedIcon from "@mui/icons-material/CasinoOutlined";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import BackpackOutlinedIcon from "@mui/icons-material/BackpackOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

const normalizeStr = (str) =>
  String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

function WeaponSubSelector({ filtros, slotKey, subSelecaoArmas = {}, setSubSelecaoArmas }) {
  if (!filtros || !setSubSelecaoArmas) return null;

  const opcoesFiltradas = armas.filter((arma) => {
    if (filtros.tipo && arma.tipo !== filtros.tipo) return false;
    if (filtros.alcance && arma.alcance !== filtros.alcance) return false;
    return true;
  });

  if (opcoesFiltradas.length === 0) return null;

  const quantidade = filtros.quantidade || 1;
  const isDuas = quantidade > 1;

  const keyA = isDuas ? `${slotKey}_a` : slotKey;
  const keyB = `${slotKey}_b`;

  const valA = subSelecaoArmas[keyA] || opcoesFiltradas[0]?.nome || "";
  const valB = subSelecaoArmas[keyB] || (opcoesFiltradas[1]?.nome || opcoesFiltradas[0]?.nome || "");

  const handleChange = (key, value) => {
    setSubSelecaoArmas((prev) => ({ ...(prev || {}), [key]: value }));
  };

  return (
    <div className={styles.weaponSubBox}>
      <span className={styles.weaponSubTitle}>
        Especifique {isDuas ? "as duas armas" : "a arma"} desejada(s):
      </span>
      <div className={`${styles.weaponSubGrid} ${isDuas ? styles.weaponSubGridTwo : ""}`}>
        <div className={styles.weaponSubItem}>
          <small>{isDuas ? "Arma 1" : "Arma Escolhida"}</small>
          <select
            className={styles.styledSelectSmall}
            value={valA}
            onChange={(e) => handleChange(keyA, e.target.value)}
          >
            {opcoesFiltradas.map((arma) => (
              <option key={arma.nome} value={arma.nome}>
                {arma.nome} ({arma.dano})
              </option>
            ))}
          </select>
        </div>

        {isDuas && (
          <div className={styles.weaponSubItem}>
            <small>Arma 2</small>
            <select
              className={styles.styledSelectSmall}
              value={valB}
              onChange={(e) => handleChange(keyB, e.target.value)}
            >
              {opcoesFiltradas.map((arma) => (
                <option key={arma.nome} value={arma.nome}>
                  {arma.nome} ({arma.dano})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Etapa4({
  characterData = {},
  updateCharacterData,
  // Props para compatibilidade com FichaPage
  classe,
  setClasse,
  classesOptions = [],
  classeSelecioanda,
  periciasClasseSelecionadas = [],
  setPericiasSelecionadas,
  equipamentosClasseSelecionada1 = "",
  setEquipamentoClasseSelecionado1,
  equipamentosClasseSelecionada2 = "",
  setEquipamentoClasseSelecionado2,
  equipamentosClasseSelecionada3 = "",
  setEquipamentoClasseSelecionado3,
  equipamentosClasseSelecionada4 = "",
  setEquipamentoClasseSelecionado4,
  subSelecaoArmas = {},
  setSubSelecaoArmas,
}) {
  const currentClassProp = characterData.classeId || characterData.classe || classe || "";

  // Sincronização segura e proteção contra seletor em branco
  const initialClassKey =
    Object.keys(CLASSES_DATA).find((key) => {
      const cls = CLASSES_DATA[key];
      return (
        key === currentClassProp ||
        normalizeStr(key) === normalizeStr(currentClassProp) ||
        normalizeStr(cls.name) === normalizeStr(currentClassProp) ||
        normalizeStr(currentClassProp).startsWith(normalizeStr(key))
      );
    }) || "guerreiro";

  const [selectedKey, setSelectedKey] = useState(initialClassKey);
  const [activeTab, setActiveTab] = useState("habilidades"); // 'habilidades' | 'proficiencias' | 'equipamento'
  const [activeModalFeature, setActiveModalFeature] = useState(null);

  const currentClass = CLASSES_DATA[selectedKey] || CLASSES_DATA.guerreiro;

  const handleSelectClass = (key) => {
    const cls = CLASSES_DATA[key];
    if (!cls) return;

    setSelectedKey(key);

    if (updateCharacterData) {
      updateCharacterData({
        classe: cls.name,
        classeId: cls.id,
        dadoVida: cls.quickStats.hitDie.split(" ")[0],
        subClasse: "",
        equipamentoInicial: cls.equipmentText,
        proficienciasClasse: cls.proficiencies,
      });
    }

    if (setClasse) {
      setClasse(cls.name);
    }
  };

  useEffect(() => {
    if (!characterData.classe && !classe) {
      handleSelectClass("guerreiro");
    }
  }, []);

  // Auto-seleciona opções padrão de equipamentos ao trocar ou carregar a classe
  useEffect(() => {
    const eq = classeSelecioanda?.equipamentos;
    if (!eq) return;

    // Slot 1
    const opts1 = eq.equipamentoAlpha1 || [];
    if (opts1.length > 0 && (!equipamentosClasseSelecionada1 || !opts1.some((o) => o.label === equipamentosClasseSelecionada1))) {
      setEquipamentoClasseSelecionado1?.(opts1[0].label);
      if (opts1[0].subSelecao) {
        initSubSelecao("slot1", opts1[0].subSelecao);
      }
    }

    // Slot 2
    const opts2 = eq.equipamentoAlpha2 || [];
    if (opts2.length > 0 && (!equipamentosClasseSelecionada2 || !opts2.some((o) => o.label === equipamentosClasseSelecionada2))) {
      setEquipamentoClasseSelecionado2?.(opts2[0].label);
      if (opts2[0].subSelecao) {
        initSubSelecao("slot2", opts2[0].subSelecao);
      }
    }

    // Slot 3
    const opts3 = eq.equipamentoAlpha3 || [];
    if (opts3.length > 0 && (!equipamentosClasseSelecionada3 || !opts3.some((o) => o.label === equipamentosClasseSelecionada3))) {
      setEquipamentoClasseSelecionado3?.(opts3[0].label);
      if (opts3[0].subSelecao) {
        initSubSelecao("slot3", opts3[0].subSelecao);
      }
    }

    // Slot 4
    const opts4 = eq.equipamentoAlpha4 || [];
    if (opts4.length > 0 && (!equipamentosClasseSelecionada4 || !opts4.some((o) => o.label === equipamentosClasseSelecionada4))) {
      setEquipamentoClasseSelecionado4?.(opts4[0].label);
      if (opts4[0].subSelecao) {
        initSubSelecao("slot4", opts4[0].subSelecao);
      }
    }
  }, [classeSelecioanda]);

  const initSubSelecao = (slotKey, filtros) => {
    if (!setSubSelecaoArmas || !filtros) return;
    const opcoes = armas.filter((arma) => {
      if (filtros.tipo && arma.tipo !== filtros.tipo) return false;
      if (filtros.alcance && arma.alcance !== filtros.alcance) return false;
      return true;
    });
    if (opcoes.length === 0) return;

    const isDuas = (filtros.quantidade || 1) > 1;
    if (isDuas) {
      setSubSelecaoArmas((prev) => ({
        ...(prev || {}),
        [`${slotKey}_a`]: opcoes[0]?.nome || "",
        [`${slotKey}_b`]: opcoes[1]?.nome || opcoes[0]?.nome || "",
      }));
    } else {
      setSubSelecaoArmas((prev) => ({
        ...(prev || {}),
        [slotKey]: opcoes[0]?.nome || "",
      }));
    }
  };

  // Manipulador de seleção de perícias
  const handleTogglePericia = (pericia) => {
    if (!setPericiasSelecionadas) return;

    if (periciasClasseSelecionadas.includes(pericia)) {
      setPericiasSelecionadas(periciasClasseSelecionadas.filter((p) => p !== pericia));
    } else {
      const limite = classeSelecioanda?.proficiencias?.perficiasMinimo || 2;
      if (periciasClasseSelecionadas.length < limite) {
        setPericiasSelecionadas([...periciasClasseSelecionadas, pericia]);
      }
    }
  };

  const equipSlots = [
    {
      slotKey: "slot1",
      label: "Escolha de Equipamento 1",
      value: equipamentosClasseSelecionada1,
      setter: setEquipamentoClasseSelecionado1,
      options: classeSelecioanda?.equipamentos?.equipamentoAlpha1 || [],
    },
    {
      slotKey: "slot2",
      label: "Escolha de Equipamento 2",
      value: equipamentosClasseSelecionada2,
      setter: setEquipamentoClasseSelecionado2,
      options: classeSelecioanda?.equipamentos?.equipamentoAlpha2 || [],
    },
    {
      slotKey: "slot3",
      label: "Escolha de Equipamento 3",
      value: equipamentosClasseSelecionada3,
      setter: setEquipamentoClasseSelecionado3,
      options: classeSelecioanda?.equipamentos?.equipamentoAlpha3 || [],
    },
    {
      slotKey: "slot4",
      label: "Escolha de Equipamento 4",
      value: equipamentosClasseSelecionada4,
      setter: setEquipamentoClasseSelecionado4,
      options: classeSelecioanda?.equipamentos?.equipamentoAlpha4 || [],
    },
  ].filter((slot) => slot.options.length > 0);

  const obrigatItems = classeSelecioanda?.equipamentos?.equipamentoObgt || [];

  return (
    <div className={styles.pageWrapper}>
      {/* Imagem de Fundo Dinâmica da Classe com Vinheta */}
      <div
        className={styles.dynamicBackground}
        style={{ backgroundImage: `url(${currentClass.bgImage})` }}
      >
        <div className={styles.bgVignetteOverlay} />
      </div>

      {/* Cartão de Pergaminho Central */}
      <div className={styles.parchmentContainer}>
        <header className={styles.headerTitle}>
          <h2>SELECIONE SUA CLASSE</h2>
          <div className={styles.headerDivider} />
        </header>

        {/* Input de Seleção Blindado */}
        <div className={styles.selectContainer}>
          <label className={styles.selectLabel} htmlFor="class-select">
            Classe Heroica
          </label>
          <div className={styles.selectBox}>
            <select
              id="class-select"
              className={styles.styledSelect}
              value={currentClass.id}
              onChange={(e) => handleSelectClass(e.target.value)}
            >
              {Object.values(CLASSES_DATA).map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Resumo do Topo com Imagem e Estatísticas Rápidas */}
        <motion.div
          key={`class-hero-${currentClass.id}`}
          className={styles.classHeroBanner}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className={styles.portraitWrapper}>
            <img
              src={currentClass.portrait}
              alt={currentClass.name}
              className={styles.classPortrait}
            />
            <div className={styles.portraitOverlay} />
          </div>

          <div className={styles.heroSummary}>
            <div className={styles.heroNameRow}>
              <h3>{currentClass.name}</h3>
              <span className={styles.hitDieBadge}>{currentClass.quickStats.hitDie}</span>
            </div>

            <p className={styles.heroQuote}>"{currentClass.quote}"</p>

            {/* Pílulas de Estatísticas Rápidas com Ícones Profissionais */}
            <div className={styles.pillsGrid}>
              <div className={styles.statPill}>
                <span className={styles.pillIcon} title="Dado de Vida">
                  <CasinoOutlinedIcon />
                </span>
                <div>
                  <small>Dado de Vida</small>
                  <strong>{currentClass.quickStats.hitDie.split(" ")[0]}</strong>
                </div>
              </div>

              <div className={styles.statPill}>
                <span className={styles.pillIcon} title="Atributo Primário">
                  <FitnessCenterIcon />
                </span>
                <div>
                  <small>Atributo Primário</small>
                  <strong>{currentClass.quickStats.primaryStat}</strong>
                </div>
              </div>

              <div className={styles.statPill}>
                <span className={styles.pillIcon} title="Salvaguardas">
                  <ShieldOutlinedIcon />
                </span>
                <div>
                  <small>Salvaguardas</small>
                  <strong>{currentClass.quickStats.savingThrows}</strong>
                </div>
              </div>

              <div className={styles.statPill}>
                <span className={styles.pillIcon} title="Magia">
                  <AutoFixHighIcon />
                </span>
                <div>
                  <small>Magia</small>
                  <strong>{currentClass.quickStats.spellcasting}</strong>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navegação por Abas com Ícones Profissionais */}
        <nav className={styles.tabsNav}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "habilidades" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("habilidades")}
          >
            <AutoStoriesOutlinedIcon className={styles.tabIcon} />
            <span>Progressão de Nível</span>
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "proficiencias" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("proficiencias")}
          >
            <ShieldOutlinedIcon className={styles.tabIcon} />
            <span>Armaduras & Perícias</span>
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "equipamento" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("equipamento")}
          >
            <BackpackOutlinedIcon className={styles.tabIcon} />
            <span>Equipamento Inicial</span>
          </button>
        </nav>

        {/* Painel de Conteúdo */}
        <div className={styles.tabContentPanel}>
          <AnimatePresence mode="wait">
            {activeTab === "habilidades" && (
              <motion.div
                key="class-features"
                className={styles.featuresTimeline}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.18 }}
              >
                <div className={styles.timelineHeaderHint}>
                  <small>Clique em qualquer poder para inspecionar os efeitos completos.</small>
                </div>

                {currentClass.features.map((feat, index) => (
                  <div key={index} className={styles.featureRowCard}>
                    <div className={styles.levelTag}>Nv. {feat.level}</div>
                    <div className={styles.featureRowInfo}>
                      <div className={styles.featureRowTitle}>
                        <h4>{feat.name}</h4>
                        <span className={styles.featureActionType}>{feat.actionType}</span>
                      </div>
                      <p>{feat.summary}</p>
                    </div>
                    <button
                      type="button"
                      className={styles.btnInspect}
                      onClick={() => setActiveModalFeature(feat)}
                    >
                      <span>Ler Detalhes</span>
                      <VisibilityIcon className={styles.inspectIcon} />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "proficiencias" && (
              <motion.div
                key="class-profs"
                className={styles.profsContainer}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.18 }}
              >
                <div className={styles.profRow}>
                  <strong>Armaduras:</strong>
                  <p>{currentClass.proficiencies.armors}</p>
                </div>
                <div className={styles.profRow}>
                  <strong>Armas:</strong>
                  <p>{currentClass.proficiencies.weapons}</p>
                </div>
                <div className={styles.profRow}>
                  <strong>Salvaguardas:</strong>
                  <p>{currentClass.proficiencies.savingThrows}</p>
                </div>
                <div className={styles.profRow}>
                  <strong>Opções de Perícias:</strong>
                  <p>{currentClass.proficiencies.skills}</p>
                </div>

                {/* Seleção Interativa de Perícias da Classe se disponível */}
                {classeSelecioanda?.proficiencias?.periciasSelecao &&
                  Array.isArray(classeSelecioanda.proficiencias.periciasSelecao) && (
                    <div className={styles.skillsSection}>
                      <span className={styles.skillsTitle}>
                        Selecione as Perícias do Personagem (Escolha{" "}
                        {classeSelecioanda?.proficiencias?.perficiasMinimo || 2}):
                      </span>
                      <div className={styles.skillsGrid}>
                        {classeSelecioanda.proficiencias.periciasSelecao.map((pericia) => (
                          <label key={pericia} className={styles.skillCheckboxLabel}>
                            <input
                              type="checkbox"
                              checked={periciasClasseSelecionadas.includes(pericia)}
                              onChange={() => handleTogglePericia(pericia)}
                              disabled={
                                periciasClasseSelecionadas.length >=
                                  (classeSelecioanda?.proficiencias?.perficiasMinimo || 2) &&
                                !periciasClasseSelecionadas.includes(pericia)
                              }
                            />
                            <span>{pericia}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
              </motion.div>
            )}

            {activeTab === "equipamento" && (
              <motion.div
                key="class-equip"
                className={styles.equipContainer}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.18 }}
              >
                {/* Equipamento Obrigatório da Classe */}
                {obrigatItems.length > 0 && (
                  <div className={styles.equipObgtBox}>
                    <span className={styles.equipObgtHeader}>
                      <Inventory2OutlinedIcon sx={{ fontSize: "1rem", color: "#58180d" }} />
                      <span>Equipamento Obrigatório Concedido:</span>
                    </span>
                    <div className={styles.equipObgtList}>
                      {obrigatItems.map((obgt, idx) => (
                        <span key={idx} className={styles.equipObgtBadge}>
                          {obgt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Opções Selecionáveis de Equipamento */}
                <div className={styles.equipChoicesContainer}>
                  {equipSlots.map((slot) => {
                    const selectedOpt = slot.options.find((o) => o.label === slot.value) || slot.options[0];

                    return (
                      <div key={slot.slotKey} className={styles.equipSlotCard}>
                        <label className={styles.equipSlotLabel}>{slot.label}</label>
                        <select
                          className={styles.styledSelectSmall}
                          value={slot.value || (slot.options[0]?.label || "")}
                          onChange={(e) => {
                            const val = e.target.value;
                            slot.setter?.(val);
                            const opt = slot.options.find((o) => o.label === val);
                            if (opt?.subSelecao) {
                              initSubSelecao(slot.slotKey, opt.subSelecao);
                            } else if (setSubSelecaoArmas) {
                              setSubSelecaoArmas((prev) => {
                                const next = { ...(prev || {}) };
                                delete next[slot.slotKey];
                                delete next[`${slot.slotKey}_a`];
                                delete next[`${slot.slotKey}_b`];
                                return next;
                              });
                            }
                          }}
                        >
                          {slot.options.map((opt, i) => (
                            <option key={i} value={opt.label}>
                              {opt.label}
                            </option>
                          ))}
                        </select>

                        {/* Seletor Específico de Armas / Sub-seleção */}
                        {selectedOpt?.subSelecao && (
                          <WeaponSubSelector
                            filtros={selectedOpt.subSelecao}
                            slotKey={slot.slotKey}
                            subSelecaoArmas={subSelecaoArmas}
                            setSubSelecaoArmas={setSubSelecaoArmas}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal Interativo de Detalhes da Habilidade */}
      <AnimatePresence>
        {activeModalFeature && (
          <HabilidadeDetalheModal
            feature={activeModalFeature}
            className={currentClass.name}
            onClose={() => setActiveModalFeature(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
