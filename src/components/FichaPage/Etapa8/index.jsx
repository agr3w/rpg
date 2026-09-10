import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CasinoOutlinedIcon from "@mui/icons-material/CasinoOutlined";
import styles from "./Etapa8.module.css";

// Banco Oficial de Traços, Ideais, Vínculos e Defeitos
const PERSONALITY_DATABASE = {
  tracos: [
    "Sempre mantenho a calma, não importa a gravidade da situação.",
    "Costumo julgar as pessoas pelas suas ações, nunca pelas suas palavras.",
    "Amo uma boa taverna barulhenta e fazer novos amigos improváveis.",
    "Falo em enigmas ou uso provérbios antigos com frequência.",
    "Tenho pouca paciência com burocracia e hipocrisia social.",
    "Durmo sempre com uma das mãos na bainha da minha arma.",
    "Não consigo resistir a um mistério não solucionado.",
    "Sou extremamente leal aos companheiros que sangraram ao meu lado."
  ],
  ideais: [
    "Respeito: As pessoas merecem ser tratadas com dignidade e gentileza. (Bom)",
    "Liberdade: Correntes existem para serem rompidas por mãos livres. (Caótico)",
    "Dever: Se não defendermos a lei e o povo, ninguém mais o fará. (Leal)",
    "Poder: O mundo pertence àqueles que são fortes o bastante para tomá-lo. (Mau)",
    "Conhecimento: A mente bem instruída é a maior arma do multiverso. (Neutro)",
    "Honra: Minha palavra é tão firme quanto o mais resistente granito. (Leal)"
  ],
  vinculos: [
    "Eu daria minha própria vida para proteger meu companheiro de armas.",
    "Busco vingança contra o monstro ou vilão que destruiu minha vila natal.",
    "Tudo o que faço é para garantir o futuro e o bem-estar de quem amo.",
    "Carrego uma relíquia familiar antiga e farei qualquer coisa para preservá-la.",
    "Tenho uma dívida impagável com a pessoa que salvou minha vida no passado.",
    "Minha honra é meu vínculo mais sagrado: nunca recuarei de uma promessa."
  ],
  defeitos: [
    "Não consigo resistir a uma aposta perigosa ou um desafio arrogante.",
    "Tenho dificuldade em confiar até mesmo nos aliados mais próximos.",
    "Um desejo secreto por ouro e riquezas reluzentes obscurece meu julgamento.",
    "Tendo a subestimar meus inimigos e superestimar minha própria bravura.",
    "Falo o que penso sem qualquer filtro, criando inimigos sem querer.",
    "Entro em pânico irracional perante certos tipos de feras ou escuridão."
  ]
};

