// EtapaAnterior.js
import React from "react";
import styles from "pages/FichaPage/fichaPage.module.css";

const Etapa5 = ({ antecedente, setAntecedente, antecedentesOptions, itensDaAntecedencia }) => {
  return (
    <>
      <label className={styles.label}>Antecedente:</label>
      <select
        className={styles.input}
        value={antecedente}
        onChange={(e) => setAntecedente(e.target.value)}
      >
        <option value="">Selecione um antecedente</option>
        {antecedentesOptions.map((opcao) => (
          <option key={opcao} value={opcao}>
            {opcao}
          </option>
        ))}
      </select>
      {/* não necessariamente precisa se chamar item, dps é só mudar no Utilits,
       quer dizer q podemos ter várias divs com vários nomes, dando para deixar bonito */}
      <div>
        {itensDaAntecedencia.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </div>
    </>
  );
};

export default Etapa5;
