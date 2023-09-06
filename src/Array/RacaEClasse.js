// racasEClasses.js

export const racas = [
  {
    nome: "Humano",
    habilidades: [
      "Habilidade +1 em todos os atributos",
      "Idiomas: Comum e um idioma adicional à escolha do jogador",
    ],
    // Adicione mais informações específicas da raça, se necessário
  },
  {
    nome: "Elfo",
    habilidades: ["Habilidade +2 em Destreza", "Idiomas: Comum e Élfico"],
    // Outras informações específicas da raça
  },
  // Adicione mais raças aqui
];

export const classes = [
  {
    nome: "Guerreiro",
    habilidades: [
      "Armadura e escudo de todas as armaduras",
      "Armas simples e marciais",
    ],
    equipamento: "oi", //ssó arrumar, utilizar a mesma função da etapa 7
    dadosDeVida: "1d10 pontos de vida por nível",
    // Outras informações específicas da classe
  },
  {
    nome: "Mago",
    habilidades: ["Magias arcanas", "Livros de magia"],
    dadosDeVida: "1d6 pontos de vida por nível",
    // Outras informações específicas da classe
  },
  // Adicione mais classes aqui
];
