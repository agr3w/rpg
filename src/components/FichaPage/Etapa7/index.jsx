import React, { useEffect, useMemo } from "react";
import LayoutFicha from "components/FichaLayout/LayoutFicha";
import CasinoOutlinedIcon from "@mui/icons-material/CasinoOutlined";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import StyleOutlinedIcon from "@mui/icons-material/StyleOutlined";
import styles from "./Etapa7.module.css";

// Subcomponente de seletor pergaminho padronizado e funcional
const StyledSelectBox = ({
  id,
  label,
  options = [],
  value,
  onChange,
  onRandom,
  icon: Icon = StyleOutlinedIcon,
}) => {
  return (
    <div className={styles.selectCard}>
      <div className={styles.labelRow}>
        <label className={styles.label} htmlFor={id}>
          <span className={styles.labelIcon}>
            <Icon sx={{ fontSize: "1rem" }} />
          </span>
          <span>{label}</span>
        </label>
        {options.length > 1 && (
          <button
            type="button"
            className={styles.btnRandom}
            onClick={onRandom}
            title={`Sortear ${label}`}
          >
            <CasinoOutlinedIcon sx={{ fontSize: "0.95rem" }} />
            <span>Aleatório</span>
          </button>
        )}
      </div>

      <div className={styles.selectWrapper}>
        <select
          id={id}
          className={styles.styledSelect}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.length === 0 ? (
            <option value="">Nenhuma opção disponível</option>
          ) : (
            options.map((opcao, idx) => (
              <option key={idx} value={opcao}>
                {opcao}
              </option>
            ))
          )}
        </select>
      </div>
    </div>
  );
};

