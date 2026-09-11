import React, { useMemo } from "react";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import DirectionsRunOutlinedIcon from "@mui/icons-material/DirectionsRunOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import { CLASSES_DATA } from "../../../Array/ClassesDetailedData";
import styles from "./SummaryCard.module.css";

// Mapeamento de dados de vida padrão D&D 5e por classe
const CLASS_HIT_DIE = {
  barbaro: 12,
  guerreiro: 10,
  paladino: 10,
  patrulheiro: 10,
  bardo: 8,
  clerigo: 8,
  druida: 8,
  ladino: 8,
  monge: 8,
  bruxo: 8,
  mago: 6,
  feiticeiro: 6,
};

const normalize = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const getModifier = (val) => {
  const num = Number(val) || 10;
  const mod = Math.floor((num - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
};

const getModifierNum = (val) => {
  const num = Number(val) || 10;
  return Math.floor((num - 10) / 2);
};

export default function SummaryCard({
  nome = "",
  raca = "",
  racaSelecionada = {},
  SubRaca = "",
  detalhesSubRaca = {},
  classe = "",
  classeSelecioanda = {},
  tendencia = "",
  antecedente = "",
  antecedenteSelecionado = {},
  CarcDosAntecedentes1 = "",
  CarcDosAntecedentes2 = "",
  CarcDosAntecedentes3 = "",
  valoresHabilidade = {},
  riquezaInicial = 0,
  equipamentosClasseSelecionada1 = "",
  equipamentosClasseSelecionada2 = "",
  equipamentosClasseSelecionada3 = "",
  equipamentosClasseSelecionada4 = "",
  subSelecaoArmas = {},
  periciasClasseSelecionadas = [],
  tracoPersonalidadeSelecionado = "",
  idealSelecionado = "",
  vinculoSelecionado = "",
  defeitoSelecionado = "",
  idiomaDoAntecedente = "",
  idiomaDoAntecendente2 = "",
  idiomaRacaSelecionado = "",
  idiomaRacaSelecionado2 = "",
  IdiomaAltoElfo = "",
  onEdit,
  onSave,
  submitting = false,
  submitSuccess = false,
}) {
  // 1. Identificação visual da classe
  const classKey = useMemo(() => {
    const n = normalize(classe);
    return Object.keys(CLASSES_DATA).find((k) => normalize(CLASSES_DATA[k].name) === n) || n;
  }, [classe]);

  const classData = CLASSES_DATA[classKey] || null;
  const portraitUrl = classData?.portrait || classData?.bgImage;

  // 2. Cálculo dos 6 Atributos D&D (Blindado contra duplicações)
  const bonusRaca = racaSelecionada?.proficienciaHabilidadeBonus || {};
  const bonusSub = detalhesSubRaca?.habilidadeBonusSubRaca || {};

  const getRacialBonus = (attrKey, attrLabel) => {
    const r = bonusRaca[attrLabel] || bonusRaca[attrKey] || 0;
    const s = bonusSub[attrLabel] || bonusSub[attrKey] || 0;
    return Number(r) + Number(s);
  };

  const getRawScore = (keyLower, keyCap) => {
    const v =
      valoresHabilidade[keyCap] ||
      valoresHabilidade[keyLower] ||
      valoresHabilidade[normalize(keyCap)] ||
      valoresHabilidade[normalize(keyLower)];
    return Number(v) || 10;
  };

  const attributesList = useMemo(() => {
    const defs = [
      { key: "forca", label: "Força", abbr: "FOR" },
      { key: "destreza", label: "Destreza", abbr: "DES" },
      { key: "constituicao", label: "Constituição", abbr: "CON" },
      { key: "inteligencia", label: "Inteligência", abbr: "INT" },
      { key: "sabedoria", label: "Sabedoria", abbr: "SAB" },
      { key: "carisma", label: "Carisma", abbr: "CAR" },
    ];

    return defs.map((d) => {
      const base = getRawScore(d.key, d.label);
      const bonus = getRacialBonus(d.key, d.label);
      const total = base + bonus;
      const mod = getModifier(total);
      const modNum = getModifierNum(total);
      return {
        ...d,
        base,
        bonus,
        total,
        mod,
        modNum,
      };
    });
  }, [valoresHabilidade, bonusRaca, bonusSub]);

  // Modificadores-chave para combate
  const conModNum = attributesList.find((a) => a.key === "constituicao")?.modNum || 0;
  const desModNum = attributesList.find((a) => a.key === "destreza")?.modNum || 0;
  const desModStr = attributesList.find((a) => a.key === "destreza")?.mod || "+0";

  // 3. Cálculo de Vitais (PV, CA, Velocidade, Dado de Vida)
  const baseHitDie = CLASS_HIT_DIE[classKey] || 8;
  const isAnaoColina = normalize(SubRaca).includes("colina");
  const hpBonus = isAnaoColina ? 1 : 0;
  const maxHp = Math.max(1, baseHitDie + conModNum + hpBonus);
  const armorClass = 10 + desModNum;

  const speed = useMemo(() => {
    const nRaca = normalize(raca);
    if (nRaca.includes("anao") || nRaca.includes("gnomo") || nRaca.includes("halfling")) {
      return "7,5m";
    }
    if (normalize(SubRaca).includes("bosques")) {
      return "10,5m";
    }
    return racaSelecionada?.deslocamento || "9m";
  }, [raca, SubRaca, racaSelecionada]);

  // 4. Equipamentos formatados (sem vazios ou '—')
  const formattedEquipments = useMemo(() => {
    const list = [];
    const formatar = (eq, slot) => {
      if (!eq || eq.trim() === "" || eq.trim() === "—") return;
      const subA = subSelecaoArmas?.[`${slot}_a`];
      const subB = subSelecaoArmas?.[`${slot}_b`];
      const sub = subSelecaoArmas?.[slot];
      if (subA && subB) {
        list.push(`${eq} (${subA} e ${subB})`);
      } else if (sub) {
        list.push(`${eq} (${sub})`);
      } else {
        list.push(eq);
      }
    };

    formatar(equipamentosClasseSelecionada1, "slot1");
    formatar(equipamentosClasseSelecionada2, "slot2");
    formatar(equipamentosClasseSelecionada3, "slot3");
    formatar(equipamentosClasseSelecionada4, "slot4");

    // Obrigatórios da classe
    const obgt = classeSelecioanda?.equipamentos?.equipamentoObgt;
    if (Array.isArray(obgt)) {
      obgt.forEach((item) => {
        if (item && item.trim() !== "" && !list.includes(item)) list.push(item);
      });
    } else if (typeof obgt === "string" && obgt.trim() !== "") {
      if (!list.includes(obgt)) list.push(obgt);
    }

    return list;
  }, [
    equipamentosClasseSelecionada1,
    equipamentosClasseSelecionada2,
    equipamentosClasseSelecionada3,
    equipamentosClasseSelecionada4,
    subSelecaoArmas,
    classeSelecioanda,
  ]);

  // 5. Perícias Combinadas (Classe + Antecedente)
  const allSkills = useMemo(() => {
    const set = new Set();
    if (Array.isArray(periciasClasseSelecionadas)) {
      periciasClasseSelecionadas.forEach((s) => s && set.add(s));
    }
    const bgSkills = antecedenteSelecionado?.proficienciaPericia;
    if (Array.isArray(bgSkills)) {
      bgSkills.forEach((s) => s && set.add(s));
    }
    return Array.from(set);
  }, [periciasClasseSelecionadas, antecedenteSelecionado]);

  // 6. Idiomas Conhecidos
  const allLanguages = useMemo(() => {
    const set = new Set();
    // Padrão da raça
    if (Array.isArray(racaSelecionada?.idiomas)) {
      racaSelecionada.idiomas.forEach((i) => set.add(i));
    } else {
      set.add("Comum");
    }
    if (idiomaRacaSelecionado) set.add(idiomaRacaSelecionado);
    if (idiomaRacaSelecionado2) set.add(idiomaRacaSelecionado2);
    if (IdiomaAltoElfo) set.add(IdiomaAltoElfo);
    if (idiomaDoAntecedente) set.add(idiomaDoAntecedente);
    if (idiomaDoAntecendente2) set.add(idiomaDoAntecendente2);
    return Array.from(set).filter((i) => i && i.trim() !== "");
  }, [
    racaSelecionada,
    idiomaRacaSelecionado,
    idiomaRacaSelecionado2,
    IdiomaAltoElfo,
    idiomaDoAntecedente,
    idiomaDoAntecendente2,
  ]);

  // 7. Salvaguardas da Classe
  const savingThrows = classData?.quickStats?.savingThrows || "Conforme classe";

  // 8. Detalhes de Antecedente (Etapa 7)
  const antecedenteInfo = useMemo(() => {
    const car = antecedenteSelecionado?.CaracteristicaDoAntecedente || {};
    const especializacao = CarcDosAntecedentes3 || CarcDosAntecedentes1;
    const extraGuilda = CarcDosAntecedentes2;
    const labelTexto = car.LabelCaracteristicaTexto1 || "Recurso de Origem";
    const texto = car.CaracteristicaTexto1 || "";

    return {
      especializacao,
      extraGuilda,
      labelTexto,
      texto,
    };
  }, [antecedenteSelecionado, CarcDosAntecedentes1, CarcDosAntecedentes2, CarcDosAntecedentes3]);

  return (
    <div className={styles.container}>
      <div className={styles.topGoldBar} />

      {/* 1. Cabeçalho Heróico */}
      <div className={styles.heroHeader}>
        <div className={styles.avatarContainer}>
          {portraitUrl ? (
            <img
              src={portraitUrl}
              alt={nome || "Personagem"}
              className={styles.avatarImage}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className={styles.avatarFallback}>
              {nome ? nome.charAt(0).toUpperCase() : "?"}
            </div>
          )}
        </div>

        <div className={styles.heroMeta}>
          <h2 className={styles.heroName}>{nome || "Herói Sem Nome"}</h2>
          <p className={styles.heroSubtitle}>Ficha Oficial do Aventureiro • 1º Nível</p>

          <div className={styles.identityPills}>
            <span className={`${styles.idPill} ${styles.idPillHighlight}`}>
              <strong>{classe || "Aventureiro"}</strong> (Nvl 1)
            </span>
            <span className={styles.idPill}>
              {SubRaca ? `${SubRaca} (${raca})` : raca || "Raça"}
            </span>
            <span className={styles.idPill}>{tendencia || "Tendência Neutra"}</span>
            <span className={styles.idPill}>Origem: {antecedente || "Viajante"}</span>
          </div>
        </div>
      </div>

      {/* 2. Faixa de Vitais de Combate */}
      <div className={styles.vitalsRow}>
        <div className={styles.vitalCard}>
          <span className={styles.vitalLabel}>
            <span className={styles.vitalIcon}>
              <FavoriteBorderOutlinedIcon sx={{ fontSize: "0.95rem" }} />
            </span>
            <span>Pontos de Vida</span>
          </span>
          <span className={styles.vitalValue}>{maxHp} PV</span>
          <span className={styles.vitalNote}>d{baseHitDie} + {conModNum}{hpBonus ? ` + ${hpBonus}` : ""}</span>
        </div>

        <div className={styles.vitalCard}>
          <span className={styles.vitalLabel}>
            <span className={styles.vitalIcon}>
              <ShieldOutlinedIcon sx={{ fontSize: "0.95rem" }} />
            </span>
            <span>Classe Armadura</span>
          </span>
          <span className={styles.vitalValue}>{armorClass} CA</span>
          <span className={styles.vitalNote}>10 + Des ({desModStr})</span>
        </div>

        <div className={styles.vitalCard}>
          <span className={styles.vitalLabel}>
            <span className={styles.vitalIcon}>
              <BoltOutlinedIcon sx={{ fontSize: "0.95rem" }} />
            </span>
            <span>Iniciativa</span>
          </span>
          <span className={styles.vitalValue}>{desModStr}</span>
          <span className={styles.vitalNote}>Modificador DES</span>
        </div>

        <div className={styles.vitalCard}>
          <span className={styles.vitalLabel}>
            <span className={styles.vitalIcon}>
              <DirectionsRunOutlinedIcon sx={{ fontSize: "0.95rem" }} />
            </span>
            <span>Deslocamento</span>
          </span>
          <span className={styles.vitalValue}>{speed}</span>
          <span className={styles.vitalNote}>Base da Raça</span>
        </div>

        <div className={styles.vitalCard}>
          <span className={styles.vitalLabel}>
            <span className={styles.vitalIcon}>
              <MonetizationOnOutlinedIcon sx={{ fontSize: "0.95rem" }} />
            </span>
            <span>Riqueza Inicial</span>
          </span>
          <span className={styles.vitalValue}>{riquezaInicial} PO</span>
          <span className={styles.vitalNote}>Moedas de Ouro</span>
        </div>
      </div>

      {/* 3. Atributos D&D (6 Caixas Clássicas) */}
      <div className={styles.sectionTitle}>
        <span className={styles.sectionIcon}>
          <ShieldOutlinedIcon sx={{ fontSize: "1.1rem" }} />
        </span>
        <span>Atributos & Modificadores</span>
      </div>

      <div className={styles.attributesGrid}>
        {attributesList.map((attr) => (
          <div key={attr.key} className={styles.attributeCard}>
            <span className={styles.attrLabel}>{attr.abbr}</span>
            <span className={styles.attrModifier}>{attr.mod}</span>
            <span className={styles.attrScorePill}>{attr.total}</span>
            <span className={styles.attrBonus}>
              {attr.bonus > 0 ? `Base ${attr.base} (+${attr.bonus})` : `Base ${attr.base}`}
            </span>
          </div>
        ))}
      </div>

      {/* 4. Grade em 2 Colunas: Habilidades/Equipamentos & Personalidade/Origem */}
      <div className={styles.detailsGrid}>
        {/* Coluna Esquerda: Conhecimentos & Equipamentos */}
        <div className={styles.cardBox}>
          {/* Perícias */}
          <div className={styles.cardBoxInner}>
            <span className={styles.subLabel}>
              <TrackChangesOutlinedIcon sx={{ fontSize: "0.95rem", color: "#9e2a2b" }} />
              <span>Perícias Concedidas ({allSkills.length})</span>
            </span>
            <div className={styles.chipsList}>
              {allSkills.length > 0 ? (
                allSkills.map((s, idx) => (
                  <span key={idx} className={styles.skillChip}>
                    {s}
                  </span>
                ))
              ) : (
                <span className={styles.vitalNote}>Nenhuma perícia selecionada</span>
              )}
            </div>
          </div>

          {/* Salvaguardas & Idiomas */}
          <div className={styles.cardBoxInner}>
            <span className={styles.subLabel}>
              <VerifiedUserOutlinedIcon sx={{ fontSize: "0.95rem", color: "#9e2a2b" }} />
              <span>Salvaguardas Proficientes</span>
            </span>
            <div className={styles.chipsList}>
              <span className={styles.skillChip}>{savingThrows}</span>
            </div>
          </div>

          <div className={styles.cardBoxInner}>
            <span className={styles.subLabel}>
              <TranslateOutlinedIcon sx={{ fontSize: "0.95rem", color: "#9e2a2b" }} />
              <span>Idiomas Conhecidos ({allLanguages.length})</span>
            </span>
            <div className={styles.chipsList}>
              {allLanguages.map((lang, idx) => (
                <span key={idx} className={styles.langChip}>
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Equipamentos Iniciais */}
          <div className={styles.cardBoxInner}>
            <span className={styles.subLabel}>
              <Inventory2OutlinedIcon sx={{ fontSize: "0.95rem", color: "#9e2a2b" }} />
              <span>Equipamentos & Armas Iniciais</span>
            </span>
            <div className={styles.chipsList}>
              {formattedEquipments.length > 0 ? (
                formattedEquipments.map((eq, idx) => (
                  <span key={idx} className={styles.equipChip}>
                    {eq}
                  </span>
                ))
              ) : (
                <span className={styles.vitalNote}>Equipamento padrão da classe</span>
              )}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Antecedente & Personalidade */}
        <div className={styles.cardBox}>
          {/* Recurso do Antecedente */}
          <div className={styles.cardBoxInner}>
            <span className={styles.subLabel}>
              <AutoStoriesOutlinedIcon sx={{ fontSize: "0.95rem", color: "#9e2a2b" }} />
              <span>Origem: {antecedente || "Aventureiro"}</span>
            </span>
            {antecedenteInfo.especializacao && (
              <div className={styles.chipsList}>
                <span className={styles.skillChip}>
                  <strong>Especialidade:</strong> {antecedenteInfo.especializacao}
                </span>
              </div>
            )}
            {antecedenteInfo.extraGuilda && (
              <div className={styles.chipsList} style={{ marginTop: 4 }}>
                <span className={styles.skillChip}>
                  <strong>Benefício:</strong> {antecedenteInfo.extraGuilda}
                </span>
              </div>
            )}
            {antecedenteInfo.texto && (
              <p className={styles.featureText}>
                <strong>{antecedenteInfo.labelTexto}:</strong> {antecedenteInfo.texto}
              </p>
            )}
          </div>

          {/* Traços de Personalidade & Interpretação */}
          <div className={styles.cardBoxInner}>
            <span className={styles.subLabel}>
              <PsychologyOutlinedIcon sx={{ fontSize: "0.95rem", color: "#9e2a2b" }} />
              <span>Interpretação & Personalidade</span>
            </span>

            <div className={styles.personalityGrid}>
              {tracoPersonalidadeSelecionado && (
                <div className={styles.personalityItem}>
                  <div className={styles.personalityTitle}>✦ Traço de Personalidade</div>
                  <p className={styles.personalityText}>"{tracoPersonalidadeSelecionado}"</p>
                </div>
              )}

              {idealSelecionado && (
                <div className={styles.personalityItem}>
                  <div className={styles.personalityTitle}>✦ Ideal Ético</div>
                  <p className={styles.personalityText}>"{idealSelecionado}"</p>
                </div>
              )}

              {vinculoSelecionado && (
                <div className={styles.personalityItem}>
                  <div className={styles.personalityTitle}>✦ Vínculo Primordial</div>
                  <p className={styles.personalityText}>"{vinculoSelecionado}"</p>
                </div>
              )}

              {defeitoSelecionado && (
                <div className={styles.personalityItem}>
                  <div className={styles.personalityTitle}>✦ Fraqueza ou Defeito</div>
                  <p className={styles.personalityText}>"{defeitoSelecionado}"</p>
                </div>
              )}

              {!tracoPersonalidadeSelecionado &&
                !idealSelecionado &&
                !vinculoSelecionado &&
                !defeitoSelecionado && (
                  <span className={styles.vitalNote}>Nenhum traço definido</span>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Ações Finais */}
      <div className={styles.actionsContainer}>
        <button type="button" className={styles.btnEdit} onClick={onEdit}>
          <ArrowBackOutlinedIcon sx={{ fontSize: "1.05rem" }} />
          <span>Voltar e Editar</span>
        </button>

        <button
          type="button"
          className={styles.btnSave}
          onClick={onSave}
          disabled={submitting || submitSuccess}
        >
          {submitting ? (
            <CircularProgress size={18} sx={{ color: "#fff" }} />
          ) : (
            <CheckCircleOutlineOutlinedIcon sx={{ fontSize: "1.15rem" }} />
          )}
          <span>
            {submitSuccess
              ? "Ficha Salva!"
              : submitting
              ? "Gravando Lenda..."
              : "Concluir e Salvar"}
          </span>
        </button>
      </div>
    </div>
  );
}
