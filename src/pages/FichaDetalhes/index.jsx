import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/database";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent, Typography } from "@mui/material";
import styles from "./fichaDetalhe.module.css";
import { racas } from "Array/RacaEClasse";
import BotaoPainelHabilidade from "components/FichaPage/BotãoPainelHabilidade";
import {
  GiHeavyFall,
  GiRunningNinja,
  GiHealthNormal,
  GiBrain,
} from "react-icons/gi";
import { ImBook } from "react-icons/im";
import { SiStylelint } from "react-icons/si";
import { backgrounds } from "./backgounds/arrayLinksBackgrounds";

const FichaDetalhes = () => {
  const { ID } = useParams();
  const [ficha, setFicha] = useState(null);

  useEffect(() => {
    const databaseRef = firebase.database().ref("fichas");

    databaseRef
      .orderByChild("ID")
      .equalTo(ID)
      .once("value")
      .then((snapshot) => {
        const fichaData = snapshot.val();
        if (fichaData) {
          const fichaEncontrada = Object.values(fichaData)[0];
          setFicha(fichaEncontrada);
        } else {
          setFicha(null);
        }
      });
  }, [ID]);

  if (!ficha) {
    return (
      <div className={styles.pageContainer}>
        <Typography variant="h4" className={styles.pageTitle}>
          Ficha não encontrada
        </Typography>
      </div>
    );
  }
  const racaSelecionada = racas.find((r) => r.nome === ficha.raca);
  const subRacaSelecionada = ficha.DetalhesDaRaça.subRaca.SubRaca;
  const subRacaDetalhes = racaSelecionada.SubRacas.find(
    (subRaca) => subRaca.subRacaNome === subRacaSelecionada
  );

  // Verifique se a raça selecionada foi encontrada
  if (racaSelecionada) {
    const atributos = ficha.DetalhesDaRaça.Atributos;
    const habilidadeBonus = racaSelecionada.proficienciaHabilidadeBonus;

    // Função para somar os atributos com os bônus
    const somarAtributos = (atributos, bonusRaca, bonusSubRaca) => {
      const atributosComBonus = {
        Força:
          parseInt(atributos.Força) +
          parseInt(bonusRaca.Força) +
          parseInt(bonusSubRaca.Força || 0),
        Destreza:
          parseInt(atributos.Destreza) +
          parseInt(bonusRaca.Destreza) +
          parseInt(bonusSubRaca.Destreza || 0),
        Constituição:
          parseInt(atributos.Constituição) +
          parseInt(bonusRaca.Constituição) +
          parseInt(bonusSubRaca.Constituição || 0),
        Inteligência:
          parseInt(atributos.Inteligência) +
          parseInt(bonusRaca.Inteligência) +
          parseInt(bonusSubRaca.Inteligência || 0),
        Sabedoria:
          parseInt(atributos.Sabedoria) +
          parseInt(bonusRaca.Sabedoria) +
          parseInt(bonusSubRaca.Sabedoria || 0),
        Carisma:
          parseInt(atributos.Carisma) +
          parseInt(bonusRaca.Carisma) +
          parseInt(bonusSubRaca.Carisma || 0),
      };

      // Se uma sub-raça estiver selecionada, adicione seus bônus
      return atributosComBonus;
    };

    const atributosComBonus = somarAtributos(
      atributos,
      habilidadeBonus,
      subRacaDetalhes ? subRacaDetalhes.habilidadeBonusSubRaca : {}
    );

    const calcularBonus = (valorAtributo) => {
      const bonus = Math.floor((valorAtributo - 10) / 2);
      return bonus >= 0 ? `(+${bonus})` : `(${bonus})`;
    };

    const classeBackgrounds = {
      Bárbaro: styles.classeBárbaro,
      Bardo: styles.classeBardo,
      Bruxo: styles.classeBruxo,
      Clérigo: styles.classeClérigo,
      Druida: styles.classeDruida,
      Feiticeiro: styles.classeFeiticeiro,
      Guerreiro: styles.classeGuerreiro,
      Ladino: styles.classeLadino,
      Mago: styles.classeMago,
      Monge: styles.classeMonge,
      Paladino: styles.classePaladino,
      Patrulheiro: styles.classePatrulheiro,
    };

    const getClasseBackground = (classe) => {
      return classeBackgrounds[classe] || ""; // Use a classe padrão se não houver correspondência
    };

    return (
      <div className={` ${getClasseBackground(ficha.classe)}`}>
        <div className={styles.fundo}>
          <div className={styles.pageContainer}>
            <Typography variant="h4" className={styles.pageTitle}>
              Detalhes da Ficha
            </Typography>
            <Card className={styles.card}>
              <CardContent className={styles.cardContent}>
                <div className={styles.header}>
                  <Typography variant="h6">
                    <span>Nome:</span> {ficha.nome}
                  </Typography>
                  <Typography variant="h6">
                    <span>Classe:</span> {ficha.classe}
                  </Typography>
                  <Typography variant="h6">
                    <span>Raça: </span>
                    {ficha.raca}
                  </Typography>
                  <Typography variant="h6">
                    <span>Tendencia: </span>
                    {ficha.tendencia}
                  </Typography>
                  <Typography variant="h6">
                    <span>Riqueza Inicial: </span> {ficha.riquezaInicial}
                  </Typography>
                </div>

                {/* Detalhes da Classe */}
                <div className={styles.espacamentoTextoItem}>
                  <Typography variant="h6" className={styles.sectionTitle}>
                    Detalhes da Classe
                  </Typography>
                </div>
                <Typography>
                  Equipamento Obrigatório:{" "}
                  {ficha.DetalhesDaClasse.Equipamentos.equipamentoObgt}
                </Typography>
                <Typography>Equipamentos Selecionados:</Typography>

                <li className={styles.listItem}>
                  {
                    ficha.DetalhesDaClasse.Equipamentos
                      .equipamentosClasseSelecionada1
                  }
                </li>
                <li className={styles.listItem}>
                  {
                    ficha.DetalhesDaClasse.Equipamentos
                      .equipamentosClasseSelecionada2
                  }
                </li>
                <li className={styles.listItem}>
                  {
                    ficha.DetalhesDaClasse.Equipamentos
                      .equipamentosClasseSelecionada3
                  }
                </li>

                <div className={styles.espacamentoTextoItem}>
                  <BotaoPainelHabilidade
                    imagens={ficha.DetalhesDaClasse.imagens}
                  />
                </div>

                {ficha.classe === "Mago" && (
                  <>
                    <Typography>Perícias da Classe:</Typography>
                    <>
                      {ficha.DetalhesDaClasse.periciasClasseSelecionadas.map(
                        (pericia) => (
                          <li className={styles.listItem} key={pericia}>
                            {pericia}
                          </li>
                        )
                      )}
                    </>
                  </>
                )}

                {/* Detalhes da Raça */}

                <div className={styles.atributos}>
                  <Typography variant="h4" className={styles.titleAtributos}>
                    Atributos:
                  </Typography>
                  <ul>
                    <li className={styles.listItemAtributos}>
                      <GiHeavyFall className={styles.iconAtributo} /> Força:{" "}
                      {atributosComBonus.Força}{" "}
                      {calcularBonus(atributosComBonus.Força)}
                    </li>
                    <li className={styles.listItemAtributos}>
                      <GiRunningNinja className={styles.iconAtributo} />{" "}
                      Destreza: {atributosComBonus.Destreza}{" "}
                      {calcularBonus(atributosComBonus.Destreza)}
                    </li>
                    <li className={styles.listItemAtributos}>
                      <GiHealthNormal className={styles.iconAtributo} />
                      Constituição: {atributosComBonus.Constituição}{" "}
                      {calcularBonus(atributosComBonus.Constituição)}
                    </li>
                    <li className={styles.listItemAtributos}>
                      <GiBrain className={styles.iconAtributo} />
                      Inteligência: {atributosComBonus.Inteligência}{" "}
                      {calcularBonus(atributosComBonus.Inteligência)}
                    </li>
                    <li className={styles.listItemAtributos}>
                      <ImBook className={styles.iconAtributo} /> Sabedoria:{" "}
                      {atributosComBonus.Sabedoria}{" "}
                      {calcularBonus(atributosComBonus.Sabedoria)}
                    </li>
                    <li className={styles.listItemAtributos}>
                      <SiStylelint className={styles.iconAtributo} /> Carisma:{" "}
                      {atributosComBonus.Carisma}{" "}
                      {calcularBonus(atributosComBonus.Carisma)}
                    </li>
                  </ul>
                </div>
                <div className={styles.espacamentoTextoItem}>
                  <Typography variant="h6" className={styles.sectionTitle}>
                    Habilidades da Raça
                  </Typography>
                </div>
                {racaSelecionada.habilidades.map((habilidadesRaca) => (
                  <li className={styles.listItem}>{habilidadesRaca}</li>
                ))}
                <Typography className={styles.sectionTitle}>
                  Idiomas da Raça:
                </Typography>
                <ul>
                  <li className={styles.listItem}>
                    {ficha.DetalhesDaRaça.Idiomas.idiomaRacaSelecionado}
                  </li>
                  <li className={styles.listItem}>
                    {ficha.DetalhesDaRaça.Idiomas.idiomaRacaSelecionado2}
                  </li>
                </ul>

                {/* Sub-Raça */}

                <Typography variant="h6" className={styles.sectionTitle}>
                  Detalhes da Sub-Raça
                </Typography>
                <div className={styles.espacamentoTextoItem}>
                  <Typography>
                    <span className={styles.spanBold}>Sub-Raça: </span>{" "}
                    {subRacaSelecionada}
                  </Typography>
                </div>

                {subRacaDetalhes.habilidadesSubRaca.map((habilidades) => (
                  <li className={styles.listItem}>{habilidades}</li>
                ))}

                {/* Detalhes do Antecedente */}

                <div className={styles.espacamentoTextoItem}>
                  <Typography variant="h6" className={styles.sectionTitle}>
                    Detalhes do Antecedente
                  </Typography>
                  <div className={styles.espacamentoTextoItem}>
                    <Typography>
                      Antecedente: {ficha.antecedenteDetalhes.antecedente}
                    </Typography>
                  </div>
                  <Typography>
                    Características Sugeridas:{" "}
                    {
                      ficha.antecedenteDetalhes.caracteristicas
                        .CaracteristicasSugeridas
                    }
                  </Typography>
                </div>

                {ficha.antecedenteDetalhes.antecedente ===
                  "Artesão de Guilda" && (
                  <>
                    <div className={styles.espacamentoTextoItem}>
                      <Typography>
                        Características Da Guilda:{" "}
                        {
                          ficha.antecedenteDetalhes.caracteristicas
                            .CaracterísticasDaGuilda
                        }
                      </Typography>
                    </div>
                    <Typography>
                      Negocios Da Guilda:{" "}
                      {
                        ficha.antecedenteDetalhes.caracteristicas
                          .NegocioDaGuilda
                      }
                    </Typography>
                    <div className={styles.espacamentoTextoItem}>
                      <Typography>
                        Idioma adicional:{" "}
                        {ficha.antecedenteDetalhes.caracteristicas.idioma}
                      </Typography>
                    </div>
                  </>
                )}
                <div className={styles.tendencias}>
                  <Typography variant="h6" className={styles.sectionTitle}>
                    Tendências
                  </Typography>
                  <div className={styles.espacamentoTextoItem}>
                    <Typography>
                      Traco De Personalidade:{" "}
                      {ficha.antecedenteDetalhes.tracoPersonalidade}
                    </Typography>
                  </div>
                  <Typography>
                    Defeito: {ficha.antecedenteDetalhes.defeito}
                  </Typography>
                  <div className={styles.espacamentoTextoItem}>
                    <Typography>
                      Ideial: {ficha.antecedenteDetalhes.tracoPersonalidade}
                    </Typography>
                  </div>
                  <Typography>
                    Vinculo: {ficha.antecedenteDetalhes.vinculo}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Typography className={styles.support}>
          BackGround Art By:{" "}
          <Link to={backgrounds[ficha.classe]} className={styles.supportLink}>
            {backgrounds[ficha.classe]}
          </Link>
        </Typography>
      </div>
    );
  } else {
    return <Typography variant="h4">Ficha não encontrada</Typography>;
  }
};

export default FichaDetalhes;