const Etapa7 = ({
  antecedenteSelecionado,
  antecedente,
  CarcDosAntecedentes1,
  setCarcDosAntecedents1,
  CarcDosAntecedentes2,
  setCarcDosAntecedentes2,
  CarcDosAntecedentes3,
  setCarcDosAntecedents3,
}) => {
  const caracteristica = antecedenteSelecionado?.CaracteristicaDoAntecedente || {};

  const labelSelect1 =
    caracteristica.LabelCaracteristicaSelect1 || "Escolha uma Especialização";
  const optionsSelect1 = useMemo(() => {
    return Array.isArray(caracteristica.CaracteristicaSelect1)
      ? caracteristica.CaracteristicaSelect1.filter((op) => op && String(op).trim() !== "")
      : [];
  }, [caracteristica.CaracteristicaSelect1]);

  const labelSelect2 =
    caracteristica.LabelCaracteristicaSelect2 || "Característica Adicional";
  const optionsSelect2 = useMemo(() => {
    return Array.isArray(caracteristica.CaracteristicaSelect2)
      ? caracteristica.CaracteristicaSelect2.filter((op) => op && String(op).trim() !== "")
      : [];
  }, [caracteristica.CaracteristicaSelect2]);

  const labelTexto1 =
    caracteristica.LabelCaracteristicaTexto1 || "Recurso da Origem";
  const texto1 = caracteristica.CaracteristicaTexto1 || "";

  const sugestoes = caracteristica.caracteristicasSugeridas;
  const sugestoesFormatadas = Array.isArray(sugestoes)
    ? sugestoes.join("\n\n")
    : sugestoes || "";

  const normalize = (s) =>
    String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const normAntecedente = normalize(antecedente);

  // Determinação de layout
  const isArtesao =
    normAntecedente === "artesao de guilda" ||
    (optionsSelect1.length > 0 && optionsSelect2.length > 0);

  const hasSingleSelect = !isArtesao && optionsSelect1.length > 0;

  // Auto-seleção inicial protegida contra valores em branco
  useEffect(() => {
    if (isArtesao) {
      if (
        optionsSelect1.length > 0 &&
        (!CarcDosAntecedentes1 || !optionsSelect1.includes(CarcDosAntecedentes1))
      ) {
        setCarcDosAntecedents1?.(optionsSelect1[0]);
      }
      if (
        optionsSelect2.length > 0 &&
        (!CarcDosAntecedentes2 || !optionsSelect2.includes(CarcDosAntecedentes2))
      ) {
        setCarcDosAntecedentes2?.(optionsSelect2[0]);
      }
    } else if (hasSingleSelect) {
      if (
        optionsSelect1.length > 0 &&
        (!CarcDosAntecedentes3 || !optionsSelect1.includes(CarcDosAntecedentes3))
      ) {
        setCarcDosAntecedents3?.(optionsSelect1[0]);
      }
    }
  }, [
    antecedente,
    isArtesao,
    hasSingleSelect,
    optionsSelect1,
    optionsSelect2,
    CarcDosAntecedentes1,
    CarcDosAntecedentes2,
    CarcDosAntecedentes3,
    setCarcDosAntecedents1,
    setCarcDosAntecedentes2,
    setCarcDosAntecedents3,
  ]);

  // Sorteios aleatórios
  const handleRandom1 = () => {
    if (!optionsSelect1.length) return;
    const chosen = optionsSelect1[Math.floor(Math.random() * optionsSelect1.length)];
    setCarcDosAntecedents1?.(chosen);
  };

  const handleRandom2 = () => {
    if (!optionsSelect2.length) return;
    const chosen = optionsSelect2[Math.floor(Math.random() * optionsSelect2.length)];
    setCarcDosAntecedentes2?.(chosen);
  };

  const handleRandom3 = () => {
    if (!optionsSelect1.length) return;
    const chosen = optionsSelect1[Math.floor(Math.random() * optionsSelect1.length)];
    setCarcDosAntecedents3?.(chosen);
  };

  return (
    <LayoutFicha title="Detalhes do Antecedente">
      <div className={styles.contentWrapper}>
        {/* Caso 1: Dois seletores (Ex: Artesão de Guilda) */}
        {isArtesao && (
          <>
            <StyledSelectBox
              id="artesao-negocios-select"
              label={labelSelect1}
              options={optionsSelect1}
              value={CarcDosAntecedentes1}
              onChange={(val) => setCarcDosAntecedents1?.(val)}
              onRandom={handleRandom1}
              icon={HandymanOutlinedIcon}
            />

            <StyledSelectBox
              id="artesao-caracteristicas-select"
              label={labelSelect2}
              options={optionsSelect2}
              value={CarcDosAntecedentes2}
              onChange={(val) => setCarcDosAntecedentes2?.(val)}
              onRandom={handleRandom2}
              icon={StyleOutlinedIcon}
            />
          </>
        )}

        {/* Caso 2: Um seletor + Texto explicativo (Ex: Charlatão, Eremita, Soldado, etc.) */}
        {hasSingleSelect && (
          <StyledSelectBox
            id="antecedente-especialidade-select"
            label={labelSelect1}
            options={optionsSelect1}
            value={CarcDosAntecedentes3}
            onChange={(val) => setCarcDosAntecedents3?.(val)}
            onRandom={handleRandom3}
            icon={StyleOutlinedIcon}
          />
        )}

        {/* Bloco de Característica Especial (quando existir) */}
        {texto1 && (
          <div className={styles.featureCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>
                <AutoStoriesOutlinedIcon sx={{ fontSize: "1.15rem" }} />
              </span>
              <span>Características: {labelTexto1}</span>
            </div>
            <p className={styles.cardBody}>{texto1}</p>
          </div>
        )}

        {/* Bloco de Sugestões de Interpretação */}
        {sugestoesFormatadas && (
          <div className={styles.suggestionCard}>
            <div className={styles.suggestionHeader}>
              <span className={styles.cardIcon}>
                <PsychologyOutlinedIcon sx={{ fontSize: "1.15rem" }} />
              </span>
              <span>Sugestões de Interpretação</span>
            </div>
            <p className={styles.suggestionBody}>{sugestoesFormatadas}</p>
          </div>
        )}
      </div>
    </LayoutFicha>
  );
};

export default Etapa7;
