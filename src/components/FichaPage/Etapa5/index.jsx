import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { tendencias } from "../../../Array/Tendencias";
import CasinoOutlinedIcon from "@mui/icons-material/CasinoOutlined";
import styles from "./Etapa5.module.css";

// 9 Alinhamentos Oficiais D&D 5e (com fallback blindado)
const FALLBACK_TENDENCIAS = [
  {
    nome: "Leal e Bom",
    id: "leal_bom",
    eixo: "Ordem & Justiça",
    resumo: "Age com honra, compaixão e dever cívico para proteger os indefesos.",
    descricao: "Um personagem Leal e Bom faz o que é esperado dele pela sociedade civilizada. Ele combina a oposição contra o mal com a disciplina de lutar incansavelmente pelos princípios da ordem e da verdade."
  },
  {
    nome: "Neutro e Bom",
    id: "neutro_bom",
    eixo: "Benevolência Pura",
    resumo: "Faz o bem movido pela consciência, sem apego rígido a leis ou rebeldia.",
    descricao: "Um indivíduo Neutro e Bom se esforça para ajudar o próximo da melhor forma possível. Ele segue as leis se elas promovem a paz, mas não hesita em ignorá-las se forem injustas."
  },
  {
    nome: "Caótico e Bom",
    id: "caotico_bom",
    eixo: "Liberdade & Bondade",
    resumo: "Guiado por uma bússola moral nobre, despreza tiranias e dogmas cegos.",
    descricao: "Um personagem Caótico e Bom segue seu próprio código moral pessoal, que geralmente é benevolente e altruísta. Ele valoriza a liberdade individual e combate a coerção autoritária."
  },
  {
    nome: "Leal e Neutro",
    id: "leal_neutro",
    eixo: "Ordem & Tradição",
    resumo: "Age conforme a lei, tradição ou código pessoal sem viés moral de bem ou mal.",
    descricao: "Um personagem Leal e Neutro age de acordo com a lei, honra, tradição ou códigos institucionais estritos. A preservação da ordem pública e da palavra dada são prioridades absolutas."
  },
  {
    nome: "Neutro Puro",
    id: "neutro_neutro",
    eixo: "Equilíbrio Natural",
    resumo: "Prefere não tomar partido em disputas extremas, valorizando a harmonia.",
    descricao: "O alinhamento dos que preferem o pragmatismo ou a harmonia da natureza. Um Neutro Puro evita julgar o mundo em termos preto-no-branco e prioriza a própria sobrevivência e o bom senso."
  },
  {
    nome: "Caótico e Neutro",
    id: "caotico_neutro",
    eixo: "Individualismo Livre",
    resumo: "Valoriza a liberdade pessoal acima de tudo, imprevisível e independente.",
    descricao: "Um indivíduo Caótico e Neutro segue apenas seus caprichos e anseios. Ele valoriza a própria independência acima de tudo e não gosta de receber ordens de governos ou deuses."
  },
  {
    nome: "Leal e Mau",
    id: "leal_mau",
    eixo: "Tirania & Ambição",
    resumo: "Manipula regras, contratos e hierarquias para oprimir e obter poder.",
    descricao: "Um indivíduo Leal e Mau segue metodicamente a lei e a ordem, mas usa a estrutura legal para explorar e subjugar os outros de maneira fria e impiedosa."
  },
  {
    nome: "Neutro e Mau",
    id: "neutro_mau",
    eixo: "Egoísmo Puro",
    resumo: "Faz tudo pelo próprio interesse egoísta, sem escrúpulos ou honra.",
    descricao: "O alinhamento dos vilões puramente pragmáticos. Um Neutro e Mau faz qualquer coisa para conseguir o que quer, sem lealdade a regras e sem crueldade desnecessária além de sua meta."
  },
  {
    nome: "Caótico e Mau",
    id: "caotico_mau",
    eixo: "Devastação & Caos",
    resumo: "Movido pela violência desenfreada, destruição e prazer no sofrimento alheio.",
    descricao: "Um personagem Caótico e Mau é guiado por crueldade e ganância voraz. Ele é imprevisível, sanguinário e muitas vezes perigoso até mesmo para seus aliados."
  }
];

export default function Etapa5({
  characterData = {},
  updateCharacterData,
  tendencia,
  setTendencia,
  TendenciasOptions,
  itensDaTendencia
}) {
  const sourceList = Array.isArray(tendencias) && tendencias.length > 0 ? tendencias : FALLBACK_TENDENCIAS;

  const currentSelectionName = characterData.tendencia || tendencia || "Neutro e Bom";

  const normalize = (s) =>
    String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const currentTendencia =
    FALLBACK_TENDENCIAS.find((t) => {
      const n = normalize(t.nome);
      const sel = normalize(currentSelectionName);
      return n === sel || sel.includes(n) || n.includes(sel);
    }) ||
    sourceList.find((t) => {
      const n = normalize(t.nome || t.name);
      const sel = normalize(currentSelectionName);
      return n === sel || sel.includes(n) || n.includes(sel);
    }) ||
    FALLBACK_TENDENCIAS[1];

  const handleSelect = (nome) => {
    if (updateCharacterData) {
      updateCharacterData({ tendencia: nome });
    }
    if (setTendencia) {
      setTendencia(nome);
    }
  };

  const handleRandom = () => {
    const listToPick = FALLBACK_TENDENCIAS.length ? FALLBACK_TENDENCIAS : sourceList;
    const randomIndex = Math.floor(Math.random() * listToPick.length);
    const chosen = listToPick[randomIndex];
    handleSelect(chosen.nome || chosen.name);
  };

  useEffect(() => {
    if (!characterData.tendencia && !tendencia) {
      handleSelect("Neutro e Bom");
    }
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>SUA BÚSSOLA MORAL</h2>
        <p className={styles.subtitle}>
          "Onde seu personagem se encaixa na batalha cósmica entre o bem e o mal, a lei e o caos?"
        </p>
        <div className={styles.divider} />
      </header>

      {/* Barra de Seleção com Botão de Dado */}
      <div className={styles.inputGroup}>
        <div className={styles.labelRow}>
          <label className={styles.label} htmlFor="tendencia-select">
            Tendência Moral
          </label>
          <button
            type="button"
            className={styles.btnRandom}
            onClick={handleRandom}
            title="Sortear uma tendência aleatória"
          >
            <CasinoOutlinedIcon sx={{ fontSize: "0.95rem" }} />
            <span>Aleatório</span>
          </button>
        </div>

        <div className={styles.selectWrapper}>
          <select
            id="tendencia-select"
            className={styles.styledSelect}
            value={currentTendencia.nome || currentTendencia.name}
            onChange={(e) => handleSelect(e.target.value)}
          >
            {FALLBACK_TENDENCIAS.map((t, idx) => (
              <option key={idx} value={t.nome}>
                {t.nome} ({t.eixo})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cartão de Filosofia da Tendência com Efeito de Pergaminho */}
      <motion.div
        key={currentTendencia.nome || currentTendencia.name}
        className={styles.quoteBox}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className={styles.quoteHeader}>
          <span className={styles.eixoBadge}>
            ✦ {currentTendencia.eixo || "Alinhamento Filosófico"}
          </span>
          <span className={styles.quoteMark}>“</span>
        </div>

        <p className={styles.quoteSummary}>
          {currentTendencia.resumo || currentTendencia.descricao || currentTendencia.desc}
        </p>

        {currentTendencia.descricao && currentTendencia.resumo && (
          <p className={styles.quoteFullDesc}>{currentTendencia.descricao}</p>
        )}
      </motion.div>
    </div>
  );
}
