import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CasinoOutlinedIcon from "@mui/icons-material/CasinoOutlined";
import BoltIcon from "@mui/icons-material/Bolt";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SpeedIcon from "@mui/icons-material/Speed";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import styles from "./Etapa10.module.css";

const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

const ATTRIBUTES_KEYS = [
  { key: "forca", label: "Força", abbr: "FOR", iconComponent: FitnessCenterIcon, desc: "Poder muscular e ataque marcial" },
  { key: "destreza", label: "Destreza", abbr: "DES", iconComponent: SpeedIcon, desc: "Agilidade, reflexos e esquiva" },
  { key: "constituicao", label: "Constituição", abbr: "CON", iconComponent: ShieldOutlinedIcon, desc: "Vigor físico e pontos de vida" },
  { key: "inteligencia", label: "Inteligência", abbr: "INT", iconComponent: PsychologyOutlinedIcon, desc: "Raciocínio, estudo e arcanismo" },
  { key: "sabedoria", label: "Sabedoria", abbr: "SAB", iconComponent: VisibilityIcon, desc: "Percepção, intuição e espírito" },
  { key: "carisma", label: "Carisma", abbr: "CAR", iconComponent: WorkspacePremiumIcon, desc: "Liderança, persuasão e presença" }
];

// Sugestão de prioridade conforme a classe do jogador
const CLASS_RECOMMENDED_PRIORITIES = {
  barbaro: ["forca", "constituicao", "destreza", "sabedoria", "carisma", "inteligencia"],
  bardo: ["carisma", "destreza", "constituicao", "sabedoria", "inteligencia", "forca"],
  bruxo: ["carisma", "constituicao", "destreza", "sabedoria", "inteligencia", "forca"],
  clerigo: ["sabedoria", "constituicao", "forca", "carisma", "destreza", "inteligencia"],
  druida: ["sabedoria", "constituicao", "destreza", "inteligencia", "carisma", "forca"],
  feiticeiro: ["carisma", "constituicao", "destreza", "sabedoria", "inteligencia", "forca"],
  guerreiro: ["forca", "constituicao", "destreza", "sabedoria", "inteligencia", "carisma"],
  ladino: ["destreza", "inteligencia", "constituicao", "carisma", "sabedoria", "forca"],
  mago: ["inteligencia", "constituicao", "destreza", "sabedoria", "carisma", "forca"],
  monge: ["destreza", "sabedoria", "constituicao", "forca", "carisma", "inteligencia"],
  paladino: ["forca", "carisma", "constituicao", "sabedoria", "destreza", "inteligencia"],
  patrulheiro: ["destreza", "sabedoria", "constituicao", "forca", "inteligencia", "carisma"]
};

// Cálculo de modificador oficial D&D 5e: floor((valor - 10) / 2)
function getModifier(val) {
  if (val === "" || val == null || isNaN(val)) return 0;
  return Math.floor((parseInt(val, 10) - 10) / 2);
}

