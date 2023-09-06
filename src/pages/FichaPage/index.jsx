// FichaPage.js
import React, { useState, useEffect } from "react";
import styles from "./fichaPage.module.css";
import { enviarFichaParaDatabase } from "components/FichaPage/FichaDatabase";
import { racas, classes } from "Array/RacaEClasse";
import Etapa1 from "components/FichaPage/Etapa1";
import Etapa2 from "components/FichaPage/Etapa2";
import Etapa3 from "components/FichaPage/Etapa3";
import { encontrarItensPorNome } from "Utils/Untils";
import { tendencias } from "Array/Tendencias";
import Etapa4 from "components/FichaPage/Etapa4";
import { antecedentes } from "Array/Antecedentes";
import Etapa6 from "components/FichaPage/Etapa6";
import Etapa5 from "components/FichaPage/Etapa5";
import Etapa7 from "components/FichaPage/Etapa7";

const FichaPage = () => {
  const [nome, setNome] = useState("");
  const [raca, setRaca] = useState("");
  const [classe, setClasse] = useState("");
  const [tendencia, setTendencia] = useState("");
  const [etapa, setEtapa] = useState(1);
  const [itensDaRaca, setItensDaRaca] = useState([]);
  const [itensDaClasse, setItensDaClasse] = useState([]);
  const [itensDaTendencia, setItensDaTendencia] = useState([]);
  const [antecedente, setAntecedente] = useState("");
  const [antecedenteSelecionado, setAntecedenteSelecionado] = useState(null);
  const [tracoPersonalidadeSelecionado, setTracoPersonalidadeSelecionado] =
    useState("");
  const [idealSelecionado, setIdealSelecionado] = useState("");
  const [defeitoSelecionado, setDefeitoSelecionado] = useState("");
  const [vinculoSelecionado, setVinculoSelecionado] = useState("");

  // Antecedente detalhe
  const [negocioGuildaSelecionado, setNegocioGuildaSelecionado] = useState("");
  const [
    caracteristicasGuildaSelecionado,
    setCaracteristicasGuildaSelecionado,
  ] = useState("");
  const [caracteristicaAbrigoDosFiéisTest] = useState("");

  const racasOptions = racas.map((r) => r.nome);
  const classesOptions = classes.map((c) => c.nome);
  const TendenciasOptions = tendencias.map((t) => t.nome);

  useEffect(() => {
    // Quando a raça selecionada mudar, encontre os itens correspondentes
    const racaSelecionada = racas.find((r) => r.nome === raca);
    if (racaSelecionada) {
      setItensDaRaca(racaSelecionada.habilidades);
    } else {
      setItensDaRaca([]); // Se a raça não for encontrada, limpe a lista de itens
    }
  }, [raca]);

  useEffect(() => {
    // Quando a raça selecionada mudar, encontre os itens correspondentes
    setItensDaTendencia(encontrarItensPorNome(tendencia, tendencias));
  }, [tendencia]);

  useEffect(() => {
    const itensDaClasse = encontrarItensPorNome(classe, classes);
    setItensDaClasse(itensDaClasse);
  }, [classe]);

  const handleNext = () => {
    if (etapa === 5 && antecedente !== "") {
      // Certifique-se de que o jogador tenha selecionado um antecedente
      const antecedenteEncontrado = antecedentes.find(
        (a) => a.nome === antecedente
      );
      if (antecedenteEncontrado) {
        setAntecedenteSelecionado(antecedenteEncontrado);
      }
    }
    if (etapa < 10) {
      setEtapa(etapa + 1);
    }
  };

  const handlePrevious = () => {
    if (etapa > 1) {
      setEtapa(etapa - 1);
    }
  };
  // verificação de antecedente
  const getArtesaoCaracteristicasFields = (antecedente) => {
    if (antecedente === "Artesão de Guilda") {
      return {
        CaracterísticasDaGuilda: caracteristicasGuildaSelecionado,
        NegocioDaGuilda: negocioGuildaSelecionado,
      };
    }
    return {};
  };

  const getAcolitoCaracteristicasFields = (antecedente) => {
    if (antecedente === "Acólito") {
      return {
        caracteristicaAbrigoDosFiéis:
          antecedenteSelecionado.CaracteristicaDoAntecedente
            .caracteristicaAbrigoDosFiéis,
      };
    }
    return {};
  };

  const handleConcluir = () => {
    // Primeiro, envie as informações para o Realtime Database
    const ArtesaoField = getArtesaoCaracteristicasFields(antecedente);
    const AcolitoField = getAcolitoCaracteristicasFields(antecedente);

    const itensSelecionados = {
      tracoPersonalidade: tracoPersonalidadeSelecionado,
      ideal: idealSelecionado,
      defeito: defeitoSelecionado,
      vinculo: vinculoSelecionado,
      antecedente: antecedente,
      caracteristicas: {
        ...ArtesaoField,
        AcolitoField,
        caracteristicaAbrigoDosFiéis: caracteristicaAbrigoDosFiéisTest,
        CaracteristicasSugeridas:
          antecedenteSelecionado.CaracteristicaDoAntecedente
            .caracteristicasSugeridas,
      },
    };

    enviarFichaParaDatabase(nome, raca, classe, tendencia, itensSelecionados);

    // Em seguida, você pode redirecionar o usuário para outra página ou realizar outra ação
  };

  return (
    <div className={styles.pageContainer}>
      <h1>Crie sua Ficha de Personagem</h1>
      {etapa === 1 && <Etapa1 nome={nome} setNome={setNome} />}
      {etapa === 2 && (
        <Etapa2
          raca={raca}
          setRaca={setRaca}
          racasOptions={racasOptions}
          itensDaRaca={itensDaRaca}
        />
      )}
      {etapa === 3 && (
        <Etapa3
          classe={classe}
          setClasse={setClasse}
          classesOptions={classesOptions}
          itensDaClasse={itensDaClasse}
        />
      )}
      {etapa === 4 && (
        <Etapa4
          tendencia={tendencia}
          setTendencia={setTendencia}
          TendenciasOptions={TendenciasOptions}
          itensDaTendencia={itensDaTendencia}
        />
      )}
      {etapa === 5 && (
        <Etapa5
          antecedente={antecedente}
          setAntecedente={setAntecedente}
          antecedentesOptions={antecedentes.map((a) => a.nome)} // Substitua com suas opções de antecedentes
        />
      )}
      {etapa === 6 && antecedenteSelecionado && (
        <Etapa6
          tracoPersonalidade={antecedenteSelecionado.tracoPersonalidade}
          ideal={antecedenteSelecionado.ideal}
          defeito={antecedenteSelecionado.defeito}
          vinculo={antecedenteSelecionado.vinculo}
          tracoPersonalidadeSelecionado={tracoPersonalidadeSelecionado}
          idealSelecionado={idealSelecionado}
          defeitoSelecionado={defeitoSelecionado}
          vinculoSelecionado={vinculoSelecionado}
          onSelecionarTracoPersonalidade={(e) =>
            setTracoPersonalidadeSelecionado(e.target.value)
          }
          setTracoPersonalidadeSelecionado={setTracoPersonalidadeSelecionado}
          onSelecionarIdeal={(e) => setIdealSelecionado(e.target.value)}
          onSelecionarDefeito={(e) => setDefeitoSelecionado(e.target.value)}
          onSelecionarVinculo={(e) => setVinculoSelecionado(e.target.value)}
        />
      )}
      {etapa === 7 && (
        <Etapa7
          antecedente={antecedente}
          antecedenteSelecionado={antecedenteSelecionado}
          negocioGuildaSelecionado={negocioGuildaSelecionado}
          setNegocioGuildaSelecionado={setNegocioGuildaSelecionado}
          caracteristicasGuildaSelecionado={caracteristicasGuildaSelecionado}
          setCaracteristicasGuildaSelecionado={
            setCaracteristicasGuildaSelecionado
          }
          caracteristicaAbrigoDosFiéisTest={caracteristicaAbrigoDosFiéisTest}
        />
      )}
      {/* Renderize outras etapas, se necessário */}
      {etapa < 10 ? (
        <button className={styles.button} onClick={handleNext}>
          Próxima Etapa
        </button>
      ) : (
        <button className={styles.button} onClick={handleConcluir}>
          Concluir
        </button>
      )}
      {etapa > 1 && (
        <button className={styles.button} onClick={handlePrevious}>
          Etapa Anterior
        </button>
      )}
    </div>
  );
};

export default FichaPage;
