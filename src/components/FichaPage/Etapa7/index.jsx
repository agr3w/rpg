// Etapa7.js
import React from "react";
import styles from "pages/FichaPage/fichaPage.module.css";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const Etapa7 = ({
  antecedenteSelecionado,
  antecedente,
  negocioGuildaSelecionado,
  setNegocioGuildaSelecionado,
  caracteristicasGuildaSelecionado,
  setCaracteristicasGuildaSelecionado,
  rotinasArtisticasSelcioando,
  setRotinasArtisticasSelecioando,
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
          <FormControl fullWidth>
            <InputLabel>Selecione um negócio da guilda</InputLabel>
            <Select
              value={negocioGuildaSelecionado}
              onChange={(e) => setNegocioGuildaSelecionado(e.target.value)}
            >
              <MenuItem value="">
                <em>Selecione um negócio da guilda</em>
              </MenuItem>
              {antecedenteSelecionado.CaracteristicaDoAntecedente.negociosGuilda.map(
                (opcao) => (
                  <MenuItem key={opcao} value={opcao}>
                    {opcao}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>

          <h3>Características da Guilda</h3>
          <FormControl fullWidth>
            <InputLabel>Selecione uma característica da guilda</InputLabel>
            <Select
              value={caracteristicasGuildaSelecionado}
              onChange={(e) =>
                setCaracteristicasGuildaSelecionado(e.target.value)
              }
            >
              {antecedenteSelecionado.CaracteristicaDoAntecedente.caracteristicasGuilda.map(
                (opcao) => (
                  <MenuItem key={opcao} value={opcao}>
                    {opcao}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
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
          <FormControl fullWidth>
            <InputLabel>Selecione uma rotina artística</InputLabel>
            <Select
              value={rotinasArtisticasSelcioando}
              onChange={(e) => setRotinasArtisticasSelecioando(e.target.value)}
            >
              {antecedenteSelecionado.CaracteristicaDoAntecedente.rotinasArtisticas.map(
                (opcao) => (
                  <MenuItem key={opcao} value={opcao}>
                    {opcao}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
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