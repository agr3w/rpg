// Etapa7.js
import React from "react";
import styles from "pages/FichaPage/fichaPage.module.css";

const Etapa7 = ({
  antecedenteSelecionado,
  antecedente,
  negocioGuildaSelecionado,
  setNegocioGuildaSelecionado,
  caracteristicasGuildaSelecionado,
  setCaracteristicasGuildaSelecionado,
}) => {
  return (
    <div>
      <h2>Características do Antecedente</h2>
      {antecedente === "Acólito" && (
        <>
          <h3>Características Abrigo dos Fiés</h3>
          <div>
            <p>
              {
                antecedenteSelecionado.CaracteristicaDoAntecedente
                  .caracteristicaAbrigoDosFiéis
              }
            </p>
          </div>
          <div>
            <p>
              {
                antecedenteSelecionado.CaracteristicaDoAntecedente
                  .caracteristicasSugeridas
              }
            </p>
          </div>
        </>
      )}
      {antecedente === "Artesão de Guilda" && (
        <>
          <h3>Opções de Negócios da Guilda</h3>
          <select
            value={negocioGuildaSelecionado}
            onChange={(e) => setNegocioGuildaSelecionado(e.target.value)}
          >
            <option value="">Selecione um negócio da guilda</option>
            {antecedenteSelecionado.CaracteristicaDoAntecedente.negociosGuilda.map(
              (opcao) => (
                <option key={opcao} value={opcao}>
                  {opcao}
                </option>
              )
            )}
          </select>

          <h3>Características da Guilda</h3>
          <select
            value={caracteristicasGuildaSelecionado}
            onChange={(e) =>
              setCaracteristicasGuildaSelecionado(e.target.value)
            }
          >
            {antecedenteSelecionado.CaracteristicaDoAntecedente.caracteristicasGuilda.map(
              (opcao) => (
                <option key={opcao} value={opcao}>
                  {opcao}
                </option>
              )
            )}
          </select>
          <h3>Características Sugeridas</h3>
          <p>
            {
              antecedenteSelecionado.CaracteristicaDoAntecedente
                .caracteristicasSugeridas
            }
          </p>
        </>
      )}
      {antecedente === "Artista" && (
        <>
          <select>
            {antecedenteSelecionado.CaracteristicaDoAntecedente.rotinasArtisticas.map(
              (opcao) => (
                <option key={opcao} value={opcao}>
                  {opcao}
                </option>
              )
            )}
          </select>
          <h3>Características Demanda Popular</h3>
          <p>
            {
              antecedenteSelecionado.CaracteristicaDoAntecedente
                .caracteristicaDemandaPopular
            }
          </p>
          <h3>Características Sugeridas</h3>
          <p>
            {
              antecedenteSelecionado.CaracteristicaDoAntecedente
                .caracteristicasSugeridas
            }
          </p>
        </>
      )}
      {/* Adicione mais blocos condicionais para outros antecedentes, se necessário */}
    </div>
  );
};

export default Etapa7;
