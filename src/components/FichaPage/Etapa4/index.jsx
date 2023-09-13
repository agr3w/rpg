import React from "react";
import {
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material"; // Importando componentes do Material-UI
import styles from "pages/FichaPage/fichaPage.module.css";

const Etapa4 = ({
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

  setExibirPainelHabilidades,
  exibirPainelHabilidades,

  classeSelecioanda,
}) => {
  const handleTogglePainelHabilidades = () => {
    setExibirPainelHabilidades(!exibirPainelHabilidades);
  };

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
      <div>
        <h1 className={styles.h1}>Selecione uma classe</h1>
        <FormControl fullWidth>
          <InputLabel>Classe</InputLabel>
          <Select
            value={classe}
            onChange={(e) => setClasse(e.target.value)}
            label="Classe"
          >
            <MenuItem value="">Selecione uma classe</MenuItem>
            {classesOptions.map((opcao) => (
              <MenuItem key={opcao} value={opcao}>
                {opcao}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className={styles.espacamentoTextoItem}>
          {/* Exiba os itens da classe selecionada */}
          {itensDaClasse.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </div>

        {/* 2 Selects de Equipamentos */}
        {(classe === "Bárbaro" ||
          classe === "Bardo" ||
          classe === "Bruxo" ||
          classe === "Clérigo" ||
          classe === "Druida" ||
          classe === "Feiticeiro" ||
          classe === "Guerreiro" ||
          classe === "Ladino" ||
          classe === "Mago" ||
          classe === "Monge" ||
          classe === "Paladino" ||
          classe === "Patrulheiro") && (
          <>
            <Button onClick={handleTogglePainelHabilidades}>
              {exibirPainelHabilidades
                ? "Fechar Habilidades"
                : "Ver Habilidades"}
            </Button>

            {/* Painel de habilidades (será exibido se exibirPainelHabilidades for true) */}
            {exibirPainelHabilidades && (
              <div className={`${styles.painelHabilidades}`}>
                <h2 className={styles.h2Habilidades}>Habilidades da classe</h2>
                <div className={styles.espacamentoTextoItem}>
                  <li>
                    Habilidades nível 1:
                    {classeSelecioanda.habilidadesClasse.habilidadeNv1}
                  </li>
                  <li>
                    Habilidades nível 2:
                    {classeSelecioanda.habilidadesClasse.habilidadeNv2}
                  </li>
                  <li>
                    Habilidades nível 3:
                    {classeSelecioanda.habilidadesClasse.habilidadeNv3}
                  </li>
                  <li>
                    Habilidades nível 4:
                    {classeSelecioanda.habilidadesClasse.habilidadeNv4}
                  </li>
                </div>
              </div>
            )}
            <div>
              <h1 className={styles.h2}>Proficiencias:</h1>
              <div className={styles.espacamentoTextoItem}>
                <li>Armaduras: {classeSelecioanda.proficiencias.armaduras}</li>
                <li>Armas: {classeSelecioanda.proficiencias.armas}</li>
                <li>
                  Ferramentas: {classeSelecioanda.proficiencias.ferramentas}
                </li>
                <li>
                  Testes de resistência:
                  {classeSelecioanda.proficiencias.testesDeResistecia}
                </li>
              </div>
              <h2 className={styles.h2}>
                Perícias, {classeSelecioanda.proficiencias.periciasLabel}
              </h2>
              <div className={styles.espacamentoTextoItem}>
                {classeSelecioanda.proficiencias.periciasSelecao.map(
                  (pericia) => (
                    <label key={pericia}>
                      <input
                        className={styles.checkBox}
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

            {/* Aqui corta as restricoes de classe para n ficar gigante */}

            <h2 className={styles.h2}>Equipamentos da Classe:</h2>
            <li className={styles.espacamentoTextoItem}>
              Item obrigatório: {classeSelecioanda.equipamentos.equipamentoObgt}
            </li>
            <div className={styles.espacamentoSelects}>
              <label className={styles.label}>
                Selecione os equipamentos da classe:
              </label>
              <FormControl fullWidth>
                <InputLabel>Equipamento 1</InputLabel>
                <Select
                  label="Equipamento 1"
                  value={equipamentosClasseSelecionada1}
                  onChange={(e) =>
                    setEquipamentoClasseSelecionado1(e.target.value)
                  }
                >
                  <MenuItem value="">Equipamentos da Classe</MenuItem>
                  {classeSelecioanda.equipamentos.equipamentoAlpha1.map(
                    (opcao) => (
                      <MenuItem key={opcao} value={opcao}>
                        {opcao}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Equipamento 2</InputLabel>
                <Select
                  label="Equipamento 2"
                  value={equipamentosClasseSelecionada2}
                  onChange={(e) =>
                    setEquipamentoClasseSelecionado2(e.target.value)
                  }
                >
                  <MenuItem value="">Equipamentos da Classe</MenuItem>
                  {classeSelecioanda.equipamentos.equipamentoAlpha2.map(
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
        {/* 3 Selects de Equipamentos */}
        {(classe === "Bardo" ||
          classe === "Bruxo" ||
          classe === "Druida" ||
          classe === "Feiticeiro" ||
          classe === "Guerreiro" ||
          classe === "Ladino" ||
          classe === "Mago" ||
          classe === "Paladino" ||
          classe === "Patrulheiro") && (
          <>
            <FormControl fullWidth>
              <InputLabel>Equipamento 3</InputLabel>
              <Select
                label="Equipamento 3"
                value={equipamentosClasseSelecionada3}
                onChange={(e) =>
                  setEquipamentoClasseSelecionado3(e.target.value)
                }
              >
                <MenuItem value="">Equipamentos da Classe</MenuItem>
                {classeSelecioanda.equipamentos.equipamentoAlpha3.map(
                  (opcao) => (
                    <MenuItem key={opcao} value={opcao}>
                      {opcao}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </>
        )}
        {/* 4 Selects de Equipamentos */}
        {(classe === "Clérigo" || classe === "Bardo") && (
          <>
            <FormControl fullWidth>
              <InputLabel>Equipamento 3</InputLabel>
              <Select
                label="Equipamento 3"
                value={equipamentosClasseSelecionada3}
                onChange={(e) =>
                  setEquipamentoClasseSelecionado3(e.target.value)
                }
              >
                <MenuItem value="">Equipamentos da Classe</MenuItem>
                {classeSelecioanda.equipamentos.equipamentoAlpha3.map(
                  (opcao) => (
                    <MenuItem key={opcao} value={opcao}>
                      {opcao}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </>
        )}
      </div>
  );
};

export default Etapa4;
