import React from "react";
import styles from "pages/FichaPage/fichaPage.module.css";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

const SingleTextSection = ({ antecedenteSelecionado }) => {
  return (
    <>
      <h1 className={styles.h2Habilidades}>
        Características{" "}
        {
          antecedenteSelecionado?.CaracteristicaDoAntecedente
            ?.LabelCaracteristicaTexto1
        }
      </h1>
      <div className={styles.divTexto}>
        <p>
          {
            antecedenteSelecionado?.CaracteristicaDoAntecedente
              ?.CaracteristicaTexto1
          }
        </p>
      </div>
    </>
  );
};

const SelectsSection = ({
  antecedente,
  antecedenteSelecionado,
  CarcDosAntecedentes1,
  setCarcDosAntecedents1,
  CarcDosAntecedentes2,
  setCarcDosAntecedentes2,
}) => {
  return (
    <div className={styles.espacamentoSelects}>
      <FormControl fullWidth>
        <InputLabel>
          {
            antecedenteSelecionado?.CaracteristicaDoAntecedente
              ?.LabelCaracteristicaSelect1
          }
        </InputLabel>
        <Select
          label={
            antecedenteSelecionado?.CaracteristicaDoAntecedente
              ?.LabelCaracteristicaSelect1
          }
          value={CarcDosAntecedentes1}
          onChange={(e) => setCarcDosAntecedents1(e.target.value)}
        >
          <MenuItem value="">
            <em>
              {
                antecedenteSelecionado.CaracteristicaDoAntecedente
                  .LabelCaracteristicaSelect1
              }
            </em>
          </MenuItem>
          {antecedenteSelecionado.CaracteristicaDoAntecedente.CaracteristicaSelect1.map(
            (opcao) => (
              <MenuItem key={opcao} value={opcao}>
                {opcao}
              </MenuItem>
            )
          )}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>
          {
            antecedenteSelecionado?.CaracteristicaDoAntecedente
              ?.LabelCaracteristicaSelect2
          }
        </InputLabel>
        <Select
          label={
            antecedenteSelecionado?.CaracteristicaDoAntecedente
              ?.LabelCaracteristicaSelect2
          }
          value={CarcDosAntecedentes2}
          onChange={(e) => setCarcDosAntecedentes2(e.target.value)}
        >
          {antecedenteSelecionado.CaracteristicaDoAntecedente.CaracteristicaSelect2.map(
            (opcao) => (
              <MenuItem key={opcao} value={opcao}>
                {opcao}
              </MenuItem>
            )
          )}
        </Select>
      </FormControl>
    </div>
  );
};

const TextAndSelectSection = ({
  antecedenteSelecionado,
  CarcDosAntecedentes3,
  setCarcDosAntecedents3,
}) => {
  return (
    <>
      <div className={styles.espacamentoSelects}>
        <FormControl fullWidth>
          <InputLabel>
            {
              antecedenteSelecionado?.CaracteristicaDoAntecedente
                ?.LabelCaracteristicaSelect1
            }
          </InputLabel>
          <Select
            label={
              antecedenteSelecionado?.CaracteristicaDoAntecedente
                ?.LabelCaracteristicaSelect1
            }
            value={CarcDosAntecedentes3}
            onChange={(e) => setCarcDosAntecedents3(e.target.value)}
          >
            {antecedenteSelecionado.CaracteristicaDoAntecedente.CaracteristicaSelect1.map(
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
        Características{" "}
        {
          antecedenteSelecionado?.CaracteristicaDoAntecedente
            ?.LabelCaracteristicaTexto1
        }
      </Typography>
      <p className={styles.divTexto}>
        {
          antecedenteSelecionado?.CaracteristicaDoAntecedente
            ?.CaracteristicaTexto1
        }
      </p>
    </>
  );
};

const Etapa7 = ({
  antecedenteSelecionado,
  antecedente,
  CarcDosAntecedentes1,
  setCarcDosAntecedents1,
  CarcDosAntecedentes2,
  setCarcDosAntecedentes2,
  CarcDosAntecedentes3,
  setCarcDosAntecedents3,
}) => {
  return (
    <div>
      <h1 className={styles.h1}>Características do Antecedente</h1>

      {antecedente === "Acólito" ||
      antecedente === "Marinheiro" ||
      antecedente === "Nobre" ||
      antecedente === "Órfão" ? (
        <SingleTextSection antecedenteSelecionado={antecedenteSelecionado} />
      ) : null}

      {antecedente === "Artesão de Guilda" ? (
        <SelectsSection
          antecedente={antecedente}
          antecedenteSelecionado={antecedenteSelecionado}
          CarcDosAntecedentes1={CarcDosAntecedentes1}
          setCarcDosAntecedents1={setCarcDosAntecedents1}
          CarcDosAntecedentes2={CarcDosAntecedentes2}
          setCarcDosAntecedentes2={setCarcDosAntecedentes2}
        />
      ) : null}

      {antecedente === "Charlatão" ||
      antecedente === "Artista" ||
      antecedente === "Charlatão" ||
      antecedente === "Criminoso" ||
      antecedente === "Eremita" ||
      antecedente === "Forasteiro" ||
      antecedente === "Sábio" ||
      antecedente === "Soldado" ||
      antecedente === "Herói do Povo" ? (
        <TextAndSelectSection
          antecedenteSelecionado={antecedenteSelecionado}
          CarcDosAntecedentes3={CarcDosAntecedentes3}
          setCarcDosAntecedents3={setCarcDosAntecedents3}
        />
      ) : null}

      <Typography variant="h6" className={styles.h2Habilidades}>
        Características sugeridas
      </Typography>
      <p className={styles.divTexto}>
        {
          antecedenteSelecionado?.CaracteristicaDoAntecedente
            ?.caracteristicasSugeridas
        }
      </p>
    </div>
  );
};

export default Etapa7;
