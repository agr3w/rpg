// FichaDatabase.js

import { app } from "APIs/firebaseConfig";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, push, set } from "firebase/database";

// Função para enviar informações para o Realtime Database
export const enviarFichaParaDatabase = (
  nome,
  raca,
  classe,
  tendencia,
  antecedente,
  riquezaInicial,
  RacasInfo,
  Classesinfo
  /* outros campos */
) => {
  // Crie uma referência para o nó onde você deseja armazenar as informações, por exemplo, "fichas"
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const userID = user.uid;
    const database = getDatabase();
    const ID = app.database().ref().child("fichas").push().key;
    const fichaRef = ref(database, `fichas/${userID}`);

  

  // Crie um objeto com as informações que você deseja armazenar
  const novaFicha = {
    nome: nome,
    raca: raca,
    classe: classe,
    tendencia: tendencia,
    antecedenteDetalhes: antecedente,
    riquezaInicial: riquezaInicial,
    DetalhesDaRaça: RacasInfo,
    DetalhesDaClasse: Classesinfo,
    ID,
    // Adicione mais campos conforme necessário
  };
  // Usamos push para gerar um novo ID único para a ficha
  const novaFichaRef = push(fichaRef);
  
    
  // Definimos os dados da nova ficha no caminho único associado ao ID do usuário
  set(novaFichaRef, novaFicha)
    .then(() => {
      console.log('Ficha criada com sucesso!');
    })
    .catch((error) => {
      console.error('Erro ao criar a ficha:', error);
    });
} else {
  console.log('Usuário não autenticado.');
}

  // Use a função push para adicionar uma nova entrada com um ID único


  // A novaFichaRef agora contém uma referência à entrada recém-criada no banco de dados
  // Você pode usar esta referência para atualizar ou recuperar os dados, se necessário
};
