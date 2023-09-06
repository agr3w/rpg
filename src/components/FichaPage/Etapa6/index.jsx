// Etapa5.js
import React from "react";
import styles from "pages/FichaPage/fichaPage.module.css";

const Etapa6 = ({
  tracoPersonalidade,
  ideal,
  defeito,
  vinculo,
  tracoPersonalidadeSelecionado,
  idealSelecionado,
  defeitoSelecionado,
  vinculoSelecionado,
  onSelecionarTracoPersonalidade,
  onSelecionarIdeal,
  onSelecionarDefeito,
  onSelecionarVinculo,
}) => {
  return (
    <div>
      <label className={styles.label}>Traço de Personalidade:</label>
      <select
        className={styles.input}
        value={tracoPersonalidadeSelecionado}
        onChange={onSelecionarTracoPersonalidade}
      >
        <option value="">Selecione um traço de personalidade</option>
        {tracoPersonalidade.map((traco, index) => (
          <option key={index} value={traco}>
            {traco}
          </option>
        ))}
      </select>

      <label className={styles.label}>Ideal:</label>
      <select
        className={styles.input}
        value={idealSelecionado}
        onChange={onSelecionarIdeal}
      >
        <option value="">Selecione um ideal</option>
        {ideal.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>

      <label className={styles.label}>Defeito:</label>
      <select
        className={styles.input}
        value={defeitoSelecionado}
        onChange={onSelecionarDefeito}
      >
        <option value="">Selecione um defeito</option>
        {defeito.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>

      <label className={styles.label}>Vínculo:</label>
      <select
        className={styles.input}
        value={vinculoSelecionado}
        onChange={onSelecionarVinculo}
      >
        <option value="">Selecione um vínculo</option>
        {vinculo.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Etapa6;
