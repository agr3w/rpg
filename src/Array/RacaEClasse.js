// RAÇAS

export const racas = [
  {
    nome: "Humano",
    habilidades: [
      "Habilidade +1 em todos os atributos",
      "Idiomas: Comum e um idioma adicional à escolha do jogador",
    ],
    idiomaRaca: ["Comum"],
    habilidadeBonus: {
      Força: 1,
      Destreza: 1,
      Constituição: 1,
      Inteligência: 1,
      Sabedoria: 1,
      Carisma: 1,
    },
  },
  {
    nome: "Elfo",
    habilidades: ["Habilidade +2 em Destreza", "Idiomas: Comum e Élfico"],
    idiomaRaca: ["Elfico"],
    habilidadeBonus: {
      Destreza: 2,
    },
  },
  // Adicione mais raças aqui
];

// CLASSES

export const classes = [
  {
    nome: "Guerreiro",
    equipamentos: {},
    habilidades: [
      "Armadura e escudo de todas as armaduras",
      "Armas simples e marciais",
    ],
    //ssó arrumar, utilizar a mesma função da etapa 7
    dadosDeVida: "1d10 pontos de vida por nível",
    // Outras informações específicas da classe
  },
  {
    nome: "Mago",
    // adicionar as imgs no storage 500X400
    imagens: [
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2Fconjura%C3%A7%C3%A3o1.png?alt=media&token=4605c5b2-798d-49a2-b4e3-49c502fee9db",
    ],
    proficiencias: {
      armaduras: "Nenhuma",
      armas: ["adagas, ", "dardos, ", "fundas, ", "bordões, ", "bestas leves"],
      ferramentas: "Nenhuma",
      testesDeResistecia: [" Inteligência, ", "Sabedoria"],
      periciasLabel: "escolha duas dentre:",
      perficiasMinimo: "2",
      periciasSelecao: [
        "Arcanismo",
        "História",
        "Intuição",
        "Investigação",
        "Medicina",
        "Religião",
      ],
    },
    habilidadesClasse: {
      habilidadeNv1: ["CONJURAÇÃO e ", "RECUPERAÇÃO ARCANA"],
      habilidadeNv2: ["TRADIÇÃO ARCANA"],
      habilidadeNv3: ["NADA"],
      habilidadeNv4: ["INCREMENTO NO VALOR DE HABILIDADE"],
    },
    equipamentos: {
      equipamentoAlpha1: ["Um bordão", "Uma adaga"],
      equipamentoAlpha2: ["Uma bolsa de componentes", "um foco arcano"],
      equipamentoAlpha3: ["Um pacote de estudioso", "Um pacote de explorador"],
      equipamentoObgt: ["Um grimório"],
    },

    dadosDeVida: "1d6 pontos de vida por nível",
    // Outras informações específicas da classe
  },
  // Adicione mais classes aqui
];
