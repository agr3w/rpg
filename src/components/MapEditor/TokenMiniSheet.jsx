// src/components/MapEditor/TokenMiniSheet.jsx
import React, { useState, useEffect, useMemo } from "react";
import ShieldIcon from "@mui/icons-material/Shield";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import CasinoIcon from "@mui/icons-material/Casino";
import HealingIcon from "@mui/icons-material/Healing";
import CloseIcon from "@mui/icons-material/Close";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import SportsKabaddiIcon from "@mui/icons-material/SportsKabaddi";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { auth } from "../../APIs/firebaseConfig";
import { racas, classes } from "../../Array/RacaEClasse";
import styles from "./TokenMiniSheet.module.css";

const SKILL_LIST = [
  { id: "Atletismo", label: "Atletismo", ability: "Força" },
  { id: "Acrobacia", label: "Acrobacia", ability: "Destreza" },
  { id: "Furtividade", label: "Furtividade", ability: "Destreza" },
  { id: "Prestidigitação", label: "Prestidigitação", ability: "Destreza" },
  { id: "Arcanismo", label: "Arcanismo", ability: "Inteligência" },
  { id: "História", label: "História", ability: "Inteligência" },
  { id: "Investigação", label: "Investigação", ability: "Inteligência" },
  { id: "Natureza", label: "Natureza", ability: "Inteligência" },
  { id: "Religião", label: "Religião", ability: "Inteligência" },
  { id: "Intuição", label: "Intuição", ability: "Sabedoria" },
  { id: "Lidar com Animais", label: "Lidar com Animais", ability: "Sabedoria" },
  { id: "Medicina", label: "Medicina", ability: "Sabedoria" },
  { id: "Percepção", label: "Percepção", ability: "Sabedoria" },
  { id: "Sobrevivência", label: "Sobrevivência", ability: "Sabedoria" },
  { id: "Atuação", label: "Atuação", ability: "Carisma" },
  { id: "Enganação", label: "Enganação", ability: "Carisma" },
  { id: "Intimidação", label: "Intimidação", ability: "Carisma" },
  { id: "Persuasão", label: "Persuasão", ability: "Carisma" },
];

const safeStr = (val, fallback = "—") => {
  if (val === null || val === undefined || val === "") return fallback;
  if (typeof val === "string" || typeof val === "number") return String(val);
  if (typeof val === "object") {
    return val.nome || val.name || val.antecedente || val.label || val.raca || val.classe || fallback;
  }
  return String(val);
};

const extractHpNumber = (source, field = "atual", fallback = 5) => {
  if (source === null || source === undefined) return fallback;
  if (typeof source === "number") return source;
  if (typeof source === "string") {
    const num = Number(source);
    return isNaN(num) ? fallback : num;
  }
  if (typeof source === "object") {
    const val = source[field] ?? source.atual ?? source.max ?? fallback;
    const num = Number(val);
    return isNaN(num) ? fallback : num;
  }
  return fallback;
};

