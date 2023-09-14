import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/database";
import { Link } from "react-router-dom";
import { Button, Card, CardContent, Typography } from "@mui/material";
import styles from "./FichaCompleta.module.css";

const FichasPage = () => {
  const [fichas, setFichas] = useState([]);

  useEffect(() => {
    // Carregue as fichas do Firebase Realtime Database
    const databaseRef = firebase.database().ref("fichas");

    databaseRef.on("value", (snapshot) => {
      const fichasData = snapshot.val();
      if (fichasData) {
        // Transforme os dados em uma array de fichas
        const fichasArray = Object.values(fichasData);
        setFichas(fichasArray);
      } else {
        setFichas([]); // Se não houver fichas, defina a array como vazia
      }
    });

    // Lembre-se de cancelar a inscrição quando o componente for desmontado
    return () => {
      databaseRef.off("value");
    };
  }, []);

  // Função para excluir uma ficha pelo ID
  const handleDeleteArray = (ID) => {
    const databaseRef = firebase.database().ref("fichas");
  
    // Encontre a ficha correspondente pelo ID
    databaseRef
      .orderByChild("ID")
      .equalTo(ID)
      .once("value")
      .then((snapshot) => {
        // Verifique se há um nó correspondente
        if (snapshot.exists()) {
          // Obtenha a chave do primeiro nó correspondente (deve haver apenas um)
          const chave = Object.keys(snapshot.val())[0];
  
          // Exclua a ficha inteira usando a chave
          databaseRef.child(chave).remove()
            .then(() => {
              console.log("Ficha excluída com sucesso");
            })
            .catch((error) => {
              console.error("Erro ao excluir ficha:", error);
            });
        } else {
          console.log("Ficha não encontrada");
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar ficha:", error);
      });
  };
  

  return (
    <div className={styles.container}>
      <Typography variant="h4" className={styles.title}>
        Fichas de Personagem
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/criar-ficha"
        className={styles.createButton}
      >
        Criar Nova Ficha
      </Button>
      <div className={styles.cardContainer}>
        {fichas.map((ficha, index) => (
          <Card key={index} className={styles.card}>
            <CardContent>
              <Typography variant="h6" className={styles.cardTitle}>
                Ficha {index + 1}
              </Typography>
              <Typography className={styles.cardInfo}>
                Nome: {ficha.nome}
              </Typography>
              <Typography className={styles.cardInfo}>
                Raça: {ficha.raca}
              </Typography>
              <Typography className={styles.cardInfo}>
                Classe: {ficha.classe}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to={`/ficha-completa/${ficha.ID}`}
              >
                Ver Ficha Completa
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleDeleteArray(ficha.ID)}
              >
                Excluir
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default FichasPage;