export default function Etapa8({
  characterData = {},
  updateCharacterData,
  tracoPersonalidade = [],
  ideal = [],
  defeito = [],
  vinculo = [],
  tracoPersonalidadeSelecionado = "",
  idealSelecionado = "",
  defeitoSelecionado = "",
  vinculoSelecionado = "",
  onSelecionarTracoPersonalidade,
  setTracoPersonalidadeSelecionado,
  onSelecionarIdeal,
  onSelecionarDefeito,
  onSelecionarVinculo,
}) {
  const tracosOptions = tracoPersonalidade && tracoPersonalidade.length > 0 ? tracoPersonalidade : PERSONALITY_DATABASE.tracos;
  const ideaisOptions = ideal && ideal.length > 0 ? ideal : PERSONALITY_DATABASE.ideais;
  const vinculosOptions = vinculo && vinculo.length > 0 ? vinculo : PERSONALITY_DATABASE.vinculos;
  const defeitosOptions = defeito && defeito.length > 0 ? defeito : PERSONALITY_DATABASE.defeitos;

  const [traco, setTraco] = useState(
    characterData.tracoPersonalidade || tracoPersonalidadeSelecionado || tracosOptions[0]
  );
  const [currentIdeal, setCurrentIdeal] = useState(
    characterData.ideal || idealSelecionado || ideaisOptions[0]
  );
  const [currentVinculo, setCurrentVinculo] = useState(
    characterData.vinculo || vinculoSelecionado || vinculosOptions[0]
  );
  const [currentDefeito, setCurrentDefeito] = useState(
    characterData.defeito || defeitoSelecionado || defeitosOptions[0]
  );

  const syncToParent = (fields) => {
    if (updateCharacterData) {
      updateCharacterData({
        tracoPersonalidade: fields.traco !== undefined ? fields.traco : traco,
        ideal: fields.ideal !== undefined ? fields.ideal : currentIdeal,
        vinculo: fields.vinculo !== undefined ? fields.vinculo : currentVinculo,
        defeito: fields.defeito !== undefined ? fields.defeito : currentDefeito,
      });
    }
    if (fields.traco !== undefined) {
      setTracoPersonalidadeSelecionado?.(fields.traco);
      onSelecionarTracoPersonalidade?.({ target: { value: fields.traco } });
    }
    if (fields.ideal !== undefined) {
      onSelecionarIdeal?.({ target: { value: fields.ideal } });
    }
    if (fields.vinculo !== undefined) {
      onSelecionarVinculo?.({ target: { value: fields.vinculo } });
    }
    if (fields.defeito !== undefined) {
      onSelecionarDefeito?.({ target: { value: fields.defeito } });
    }
  };

  const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Sorteia os 4 de uma vez só com animação e clique único
  const handleRandomizeAll = () => {
    const newTraco = getRandomItem(tracosOptions);
    const newIdeal = getRandomItem(ideaisOptions);
    const newVinculo = getRandomItem(vinculosOptions);
    const newDefeito = getRandomItem(defeitosOptions);

    setTraco(newTraco);
    setCurrentIdeal(newIdeal);
    setCurrentVinculo(newVinculo);
    setCurrentDefeito(newDefeito);

    syncToParent({
      traco: newTraco,
      ideal: newIdeal,
      vinculo: newVinculo,
      defeito: newDefeito,
    });
  };

  const handleSelectField = (field, value) => {
    if (field === "traco") {
      setTraco(value);
      syncToParent({ traco: value });
    } else if (field === "ideal") {
      setCurrentIdeal(value);
      syncToParent({ ideal: value });
    } else if (field === "vinculo") {
      setCurrentVinculo(value);
      syncToParent({ vinculo: value });
    } else if (field === "defeito") {
      setCurrentDefeito(value);
      syncToParent({ defeito: value });
    }
  };

  useEffect(() => {
    if (!characterData.tracoPersonalidade && !tracoPersonalidadeSelecionado) {
      syncToParent({
        traco: tracosOptions[0],
        ideal: ideaisOptions[0],
        vinculo: vinculosOptions[0],
        defeito: defeitosOptions[0],
      });
    }
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>TRAÇOS DE PERSONALIDADE</h2>
        <p className={styles.subtitle}>
          "O que define o caráter do seu herói? Suas falhas, virtudes e aspirações."
        </p>
        <div className={styles.divider} />
      </header>

      {/* Botão de Sortear Tudo no Topo */}
      <div className={styles.topToolbar}>
        <button
          type="button"
          className={styles.btnRandomAll}
          onClick={handleRandomizeAll}
          title="Preencher todos os traços de forma aleatória"
        >
          <CasinoOutlinedIcon sx={{ fontSize: "1.05rem" }} />
          <span>Sortear Toda a Personalidade</span>
        </button>
      </div>

      {/* 4 Seletores Estilizados */}
      <div className={styles.selectorsList}>
        {/* Traço */}
        <div className={styles.selectCard}>
          <div className={styles.labelRow}>
            <label htmlFor="select-traco">✦ Traço de Personalidade</label>
            <button
              type="button"
              className={styles.btnMiniRandom}
              onClick={() => handleSelectField("traco", getRandomItem(tracosOptions))}
              title="Sortear este traço"
            >
              <CasinoOutlinedIcon sx={{ fontSize: "1rem" }} />
            </button>
          </div>
          <select
            id="select-traco"
            className={styles.styledSelect}
            value={traco}
            onChange={(e) => handleSelectField("traco", e.target.value)}
          >
            {tracosOptions.map((item, idx) => (
              <option key={idx} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Ideal */}
        <div className={styles.selectCard}>
          <div className={styles.labelRow}>
            <label htmlFor="select-ideal">✦ Ideal Ético & Filosofia</label>
            <button
              type="button"
              className={styles.btnMiniRandom}
              onClick={() => handleSelectField("ideal", getRandomItem(ideaisOptions))}
              title="Sortear este ideal"
            >
              <CasinoOutlinedIcon sx={{ fontSize: "1rem" }} />
            </button>
          </div>
          <select
            id="select-ideal"
            className={styles.styledSelect}
            value={currentIdeal}
            onChange={(e) => handleSelectField("ideal", e.target.value)}
          >
            {ideaisOptions.map((item, idx) => (
              <option key={idx} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Vínculo */}
        <div className={styles.selectCard}>
          <div className={styles.labelRow}>
            <label htmlFor="select-vinculo">✦ Vínculo Primordial</label>
            <button
              type="button"
              className={styles.btnMiniRandom}
              onClick={() => handleSelectField("vinculo", getRandomItem(vinculosOptions))}
              title="Sortear este vínculo"
            >
              <CasinoOutlinedIcon sx={{ fontSize: "1rem" }} />
            </button>
          </div>
          <select
            id="select-vinculo"
            className={styles.styledSelect}
            value={currentVinculo}
            onChange={(e) => handleSelectField("vinculo", e.target.value)}
          >
            {vinculosOptions.map((item, idx) => (
              <option key={idx} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Defeito */}
        <div className={styles.selectCard}>
          <div className={styles.labelRow}>
            <label htmlFor="select-defeito">✦ Fraqueza ou Defeito</label>
            <button
              type="button"
              className={styles.btnMiniRandom}
              onClick={() => handleSelectField("defeito", getRandomItem(defeitosOptions))}
              title="Sortear este defeito"
            >
              <CasinoOutlinedIcon sx={{ fontSize: "1rem" }} />
            </button>
          </div>
          <select
            id="select-defeito"
            className={styles.styledSelect}
            value={currentDefeito}
            onChange={(e) => handleSelectField("defeito", e.target.value)}
          >
            {defeitosOptions.map((item, idx) => (
              <option key={idx} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cartão de Resumo Inferior */}
      <div className={styles.summaryContainer}>
        <h4 className={styles.summaryTitle}>RESUMO DO CARÁTER</h4>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <strong>Traço:</strong>
            <p>"{traco}"</p>
          </div>
          <div className={styles.summaryItem}>
            <strong>Ideal:</strong>
            <p>"{currentIdeal}"</p>
          </div>
          <div className={styles.summaryItem}>
            <strong>Vínculo:</strong>
            <p>"{currentVinculo}"</p>
          </div>
          <div className={styles.summaryItem}>
            <strong>Defeito:</strong>
            <p>"{currentDefeito}"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