export default function TokenMiniSheet({
  token = {},
  sheetData: initialSheetData,
  onUpdateToken,
  onRollDice,
  onClose
}) {
  const [activeTab, setActiveTab] = useState("combate"); // "combate" | "atributos" | "magias"
  const [hpModInput, setHpModInput] = useState("");
  const [liveSheet, setLiveSheet] = useState(initialSheetData || null);

  const sheetId = token?.characterId || initialSheetData?.id || initialSheetData?.key;

  // Escuta em tempo real da ficha real do Firebase
  useEffect(() => {
    if (!sheetId) return;
    const user = auth.currentUser;
    if (!user) return;
    const db = getDatabase();
    const sheetRef = ref(db, `fichas/${user.uid}/${sheetId}`);

    const unsub = onValue(sheetRef, (snap) => {
      const val = snap.val();
      if (val) {
        setLiveSheet({ id: sheetId, key: sheetId, ...val });
      }
    });

    return () => unsub();
  }, [sheetId]);

  const sheet = liveSheet || initialSheetData;

  // Raça e Classe da Base
  const racaSelecionada = useMemo(() => {
    if (!sheet?.raca) return null;
    return racas.find(r => String(r.nome).toLowerCase() === String(sheet.raca).toLowerCase()) || null;
  }, [sheet?.raca]);

  const subRacaSelecionada = useMemo(() => {
    if (!racaSelecionada || !sheet?.subRaca) return null;
    return racaSelecionada.SubRacas?.find(s => String(s.subRacaNome).toLowerCase() === String(sheet.subRaca).toLowerCase()) || null;
  }, [racaSelecionada, sheet?.subRaca]);

  const classeSelecionada = useMemo(() => {
    if (!sheet?.classe) return null;
    return classes.find(c => String(c.nome).toLowerCase() === String(sheet.classe).toLowerCase()) || null;
  }, [sheet?.classe]);

  // Nível e Bônus de Proficiência
  const level = Number(sheet?.level || sheet?.nivel || 1);
  const profBonus = 2 + Math.floor((Math.max(1, level) - 1) / 4);

  // Atributos Reais
  const rawAttrs = sheet?.DetalhesDaRaça?.Atributos || sheet?.atributos || {};
  const bonusRaca = racaSelecionada?.proficienciaHabilidadeBonus || {};
  const bonusSub = subRacaSelecionada?.habilidadeBonusSubRaca || {};

  const atributos = useMemo(() => {
    return {
      Força: (Number(rawAttrs.Força ?? rawAttrs.forca) || 0) + (Number(bonusRaca.Força ?? bonusRaca.forca) || 0) + (Number(bonusSub.Força ?? bonusSub.forca) || 0),
      Destreza: (Number(rawAttrs.Destreza ?? rawAttrs.destreza) || 0) + (Number(bonusRaca.Destreza ?? bonusRaca.destreza) || 0) + (Number(bonusSub.Destreza ?? bonusSub.destreza) || 0),
      Constituição: (Number(rawAttrs.Constituição ?? rawAttrs.constituicao) || 0) + (Number(bonusRaca.Constituição ?? bonusRaca.constituicao) || 0) + (Number(bonusSub.Constituição ?? bonusSub.constituicao) || 0),
      Inteligência: (Number(rawAttrs.Inteligência ?? rawAttrs.inteligencia) || 0) + (Number(bonusRaca.Inteligência ?? bonusRaca.inteligencia) || 0) + (Number(bonusSub.Inteligência ?? bonusSub.inteligencia) || 0),
      Sabedoria: (Number(rawAttrs.Sabedoria ?? rawAttrs.sabedoria) || 0) + (Number(bonusRaca.Sabedoria ?? bonusRaca.sabedoria) || 0) + (Number(bonusSub.Sabedoria ?? bonusSub.sabedoria) || 0),
      Carisma: (Number(rawAttrs.Carisma ?? rawAttrs.carisma) || 0) + (Number(bonusRaca.Carisma ?? bonusRaca.carisma) || 0) + (Number(bonusSub.Carisma ?? bonusSub.carisma) || 0),
    };
  }, [rawAttrs, bonusRaca, bonusSub]);

  const getMod = (val = 0) => Math.floor((val - 10) / 2);
  const formatMod = (mod) => (mod >= 0 ? `+${mod}` : `${mod}`);

  const abilityMods = useMemo(() => {
    return {
      Força: getMod(atributos.Força),
      Destreza: getMod(atributos.Destreza),
      Constituição: getMod(atributos.Constituição),
      Inteligência: getMod(atributos.Inteligência),
      Sabedoria: getMod(atributos.Sabedoria),
      Carisma: getMod(atributos.Carisma),
    };
  }, [atributos]);

  const dexMod = abilityMods.Destreza;

  // CA Real
  const ca = typeof sheet?.caState === "object" ? Number(sheet.caState.total ?? 10) : (typeof sheet?.ca === "object" ? Number(sheet.ca.total ?? 10) : Number(sheet?.ca ?? (10 + dexMod)));

  // Deslocamento Real
  const speed = safeStr(sheet?.deslocamento || racaSelecionada?.deslocamento, "9m (30ft)");

  // PV Real (Garantido contra objetos)
  const currentHp = extractHpNumber(sheet?.hp ?? sheet?.hpAtual ?? token?.hp, "atual", 5);
  const maxHp = extractHpNumber(sheet?.hp ?? sheet?.hpMaximo ?? token?.maxHp ?? token?.hp, "max", 5);

  // Cálculo de Armas e Ataques conforme Regras Oficiais D&D 5E
  const realWeapons = useMemo(() => {
    const list = [];
    const equipped = sheet?.inventory?.equipped || {};

    Object.entries(equipped).forEach(([slot, item]) => {
      if (item && (item.kind === "weapon" || item.damageDice || item.dano)) {
        let stat = item.attackStat || "Força";
        const forMod = Number(abilityMods["Força"] || 0);
        const desMod = Number(abilityMods["Destreza"] || 0);

        if (item.props?.agil) {
          stat = desMod >= forMod ? "Destreza" : "Força";
        } else if (item.category === "ranged") {
          stat = "Destreza";
        }

        const mod = Number(abilityMods[stat] || 0);
        const prof = item.proficiente === false ? 0 : profBonus;
        const extra = Number(item.attackBonus || 0);

        const attackBonus = mod + prof + extra;
        const damageBonus = mod + extra;
        const damageDice = item.damageDice || item.dano || "1d6";
        const damageFormula = `${damageDice}${damageBonus !== 0 ? (damageBonus > 0 ? `+${damageBonus}` : `${damageBonus}`) : ""}`;

        list.push({
          nome: safeStr(item.name || item.nome, slot),
          damageDice,
          damageBonus,
          damageFormula,
          bonusAtaque: attackBonus,
          tipo: safeStr(item.damageType || item.tipo, "Dano"),
          statUsed: stat,
          props: item.props || {},
        });
      }
    });

    if (Array.isArray(sheet?.armas)) {
      sheet.armas.forEach((w) => {
        let stat = w.attackStat || "Força";
        const forMod = Number(abilityMods["Força"] || 0);
        const desMod = Number(abilityMods["Destreza"] || 0);

        if (w.props?.agil) {
          stat = desMod >= forMod ? "Destreza" : "Força";
        } else if (w.category === "ranged") {
          stat = "Destreza";
        }

        const mod = Number(abilityMods[stat] || 0);
        const prof = w.proficiente === false ? 0 : profBonus;
        const extra = Number(w.attackBonus || 0);

        const attackBonus = mod + prof + extra;
        const damageBonus = mod + extra;
        const damageDice = w.damageDice || w.dano || "1d6";
        const damageFormula = `${damageDice}${damageBonus !== 0 ? (damageBonus > 0 ? `+${damageBonus}` : `${damageBonus}`) : ""}`;

        list.push({
          nome: safeStr(w.name || w.nome, "Arma"),
          damageDice,
          damageBonus,
          damageFormula,
          bonusAtaque: attackBonus,
          tipo: safeStr(w.damageType || w.tipo, "Dano"),
          statUsed: stat,
          props: w.props || {},
        });
      });
    }

    return list;
  }, [sheet, abilityMods, profBonus]);

  // Magias Reais
  const realSpells = useMemo(() => {
    const list = [];
    if (sheet?.spellcasting?.spells) {
      Object.entries(sheet.spellcasting.spells).forEach(([id, s]) => {
        if (s && s.name) {
          list.push({
            nome: safeStr(s.name, "Magia"),
            circulo: Number(s.circle ?? s.circulo ?? 0),
            formula: s.damage || s.formula || "1d20"
          });
        }
      });
    }
    if (Array.isArray(sheet?.magias)) {
      sheet.magias.forEach(m => list.push(m));
    }
    return list;
  }, [sheet]);

  // Ajustes de Vida com Persistência Bidirecional no Firebase
  const handleApplyDamage = async () => {
    const val = Number(hpModInput);
    if (!val || val <= 0) return;
    const newHp = Math.max(0, currentHp - val);
    
    onUpdateToken?.(token.id, { hp: newHp, maxHp });
    setHpModInput("");

    if (sheetId && auth.currentUser) {
      const db = getDatabase();
      const hpRef = ref(db, `fichas/${auth.currentUser.uid}/${sheetId}/hp`);
      await update(hpRef, { atual: newHp, max: maxHp });
    }
  };

  const handleApplyHeal = async () => {
    const val = Number(hpModInput);
    if (!val || val <= 0) return;
    const newHp = Math.min(maxHp, currentHp + val);

    onUpdateToken?.(token.id, { hp: newHp, maxHp });
    setHpModInput("");

    if (sheetId && auth.currentUser) {
      const db = getDatabase();
      const hpRef = ref(db, `fichas/${auth.currentUser.uid}/${sheetId}/hp`);
      await update(hpRef, { atual: newHp, max: maxHp });
    }
  };

  // Disparadores de Ataque & Dano no Padrão D&D 5E
  const handleRollWeaponAttack = (arma) => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    const bonus = arma.bonusAtaque;
    const total = d20 + bonus;
    let label = `Ataque: ${arma.nome}`;
    if (d20 === 20) {
      onRollDice?.(`d20[20] ${formatMod(bonus)} = Total ${total}`, `⚡ ACERTO CRÍTICO! ${label}`);
    } else if (d20 === 1) {
      onRollDice?.(`d20[1] ${formatMod(bonus)} = Total ${total}`, `⚠️ FALHA CRÍTICA! ${label}`);
    } else {
      onRollDice?.(`1d20${formatMod(bonus)}`, `${label} (${formatMod(bonus)} para acertar)`);
    }
  };

  const handleRollWeaponDamage = (arma, isCrit = false) => {
    const diceMatch = (arma.damageDice || "1d8").match(/^(\d+)d(\d+)/i);
    const numDice = diceMatch ? parseInt(diceMatch[1], 10) : 1;
    const diceFaces = diceMatch ? parseInt(diceMatch[2], 10) : 8;
    const totalNumDice = isCrit ? numDice * 2 : numDice;
    const formula = `${totalNumDice}d${diceFaces}${arma.damageBonus !== 0 ? (arma.damageBonus > 0 ? `+${arma.damageBonus}` : `${arma.damageBonus}`) : ""}`;
    onRollDice?.(formula, `Dano: ${arma.nome} (${arma.tipo || "Dano"})${isCrit ? " [CRÍTICO 2X DADOS]" : ""}`);
  };

  const characterName = safeStr(sheet?.nome || sheet?.nomePersonagem || token.name, "Personagem");
  const characterRaca = safeStr(sheet?.raca || token.raca, "Personagem");
  const characterClasse = safeStr(sheet?.classe || token.classe, "Token");
  const characterSub = `${characterRaca} • ${characterClasse} (Nvl ${level})`;

  return (
    <div className={styles.miniSheetDrawer}>
      {/* Header Compacto */}
      <div className={styles.header}>
        {token.src ? (
          <img src={token.src} alt={characterName} className={styles.avatar} />
        ) : (
          <div className={styles.avatarPlaceholder}>
            {characterName[0]?.toUpperCase() || "T"}
          </div>
        )}
        <div className={styles.characterInfo}>
          <h4 title={characterName}>{characterName}</h4>
          <span title={characterSub}>{characterSub}</span>
        </div>
        <button className={styles.closeBtn} onClick={onClose} title="Fechar Mini Ficha" aria-label="Fechar">
          <CloseIcon fontSize="small" />
        </button>
      </div>

      {/* Botão de Abrir Ficha Completa */}
      {sheetId && (
        <button
          className={styles.openFullSheetBtn}
          onClick={() => window.open(`/ficha-completa/${sheetId}`, "_blank")}
          title="Abrir Ficha Completa em nova aba"
        >
          <OpenInNewIcon sx={{ fontSize: 15 }} />
          <span>Abrir Ficha Completa</span>
        </button>
      )}

      {/* Badges Táticos Principais */}
      <div className={styles.coreBadges}>
        <div className={styles.badge}>
          <span className={styles.badgeLabel}>CA</span>
          <span className={styles.badgeValue}>
            <ShieldIcon sx={{ fontSize: 14, color: "#f1c40f", mr: 0.3 }} />
            {ca}
          </span>
        </div>
        <div className={styles.badge}>
          <span className={styles.badgeLabel}>DESLOC.</span>
          <span className={styles.badgeValue}>
            <DirectionsRunIcon sx={{ fontSize: 14, color: "#f1c40f", mr: 0.3 }} />
            {speed}
          </span>
        </div>
        <div className={styles.badge}>
          <span className={styles.badgeLabel}>INICIATIVA</span>
          <button
            className={styles.miniRollBtn}
            onClick={() => {
              onRollDice?.(`1d20${formatMod(dexMod)}`, `Iniciativa de ${characterName}`);
            }}
            title="Rolar Iniciativa"
          >
            <CasinoIcon sx={{ fontSize: 13, mr: 0.3 }} />
            {formatMod(dexMod)}
          </button>
        </div>
      </div>

      {/* Barra e Gestão de HP */}
      <div className={styles.hpContainer}>
        <div className={styles.hpLabels}>
          <span>PONTOS DE VIDA</span>
          <span>{currentHp} / {maxHp}</span>
        </div>
        <div className={styles.hpBar}>
          <div
            className={styles.hpBarFill}
            style={{
              width: `${Math.min(100, Math.max(0, (currentHp / maxHp) * 100))}%`,
              backgroundColor: currentHp < maxHp * 0.3 ? "#e74c3c" : "#2ecc71"
            }}
          />
        </div>
        <div className={styles.hpActions}>
          <input
            type="number"
            min="1"
            placeholder="Qtd"
            value={hpModInput}
            onChange={(e) => setHpModInput(e.target.value)}
          />
          <button className={styles.damageBtn} onClick={handleApplyDamage}>
            <FlashOnIcon sx={{ fontSize: 13 }} />
            Dano
          </button>
          <button className={styles.healBtn} onClick={handleApplyHeal}>
            <HealingIcon sx={{ fontSize: 13 }} />
            Cura
          </button>
        </div>
      </div>

      {/* Navegação por Abas */}
      <div className={styles.tabsNav}>
        <button
          className={activeTab === "combate" ? styles.activeTab : ""}
          onClick={() => setActiveTab("combate")}
        >
          <SportsKabaddiIcon sx={{ fontSize: 14 }} />
          Ataques
        </button>
        <button
          className={activeTab === "atributos" ? styles.activeTab : ""}
          onClick={() => setActiveTab("atributos")}
        >
          <AssessmentIcon sx={{ fontSize: 14 }} />
          Testes
        </button>
        <button
          className={activeTab === "magias" ? styles.activeTab : ""}
          onClick={() => setActiveTab("magias")}
        >
          <AutoFixHighIcon sx={{ fontSize: 14 }} />
          Magias
        </button>
      </div>

      {/* Conteúdo da Aba */}
      <div className={styles.tabContent}>
        {/* ABA: COMBATE / ARSENAL D&D 5E */}
        {activeTab === "combate" && (
          realWeapons.length > 0 ? (
            <div className={styles.weaponsList}>
              {realWeapons.map((arma, idx) => (
                <div key={idx} className={styles.actionCard}>
                  <div className={styles.actionInfo}>
                    <strong>{arma.nome}</strong>
                    <small>{arma.damageFormula} ({arma.statUsed})</small>
                  </div>
                  <div className={styles.actionBtns}>
                    <button
                      onClick={() => handleRollWeaponAttack(arma)}
                      title={`Rolar Ataque D&D 5E (1d20 ${formatMod(arma.bonusAtaque)})`}
                    >
                      Atacar ({formatMod(arma.bonusAtaque)})
                    </button>
                    <button
                      onClick={() => handleRollWeaponDamage(arma, false)}
                      title={`Rolar Dano (${arma.damageFormula})`}
                    >
                      Dano
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <SportsKabaddiIcon sx={{ fontSize: 32, color: "#8b949e", opacity: 0.6 }} />
              <strong>NENHUMA ARMA CADASTRADA</strong>
              <small>Cadastre armas na Ficha Completa para rolar ataques.</small>
            </div>
          )
        )}

        {/* ABA: ATRIBUTOS & TESTES REAIS */}
        {activeTab === "atributos" && (
          <>
            <div className={styles.attributesGrid}>
              {Object.entries(atributos).map(([attr, val]) => {
                const mod = getMod(val);
                return (
                  <div key={attr} className={styles.attrCard}>
                    <span className={styles.attrName}>{attr.slice(0, 3).toUpperCase()}</span>
                    <span className={styles.attrVal}>Valor {val}</span>
                    <button
                      className={styles.attrRollBtn}
                      onClick={() => onRollDice?.(`1d20${formatMod(mod)}`, `Teste de ${attr}`)}
                    >
                      {formatMod(mod)}
                    </button>
                  </div>
                );
              })}
            </div>

            <span className={styles.subSectionHeader}>PERÍCIAS & TESTES</span>
            <div className={styles.skillsList}>
              {SKILL_LIST.map((sk) => {
                const attrMod = getMod(atributos[sk.ability] || 0);
                const isProficient = sheet?.pericias?.[sk.id] || sheet?.skills?.[sk.id] || sheet?.periciasAtivas?.includes(sk.id);
                const totalSkillMod = attrMod + (isProficient ? profBonus : 0);

                return (
                  <div key={sk.id} className={styles.skillRow}>
                    <span className={styles.skillName}>
                      {sk.label} {isProficient && "★"}
                    </span>
                    <button
                      className={styles.skillModBtn}
                      onClick={() => onRollDice?.(`1d20${formatMod(totalSkillMod)}`, `Perícia: ${sk.label}`)}
                    >
                      {formatMod(totalSkillMod)}
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ABA: MAGIAS / GRIMÓRIO REAL */}
        {activeTab === "magias" && (
          realSpells.length > 0 ? (
            <div className={styles.spellsList}>
              {realSpells.map((magia, idx) => (
                <div key={idx} className={styles.actionCard}>
                  <div className={styles.actionInfo}>
                    <strong>{magia.nome}</strong>
                    <small>{magia.circulo === 0 ? "Truque" : `${magia.circulo}º Círculo`}</small>
                  </div>
                  <button
                    className={styles.castBtn}
                    onClick={() => onRollDice?.(magia.formula || "1d20", `Magia: ${magia.nome}`)}
                  >
                    Conjurar ({magia.formula || "1d20"})
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <AutoFixHighIcon sx={{ fontSize: 32, color: "#8b949e", opacity: 0.6 }} />
              <strong>NENHUMA MAGIA CADASTRADA</strong>
              <small>Cadastre magias na Ficha Completa para conjurar.</small>
            </div>
          )
        )}
      </div>
    </div>
  );
}
