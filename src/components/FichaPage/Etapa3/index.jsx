// Etapa3.js

import React from "react";
import styles from "pages/FichaPage/fichaPage.module.css";

const Etapa3 = ({
  classe,
  setClasse,
  classesOptions,
  itensDaClasse,

  equipamentosClasseSelecionada1,
  setEquipamentoClasseSelecionado1,

  equipamentosClasseSelecionada2,
  setEquipamentoClasseSelecionado2,

  equipamentosClasseSelecionada3,
  setEquipamentoClasseSelecionado3,

  periciasClasseSelecionadas,
  setPericiasSelecionadas,

  classeSelecioanda,
}) => {
  const handleCheckboxChange = (e) => {
    const periciaSelecionada = e.target.value;
    // Verifique se a pericia já está selecionada
    if (periciasClasseSelecionadas.includes(periciaSelecionada)) {
      // Se estiver selecionada, remova-a da lista de seleções
      setPericiasSelecionadas((prevPericias) =>
        prevPericias.filter((pericia) => pericia !== periciaSelecionada)
      );
    } else if (
      periciasClasseSelecionadas.length <
      classeSelecioanda.proficiencias.perficiasMinimo
    ) {
      // Se ainda não estiverem selecionadas 2 perícias, adicione-a
      setPericiasSelecionadas((prevPericias) => [
        ...prevPericias,
        periciaSelecionada,
      ]);
    }
  };

  return (
    <>
      <label className={styles.label}>Classe:</label>
      <select
        className={styles.input}
        value={classe}
        onChange={(e) => setClasse(e.target.value)}
      >
        <option value="">Selecione uma classe</option>
        {classesOptions.map((opcao) => (
          <option key={opcao} value={opcao}>
            {opcao}
          </option>
        ))}
      </select>
      <div>
        {/* Exiba os itens da classe selecionada */}
        {itensDaClasse.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </div>

      {/* Lembrar das variações de equipamentos, pois uns possuem até 5 selects */}

      {(classe === "Mago" || classe === "cu") && (
        <>
          <div>
            <div>
              <h1>Proficiencias:</h1>
              <p>Armaduras: {classeSelecioanda.proficiencias.armaduras}</p>
              <p>Armas: {classeSelecioanda.proficiencias.armas}</p>
              <p>Ferramentas: {classeSelecioanda.proficiencias.ferramentas}</p>
              <p>
                Testes de resistência:
                {classeSelecioanda.proficiencias.testesDeResistecia}
              </p>
              <label>
                Perícias, {classeSelecioanda.proficiencias.periciasLabel}
              </label>
              <div>
                {classeSelecioanda.proficiencias.periciasSelecao.map(
                  (pericia) => (
                    <label key={pericia}>
                      <input
                        type="checkbox"
                        value={pericia}
                        checked={periciasClasseSelecionadas.includes(pericia)}
                        onChange={handleCheckboxChange}
                        disabled={
                          periciasClasseSelecionadas.length ===
                            classeSelecioanda.proficiencias.perficiasMinimo &&
                          !periciasClasseSelecionadas.includes(pericia)
                        }
                      />
                      {pericia}
                    </label>
                  )
                )}
              </div>
            </div>

            <h1>Equipamentos da Classe:</h1>
            <p>{classeSelecioanda.equipamentos.equipamentoObgt}</p>
            <select
              value={equipamentosClasseSelecionada1}
              onChange={(e) => setEquipamentoClasseSelecionado1(e.target.value)}
            >
              <option value="">Equipamentos da Classe</option>
              {classeSelecioanda.equipamentos.equipamentoAlpha1.map((opcao) => (
                <option key={opcao} value={opcao}>
                  {opcao}
                </option>
              ))}{" "}
            </select>
            <select
              value={equipamentosClasseSelecionada2}
              onChange={(e) => setEquipamentoClasseSelecionado2(e.target.value)}
            >
              <option value="">Equipamentos da Classe</option>
              {classeSelecioanda.equipamentos.equipamentoAlpha2.map((opcao) => (
                <option key={opcao} value={opcao}>
                  {opcao}
                </option>
              ))}{" "}
            </select>
            <select
              value={equipamentosClasseSelecionada3}
              onChange={(e) => setEquipamentoClasseSelecionado3(e.target.value)}
            >
              <option value="">Equipamentos da Classe</option>
              {classeSelecioanda.equipamentos.equipamentoAlpha3.map((opcao) => (
                <option key={opcao} value={opcao}>
                  {opcao}
                </option>
              ))}{" "}
            </select>
          </div>
        </>
      )}
    </>
  );
};

export default Etapa3;
