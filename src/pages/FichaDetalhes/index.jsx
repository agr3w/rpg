import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/database";
import { useParams } from "react-router-dom";
import { Card, CardContent, Typography } from "@mui/material";
import styles from "./fichaDetalhe.module.css";
import { classes, racas } from "Array/RacaEClasse";

const FichaDetalhes = () => {
  const { nome } = useParams();
  const [ficha, setFicha] = useState(null);

  useEffect(() => {
    const databaseRef = firebase.database().ref("fichas");

    databaseRef
      .orderByChild("nome")
      .equalTo(nome)
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
  }, [nome]);

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
  const classeSelecioanda = classes.find((c) => c.nome === ficha.classe);

  // Verifique se a raça selecionada foi encontrada
  if (racaSelecionada) {
    const atributos = ficha.DetalhesDaRaça.Atributos;
    const habilidadeBonus = racaSelecionada.habilidadeBonus;

    // Função para somar os atributos com os bônus
    const somarAtributos = (atributos, bonus) => {
      return {
        Força: parseInt(atributos.Força) + parseInt(bonus.Força),
        Destreza: parseInt(atributos.Destreza) + parseInt(bonus.Destreza),
        Constituição:
          parseInt(atributos.Constituição) + parseInt(bonus.Constituição),
        Inteligência:
          parseInt(atributos.Inteligência) + parseInt(bonus.Inteligência),
        Sabedoria: parseInt(atributos.Sabedoria) + parseInt(bonus.Sabedoria),
        Carisma: parseInt(atributos.Carisma) + parseInt(bonus.Carisma),
      };
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
            <Typography variant="h6">Nome: {ficha.nome}</Typography>
            <Typography variant="h6">Classe: {ficha.classe}</Typography>
            <Typography variant="h6">Raça: {ficha.raca}</Typography>

            {/* Detalhes da Classe */}
            <Typography variant="h6" className={styles.sectionTitle}>
              Detalhes da Classe
            </Typography>
            <Typography>
              Equipamento Obrigatório:{" "}
              {ficha.DetalhesDaClasse.Equipamentos.equipamentoObgt}
            </Typography>
            <Typography>Equipamentos Selecionados:</Typography>
            <ul>
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
            </ul>

            {ficha.classe === "Mago" && (
                <>
                  <Typography>Perícias da Classe:</Typography>
                  <ul>
                    {ficha.DetalhesDaClasse.periciasClasseSelecionadas.map((pericia) => (
                      <li className={styles.listItem}>{pericia}</li>
                    ))}
                  </ul>
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

            {/* Detalhes do Antecedente */}
            <Typography variant="h6" className={styles.sectionTitle}>
              Detalhes do Antecedente
            </Typography>
            <Typography>
              Antecedente: {ficha.antecedenteDetalhes.antecedente}
            </Typography>
            <Typography>
              Características Sugeridas:{" "}
              {
                ficha.antecedenteDetalhes.caracteristicas
                  .CaracteristicasSugeridas
              }
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  } else {
    return <Typography variant="h4">Raça não encontrada</Typography>;
  }
};

export default FichaDetalhes;
