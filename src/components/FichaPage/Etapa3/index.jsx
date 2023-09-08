import React from "react";
import { Button, Select, MenuItem } from "@mui/material"; // Importando componentes do Material-UI
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
    <>
      <label className={styles.label}>Classe:</label>
      <Select
        className={styles.input}
        value={classe}
        onChange={(e) => setClasse(e.target.value)}
      >
        <MenuItem value="">Selecione uma classe</MenuItem>
        {classesOptions.map((opcao) => (
          <MenuItem key={opcao} value={opcao}>
            {opcao}
          </MenuItem>
        ))}
      </Select>
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
            <Button onClick={handleTogglePainelHabilidades}>
              {exibirPainelHabilidades
                ? "Fechar Habilidades"
                : "Ver Habilidades"}
            </Button>

            {/* Painel de habilidades (será exibido se exibirPainelHabilidades for true) */}
            {exibirPainelHabilidades && (
              <div className={`${styles.painelHabilidades}`}>
                <h2>Habilidades da classe</h2>
                <p>
                  Habilidades nível 1:
                  {classeSelecioanda.habilidadesClasse.habilidadeNv1}
                </p>
                <p>
                  Habilidades nível 2:
                  {classeSelecioanda.habilidadesClasse.habilidadeNv2}
                </p>
                <p>
                  Habilidades nível 3:
                  {classeSelecioanda.habilidadesClasse.habilidadeNv3}
                </p>
                <p>
                  Habilidades nível 4:
                  {classeSelecioanda.habilidadesClasse.habilidadeNv4}
                </p>
              </div>
            )}
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
            <Select
              value={equipamentosClasseSelecionada1}
              onChange={(e) => setEquipamentoClasseSelecionado1(e.target.value)}
            >
              <MenuItem value="">Equipamentos da Classe</MenuItem>
              {classeSelecioanda.equipamentos.equipamentoAlpha1.map((opcao) => (
                <MenuItem key={opcao} value={opcao}>
                  {opcao}
                </MenuItem>
              ))}
            </Select>
            <Select
              value={equipamentosClasseSelecionada2}
              onChange={(e) => setEquipamentoClasseSelecionado2(e.target.value)}
            >
              <MenuItem value="">Equipamentos da Classe</MenuItem>
              {classeSelecioanda.equipamentos.equipamentoAlpha2.map((opcao) => (
                <MenuItem key={opcao} value={opcao}>
                  {opcao}
                </MenuItem>
              ))}
            </Select>
            <Select
              value={equipamentosClasseSelecionada3}
              onChange={(e) => setEquipamentoClasseSelecionado3(e.target.value)}
            >
              <MenuItem value="">Equipamentos da Classe</MenuItem>
              {classeSelecioanda.equipamentos.equipamentoAlpha3.map((opcao) => (
                <MenuItem key={opcao} value={opcao}>
                  {opcao}
                </MenuItem>
              ))}
            </Select>
          </div>
        </>
      )}
    </>
  );
};

export default Etapa3;
