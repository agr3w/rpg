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
      Escolha: {
        Força: 1,
        Destreza: 1,
        Constituição: 1,
        Inteligência: 1,
        Sabedoria: 1,
        Carisma: 1,
      },
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
  },
];

// ---------------------------------------------------------------------------------------------------------------  //

// CLASSES

export const classes = [
  {
    nome: "Bárbaro",
    // adicionar as imgs no storage 500X400
    imagens: [
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2Fconjura%C3%A7%C3%A3o1.png?alt=media&token=4605c5b2-798d-49a2-b4e3-49c502fee9db",
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
      "https://firebasestorage.googleapis.com/v0/b/test-b6bc2.appspot.com/o/ImagensHabilidades%2Fconjura%C3%A7%C3%A3o1.png?alt=media&token=4605c5b2-798d-49a2-b4e3-49c502fee9db",
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
    imagens: ["URL_DA_IMAGEM_DO_BRUXO"],
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
      habilidadeNv2: "Recuperação Arcana",
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
    imagens: ["URL_DA_IMAGEM_DO_CLERIGO"],
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
      habilidadeNv3: "Nada",
      habilidadeNv4: "Incremento no Valor de Habilidade",
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
    imagens: ["URL_DA_IMAGEM_DO_DRUIDA"],
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
    imagens: ["URL_DA_IMAGEM_DO_FEITICEIRO"],
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
    imagens: ["URL_DA_IMAGEM_DO_GUERREIRO"],
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
      habilidadeNv1: "Estilo de Luta, Segunda Vida",
      habilidadeNv2: "Ação Extra",
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
    imagens: ["URL_DA_IMAGEM_DO_LADINO"],
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

  // ---------------------------------------------------------------------------------------------------------------  //
  {
    nome: "Monge",
    imagens: ["URL_DA_IMAGEM_DO_MONGE"],
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
    imagens: ["URL_DA_IMAGEM_DO_PALADINO"],
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
      habilidadeNv2: "Estilo de Luta e Conjuração",
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
