import React from "react";

function AntecedenteSelects(props) {
  const { tracoPersonalidade, ideal, defeito, vinculo, onSelectChange } = props;

  return (
    <div>
      <label htmlFor="tracoPersonalidade">Traço de Personalidade:</label>
      <select
        id="tracoPersonalidade"
        name="tracoPersonalidade"
        onChange={onSelectChange}
      >
        <option value="">Selecione...</option>
        {tracoPersonalidade.map((traco, index) => (
          <option key={index} value={traco}>
            {traco}
          </option>
        ))}
      </select>

      <label htmlFor="ideal">Ideal:</label>
      <select id="ideal" name="ideal" onChange={onSelectChange}>
        <option value="">Selecione...</option>
        {ideal.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>

      <label htmlFor="defeito">Defeito:</label>
      <select id="defeito" name="defeito" onChange={onSelectChange}>
        <option value="">Selecione...</option>
        {defeito.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>

      <label htmlFor="vinculo">Vínculo:</label>
      <select id="vinculo" name="vinculo" onChange={onSelectChange}>
        <option value="">Selecione...</option>
        {vinculo.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}

export default AntecedenteSelects;
