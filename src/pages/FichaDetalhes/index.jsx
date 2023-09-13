import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/database";
import { useParams } from "react-router-dom";
import { Card, CardContent, Typography } from "@mui/material";
import styles from "./fichaDetalhe.module.css";
import { racas } from "Array/RacaEClasse";
import BotaoPainelHabilidade from "components/FichaPage/BotãoPainelHabilidade";

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
  const detalhes = racaSelecionada.SubRacas.find(
    (subRaca) => subRaca.subRacaNome === ficha.DetalhesDaRaça.subRaca.SubRaca
  );

  // Verifique se a raça selecionada foi encontrada
  if (racaSelecionada) {
    const atributos = ficha.DetalhesDaRaça.Atributos;
    const habilidadeBonus = racaSelecionada.proficienciaHabilidadeBonus;

    // Função para somar os atributos com os bônus
    const somarAtributos = (atributos, bonus, subRaca) => {
      const atributosComBonus = {
        Força: parseInt(atributos.Força) + parseInt(bonus.Força),
        Destreza: parseInt(atributos.Destreza) + parseInt(bonus.Destreza),
        Constituição:
          parseInt(atributos.Constituição) + parseInt(bonus.Constituição),
        Inteligência:
          parseInt(atributos.Inteligência) + parseInt(bonus.Inteligência),
        Sabedoria: parseInt(atributos.Sabedoria) + parseInt(bonus.Sabedoria),
        Carisma: parseInt(atributos.Carisma) + parseInt(bonus.Carisma),
      };

      // Se uma sub-raça estiver selecionada, adicione seu bônus
      if (subRaca && subRaca.habilidadeBonusSubRaca) {
        for (const atributo in subRaca.habilidadeBonusSubRaca) {
          atributosComBonus[atributo] += parseInt(
            subRaca.habilidadeBonusSubRaca[atributo]
          );
        }
      }

      return atributosComBonus;
    };

    const atributosComBonus = somarAtributos(atributos, habilidadeBonus);

    const calcularBonus = (valorAtributo) => {
      const bonus = Math.floor((valorAtributo - 10) / 2);
      return bonus >= 0 ? `(+${bonus})` : `(${bonus})`;
    };

    return (
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
            <Typography variant="h6" className={styles.sectionTitle}>
              Detalhes da Classe
            </Typography>
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
              <BotaoPainelHabilidade imagens={ficha.DetalhesDaClasse.imagens} />
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
            <Typography variant="h6" className={styles.sectionTitle}>
              Detalhes da Raça
            </Typography>
            <div className={styles.atributos}>
              <Typography variant="h4" className={styles.titleAtributos}>
                Atributos:
              </Typography>
              <ul>
                <li className={styles.listItemAtributos}>
                  Força: {atributosComBonus.Força}{" "}
                  {calcularBonus(atributosComBonus.Força)}
                </li>
                <li className={styles.listItemAtributos}>
                  Destreza: {atributosComBonus.Destreza}{" "}
                  {calcularBonus(atributosComBonus.Destreza)}
                </li>
                <li className={styles.listItemAtributos}>
                  Constituição: {atributosComBonus.Constituição}{" "}
                  {calcularBonus(atributosComBonus.Constituição)}
                </li>
                <li className={styles.listItemAtributos}>
                  Inteligência: {atributosComBonus.Inteligência}{" "}
                  {calcularBonus(atributosComBonus.Inteligência)}
                </li>
                <li className={styles.listItemAtributos}>
                  Sabedoria: {atributosComBonus.Sabedoria}{" "}
                  {calcularBonus(atributosComBonus.Sabedoria)}
                </li>
                <li className={styles.listItemAtributos}>
                  Carisma: {atributosComBonus.Carisma}{" "}
                  {calcularBonus(atributosComBonus.Carisma)}
                </li>
              </ul>
            </div>
            <Typography>Idiomas da Raça:</Typography>
            <ul>
              <li className={styles.listItem}>
                {ficha.DetalhesDaRaça.Idiomas.idiomaRacaSelecionado}
              </li>
              <li className={styles.listItem}>
                {ficha.DetalhesDaRaça.Idiomas.idiomaRacaSelecionado2}
              </li>
            </ul>

            {/* Sub-Raça */}

            <Typography>Sub-Raça: {ficha.DetalhesDaRaça.subRaca.SubRaca}</Typography>

             

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

            {ficha.antecedenteDetalhes.antecedente === "Artesão de Guilda" && (
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
                  {ficha.antecedenteDetalhes.caracteristicas.NegocioDaGuilda}
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
    );
  } else {
    return <Typography variant="h4">Ficha não encontrada</Typography>;
  }
};

export default FichaDetalhes;
