// Etapa7.js
import React from "react";
import styles from "pages/FichaPage/fichaPage.module.css";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

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
      <h1 className={styles.h1}>Características do Antecedente</h1>
      {antecedente === "Acólito" && (
        <>
          <h1 className={styles.h2Habilidades}>Características Abrigo dos Fiés:</h1>
          <div className={styles.divTexto}>
            <p>
              {
                antecedenteSelecionado.CaracteristicaDoAntecedente
                  .caracteristicaAbrigoDosFiéis
              }
            </p>
          </div>
        </>
      )}
      {antecedente === "Artesão de Guilda" && (
        <>
          <div className={styles.espacamentoSelects}>
            <FormControl fullWidth>
              <InputLabel>Selecione um negócio da guilda</InputLabel>
              <Select
                label="Selecione um negócio da guilda"
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

            <FormControl fullWidth>
              <InputLabel>Selecione uma característica da guilda</InputLabel>
              <Select
                label="Selecione uma característica da guilda"
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
          </div>
        </>
      )}
      {antecedente === "Artista" && (
        <>
          <div className={styles.espacamentoSelects}>
            <FormControl fullWidth>
              <InputLabel>Selecione uma rotina artística</InputLabel>
              <Select
                label="Selecione uma rotina artística"
                value={rotinasArtisticasSelcioando}
                onChange={(e) =>
                  setRotinasArtisticasSelecioando(e.target.value)
                }
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
          </div>
          <Typography variant="h6" className={styles.h2Habilidades}>
            Características Demanda Popular
          </Typography>
          <p className={styles.divTexto}>
            {
              antecedenteSelecionado.CaracteristicaDoAntecedente
                .caracteristicaDemandaPopular
            }
          </p>
        </>
      )}
      <Typography variant="h6" className={styles.h2Habilidades}>
        Características sugeridas
      </Typography>
      <p className={styles.divTexto}>
        {
          antecedenteSelecionado.CaracteristicaDoAntecedente
            .caracteristicasSugeridas
        }
      </p>
      {/* Adicione mais blocos condicionais para outros antecedentes, se necessário */}
    </div>
  );
};

export default Etapa7;
