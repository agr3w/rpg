import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/database";
import { Link } from "react-router-dom";
import { Button, Card, CardContent, Typography } from "@mui/material";

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
  const handleDeleteArray = () => {
    // Remova a array do banco de dados Firebase
    const databaseRef = firebase.database().ref("fichas");

    // Tente excluir a array
    try {
      databaseRef.remove();
      console.log("Array excluída com sucesso");
    } catch (error) {
      console.error("Erro ao excluir array:", error);
    }
  };

  return (
    <div>
      <Typography variant="h4" color={"white"}>Fichas de Personagem</Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/criar-ficha"
      >
        Criar Nova Ficha
      </Button>
      <div>
        {fichas.map((ficha, index) => (
          <Card key={index} style={{ margin: "16px 0" }}>
            <CardContent>
              <Typography variant="h6">Ficha {index + 1}</Typography>
              <Typography>Nome: {ficha.nome}</Typography>
              <Typography>Raça: {ficha.raca}</Typography>
              <Typography>Classe: {ficha.classe}</Typography>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to={`/ficha-completa/${ficha.ID}`} // Redireciona para a página da ficha completa
              >
                Ver Ficha Completa
              </Button>
              {/* Botão de Exclusão */}
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
