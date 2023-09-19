// RAÇAS

export const racas = [
  {
    nome: "Anão",
    habilidades: [
      "Constituição +2",
      "Deslocamento: 7,5 metros",
      "Visão no escuro: Acostumado à vida subterrânea,você tem uma visão superior no escuro e na penumbra Você enxerga na penumbra a até 18 metros como se fosse luz plena, e no escuro como se fosse na penumbra. Você não pode discernir cores no escuro, apenas tons de cinza",
      "Resiliência Anã: Você possui vantagem em testes de resistência contra venenos e resistência contra dano de veneno",
      "Treinamento Anão em Combate: Você tem proficiência com machados de batalha, machadinhas, martelos leves e martelos de guerra.",
      "Especialização em Rochas: Sempre que você realizar um teste de Inteligência (História) relacionado à origem de um trabalho em pedra, você é considerado proficiente na perícia História e adiciona o dobro do seu bônus de proficiência ao teste, ao invés do seu bônus de proficiência normal",
    ],
    deslocamento: "7,5 metros",
    proficienciaRacaArmas: [
      "Machado de Batalha",
      "Machadinha",
      "Martelos Leves",
      "Martelos de Guerra",
    ],
    proficienciaRacaFerramentas: [
      "Ferramentas de Ferreiro",
      "Suprimentos de Cervejeiro",
      "Ferramentas de Pedreiro",
    ],
    idiomaRaca: ["Comum e Anão"],
    proficienciaHabilidadeBonus: {
      Constituição: 2,
      Força: 0,
      Destreza: 0,
      Inteligência: 0,
      Sabedoria: 0,
      Carisma: 0,
    },
    SubRacas: [
      {
        subRacaNome: "Anão da Colina",
        habilidadesSubRaca: [
          "Sabedoria +1",
          "Tenacidade Anã. Seu máximo de pontos de vida aumentam em 1, e cada vez que o anão da colina sobe um nível, ele recebe 1 ponto de vida adicional",
        ],
        habilidadeBonusSubRaca: {
          Sabedoria: 1,
          Constituição: 0,
          Força: 0,
          Destreza: 0,
          Inteligência: 0,
          Carisma: 0,
        },
      },
      {
        subRacaNome: "Anão da Montanha",
        habilidadesSubRaca: [
          "Força +2",
          "Treinamento Anão com Armaduras: Você adquire proficiência em armaduras leves e médias.",
        ],
        habilidadeBonusSubRaca: {
          Força: 2,
          Constituição: 0,
          Destreza: 0,
          Inteligência: 0,
          Sabedoria: 0,
          Carisma: 0,
        },
        proficienciaSubRacaArmaduras: ["Armaduras Lesves", "Armaduras Médias"],
      },
    ],
  },

  // ---------------------------------------------------------------------------------------------------------------  //

  {
    nome: "Elfo",
    habilidades: [
      "Destreza +2",
      "Deslocamento 9 metros",
      "Visão no Escuro: Acostumado às florestas crepusculares e ao céu noturno, você possui uma visão superior em condições de escuridão e na penumbra. Você pode enxergar na penumbra a até 18 metros como se fosse na luz plena, e no escuro como se fosse na penumbra. Você não pode discernir cores no escuro, apenas tons de cinza.",
      "Sentidos Aguçados: Você tem proficiência na perícia Percepção",
      "Ancestral Feérico. Você tem vantagem nos testes de resistência para resistir a ser enfeitiçado e magias não podem colocá-lo para dormir.",
      "Transe. Elfos não precisam dormir. Ao invés disso, eles meditam profundamente, permanecendo semiconscientes, durante 4 horas por dia. (A palavra em idioma comum para tal meditação é transe.) Enquanto medita, um elfo é capaz de sonhar de certo modo. Esses sonhos na verdade são exercícios mentais que se tornam reflexos através de anos de prática. Depois de descansar dessa forma, você ganha os mesmos benefícios que um humano depois de 8 horas de sono.",
    ],
    deslocamento: "9 metros",
    proficienciaPericia: "Percepção",
    idiomaRaca: ["Comum e Élfico"],
    SubRacas: [
      {
        subRacaNome: "Alto Elfo",
        habilidadesSubRaca: [
          "Inteligência +1",
          "Treinamento Élfico com Armas. Você possui proficiência com espadas longas, espadas curtas, arcos longos e arcos curtos.",
          "Truque: Você conhece um truque, à sua escolha, da lista de truques do mago. Inteligência é a habilidade usado para conjurar este truque. ",
          "Idioma Adicional: Você pode falar, ler e escrever um idioma adicional à sua escolha.",
        ],
        habilidadeBonusSubRaca: {
          Inteligência: 1,
          Constituição: 0,
          Força: 0,
          Destreza: 0,
          Sabedoria: 0,
          Carisma: 0,
        },
        proficienciaSubRacaArmas: [
          "Espadas Longas",
          "Espadas Curtas",
          "Arcos Longos",
          "Arcos Curtos",
        ],
      },
      {
        subRacaNome: "Elfo Da Floresta",
        habilidadesSubRaca: [
          "Sabedoria +1",
          "Treinamento Élfico com Armas. Você possui proficiência com espadas longas, espadas curtas, arcos longos e arcos curtos.",
          "Pés Ligeiros. Seu deslocamento base de caminhada aumenta para 10,5 metros. ",
          "Máscara da Natureza. Você pode tentar se esconder mesmo quando você está apenas levemente obscurecido por folhagem, chuva forte, neve caindo, névoa ou outro fenômeno natura",
        ],
        habilidadeBonusSubRaca: {
          Sabedoria: 1,
        },
        proficienciaSubRacaArmas: [
          "Espadas Longas",
          "Espadas Curtas",
          "Arcos Longos",
          "Arcos Curtos",
        ],
      },
      {
        subRacaNome: "Elfo Negro (DROW)",
        habilidadesSubRaca: [
          "Carisma +1",
          "Visão no Escuro Superior. Sua visão no escuro tem alcance de 36 metros de raio. ",
          "Sensibilidade à Luz Solar. Você possui desvantagem nas jogadas de ataque e testes de Sabedoria (Percepção) relacionados a visão quando você, o alvo do seu ataque, ou qualquer coisa que você está tentando perceber, esteja sob luz solar direta.",
          "Magia Drow. Você possui o truque globos de luz. Quando você alcança o 3° nível, você pode conjurar a magia fogo das fadas. Quando você alcança o 5° nível, você pode conjurar escuridão. Você precisa terminar um descanso longo para poder conjurar as magias desse traço novamente. Carisma é sua habilidade chave para conjurar essas magias.",
          "Treinamento Drow com Armas. Você possui proficiência com rapieiras, espadas curtas e bestas de mão. ",
        ],
        habilidadeBonusSubRaca: {
          Carisma: 1,
          Constituição: 0,
          Força: 0,
          Destreza: 0,
          Inteligência: 0,
          Sabedoria: 0,
        },
        proficienciaSubRacaArmas: [
          "Rapieiras",
          "Espadas Curtas",
          "Bestas de Mão",
        ],
      },
    ],
    proficienciaHabilidadeBonus: {
      Destreza: 2,
      Constituição: 0,
      Força: 0,
      Inteligência: 0,
      Sabedoria: 0,
      Carisma: 0,
    },
  },

  // ---------------------------------------------------------------------------------------------------------------  //

  {
    nome: "Halfling",
    habilidades: [
      "Destreza +2.",
      "Deslocamento. Seu deslocamento base de caminhada é 7,5 metros.",
      "Sortudo. Quando você obtiver um 1 natural em uma jogada de ataque, teste de habilidade ou teste de resistência, você pode jogar de novo o dado e deve utilizar o novo resultado.",
      "Bravura. Você tem vantagem em testes de resistência contra ficar amedrontado.",
      "Agilidade Halfling. Você pode mover-se através do espaço de qualquer criatura que for de um tamanho maior que o seu.",
    ],
    deslocamento: "7,5 metros",
    idiomaRaca: ["Comum e Halfling"],
    proficienciaHabilidadeBonus: {
      Destreza: 2,
      Constituição: 0,
      Força: 0,
      Inteligência: 0,
      Sabedoria: 0,
      Carisma: 0,
    },
    SubRacas: [
      {
        subRacaNome: "Pés-Leves",
        habilidadesSubRaca: [
          "Aumento no Valor de Habilidade. Seu valor de Carisma aumenta em 1.",
          "Furtividade Natural. Você pode tentar se esconder mesmo quando possuir apenas a cobertura de uma criatura que for no mínimo um tamanho maior que o seu.",
        ],
        habilidadeBonusSubRaca: {
          Carisma: 1,
          Constituição: 0,
          Força: 0,
          Destreza: 0,
          Inteligência: 0,
          Sabedoria: 0,
        },
      },
      {
        subRacaNome: "Robustos",
        habilidadesSubRaca: [
          "Aumento no Valor de Habilidade. Seu valor de Constituição aumenta em 1.",
          "Resiliência dos Robustos. Você tem vantagem em testes de resistência contra veneno e tem resistência contra dano de veneno.",
        ],
        habilidadeBonusSubRaca: {
          Constituição: 1,
          Força: 0,
          Destreza: 0,
          Inteligência: 0,
          Sabedoria: 0,
          Carisma: 0,
        },
      },
    ],
  },

  // ---------------------------------------------------------------------------------------------------------------  //

  {
    nome: "Humano",
    habilidades: [
      "Habilidade +1 em todos os atributos",
      "Idiomas: Comum e um idioma adicional à escolha do jogador",
    ],
    idiomaRaca: ["Comum"],
    proficienciaHabilidadeBonus: {
      Força: 1,
      Destreza: 1,
      Constituição: 1,
      Inteligência: 1,
      Sabedoria: 1,
      Carisma: 1,
    },
    SubRacas: [
      {
        subRacaNome: "Sem SubRaca",
        habilidadesSubRaca: ["Nenhuma"],
        habilidadeBonusSubRaca: {
          Constituição: 0,
          Força: 0,
          Destreza: 0,
          Inteligência: 0,
          Sabedoria: 0,
          Carisma: 0,
        },
      },
    ],
  },

  // ---------------------------------------------------------------------------------------------------------------  //

  {
    nome: "Draconato",
    habilidades: [
      "Aumento no Valor de Habilidade. Seu valor de Força aumenta em 2 e seu valor de Carisma aumenta em 1.",
      "Deslocamento. Seu deslocamento base de caminhada é 9 metros.",
    ],
    deslocamento: "9 mestros",
    idiomaRaca: ["Comum e Dracônico"],
    proficienciaHabilidadeBonus: {
      Força: 2,
      Carisma: 1,
      Constituição: 0,
      Destreza: 0,
      Inteligência: 0,
      Sabedoria: 0,
    },
    SubRacas: [
      {
        subRacaNome: "Azul",
        habilidadesSubRaca: [
          "Tipo de Dano: Elétrico",
          "Arma de Sopro: Linha de 1,5m/9m (teste de Des)",
          "Resistência a Dano: Elétrico",
        ],
        habilidadeBonusSubRaca: {
          Constituição: 0,
          Força: 0,
          Destreza: 0,
          Inteligência: 0,
          Sabedoria: 0,
          Carisma: 0,
        },
      },
      {
        subRacaNome: "Branco",
        habilidadesSubRaca: [
          "Tipo de Dano: Frio",
          "Arma de Sopro: Cone de 4,5m (teste de Con)",
          "Resistência a Dano: Frio",
        ],
        habilidadeBonusSubRaca: {
          Constituição: 0,
          Força: 0,
          Destreza: 0,
          Inteligência: 0,
          Sabedoria: 0,
          Carisma: 0,
        },
      },
      {
        subRacaNome: "Bronze",
        habilidadesSubRaca: [
          "Tipo de Dano: Elétrico",
          "Arma de Sopro: Linha de 1,5m/9m (teste de Des)",
          "Resistência a Dano: Elétrico",
        ],
        habilidadeBonusSubRaca: {
          Constituição: 0,
          Força: 0,
          Destreza: 0,
          Inteligência: 0,
          Sabedoria: 0,
          Carisma: 0,
        },
      },
      {
        subRacaNome: "Cobre",
        habilidadesSubRaca: [
          "Tipo de Dano: Ácido",
          "Arma de Sopro: Linha de 1,5m/9m (teste de Des)",
          "Resistência a Dano: Ácido",
        ],
        habilidadeBonusSubRaca: {
          Constituição: 0,
          Força: 0,
          Destreza: 0,
          Inteligência: 0,
          Sabedoria: 0,
          Carisma: 0,
        },
      },
      {
        subRacaNome: "Latão",
        habilidadesSubRaca: [
          "Tipo de Dano: Fogo",
          "Arma de Sopro: Linha de 1,5m/9m (teste de Des)",
          "Resistência a Dano: Fogo",
        ],
        habilidadeBonusSubRaca: {
          Constituição: 0,
          Força: 0,
          Destreza: 0,
          Inteligência: 0,
          Sabedoria: 0,
          Carisma: 0,
        },
      },
      {
        subRacaNome: "Negro",
        habilidadesSubRaca: [
          "Tipo de Dano: Ácido",
          "Arma de Sopro: Linha de 1,5m/9m (teste de Des)",
          "Resistência a Dano: Ácido",
        ],
        habilidadeBonusSubRaca: {
          Constituição: 0,
          Força: 0,
          Destreza: 0,
          Inteligência: 0,
          Sabedoria: 0,
          Carisma: 0,
        },
      },
      {
        subRacaNome: "Ouro",
        habilidadesSubRaca: [
          "Tipo de Dano: Fogo",
          "Arma de Sopro: Cone de 4,5m (teste de Des)",
          "Resistência a Dano: Fogo",
        ],
        habilidadeBonusSubRaca: {
          Constituição: 0,
          Força: 0,
          Destreza: 0,
          Inteligência: 0,
          Sabedoria: 0,
          Carisma: 0,
        },
      },
      {
        subRacaNome: "Prata",
        habilidadesSubRaca: [
          "Tipo de Dano: Frio",
          "Arma de Sopro: Cone de 4,5m (teste de Con)",
          "Resistência a Dano: Frio",
        ],
        habilidadeBonusSubRaca: {
          Constituição: 0,
          Força: 0,
          Destreza: 0,
          Inteligência: 0,
          Sabedoria: 0,
          Carisma: 0,
        },
      },
      {
        subRacaNome: "Verde",
        habilidadesSubRaca: [
          "Tipo de Dano: Veneno",
          "Arma de Sopro: Cone de 4,5m (teste de Con)",
          "Resistência a Dano: Veneno",
        ],
        habilidadeBonusSubRaca: {
          Constituição: 0,
          Força: 0,
          Destreza: 0,
          Inteligência: 0,
          Sabedoria: 0,
          Carisma: 0,
        },
      },
      {
        subRacaNome: "Vermelho",
        habilidadesSubRaca: [
          "Tipo de Dano: Fogo",
          "Arma de Sopro: Cone de 4,5m (teste de Des)",
          "Resistência a Dano: Fogo",
        ],
        habilidadeBonusSubRaca: {
          Constituição: 0,
          Força: 0,
          Destreza: 0,
          Inteligência: 0,
          Sabedoria: 0,
          Carisma: 0,
        },
      },
    ],
  },

  // ---------------------------------------------------------------------------------------------------------------  //

  {
    nome: "Gnomo",
    habilidades: [
      "Inteligência +2.",
      "Tamanho. Os gnomos tem entre 0,90 e 1,20 metro e seu peso médio é de 20 kg. Seu tamanho é Pequeno.",
      "Deslocamento. Seu deslocamento base de caminhada é 7,5 metros.",
      "Visão no Escuro. Acostumado à vida subterrânea, você tem uma visão superior no escuro e na penumbra. Você enxerga na penumbra a até 18 metros como se fosse luz plena, e no escuro como se fosse na penumbra. Você não pode discernir cores no escuro, apenas tons de cinza.",
      "Esperteza Gnômica. Você possui vantagem em todos os testes de resistência de Inteligência, Sabedoria e Carisma contra magia.",
    ],
    deslocamento: "7,5 mestors",
    idiomaRaca: ["Comum e Gnômico"],
    proficienciaHabilidadeBonus: {
      Inteligência: 2,
      Constituição: 0,
      Força: 0,
      Destreza: 0,
      Sabedoria: 0,
      Carisma: 0,
    },
    SubRacas: [
      {
        subRacaNome: "Gnomo da Floresta",
        habilidadesSubRaca: [
          "Aumento no Valor de Habilidade. Seu valor de Destreza aumenta em 1.",
          "Ilusionista Nato. Você conhece o truque ilusão menor. Inteligência é a sua habilidade usada para conjurá-la.",
          "Falar com Bestas Pequenas. Através de sons e gestos, você pode comunicar ideias simples para Bestas pequenas ou menores. Gnomos da floresta amam os animais e normalmente possuem esquilos, doninhas, coelhos, toupeiras, pica-paus e outras criaturas como amados animais de estimação.",
        ],
        habilidadeBonusSubRaca: {
          Constituição: 0,
          Força: 0,
          Destreza: 0,
          Inteligência: 0,
          Sabedoria: 0,
          Carisma: 0,
        },
      },
      {
        subRacaNome: "Gnomo das Rochas",
        habilidadesSubRaca: [
          "Aumento no Valor de Habilidade. Seu valor de Constituição aumenta em 1.",
          "Conhecimento de Artífice. Toda vez que você fizer um teste de Inteligência (História) relacionado a itens mágicos, objetos alquímicos ou mecanismos tecnológicos, você pode adicionar o dobro do seu bônus de proficiência, ao invés de qualquer bônus de proficiência que você normalmente use.",
          "Engenhoqueiro. Você possui proficiência com ferramentas de artesão (ferramentas de engenhoqueiro). Usando essas ferramentas, você pode gastar 1 hora e 10 po em materiais para construir um mecanismo Miúdo (CA 5, 1 pv). O mecanismo para de funcionar após 24 horas (a não ser que você gaste 1 hora reparando-o para manter o mecanismo funcionando), ou quando você usa sua ação para desmantelá-lo; nesse momento, você pode recuperar o material usado para criá-lo. Você pode ter até três desses mecanismos ativos ao mesmo tempo.",
        ],
        Engenhoca: [
          "Brinquedo Mecânico",
          "Isqueiro Mecânico",
          "Caixa de Música",
        ],
        habilidadeBonusSubRaca: {
          Constituição: 0,
          Força: 0,
          Destreza: 0,
          Inteligência: 0,
          Sabedoria: 0,
          Carisma: 0,
        },
      },
    ],
  },

  // ---------------------------------------------------------------------------------------------------------------  //

  {
    nome: "Meio-Elfo",
    habilidades: [
      "Carisma +2 e outros dois valores de habilidade, à sua escolha, aumentam em 1.",
      "Deslocamento. Seu deslocamento base de caminhada é 9 metros.",
      "Visão no Escuro. Graças ao seu sangue élfico, você tem uma visão superior no escuro e na penumbra. Você enxerga na penumbra a até 18 metros como se fosse luz plena, e no escuro como se fosse na penumbra. Você não pode discernir cores no escuro, apenas tons de cinza.",
      "Ancestral Feérico. Você possui vantagem em testes de resistência contra encantamento e magia não pode colocar você para dormir.",
      "Versatilidade em Perícia. Você ganha proficiência em duas perícias, à sua escolha.",
    ],
    idiomaRaca: ["Comum e Élfico"],
    deslocamento: "9 metros",
    proficienciaHabilidadeBonus: {
      Carisma: 2,
      Constituição: 0,
      Força: 0,
      Destreza: 0,
      Inteligência: 0,
      Sabedoria: 0,
    },
    periciasRacaLabel: "escolha duas dentre:",
    perficiasRacaMinimo: "2",
    periciasRacaSelecao: [
      "Arcanismo",
      "História",
      "Intuição",
      "Investigação",
      "Medicina",
      "Religião",
    ],
    SubRacas: [
      {
        subRacaNome: "Sem SubRaca",
        habilidadesSubRaca: ["Nenhuma"],
        habilidadeBonusSubRaca: {
          Constituição: 0,
          Força: 0,
          Destreza: 0,
          Inteligência: 0,
          Sabedoria: 0,
          Carisma: 0,
        },
      },
    ],
  },

  // ---------------------------------------------------------------------------------------------------------------  //

  {
    nome: "Meio-Orc",
    habilidades: [
      "Força +2 e Constituição +1.",
      "Deslocamento. Seu deslocamento base de caminhada é 9 metros.",
      "Visão no Escuro. Graças ao seu sangue orc, você tem uma visão superior no escuro e na penumbra. Você enxerga na penumbra a até 18 metros como se fosse luz plena, e no escuro como se fosse na penumbra. Você não pode discernir cores no escuro, apenas tons de cinza.",
      "Ameaçador. Você adquire proficiência na perícia Intimidação.",
      "Resistência Implacável. Quando você é reduzido a 0 pontos de vida mas não é completamente morto, você pode voltar para 1 ponto de vida. Você não pode usar essa característica novamente até completar um descanso longo.",
      "Ataques Selvagens. Quando você atinge um ataque crítico com uma arma corpo-a-corpo, você pode rolar um dos dados de dano da arma mais uma vez e adicioná-lo ao dano extra causado pelo acerto crítico.",
    ],
    deslocamento: "9 metros",
    idiomaRaca: ["Comum e Orc"],
    proficienciaHabilidadeBonus: {
      Força: 2,
      Constituição: 1,
      Destreza: 0,
      Inteligência: 0,
      Sabedoria: 0,
      Carisma: 0,
    },
    proficienciaPericia: "Intimidação",
    SubRacas: [
      {
        subRacaNome: "Sem SubRaca",
        habilidadesSubRaca: ["Nenhuma"],
        habilidadeBonusSubRaca: {
          Constituição: 0,
          Força: 0,
          Destreza: 0,
          Inteligência: 0,
          Sabedoria: 0,
          Carisma: 0,
        },
      },
    ],
  },

  // ---------------------------------------------------------------------------------------------------------------  //

  {
    nome: "Tiefling",
    habilidades: [
      "Inteligência +1 e Carisma +2.",
      "Deslocamento. Seu deslocamento base de caminhada é 9 metros.",
      "Visão no Escuro. Graças à sua herança infernal, você tem uma visão superior no escuro e na penumbra. Você enxerga na penumbra a até 18 metros como se fosse luz plena, e no escuro como se fosse na penumbra. Você não pode discernir cores no escuro, apenas tons de cinza.",
      "Resistência Infernal. Você possui resistência a dano de fogo.",
      "Legado Infernal. Você conhece o truque taumaturgia. Quando você atingir o 3° nível, você poderá conjurar a magia repreensão infernal como uma magia de 2° nível. Quando você atingir o 5° nível, você também poderá conjurar a magia escuridão. Você precisa terminar um descanso longo para poder usar as magias desse traço novamente. Sua habilidade de conjuração para essas magias é Carisma.",
    ],
    deslocamento: "9 metros",
    idiomaRaca: ["Comum e infernal"],

    proficienciaHabilidadeBonus: {
      Inteligência: 1,
      Carisma: 2,
      Constituição: 0,
      Força: 0,
      Destreza: 0,
      Sabedoria: 0,
    },
    SubRacas: [
      {
        subRacaNome: "Sem SubRaca",
        habilidadesSubRaca: ["Nenhuma"],
        habilidadeBonusSubRaca: {
          Constituição: 0,
          Força: 0,
          Destreza: 0,
          Inteligência: 0,
          Sabedoria: 0,
          Carisma: 0,
        },
      },
    ],
  },
];

