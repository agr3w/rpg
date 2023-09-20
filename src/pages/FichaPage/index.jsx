// FichaPage.js
import React, { useState, useEffect } from "react";
import styles from "./fichaPage.module.css";
import styleFundo from "pages/FichaDetalhes/fichaDetalhe.module.css";
import { enviarFichaParaDatabase } from "components/FichaPage/FichaDatabase";
import { racas, classes } from "Array/RacaEClasse";
import {
  encontrarItensPorNome,
  getAcolitoCaracteristicasFields,
  getArtesaoCaracteristicasFields,
  getArtistaCaracteristicasFields,
  getIdiomasAntecendete,
  getIdiomasAntecendete1,
  getSubRacasField,
  getSubRacasGnomoField,
} from "Utils/Untils";
import { tendencias } from "Array/Tendencias";
import { antecedentes } from "Array/Antecedentes";
import { idiomasArray } from "Array/Idiomas";
import Etapa1 from "components/FichaPage/Etapa1";
import Etapa2 from "components/FichaPage/Etapa2";
import Etapa4 from "components/FichaPage/Etapa4";
import Etapa5 from "components/FichaPage/Etapa5";
import Etapa6 from "components/FichaPage/Etapa6";
import Etapa7 from "components/FichaPage/Etapa7";
import Etapa8 from "components/FichaPage/Etapa8";
import Etapa9 from "components/FichaPage/Etapa9";
import Etapa10 from "components/FichaPage/Etapa10";
import Etapa3 from "components/FichaPage/Etapa3";
import { Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { backgrounds } from "pages/FichaDetalhes/backgounds/arrayLinksBackgrounds";

const FichaCriar = () => {
  const [nome, setNome] = useState("");
  const [raca, setRaca] = useState("");
  const [SubRaca, setSubRaca] = useState("");
  const [classe, setClasse] = useState("");
  const [tendencia, setTendencia] = useState("");
  const [idiomaDoAntecedente, setIdiomaAntecedente] = useState("");
  const [idiomaDoAntecendente2, setIdiomaAntecendente2] = useState("");
  const [IdiomaAltoElfo, setIdiomaAltoElfoSelecioando] = useState(""); // Estado para armazenar o idioma do Alto Elfo

  const [etapa, setEtapa] = useState(1);
  const [itensDaRaca, setItensDaRaca] = useState([]);
  const [itensDaClasse, setItensDaClasse] = useState([]);
  const [itensDaTendencia, setItensDaTendencia] = useState([]);
  const [itensDaAntecedencia, setItensAntecedencia] = useState([]);
  const [antecedente, setAntecedente] = useState("");
  const [antecedenteSelecionado, setAntecedenteSelecionado] = useState(null);
  const [detalhesSubRaca, setDetalhesSubRaca] = useState(null);
  const [tracoPersonalidadeSelecionado, setTracoPersonalidadeSelecionado] =
    useState("");
  const [idealSelecionado, setIdealSelecionado] = useState("");
  const [defeitoSelecionado, setDefeitoSelecionado] = useState("");
  const [vinculoSelecionado, setVinculoSelecionado] = useState("");

  // Antecedente detalhe
  const [CarcDosAntecedentes1, setCarcDosAntecedents1] = useState("");
  const [CarcDosAntecedentes2, setCarcDosAntecedentes2] = useState("");
  const [CarcDosAntecedentes3, setCarcDosAntecedents3] = useState("");

  const [riquezaInicial, setRiquezaInicial] = useState(0);

  const [idiomaRacaSelecionado, setIdiomaRacaSelecionado] = useState("");
  const [idiomaRacaSelecionado2, setIdiomaRacaSelecionado2] = useState("");

  const [equipamentosClasseSelecionada1, setEquipamentoClasseSelecionado1] =
    useState("");
  const [equipamentosClasseSelecionada2, setEquipamentoClasseSelecionado2] =
    useState("");
  const [equipamentosClasseSelecionada3, setEquipamentoClasseSelecionado3] =
    useState("");

  const [equipamentosClasseSelecionada4, setEquipamentoClasseSelecionado4] =
    useState("");

  const [periciasClasseSelecionadas, setPericiasSelecionadas] = useState([]);

  const [exibirPainelHabilidades, setExibirPainelHabilidades] = useState("");

  const [valoresHabilidade, setValoresHabilidade] = useState({
    Força: "",
    Destreza: "",
    Constituição: "",
    Inteligência: "",
    Sabedoria: "",
    Carisma: "",
  });

  const [Engenhocas, setEngenhocas] = useState("");

  const racasOptions = racas.map((r) => r.nome);
  const classesOptions = classes.map((c) => c.nome);
  const TendenciasOptions = tendencias.map((t) => t.nome);
  const idiomaOption = idiomasArray.map((i) => i);
  const racaSelecionada = racas.find((r) => r.nome === raca);
  // const detalhes = racaSelecionada.SubRacas.find(
  //   (subRaca) => subRaca.subRacaNome === racas
  // );
  const classeSelecioanda = classes.find((c) => c.nome === classe);
  const SubRacasOptions =
    racaSelecionada && racaSelecionada.SubRacas
      ? racaSelecionada.SubRacas.map((subRaca) => subRaca.subRacaNome)
      : [];

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

  const handleSubRacaChange = (e) => {
    const subRacaSelecionada = e.target.value;
    setSubRaca(subRacaSelecionada);

    // Encontre os detalhes da sub-raça selecionada com base no nome da sub-raça
    const detalhes = racaSelecionada.SubRacas.find(
      (subRaca) => subRaca.subRacaNome === subRacaSelecionada
    );

    setDetalhesSubRaca(detalhes);
  };

  const handleNext = () => {
    if (etapa === 6 && antecedente !== "") {
      // Certifique-se de que o jogador tenha selecionado um antecedente
      const antecedenteEncontrado = antecedentes.find(
        (a) => a.nome === antecedente
      );
      if (antecedenteEncontrado) {
        setAntecedenteSelecionado(antecedenteEncontrado);
      }
    }
    if (checkRequiredFields()) {
      if (etapa < 11) {
        setEtapa(etapa + 1);
      }
    } else {
      alert(
        "Por favor, preencha todos os campos obrigatórios antes de prosseguir."
      );
    }
  };

  const handlePrevious = () => {
    if (etapa > 1) {
      setEtapa(etapa - 1);
    }
  };

  const handleConcluir = () => {
    // SubRacas

    const SubRacasField = getSubRacasField(
      SubRaca,
      IdiomaAltoElfo,
      detalhesSubRaca
    );

    const SubRacaGnomoField = getSubRacasGnomoField(SubRaca, Engenhocas);

    // Antecedentes
    const ArtesaoField = getArtesaoCaracteristicasFields(
      antecedente,
      CarcDosAntecedentes1,
      CarcDosAntecedentes2,
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
      CarcDosAntecedentes3,
      antecedenteSelecionado
    );

    const IdiomasAntecedente = getIdiomasAntecendete(
      antecedente,
      idiomaDoAntecedente
    );
    const IdiomasAntecedente1 = getIdiomasAntecendete1(
      antecedente,
      idiomaDoAntecedente,
      idiomaDoAntecendente2
    );

    // RacasParaMandar

    const RacasInfo = {
      Idiomas: { idiomaRacaSelecionado, idiomaRacaSelecionado2 },
      Atributos: valoresHabilidade,
      SubRacasInfo: { ...SubRacasField, SubRacaGnomoField },
    };

    // ClassesParaMandar

    const Classesinfo = {
      imagens: classeSelecioanda.imagens,
      Equipamentos: {
        equipamentosClasseSelecionada1,
        equipamentosClasseSelecionada2,
        equipamentosClasseSelecionada3,
        equipamentosClasseSelecionada4,
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
        ...IdiomasAntecedente1,
        ...IdiomasAntecedente,
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

  const classeBackgrounds = {
    Bárbaro: styleFundo.classeBárbaro,
    Bardo: styleFundo.classeBardo,
    Bruxo: styleFundo.classeBruxo,
    Clérigo: styleFundo.classeClérigo,
    Druida: styleFundo.classeDruida,
    Feiticeiro: styleFundo.classeFeiticeiro,
    Guerreiro: styleFundo.classeGuerreiro,
    Ladino: styleFundo.classeLadino,
    Mago: styleFundo.classeMago,
    Monge: styleFundo.classeMonge,
    Paladino: styleFundo.classePaladino,
    Patrulheiro: styleFundo.classePatrulheiro,
    // Adicione mais classes e estilos aqui
  };

  const getClasseBackground = (classe) => {
    return classeBackgrounds[classe] || ""; // Use a classe padrão se não houver correspondência
  };

  const checkRequiredFields = () => {
    switch (etapa) {
      case 1:
        return nome !== "";
      case 2:
        return raca !== "" && idiomaRacaSelecionado !== "";
      case 3:
        return SubRaca !== "" && SubRaca !== "";
      case 4:
        if (classe !== "") {
          // Verifique se todas as checkboxes estão selecionadas
          const todasSelecionadas =
            periciasClasseSelecionadas.length ==
            classeSelecioanda.proficiencias.perficiasMinimo;

          return todasSelecionadas;
        }
        return false;
      case 5:
        return tendencia !== "";
      case 6:
        return antecedente !== "";
      case 7:
        return antecedente !== "" && !!antecedenteSelecionado;
      case 9:
        return riquezaInicial !== 0;
      case 10:
        return Object.values(valoresHabilidade).every((value) => value !== "");
      default:
        return true; // Não há verificações extras para outras etapas
    }
  };

  return (
    <div className={getClasseBackground(classe)}>
      <div className={styles.espacamento}>
        <div className={styles.pageContainer}>
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
              raca={raca}
              SubRaca={SubRaca}
              setSubRaca={setSubRaca}
              racaSelecionada={racaSelecionada}
              SubRacasOptions={SubRacasOptions}
              detalhesSubRaca={detalhesSubRaca}
              setDetalhesSubRaca={setDetalhesSubRaca}
              idiomaOption={idiomaOption}
              setIdiomaAltoElfoSelecioando={setIdiomaAltoElfoSelecioando}
              IdiomaAltoElfo={IdiomaAltoElfo}
              handleSubRacaChange={handleSubRacaChange}
              Engenhocas={Engenhocas}
              setEngenhocas={setEngenhocas}
            />
          )}

          {etapa === 4 && (
            <Etapa4
              classe={classe}
              setClasse={setClasse}
              classesOptions={classesOptions}
              itensDaClasse={itensDaClasse}
              equipamentosClasseSelecionada1={equipamentosClasseSelecionada1}
              setEquipamentoClasseSelecionado1={
                setEquipamentoClasseSelecionado1
              }
              equipamentosClasseSelecionada2={equipamentosClasseSelecionada2}
              setEquipamentoClasseSelecionado2={
                setEquipamentoClasseSelecionado2
              }
              equipamentosClasseSelecionada3={equipamentosClasseSelecionada3}
              setEquipamentoClasseSelecionado3={
                setEquipamentoClasseSelecionado3
              }
              equipamentosClasseSelecionada4={equipamentosClasseSelecionada4}
              setEquipamentoClasseSelecionado4={
                setEquipamentoClasseSelecionado4
              }
              classeSelecioanda={classeSelecioanda}
              periciasClasseSelecionadas={periciasClasseSelecionadas}
              setPericiasSelecionadas={setPericiasSelecionadas}
              setExibirPainelHabilidades={setExibirPainelHabilidades}
              exibirPainelHabilidades={exibirPainelHabilidades}
            />
          )}
          {etapa === 5 && (
            <Etapa5
              tendencia={tendencia}
              setTendencia={setTendencia}
              TendenciasOptions={TendenciasOptions}
              itensDaTendencia={itensDaTendencia}
            />
          )}
          {etapa === 6 && (
            <Etapa6
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
          {etapa === 7 && antecedenteSelecionado && (
            <Etapa7
              antecedente={antecedente}
              antecedenteSelecionado={antecedenteSelecionado}
              CarcDosAntecedentes1={CarcDosAntecedentes1}
              setCarcDosAntecedents1={setCarcDosAntecedents1}
              CarcDosAntecedentes2={CarcDosAntecedentes2}
              setCarcDosAntecedentes2={setCarcDosAntecedentes2}
              CarcDosAntecedentes3={CarcDosAntecedentes3}
              setCarcDosAntecedents3={setCarcDosAntecedents3}
            />
          )}
          {etapa === 8 && (
            // continuar
            <Etapa8
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
              setTracoPersonalidadeSelecionado={
                setTracoPersonalidadeSelecionado
              }
              onSelecionarIdeal={(e) => setIdealSelecionado(e.target.value)}
              onSelecionarDefeito={(e) => setDefeitoSelecionado(e.target.value)}
              onSelecionarVinculo={(e) => setVinculoSelecionado(e.target.value)}
            />
          )}
          {etapa === 9 && (
            <Etapa9
              riquezaInicial={riquezaInicial}
              setRiquezaInicial={setRiquezaInicial}
              classeSelecionada={classe}
              onRiquezaInicialCalculada={handleRiquezaInicialCalculada}
            />
          )}
          {etapa === 10 && (
            <Etapa10
              racaSelecionada={racaSelecionada}
              valoresHabilidade={valoresHabilidade}
              setValoresHabilidade={setValoresHabilidade}
              SubRaca={SubRaca}
              detalhesSubRaca={detalhesSubRaca}
            />
          )}
          {etapa < 11 ? (
            <Button
              variant="contained"
              color="primary"
              className={styles.button}
              onClick={handleNext}
              disabled={!checkRequiredFields()}
            >
              Próxima Etapa
            </Button>
          ) : (
            <>
              <Typography variant="h5" align="center">
                Ficha Concluído
              </Typography>
              <Link to="/fichas" className={styles.link}>
                <Button
                  variant="contained"
                  color="primary"
                  className={styles.button}
                  onClick={handleConcluir}
                  disabled={!checkRequiredFields()}
                >
                  Concluir
                </Button>
              </Link>
            </>
          )}
          {etapa > 1 && (
            <Button
              variant="contained"
              color="secondary"
              className={styles.button}
              onClick={handlePrevious}
            >
              Etapa Anterior
            </Button>
          )}
        </div>
      </div>
      <Typography className={styleFundo.support}>
        BackGround Art By:{" "}
        <Link to={backgrounds[classe]} className={styleFundo.supportLink}>
          {backgrounds[classe]}
        </Link>
      </Typography>
    </div>
  );
};

export default FichaCriar;