function formatMod(mod) {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export default function Etapa10({
  characterData = {},
  updateCharacterData,
  racaSelecionada = {},
  valoresHabilidade = {},
  setValoresHabilidade,
  SubRaca,
  detalhesSubRaca = {},
}) {
  const [attributes, setAttributes] = useState({
    forca: characterData.forca || valoresHabilidade.Força || valoresHabilidade.forca || "",
    destreza: characterData.destreza || valoresHabilidade.Destreza || valoresHabilidade.destreza || "",
    constituicao: characterData.constituicao || valoresHabilidade.Constituição || valoresHabilidade.constituicao || "",
    inteligencia: characterData.inteligencia || valoresHabilidade.Inteligência || valoresHabilidade.inteligencia || "",
    sabedoria: characterData.sabedoria || valoresHabilidade.Sabedoria || valoresHabilidade.sabedoria || "",
    carisma: characterData.carisma || valoresHabilidade.Carisma || valoresHabilidade.carisma || ""
  });

  const bonusRaca = racaSelecionada?.proficienciaHabilidadeBonus || {};
  const bonusSub = detalhesSubRaca?.habilidadeBonusSubRaca || {};

  const getRacialBonus = (attrKey, attrLabel) => {
    const r = bonusRaca[attrLabel] || bonusRaca[attrKey] || 0;
    const s = bonusSub[attrLabel] || bonusSub[attrKey] || 0;
    return r + s;
  };

  const syncToParent = (newAttrs) => {
    if (setValoresHabilidade) {
      setValoresHabilidade({
        Força: newAttrs.forca,
        Destreza: newAttrs.destreza,
        Constituição: newAttrs.constituicao,
        Inteligência: newAttrs.inteligencia,
        Sabedoria: newAttrs.sabedoria,
        Carisma: newAttrs.carisma,
        forca: newAttrs.forca,
        destreza: newAttrs.destreza,
        constituicao: newAttrs.constituicao,
        inteligencia: newAttrs.inteligencia,
        sabedoria: newAttrs.sabedoria,
        carisma: newAttrs.carisma,
      });
    }

    if (updateCharacterData) {
      updateCharacterData({
        forca: newAttrs.forca,
        destreza: newAttrs.destreza,
        constituicao: newAttrs.constituicao,
        inteligencia: newAttrs.inteligencia,
        sabedoria: newAttrs.sabedoria,
        carisma: newAttrs.carisma,
        Força: newAttrs.forca,
        Destreza: newAttrs.destreza,
        Constituição: newAttrs.constituicao,
        Inteligência: newAttrs.inteligencia,
        Sabedoria: newAttrs.sabedoria,
        Carisma: newAttrs.carisma,
        modForca: getModifier(newAttrs.forca),
        modDestreza: getModifier(newAttrs.destreza),
        modConstituicao: getModifier(newAttrs.constituicao),
        modInteligencia: getModifier(newAttrs.inteligencia),
        modSabedoria: getModifier(newAttrs.sabedoria),
        modCarisma: getModifier(newAttrs.carisma),
      });
    }
  };

  const handleSelectValue = (key, value) => {
    const num = value === "" ? "" : parseInt(value, 10);
    const updated = { ...attributes, [key]: num };
    setAttributes(updated);
    syncToParent(updated);
  };

  // Valores já utilizados
  const usedValues = Object.values(attributes).filter((v) => v !== "" && !isNaN(v));
  const remainingValues = STANDARD_ARRAY.filter((val) => {
    const countTotal = STANDARD_ARRAY.filter((x) => x === val).length;
    const countUsed = usedValues.filter((x) => x === val).length;
    return countUsed < countTotal;
  });

  // 1. Sorteio Aleatório das Habilidades
  const handleRandomize = () => {
    const shuffled = [...STANDARD_ARRAY].sort(() => Math.random() - 0.5);
    const newAttrs = {
      forca: shuffled[0],
      destreza: shuffled[1],
      constituicao: shuffled[2],
      inteligencia: shuffled[3],
      sabedoria: shuffled[4],
      carisma: shuffled[5]
    };
    setAttributes(newAttrs);
    syncToParent(newAttrs);
  };

  // 2. Distribuição Recomendada para a Classe do Herói
  const handleRecommended = () => {
    const classId = (characterData.classeId || characterData.classe || "guerreiro").toLowerCase();
    const priorities = CLASS_RECOMMENDED_PRIORITIES[classId] || CLASS_RECOMMENDED_PRIORITIES.guerreiro;
    const sortedArray = [...STANDARD_ARRAY].sort((a, b) => b - a); // [15, 14, 13, 12, 10, 8]

    const newAttrs = {};
    priorities.forEach((attrKey, idx) => {
      newAttrs[attrKey] = sortedArray[idx];
    });

    setAttributes(newAttrs);
    syncToParent(newAttrs);
  };

  const handleClear = () => {
    const empty = { forca: "", destreza: "", constituicao: "", inteligencia: "", sabedoria: "", carisma: "" };
    setAttributes(empty);
    syncToParent(empty);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>ATRIBUTOS</h2>
        <p className={styles.subtitle}>
          "Defina suas capacidades físicas e mentais. (Standard Array: 15, 14, 13, 12, 10, 8)"
        </p>
        <div className={styles.divider} />
      </header>

      {/* Barra de Ações Rápidas: Aleatório, Recomendado e Limpar */}
      <div className={styles.actionsBar}>
        <div className={styles.btnGroup}>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={handleRandomize}
            title="Distribuir os valores de forma 100% aleatória"
          >
            <CasinoOutlinedIcon sx={{ fontSize: "1rem" }} />
            <span>Aleatório</span>
          </button>
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
            onClick={handleRecommended}
            title="Distribuir otimizado para sua classe"
          >
            <BoltIcon sx={{ fontSize: "1rem" }} />
            <span>Otimizar ({characterData.classe || "Classe"})</span>
          </button>
        </div>

        {usedValues.length > 0 && (
          <button type="button" className={styles.btnClear} onClick={handleClear}>
            Limpar
          </button>
        )}
      </div>

      {/* Pílula de Valores Disponíveis */}
      <div className={styles.remainingPill}>
        <small>Disponíveis para alocar:</small>
        <div className={styles.valuesPool}>
          {STANDARD_ARRAY.map((val, idx) => {
            const isUsed = !remainingValues.includes(val);
            return (
              <span
                key={idx}
                className={`${styles.poolVal} ${isUsed ? styles.poolValUsed : ""}`}
              >
                {val}
              </span>
            );
          })}
        </div>
      </div>

      {/* Grid de Cards dos 6 Atributos (Responsivo sem corte) */}
      <div className={styles.attributesGrid}>
        {ATTRIBUTES_KEYS.map((attr) => {
          const rawVal = attributes[attr.key];
          const hasVal = rawVal !== "" && !isNaN(rawVal);
          const racial = getRacialBonus(attr.key, attr.label);
          const finalVal = hasVal ? Number(rawVal) + racial : "";
          const mod = hasVal ? getModifier(finalVal) : 0;
          const IconComp = attr.iconComponent;

          return (
            <div key={attr.key} className={styles.attrCard}>
              <div className={styles.attrHeader}>
                <span className={styles.attrIcon}>
                  <IconComp sx={{ fontSize: "1.15rem" }} />
                </span>
                <span className={styles.attrTitle}>{attr.label}</span>
              </div>

              {/* Caixa Central com Modificador */}
              <div className={styles.modBox}>
                <span className={styles.modNumber}>{hasVal ? formatMod(mod) : "-"}</span>
                <small className={styles.modLabel}>MODIFICADOR</small>
              </div>

              <div className={styles.valIndicator}>
                VALOR: <strong>{hasVal ? finalVal : "—"}</strong>
                {hasVal && racial > 0 && (
                  <span className={styles.racialBadge}>(Base {rawVal} + {racial} Raça)</span>
                )}
              </div>

              {/* Select Corrigido: Texto Curto e Limpo sem corte */}
              <div className={styles.selectWrapper}>
                <select
                  className={styles.styledSelect}
                  value={rawVal}
                  onChange={(e) => handleSelectValue(attr.key, e.target.value)}
                >
                  <option value="">Escolher...</option>
                  {STANDARD_ARRAY.map((arrayVal, i) => {
                    const isTaken =
                      usedValues.includes(arrayVal) && arrayVal !== rawVal;
                    const modPreview = getModifier(arrayVal + racial);
                    return (
                      <option key={i} value={arrayVal} disabled={isTaken}>
                        {arrayVal} ({formatMod(modPreview)}) {isTaken ? "[Usado]" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
