// FichaPage.js
import React, { useState, useEffect } from "react";
import styles from "./fichaPage.module.css";
import { enviarFichaParaDatabase } from "components/FichaPage/FichaDatabase";
import { racas, classes } from "Array/RacaEClasse";
import Etapa1 from "components/FichaPage/Etapa1";
import Etapa2 from "components/FichaPage/Etapa2";
import Etapa3 from "components/FichaPage/Etapa3";
import {
  encontrarItensPorNome,
  getAcolitoCaracteristicasFields,
  getArtesaoCaracteristicasFields,
  getArtistaCaracteristicasFields,
  getHumanoCaracteristicasFields,
} from "Utils/Untils";
import { tendencias } from "Array/Tendencias";
import Etapa4 from "components/FichaPage/Etapa4";
import { antecedentes } from "Array/Antecedentes";
import Etapa6 from "components/FichaPage/Etapa6";
import Etapa5 from "components/FichaPage/Etapa5";
import Etapa7 from "components/FichaPage/Etapa7";
import { idiomasArray } from "Array/Idiomas";
import Etapa8 from "components/FichaPage/Etapa8";

const FichaPage = () => {
  const [nome, setNome] = useState("");
  const [raca, setRaca] = useState("");
  const [classe, setClasse] = useState("");
  const [tendencia, setTendencia] = useState("");
  const [idiomaDoAntecedente, setIdiomaAntecedente] = useState("");
  const [idiomaDoAntecendente2, setIdiomaAntecendente2] = useState("");
  const [etapa, setEtapa] = useState(1);
  const [itensDaRaca, setItensDaRaca] = useState([]);
  const [itensDaClasse, setItensDaClasse] = useState([]);
  const [itensDaTendencia, setItensDaTendencia] = useState([]);
  const [itensDaAntecedencia, setItensAntecedencia] = useState([]);
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

  const [rotinasArtisticasSelcioando, setRotinasArtisticasSelecioando] =
    useState("");

  const [riquezaInicial, setRiquezaInicial] = useState(0);

  const [idiomaRacaSelecionado, setIdiomaRacaSelecionado] = useState("");
  const [idiomaRacaSelecionado2, setIdiomaRacaSelecionado2] = useState("");

  const [equipamentosClasseSelecionada1, setEquipamentoClasseSelecionado1] =
    useState("");
  const [equipamentosClasseSelecionada2, setEquipamentoClasseSelecionado2] =
    useState("");
  const [equipamentosClasseSelecionada3, setEquipamentoClasseSelecionado3] =
    useState("");

  const [periciasClasseSelecionadas, setPericiasSelecionadas] = useState([]);

  const [exibirPainelHabilidades, setExibirPainelHabilidades] = useState("")


  const racasOptions = racas.map((r) => r.nome);
  const classesOptions = classes.map((c) => c.nome);
  const TendenciasOptions = tendencias.map((t) => t.nome);
  const idiomaOption = idiomasArray.map((i) => i);

  const racaSelecionada = racas.find((r) => r.nome === raca);
  const classeSelecioanda = classes.find((c) => c.nome === classe);

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
    setItensAntecedencia(encontrarItensPorNome(antecedente, antecedentes));
  }, [antecedente]);

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

  const handleConcluir = () => {
    // Racas
    const HuamnoField = getHumanoCaracteristicasFields(
      racaSelecionada,
      idiomaRacaSelecionado,
      idiomaRacaSelecionado2
    );

    // Classes
    const ArtesaoField = getArtesaoCaracteristicasFields(
      antecedente,
      caracteristicasGuildaSelecionado,
      negocioGuildaSelecionado,
      idiomaDoAntecedente
    );
    const AcolitoField = getAcolitoCaracteristicasFields(
      antecedente,
      antecedenteSelecionado,
      idiomaDoAntecedente,
      idiomaDoAntecendente2
    );
    const ArtistaField = getArtistaCaracteristicasFields(
      antecedente,
      rotinasArtisticasSelcioando,
      antecedenteSelecionado
    );

    // RacasParaMandar

    const RacasInfo = {
      Idiomas: { idiomaRacaSelecionado, idiomaRacaSelecionado2 },
    };

    // ClassesParaMandar

    const Classesinfo = {
      Equipamentos: {
        equipamentosClasseSelecionada1,
        equipamentosClasseSelecionada2,
        equipamentosClasseSelecionada3,
        equipamentoObgt: classeSelecioanda.equipamentos.equipamentoObgt,
      },
      periciasClasseSelecionadas,
    };

    const itensSelecionados = {
      tracoPersonalidade: tracoPersonalidadeSelecionado,
      ideal: idealSelecionado,
      defeito: defeitoSelecionado,
      vinculo: vinculoSelecionado,
      antecedente: antecedente,
      caracteristicas: {
        ...ArtesaoField,
        ...AcolitoField,
        ...ArtistaField,
        CaracteristicasSugeridas:
          antecedenteSelecionado.CaracteristicaDoAntecedente
            .caracteristicasSugeridas,
      },
    };

    // Envio

    enviarFichaParaDatabase(
      nome,
      raca,
      classe,
      tendencia,
      itensSelecionados,
      riquezaInicial,
      RacasInfo,
      Classesinfo
    );

    // Em seguida, você pode redirecionar o usuário para outra página ou realizar outra ação
  };

  const handleRiquezaInicialCalculada = (riqueza) => {
    setRiquezaInicial(riqueza);
  };

  return (
    <div className={styles.pageContainer}>
      {/* <h1>Crie sua Ficha de Personagem</h1> */}
      {etapa === 1 && <Etapa1 nome={nome} setNome={setNome} />}
      {etapa === 2 && (
        <Etapa2
          raca={raca}
          setRaca={setRaca}
          racasOptions={racasOptions}
          itensDaRaca={itensDaRaca}
          racaSelecionada={racaSelecionada}
          idiomaRacaSelecionado={idiomaRacaSelecionado}
          setIdiomaRacaSelecionado={setIdiomaRacaSelecionado}
          idiomaRacaSelecionado2={idiomaRacaSelecionado2}
          setIdiomaRacaSelecionado2={setIdiomaRacaSelecionado2}
          idiomaOption={idiomaOption}
        />
      )}
      {etapa === 3 && (
        <Etapa3
          classe={classe}
          setClasse={setClasse}
          classesOptions={classesOptions}
          itensDaClasse={itensDaClasse}
          equipamentosClasseSelecionada1={equipamentosClasseSelecionada1}
          setEquipamentoClasseSelecionado1={setEquipamentoClasseSelecionado1}
          equipamentosClasseSelecionada2={equipamentosClasseSelecionada2}
          setEquipamentoClasseSelecionado2={setEquipamentoClasseSelecionado2}
          equipamentosClasseSelecionada3={equipamentosClasseSelecionada3}
          setEquipamentoClasseSelecionado3={setEquipamentoClasseSelecionado3}
          classeSelecioanda={classeSelecioanda}
          periciasClasseSelecionadas={periciasClasseSelecionadas}
          setPericiasSelecionadas={setPericiasSelecionadas}
          setExibirPainelHabilidades={setExibirPainelHabilidades}
          exibirPainelHabilidades={exibirPainelHabilidades}
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
          antecedentesOptions={antecedentes.map((a) => a.nome)}
          itensDaAntecedencia={itensDaAntecedencia}
          idiomaDoAntecedente={idiomaDoAntecedente}
          idiomaDoAntecendente2={idiomaDoAntecendente2}
          setIdiomaAntecedente={setIdiomaAntecedente}
          setIdiomaAntecendente2={setIdiomaAntecendente2}
          idiomaOption={idiomaOption}
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
        // continuar
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
          rotinasArtisticasSelcioando={rotinasArtisticasSelcioando}
          setRotinasArtisticasSelecioando={setRotinasArtisticasSelecioando}
        />
      )}
      {etapa === 8 && (
        <Etapa8
          riquezaInicial={riquezaInicial}
          setRiquezaInicial={setRiquezaInicial}
          classeSelecionada={classe}
          onRiquezaInicialCalculada={handleRiquezaInicialCalculada}
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