// ---------------------------------------------------------------------------------------------------------------  //

// CLASSES

export const classes = [
  {
    nome: "Bárbaro",
    // adicionar as imgs no storage 500X400
    imagens: [
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FBarbaro%2FFuria.png?alt=media&token=0b96ac46-a9d6-43a3-a9b8-e692daa59ca6",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FBarbaro%2FDefesa%20Sem%20Armadura.png?alt=media&token=8b2a9158-e972-4bbf-ac68-88d6ac8c8d8d",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FBarbaro%2FAtaque%20Descuidado.png?alt=media&token=3680c741-5ec5-47b8-921c-875298d04bcf",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FBarbaro%2FSentido%20De%20Perigo.png?alt=media&token=c2e0eae6-4cf9-4248-b020-7ee167a9aeb8",
    ],
    proficiencias: {
      armaduras: "Armaduras Leves, Armaduras Médias e Escudos",
      armas: "Armas Simples e Armas Marciais",
      ferramentas: "Nenhuma",
      testesDeResistecia: " Força e Constituição",
      periciasLabel: "escolha duas dentre:",
      perficiasMinimo: "2",
      periciasSelecao: [
        "Adestrar Animais",
        "Atletismo",
        "Intimidação",
        "Natureza",
        "Percepção",
        "Sobrevivência",
      ],
    },
    habilidadesClasse: {
      habilidadeNv1: "Furia e Defesa sem Armadura",
      habilidadeNv2: "Ataque Descuidado e Sentido de Perigo",
    },
    equipamentos: {
      equipamentoAlpha1: [
        "Um machado grande",
        "Qualquer Arma marcial corpo-a-corpo",
      ],
      equipamentoAlpha2: ["Dois machados de mão", "Qualquer Arma simples"],
      equipamentoObgt: ["Um pacote de aventureiros e Quatro azagaias"],
    },

    dadosDeVida: "1d12 pontos de vida por nível",
    // Outras informações específicas da classe
  },

  // ---------------------------------------------------------------------------------------------------------------  //

  {
    nome: "Bardo",
    // adicionar as imgs no storage 500X400
    imagens: [
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FBardo%2FConjura%C3%A7%C3%A3o%20Bardo.png?alt=media&token=9279abd7-ed4b-487d-aabb-fe1ae270a820",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FBardo%2FInspiracao%20Bardo.png?alt=media&token=7b964d53-c646-4fdb-9a0d-3aa117d3ce1c",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FBardo%2FVersatilidade.png?alt=media&token=0dfaded0-7e17-46a5-b9b6-266d0eb60bce",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FBardo%2FCancao%20de%20descanso.png?alt=media&token=76873621-f9b4-4b2e-96dc-8dfcc776b1e9",
    ],
    proficiencias: {
      armaduras: "Armaduras Leves",
      armas:
        "Armas simples, bestas de mão, espadas longas, rapieiras, espadas curtas ",
      ferramentas: "Três instrumentos musicais, à sua escolha",
      testesDeResistecia: " Destreza e Carisma",
      periciasLabel: "escolha três dentre:",
      perficiasMinimo: "3",
      periciasSelecao: [
        "Acrobacia",
        "Arcanismo",
        "Atletismo",
        "Atuação",
        "Enganação",
        "Furtividade",
        "Historia",
        "intimidação",
        "Intuição",
        "investigação",
        "Lidar com Animais",
        "Medicina",
        "Natureza",
        "Percepção",
        "Persuação",
        "Prestidigitação",
        "Religião",
        "Sobrevivência",
      ],
    },
    habilidadesClasse: {
      habilidadeNv1: "Conjuração e Inspiração de Bardo",
      habilidadeNv2: "Versatilidade e Canção de Descanso",
    },
    equipamentos: {
      equipamentoAlpha1: [
        "Uma rapieira",
        "Uma espada longa",
        "Qualuer Arma Simples",
      ],
      equipamentoAlpha2: ["Um pacote de diplomacia", "Um pacote de artista"],
      equipamentoAlpha3: ["Um lute", "Qualquer outro instrumento musical"],
      equipamentoObgt: ["Armadura de couro e uma adaga"],
    },

    dadosDeVida: "1d8 pontos de vida por nível",
    // Outras informações específicas da classe
  },

  // ---------------------------------------------------------------------------------------------------------------  //

  {
    nome: "Bruxo",
    imagens: [
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FBruxo%2FPatrono%20Ancestral.png?alt=media&token=a7401f03-cbd6-46b2-9b29-effd9bf914b8",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FBruxo%2FMagia%20de%20pact1o.jpg.png?alt=media&token=ad039d9a-4357-4a07-a5f6-3f25a2ede6df",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FBruxo%2FMagia%20de%20pacto2.jpg.png?alt=media&token=98b0fbeb-3008-4bce-8984-165f07ed5615",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FBruxo%2FInvoca%C3%A7%C3%A3o%20Mistica.png?alt=media&token=2f471d11-48a3-40f1-bc6b-3cee6adb3951",
    ],
    proficiencias: {
      armaduras: "Armaduras Leves",
      armas: "Armas Simples",
      ferramentas: "Nenhuma",
      testesDeResistecia: "Sabedoria e Carisma",
      periciasLabel: "Escolha duas dentre:",
      perficiasMinimo: "2",
      periciasSelecao: [
        "Arcanismo",
        "Enganação",
        "História",
        "Intimidação",
        "Investigação",
        "Natureza",
        "Religião",
      ],
    },
    habilidadesClasse: {
      habilidadeNv1: "Patrono Transcedental e Magia de Pacto",
      habilidadeNv2: "Invocação Mística",
    },
    equipamentos: {
      equipamentoAlpha1: [
        "(a) Uma besta leve e 20 virotes",
        "(b) Qualquer arma simples",
      ],
      equipamentoAlpha2: ["(a) Uma bolsa de componentes", "(b) Um foco arcano"],
      equipamentoAlpha3: [
        "(a) Um pacote de estudioso",
        "(b) Um pacote de explorador",
      ],
      equipamentoObgt: [
        "Armadura de couro, Qualquer arma simples e Duas adagas",
      ],
    },
    dadosDeVida: "1d8 pontos de vida por nível",
    // Outras informações específicas da classe
  },

  // ---------------------------------------------------------------------------------------------------------------  //
  {
    nome: "Clérigo",
    imagens: [
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FClerigo%2FConjuracao%20Clerigo%201.png?alt=media&token=00b1fc65-a474-43e2-885b-d02ea46f9240",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FClerigo%2FConjuracao%20Clerigo%202.png?alt=media&token=c424aff0-41df-4132-9e20-3409ff8967a6",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FClerigo%2FDominio%20Divino.png?alt=media&token=fc5e1d6d-1ada-463c-8cfe-d0bf71c325b0",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FClerigo%2FCanalizar%20Divindade%201.png?alt=media&token=89836a5f-2daf-4cad-91d8-3279cd36f9cc",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FClerigo%2FCanalizar%20Divindade%202.png?alt=media&token=49e8e5b5-ad91-4482-b224-8a19c20c080e",
    ],
    proficiencias: {
      armaduras: "Armaduras Leves, Armaduras Médias, Escudos",
      armas: "Todas as Armas Simples",
      ferramentas: "Nenhuma",
      testesDeResistecia: "Sabedoria e Carisma",
      periciasLabel: "Escolha duas dentre:",
      perficiasMinimo: "2",
      periciasSelecao: [
        "História",
        "Intuição",
        "Medicina",
        "Persuasão",
        "Religião",
      ],
    },
    habilidadesClasse: {
      habilidadeNv1: "Conjuração e Domínio Divino",
      habilidadeNv2: "Canalizar Divindade",
    },
    equipamentos: {
      equipamentoAlpha1: [
        "(a) Uma maça",
        "(b) Um martelo de guerra (se for proficiente)",
      ],
      equipamentoAlpha2: [
        "(a) Brunea",
        "(b) Armadura de couro",
        "(c) Cota de malha (se for proficiente)",
      ],
      equipamentoAlpha3: [
        "(a) Uma besta leve e 20 virotes",
        "(b) Qualquer arma simples",
      ],
      equipamentoAlpha4: [
        "(a) Um pacote de sacerdote",
        "(b) Um pacote de aventureiro",
      ],
      equipamentoObgt: ["Um escudo e Um símbolo sagrado"],
    },
    dadosDeVida: "1d8 pontos de vida por nível",
    // Outras informações específicas da classe
  },
  // ---------------------------------------------------------------------------------------------------------------  //
  {
    nome: "Druida",
    imagens: [
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FDruida%2FDruidico.png?alt=media&token=45e01956-7716-4c3b-a78b-415a1fb6f2df",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FDruida%2FConjuracao%20Druida%201.png?alt=media&token=e80a84e0-e475-4671-b925-e5e173c2b878",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FDruida%2FConjuracao%20Druida%202.png?alt=media&token=3310fdf4-8811-4988-a38d-ef866c4f16cc",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FDruida%2FForma%20Selvagem%201.png?alt=media&token=e8aed1bf-0149-45fb-9d42-04413a4f18eb",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FDruida%2FForma%20Selvagem%202.png?alt=media&token=343cfd16-3213-4fa0-9128-6f3a2d5e5ae1",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FDruida%2FForma%20Selvagem%203.png?alt=media&token=0f3a017a-eee9-4b10-864d-5dbad061da0e",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FDruida%2FCirculo%20Druicico.png?alt=media&token=8da4ea87-8af6-46e4-998c-91a670082ac7",
    ],
    proficiencias: {
      armaduras:
        "Armaduras Leves, Armaduras Médias, Escudos (Druidas não vestirão armaduras ou usarão escudos feitos de metal)",
      armas:
        "Clavas, Adagas, Dardos, Azagaias, Maças, Bordões, Cimitarras, Foice, Funda e Lanças",
      ferramentas: "Kit de Herbalismo",
      testesDeResistecia: "Inteligência e Sabedoria",
      periciasLabel: "Escolha duas dentre:",
      perficiasMinimo: "2",
      periciasSelecao: [
        "Arcanismo",
        "Adestrar Animais",
        "Intuição",
        "Medicina",
        "Natureza",
        "Percepção",
        "Religião",
        "Sobrevivência",
      ],
    },
    habilidadesClasse: {
      habilidadeNv1: "Druídico e Conjuração",
      habilidadeNv2: "Forma Selvagem e Círculo Druídico",
    },
    equipamentos: {
      equipamentoAlpha1: [
        "(a) Um escudo de madeira",
        "(b) Qualquer arma simples",
      ],
      equipamentoAlpha2: [
        "(a) Uma cimitarra",
        "(b) Qualquer arma corpo-a-corpo simples",
      ],
      equipamentoAlpha3: [
        "(a) Um pacote de estudioso",
        "(b) Um pacote de explorador",
      ],
      equipamentoObgt: [
        "Armadura de couro, Um pacote de aventureiro e Um foco druídico",
      ],
    },
    dadosDeVida: "1d8 pontos de vida por nível",
    // Outras informações específicas da classe
  },

  // ---------------------------------------------------------------------------------------------------------------  //

  {
    nome: "Feiticeiro",
    imagens: [
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FFeiticeiro%2FConjuracao%20Feiticeiro%201.png?alt=media&token=4eab3f8e-3302-44d6-a63a-594bf7816ff9",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FFeiticeiro%2FConjuracao%20Feiticeiro%202.png?alt=media&token=95f502e1-76bb-4af9-979d-1afc96a271b0",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FFeiticeiro%2FOrigem%20do%20Feitico.jpg?alt=media&token=fadffe53-b680-492c-8629-eace6582cc1a",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FFeiticeiro%2FFonte%20de%20Magia.png?alt=media&token=d4aa2b0a-8a2c-44f2-9163-bdedfdfc4956",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FFeiticeiro%2FFonte%20de%20Magia%202.png?alt=media&token=16ef5f73-d02a-45f6-8ef6-e3ee4f3966e2",
    ],
    proficiencias: {
      armaduras: "Nenhuma",
      armas: "Adagas, Dardos, Fundas, Bordões e Bestas Leves",
      ferramentas: "Nenhuma",
      testesDeResistecia: "Constituição, Carisma",
      periciasLabel: "Escolha duas dentre:",
      perficiasMinimo: "2",
      periciasSelecao: [
        "Arcanismo",
        "Enganação",
        "Intuição",
        "Intimidação",
        "Persuasão",
        "Religião",
      ],
    },
    habilidadesClasse: {
      habilidadeNv1: "Conjuração e Origem de Feitiçaria",
      habilidadeNv2: "Fonte de Magia",
    },
    equipamentos: {
      equipamentoAlpha1: [
        "(a) Uma besta leve e 20 virotes",
        "(b) Qualquer arma simples",
      ],
      equipamentoAlpha2: ["(a) Uma bolsa de componentes", "(b) Um foco arcano"],
      equipamentoAlpha3: [
        "(a) Um pacote de explorador",
        "(b) Um pacote de aventureiro",
      ],
      equipamentoObgt: [],
    },
    dadosDeVida: "1d6 pontos de vida por nível",
    // Outras informações específicas da classe
  },

  // ---------------------------------------------------------------------------------------------------------------  //

  {
    nome: "Guerreiro",
    imagens: [
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FGuerreiro%2FEstilo%20de%20Luta.png?alt=media&token=2b2e1260-fe27-44a6-a6e8-c87f12808cad",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FGuerreiro%2FRetomar%20folego.png?alt=media&token=48d53748-d0cf-4a69-be49-63c1ba94035a",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FGuerreiro%2FSurto%20de%20acao.jpg?alt=media&token=4be43142-e193-43da-8cc1-58f38beecb16",
    ],
    proficiencias: {
      armaduras: "Todas as armaduras, escudos",
      armas: "Armas simples, armas marciais",
      ferramentas: "Nenhuma",
      testesDeResistecia: "Força, Constituição",
      periciasLabel: "Escolha duas dentre:",
      perficiasMinimo: "2",
      periciasSelecao: [
        "Acrobacia",
        "Adestrar Animais",
        "Atletismo",
        "História",
        "Intuição",
        "Intimidação",
        "Percepção",
        "Sobrevivência",
      ],
    },
    habilidadesClasse: {
      habilidadeNv1: "Estilo de Luta, Retomar Folego",
      habilidadeNv2: "Surto de Acção",
    },
    equipamentos: {
      equipamentoAlpha1: [
        "(a) Cota de malha",
        "(b) Gibão de peles, arco longo e 20 flechas",
      ],
      equipamentoAlpha2: [
        "(a) Uma arma marcial e um escudo",
        "(b) Duas armas marciais",
      ],
      equipamentoAlpha3: [
        "(a) Uma besta leve e 20 virotes",
        "(b) Dois machados de arremesso",
      ],
      equipamentoObgt: [],
    },
    dadosDeVida: "1d10 pontos de vida por nível",
    // Outras informações específicas da classe
  },

  // ---------------------------------------------------------------------------------------------------------------  //

  {
    nome: "Ladino",
    imagens: [
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FLadino%2FEspecializa%C3%A7%C3%A3o.png?alt=media&token=0fca9a48-e44a-4626-92a0-93781b8ca42b",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FLadino%2FAtaque%20Furtivo.png?alt=media&token=a458717b-70b6-42af-8837-86325046b8a1",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FLadino%2FGiria%20de%20Ladrao.jpg?alt=media&token=f956bab5-b09a-411e-a9af-68d56956214d",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FLadino%2FAcao%20Ardilosa.png?alt=media&token=79d143e9-373b-4703-8423-ca98b7505d47",
    ],
    proficiencias: {
      armaduras: "Armaduras leves",
      armas:
        "Armas simples, bestas de mão, espadas longas, rapieiras, espadas curtas",
      ferramentas: "Ferramentas de ladrão",
      testesDeResistecia: "Destreza, Inteligência",
      periciasLabel: "Escolha quatro dentre:",
      perficiasMinimo: "4",
      periciasSelecao: [
        "Acrobacia",
        "Atletismo",
        "Atuação",
        "Enganação",
        "Furtividade",
        "Intimidação",
        "Intuição",
        "Investigação",
        "Percepção",
        "Persuasão",
        "Prestidigitação",
      ],
    },
    habilidadesClasse: {
      habilidadeNv1: "Especialização, Ataque Furtivo e Gíria de Ladrão",
      habilidadeNv2: "Ação Ardilosa",
    },
    equipamentos: {
      equipamentoAlpha1: ["(a) Uma rapieira", "(b) Uma espada longa"],
      equipamentoAlpha2: [
        "(a) Um arco curto e uma aljava com 20 flechas",
        "(b) Uma espada curta",
      ],
      equipamentoAlpha3: [
        "(a) Um pacote de assaltante",
        "(b) Um pacote de aventureiro",
        "(c) Um pacote de explorador",
      ],
      equipamentoObgt: [
        "Armadura de couro, Duas adagas e Ferramentas de ladrão",
      ],
    },
    dadosDeVida: "1d8 pontos de vida por nível",
    // Outras informações específicas da classe
  },

  // ---------------------------------------------------------------------------------------------------------------  //

  {
    nome: "Mago",
    // adicionar as imgs no storage 500X400
    imagens: [
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FMago%2FConjuracao%20Mago%201.png?alt=media&token=e218d3d2-1e69-45a2-b17e-9f9f1a7a4397",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FMago%2FConjuracao%20Mago%202.png?alt=media&token=ea47da45-9354-4e0c-bc51-c4ffca29a922",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FMago%2FConjuracao%20Mago%203.png?alt=media&token=6322c487-83b2-4371-adf6-83733b292b64",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FMago%2FRecuperacao%20Arcana.png?alt=media&token=eb28c6dc-8b6e-435c-8c1e-384c0bc0c17f",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FMago%2FTradicao%20Arcana.png?alt=media&token=ff95ec77-77d0-41cb-8e89-77941b01f7af",
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
      habilidadeNv1: ["CONJURAÇÃO e RECUPERAÇÃO ARCANA"],
      habilidadeNv2: ["TRADIÇÃO ARCANA"],
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

  // ---------------------------------------------------------------------------------------------------------------  //
  {
    nome: "Monge",
    imagens: [
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FMonge%2FDefesa%20Sem%20Armadura%20Monge.png?alt=media&token=f6f2f19a-ff67-472c-86db-f4b2ee9908c6",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FMonge%2FArtes%20Marciais.png?alt=media&token=e3e374f9-b6cf-4d53-8f6f-07a456f1a6f0",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FMonge%2FChi.png?alt=media&token=c390084c-24b6-4b3d-85e7-f05a601e6e34",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FMonge%2FChi%202.png?alt=media&token=c9ebcc11-aa6f-4a34-9953-1a5619ce58b6",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FMonge%2Fmovimento%20sem%20armadura.png?alt=media&token=ad61992f-37ae-4026-80bb-548fe2d97ed4",
      "",
    ],
    proficiencias: {
      armaduras: "Nenhuma",
      armas: "Armas simples, espadas curtas",
      ferramentas:
        "Escolha um tipo de ferramenta de artesão ou um instrumento musical",
      testesDeResistecia: "Força, Destreza",
      periciasLabel: "Escolha duas dentre:",
      perficiasMinimo: "2",
      periciasSelecao: [
        "Acrobacia",
        "Atletismo",
        "Furtividade",
        "História",
        "Intuição",
        "Religião",
      ],
    },
    habilidadesClasse: {
      habilidadeNv1: "Defesa Sem Armadura e Artes marciais",
      habilidadeNv2: "Chi e Movimento Sem Armadura",
    },
    equipamentos: {
      equipamentoAlpha1: ["(a) Uma espada curta", "(b) Qualquer arma simples"],
      equipamentoAlpha2: [
        "(a) Um pacote de explorador",
        "(b) Um pacote de aventureiro",
      ],
      equipamentoObgt: ["10 dardos"],
    },
    dadosDeVida: "1d8 pontos de vida por nível",
    // Outras informações específicas da classe
  },

  // ---------------------------------------------------------------------------------------------------------------  //
  {
    nome: "Paladino",
    imagens: [
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FPaladino%2FSentido%20Divino.png?alt=media&token=8afe6c2a-c671-4a8c-9290-c3bb933cc17d",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FPaladino%2FCura%20pela%20M%C3%A3os.png?alt=media&token=48e686c3-46ef-4325-839d-fd8b7e43beaa",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FPaladino%2FEstilo%20de%20luta%20Paladino.jpg?alt=media&token=25f8b478-fd1f-4cb9-91bf-d0a571aa1a50",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FPaladino%2FConjuracao%20Paladino%201.png?alt=media&token=0604694e-9b2d-4057-96d6-71c7f465015b",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FPaladino%2FConjuracao%20Paladino%202.png?alt=media&token=2e0d5f68-1d98-4764-b738-2b6256858c77",
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2FPaladino%2FDestrui%C3%A7%C3%A3o%20Divina.png?alt=media&token=4a64402d-00f3-48c3-b216-6f53e9a6c76a",
    ],
    proficiencias: {
      armaduras: "Todas as armaduras, escudos",
      armas: "Armas simples, armas marciais",
      ferramentas: "Nenhum",
      testesDeResistecia: "Sabedoria, Carisma",
      periciasLabel: "Escolha duas dentre:",
      perficiasMinimo: "2",
      periciasSelecao: [
        "Atletismo",
        "Intuição",
        "Intimidação",
        "Medicina",
        "Persuasão",
        "Religião",
      ],
    },
    habilidadesClasse: {
      habilidadeNv1: "Sentido Divino e Cura pelas Mãos",
      habilidadeNv2: "Estilo de Luta Conjuração e Destuição Divina",
    },
    equipamentos: {
      equipamentoAlpha1: [
        "(a) Uma arma marcial e um escudo",
        "(b) Duas armas marciais",
      ],
      equipamentoAlpha2: [
        "(a) Cinco azagaias",
        "(b) Qualquer arma simples corpo-a-corpo",
      ],
      equipamentoAlpha3: [
        "(a) Um pacote de sacerdote",
        "(b) Um pacote de aventureiro",
      ],
      equipamentoObgt: ["Cota de malha e Um símbolo sagrado"],
    },
    dadosDeVida: "1d10 pontos de vida por nível",
    // Outras informações específicas da classe
  },

  // ---------------------------------------------------------------------------------------------------------------  //
  {
    nome: "Patrulheiro",
    imagens: ["URL_DA_IMAGEM_DO_PATRULHEIRO"],
    proficiencias: {
      armaduras: "Armaduras leves, armaduras médias, escudos",
      armas: "Armas simples, armas marciais",
      ferramentas: "Nenhuma",
      testesDeResistecia: "Força, Destreza",
      periciasLabel: "Escolha três dentre:",
      perficiasMinimo: "3",
      periciasSelecao: [
        "Adestrar Animais",
        "Atletismo",
        "Furtividade",
        "Intuição",
        "Investigação",
        "Natureza",
        "Percepção",
        "Sobrevivência",
      ],
    },
    habilidadesClasse: {
      habilidadeNv1: "Inimigo Favorito e Explorador Natural",
      habilidadeNv2: "Estilo de Luta e Conjuração",
    },
    equipamentos: {
      equipamentoAlpha1: ["(a) Brunea", "(b) Armadura de couro"],
      equipamentoAlpha2: [
        "(a) Duas espadas curtas",
        "(b) Duas armas simples corpo-a-corpo",
      ],
      equipamentoAlpha3: [
        "(a) Um pacote de explorador",
        "(b) Um pacote de aventureiro",
      ],
      equipamentoObgt: ["Um arco longo e Uma aljava com 20 flechas"],
    },
    dadosDeVida: "1d10 pontos de vida por nível",
    // Outras informações específicas da classe
  },

  // ---------------------------------------------------------------------------------------------------------------  //
];
