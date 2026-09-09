export const SUBRACES_DATA = {
  // ==================== ANÃO ====================
  anao_colina: {
    id: "anao_colina",
    raceId: "anao",
    name: "Anão da Colina",
    quote: "Sentidos afiados, sabedoria profunda e a lendária tenacidade dos anões dourados.",
    image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=400&q=80",
    quickStats: {
      abilityBonus: "Sabedoria +1",
      hpBonus: "+1 PV máx por nível",
      speed: "7,5 metros",
      darkvision: "18 metros (Base)"
    },
    traits: [
      {
        name: "Tenacidade Anã",
        desc: "Seu máximo de pontos de vida aumenta em 1, e você recebe mais 1 ponto de vida adicional a cada vez que subir de nível."
      }
    ],
    lore: {
      origin: "Conhecidos como anões dourados em Faerûn ou Neidar em Krynn, vivem em reinos prósperos nas colinas e terras altas do sul.",
      culture: "Possuem grande intuição e paciência. Costumam ser líderes espirituais, clérigos reverenciados e negociadores justos."
    },
    proficiencies: {
      weapons: "Machados de batalha, machadinhas, martelos leves e de guerra (Herança Anã).",
      armors: "Nenhuma adicional.",
      spells: "Nenhuma magia inata."
    }
  },

  anao_montanha: {
    id: "anao_montanha",
    raceId: "anao",
    name: "Anão da Montanha",
    quote: "Força bruta forjada no granito e domínio marcial blindado sob cotas de malha ancestrais.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80",
    quickStats: {
      abilityBonus: "Força +2",
      armorProf: "Armaduras Leves e Médias",
      speed: "7,5 metros",
      darkvision: "18 metros (Base)"
    },
    traits: [
      {
        name: "Treinamento Anão com Armaduras",
        desc: "Você adquire proficiência no uso de armaduras leves e armaduras médias."
      }
    ],
    lore: {
      origin: "Os valorosos anões do escudo do norte de Faerûn e os nobres clãs Daewar e Hylar de Dragonlance.",
      culture: "Habitantes de picos íngremes e galerias profundas. São guerreiros natos acostumados a repelir hordas de orcs e gigantes."
    },
    proficiencies: {
      weapons: "Machados e martelos da herança anã.",
      armors: "Armaduras Leves e Armaduras Médias.",
      spells: "Nenhuma magia inata."
    }
  },

  // ==================== ELFO ====================
  alto_elfo: {
    id: "alto_elfo",
    raceId: "elfo",
    name: "Alto Elfo",
    quote: "Mente aguçada, erudição arcana e a herança dourada dos reinos élficos imperecíveis.",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80",
    quickStats: {
      abilityBonus: "Inteligência +1",
      extraSpell: "1 Truque de Mago",
      speed: "9 metros",
      darkvision: "18 metros (Base)"
    },
    traits: [
      {
        name: "Treinamento Élfico com Armas",
        desc: "Proficiência com espadas longas, espadas curtas, arcos curtos e arcos longos."
      },
      {
        name: "Truque Arcano",
        desc: "Você conhece 1 truque à sua escolha da lista de magias de Mago (Inteligência é seu atributo de conjuração)."
      },
      {
        name: "Idioma Adicional",
        desc: "Você pode falar, ler e escrever um idioma adicional à sua escolha."
      }
    ],
    lore: {
      origin: "Divide-se entre os Elfos do Sol (altivos e de pele bronzeada) e os Elfos da Lua (amigáveis, com pele de alabastro).",
      culture: "Valorizam o estudo de bibliotecas arcanas, a preservação histórica e a magia refinada como ápice da civilização."
    },
    proficiencies: {
      weapons: "Espadas longas, espadas curtas, arcos longos e arcos curtos.",
      armors: "Nenhuma adicional.",
      spells: "1 Truque de Mago inato à sua escolha."
    }
  },

  elfo_floresta: {
    id: "elfo_floresta",
    raceId: "elfo",
    name: "Elfo da Floresta",
    quote: "Pés velozes entre a folhagem, camuflagem mística e olhos que nunca perdem uma presa de vista.",
    image: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=400&q=80",
    quickStats: {
      abilityBonus: "Sabedoria +1",
      speed: "10,5 metros (Pés Ligeiros)",
      camouflage: "Máscara da Natureza",
      darkvision: "18 metros (Base)"
    },
    traits: [
      {
        name: "Pés Ligeiros",
        desc: "Seu deslocamento base de caminhada aumenta para 10,5 metros."
      },
      {
        name: "Máscara da Natureza",
        desc: "Você pode tentar se esconder mesmo estando apenas levemente obscurecido por folhagem, chuva forte, neve ou névoa."
      },
      {
        name: "Treinamento Élfico com Armas",
        desc: "Proficiência com espadas longas, espadas curtas, arcos curtos e arcos longos."
      }
    ],
    lore: {
      origin: "Conhecidos como elfos selvagens ou verdes em Faerûn e Kagonesti em Dragonlance.",
      culture: "Reclusos e desconfiados de forasteiros, vivem em harmonia absoluta com as florestas primordiais sem arar ou minerar."
    },
    proficiencies: {
      weapons: "Espadas longas, espadas curtas, arcos longos e arcos curtos.",
      armors: "Nenhuma adicional.",
      spells: "Nenhuma magia inata."
    }
  },

  drow: {
    id: "drow",
    raceId: "elfo",
    name: "Elfo Negro (Drow)",
    quote: "A graça letal das profundezas do Subterrâneo, tecida em magia de sombras e veneno.",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80",
    quickStats: {
      abilityBonus: "Carisma +1",
      darkvision: "36 metros (Superior)",
      special: "Magia Drow & Sensibilidade à Luz",
      speed: "9 metros"
    },
    traits: [
      {
        name: "Visão no Escuro Superior",
        desc: "Sua visão no escuro alcança impressionantes 36 metros de raio."
      },
      {
        name: "Magia Drow",
        desc: "Conhece o truque Globos de Luz. No 3º nível conjura Fogo das Fadas; no 5º nível conjura Escuridão (recarrega em descanso longo; Carisma)."
      },
      {
        name: "Treinamento Drow com Armas",
        desc: "Proficiência com rapieiras, espadas curtas e bestas de mão."
      },
      {
        name: "Sensibilidade à Luz Solar",
        desc: "Desvantagem em ataques e Percepção visual quando você ou seu alvo estiverem sob luz solar direta."
      }
    ],
    lore: {
      origin: "Habitantes das metrópoles impiedosas do Subterrâneo, marcados pelo culto à Rainha-Aranha Lolth.",
      culture: "Sobrevivem em uma teia de intrigas e assassinatos. Rebeldes célebres como Drizzt Do'Urden provam que a coragem supera a herança sombria."
    },
    proficiencies: {
      weapons: "Rapieiras, espadas curtas e bestas de mão.",
      armors: "Nenhuma adicional.",
      spells: "Globos de Luz (1º), Fogo das Fadas (3º) e Escuridão (5º)."
    }
  },

  // ==================== HALFLING ====================
  halfling_pes_leves: {
    id: "halfling_pes_leves",
    raceId: "halfling",
    name: "Halfling Pés-Leves",
    quote: "Mestres da esquiva e da simpatia, deslizam por trás de gigantes sem emitir um único suspiro.",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
    quickStats: {
      abilityBonus: "Carisma +1",
      stealth: "Furtividade Natural",
      speed: "7,5 metros",
      size: "Pequeno"
    },
    traits: [
      {
        name: "Furtividade Natural",
        desc: "Você pode tentar se esconder mesmo quando possuir apenas a cobertura de uma criatura que for no mínimo um tamanho maior que o seu."
      }
    ],
    lore: {
      origin: "A variedade mais comum e aventureira de halflings nos Reinos Esquecidos e Greyhawk.",
      culture: "Viajantes natos que adoram caravanas, conhecer novos amigos em tavernas e desarmar tensões com um sorriso afável."
    },
    proficiencies: {
      weapons: "Nenhuma proficiência de arma adicional.",
      armors: "Nenhuma adicional.",
      spells: "Nenhuma magia inata."
    }
  },

  halfling_robusto: {
    id: "halfling_robusto",
    raceId: "halfling",
    name: "Halfling Robusto",
    quote: "A solidez do carvalho em corpo miúdo, imune às peçonhas mais traiçoeiras.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    quickStats: {
      abilityBonus: "Constituição +1",
      resistance: "Resiliência contra Veneno",
      speed: "7,5 metros",
      size: "Pequeno"
    },
    traits: [
      {
        name: "Resiliência dos Robustos",
        desc: "Você tem vantagem em testes de resistência contra veneno e tem resistência contra dano de veneno."
      }
    ],
    lore: {
      origin: "Chamados de austeros nas terras do sul de Faerûn; diz-se que carregam sangue dos anões em sua linhagem.",
      culture: "Trabalham duro na terra e na forja, valorizando a resistência física e a defesa tenaz de suas aldeias."
    },
    proficiencies: {
      weapons: "Nenhuma proficiência de arma adicional.",
      armors: "Nenhuma adicional.",
      spells: "Nenhuma magia inata."
    }
  },

  // ==================== HUMANO ====================
  humano_padrao: {
    id: "humano_padrao",
    raceId: "humano",
    name: "Humano Padrão",
    quote: "A força do equilíbrio: capacidade inigualável de se aprimorar em todas as facetas da vida.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    quickStats: {
      abilityBonus: "+1 em TODOS os 6 Atributos",
      language: "+1 Idioma Adicional",
      speed: "9 metros",
      size: "Médio"
    },
    traits: [
      {
        name: "Versatilidade Absoluta",
        desc: "Seus valores de Força, Destreza, Constituição, Inteligência, Sabedoria e Carisma aumentam em 1 cada."
      },
      {
        name: "Idioma Adicional",
        desc: "Você aprende a falar, ler e escrever um idioma extra à sua escolha."
      }
    ],
    lore: {
      origin: "Presentes em todos os continentes, desde os clãs de Damara até os reinos de Calimshan e Shou Lung.",
      culture: "Construtores de civilizações aceleradas que procuram deixar legados monumentais através do comércio e da guerra."
    },
    proficiencies: {
      weapons: "Determinadas pela classe escolhida.",
      armors: "Determinadas pela classe escolhida.",
      spells: "Nenhuma magia inata."
    }
  },

  humano_variante: {
    id: "humano_variante",
    raceId: "humano",
    name: "Humano Variante (Talento)",
    quote: "Especialistas natos que forjam seu próprio destino através de talentos ímpares desde o berço.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    quickStats: {
      abilityBonus: "+1 em Dois Atributos Livres",
      feat: "1 Talento Inicial Adicional",
      skill: "1 Perícia à Escolha",
      speed: "9 metros"
    },
    traits: [
      {
        name: "Talento Inicial",
        desc: "Você adquire 1 Talento oficial da 5ª Edição à sua escolha logo no 1º nível."
      },
      {
        name: "Perícia Versátil",
        desc: "Você ganha proficiência em uma perícia qualquer à sua escolha."
      },
      {
        name: "Aprimoramento Duplo",
        desc: "Dois valores de habilidade diferentes aumentam em 1."
      }
    ],
    lore: {
      origin: "Representa indivíduos que se destacaram por treinamento rigoroso precoce e vocação extraordinária.",
      culture: "Heróis pragmáticos que lapidam habilidades específicas para se tornarem mestres de sua arte marcial ou mística."
    },
    proficiencies: {
      weapons: "Definidas pelo Talento ou classe.",
      armors: "Definidas pelo Talento ou classe.",
      spells: "Possível acesso via Talento (ex: Iniciado em Magia)."
    }
  },

  // ==================== DRACONATO ====================
  draconato_cromatico: {
    id: "draconato_cromatico",
    raceId: "draconato",
    name: "Draconato Cromático",
    quote: "A ferocidade elemental dos dragões vermelhos, azuis, verdes, negros ou brancos fluindo em seu sopro.",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80",
    quickStats: {
      breath: "Sopro Destrutivo (Ácido, Fogo, Frio, etc.)",
      resistance: "Resistência Elemental Inata",
      speed: "9 metros",
      size: "Médio"
    },
    traits: [
      {
        name: "Arma de Sopro Cromática",
        desc: "Ação para exalar cone ou linha de dano elemental (2d6, escala nos níveis 6, 11 e 16; recarrega em descanso curto ou longo)."
      },
      {
        name: "Resistência Dracônica",
        desc: "Resistência passiva permanente ao tipo de dano gerado pelo seu sopro."
      }
    ],
    lore: {
      origin: "Linhagens descendentes das crias de Tiamat ou moldadas pelos dragões cromáticos mais temidos.",
      culture: "Orgulhosos e guerreiros, demonstram presença imponente e desafiam qualquer um que questione a força de seu clã."
    },
    proficiencies: {
      weapons: "Conforme classe escolhida.",
      armors: "Conforme classe escolhida.",
      spells: "Sopro Dracônico Inato."
    }
  },

  draconato_metalico: {
    id: "draconato_metalico",
    raceId: "draconato",
    name: "Draconato Metálico",
    quote: "A nobreza do ouro, prata, bronze, cobre e latão: protetores incansáveis da honra e dos fracos.",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80",
    quickStats: {
      breath: "Sopro Metálico (Fogo, Frio, Elétrico)",
      resistance: "Resistência Elemental Inata",
      speed: "9 metros",
      size: "Médio"
    },
    traits: [
      {
        name: "Arma de Sopro Metálica",
        desc: "Exala rajada elemental correspondente ao dragão metálico ancestral (2d6 inicial, CD 8 + Con + Proficiência)."
      },
      {
        name: "Resistência Nobre",
        desc: "Resistência inata ao tipo de energia elemental de seu patrono dracônico."
      }
    ],
    lore: {
      origin: "Linhagens consagradas pelo Dragão de Platina Bahamut nos campos de batalha antigos.",
      culture: "Guiados por códigos de conduta estritos de cavalaria, autodisciplina e proteção aos indefesos."
    },
    proficiencies: {
      weapons: "Conforme classe escolhida.",
      armors: "Conforme classe escolhida.",
      spells: "Sopro Dracônico Metálico."
    }
  },

  // ==================== GNOMO ====================
  gnomo_rochas: {
    id: "gnomo_rochas",
    raceId: "gnomo",
    name: "Gnomo das Rochas",
    quote: "Engrenagens reluzentes, pólvora fina e o toque genial que dá vida a mecanismos incríveis.",
    image: "https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=400&q=80",
    quickStats: {
      abilityBonus: "Constituição +1",
      tools: "Ferramentas de Engenhoqueiro",
      artifice: "Conhecimento de Artífice",
      speed: "7,5 metros"
    },
    traits: [
      {
        name: "Conhecimento de Artífice",
        desc: "Adiciona o dobro do bônus de proficiência em testes de História ligados a itens mágicos, objetos alquímicos ou mecanismos."
      },
      {
        name: "Engenhoqueiro",
        desc: "Proficiência com ferramentas de engenhoqueiro. Permite construir brinquedos mecânicos, isqueiros e caixas de música (até 3 ativos)."
      }
    ],
    lore: {
      origin: "A sub-raça mais comum nos mundos de D&D, incluindo os lendários gnomos engenhoqueiros de Monte Não-Importa em Krynn.",
      culture: "Suas vilas são labirintos de oficinas fumegantes e engrenagens. Para eles, cada explosão é uma lição de aprendizado."
    },
    proficiencies: {
      weapons: "Nenhuma proficiência marcial adicional.",
      armors: "Nenhuma adicional.",
      spells: "Construção de mecanismos menores."
    }
  },

  gnomo_floresta: {
    id: "gnomo_floresta",
    raceId: "gnomo",
    name: "Gnomo da Floresta",
    quote: "Ilusões delicadas, passos silenciosos entre as raízes e comunhão sincera com as feras da mata.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80",
    quickStats: {
      abilityBonus: "Destreza +1",
      innateSpell: "Ilusão Menor (Int)",
      beastSpeech: "Falar com Bestas Pequenas",
      speed: "7,5 metros"
    },
    traits: [
      {
        name: "Ilusionista Nato",
        desc: "Você conhece o truque Ilusão Menor (Inteligência é seu atributo de conjuração)."
      },
      {
        name: "Falar com Bestas Pequenas",
        desc: "Através de gestos e sons, você pode comunicar ideias simples a animais Pequenos ou Miúdos (esquilos, coelhos, pássaros)."
      }
    ],
    lore: {
      origin: "Vivem em clãs isolados em florestas silvestres antigas, mantendo laços estreitos com fadas benévolas.",
      culture: "Tímidos perante povos grandes, usam ilusões para desviar intrusos e valorizam a alegria pura das criaturas da mata."
    },
    proficiencies: {
      weapons: "Nenhuma proficiência de arma adicional.",
      armors: "Nenhuma adicional.",
      spells: "Truque Ilusão Menor inato."
    }
  },

  // ==================== RAÇAS COM LINHAGEM ÚNICA ====================
  meio_orc_padrao: {
    id: "meio_orc_padrao",
    raceId: "meio-orc",
    name: "Linhagem das Tribos Fronteiriças",
    quote: "A tenacidade indomável de quem sobreviveu ao escárnio de dois mundos através da força absoluta.",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&q=80",
    quickStats: {
      abilityBonus: "Força +2, Constituição +1",
      relentless: "Resistência Implacável (1 PV)",
      savage: "Ataques Selvagens (Crítico)",
      speed: "9 metros"
    },
    traits: [
      {
        name: "Resistência Implacável",
        desc: "Ao ser reduzido a 0 PV sem morrer, você pode optar por cair a 1 PV em vez disso (1x por descanso longo)."
      },
      {
        name: "Ataques Selvagens",
        desc: "Ao acertar um ataque crítico com arma corpo a corpo, role um dado de dano adicional da arma."
      },
      {
        name: "Ameaçador",
        desc: "Proficiência automática na perícia Intimidação."
      }
    ],
    lore: {
      origin: "Meio-orcs não possuem divisões de sub-raças oficiais no livro básico: seu poder reside na fusão direta do sangue humano e orc.",
      culture: "Guerreiros cobiçados como comandantes e mercenários, provam seu valor pelo impacto de suas lâminas e lealdade inquebrável."
    },
    proficiencies: {
      weapons: "Conforme classe escolhida.",
      armors: "Conforme classe escolhida.",
      spells: "Nenhuma magia inata."
    }
  },

  meio_elfo_padrao: {
    id: "meio_elfo_padrao",
    raceId: "meio-elfo",
    name: "Herança de Dois Mundos",
    quote: "A ponte viva entre a paixão humana e a graça élfica, mestre da diplomacia e versatilidade.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    quickStats: {
      abilityBonus: "Carisma +2, dois à escolha +1",
      versatility: "2 Perícias à Escolha",
      feyAncestry: "Ancestral Feérico",
      speed: "9 metros"
    },
    traits: [
      {
        name: "Versatilidade em Perícias",
        desc: "Você ganha proficiência em duas perícias quaisquer à sua escolha."
      },
      {
        name: "Ancestral Feérico",
        desc: "Vantagem em salvaguardas contra encantamento e imunidade a sono mágico."
      }
    ],
    lore: {
      origin: "Nascidos do amor ou de alianças entre humanos e elfos, não possuem pátria própria e encontram lar onde quiserem.",
      culture: "Excelentes diplomatas, vigaristas ou caçadores que aprendem a ler os sentimentos dos outros com precisão impecável."
    },
    proficiencies: {
      weapons: "Conforme classe escolhida.",
      armors: "Conforme classe escolhida.",
      spells: "Nenhuma magia inata."
    }
  },

  tiefling_asmodeus: {
    id: "tiefling_asmodeus",
    raceId: "tiefling",
    name: "Linhagem Infernal de Asmodeus",
    quote: "O fogo dos Nove Infernos corre em suas veias, concedendo comando sobre chamas e trevas.",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80",
    quickStats: {
      abilityBonus: "Carisma +2, Inteligência +1",
      fireResistance: "Resistência a Fogo",
      legacy: "Legado Infernal",
      speed: "9 metros"
    },
    traits: [
      {
        name: "Resistência Infernal",
        desc: "Resistência passiva contra qualquer dano de fogo."
      },
      {
        name: "Legado Infernal",
        desc: "Você conhece o truque Taumaturgia. No 3º nível conjura Repreensão Infernal; no 5º nível conjura Escuridão (recarrega em descanso longo; Carisma)."
      }
    ],
    lore: {
      origin: "A linhagem clássica marcada pelo pacto ancestral com Asmodeus, senhor dos Nove Infernos.",
      culture: "Sobrevivem à desconfiança dos povos com orgulho mordaz, tornando-se aliados fiéis ou mestres das artes proibidas."
    },
    proficiencies: {
      weapons: "Conforme classe escolhida.",
      armors: "Conforme classe escolhida.",
      spells: "Taumaturgia (1º), Repreensão Infernal (3º) e Escuridão (5º)."
    }
  }
};

// Função utilitária para buscar as sub-raças correspondentes a uma raça
export function getSubracesByRace(raceKeyOrName = "") {
  const normalized = raceKeyOrName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  // Mapeamento de sinonimos e ids
  let targetRaceId = normalized;
  if (normalized.includes("anao")) targetRaceId = "anao";
  else if (normalized.includes("elfo") && !normalized.includes("meio")) targetRaceId = "elfo";
  else if (normalized.includes("halfling")) targetRaceId = "halfling";
  else if (normalized.includes("humano")) targetRaceId = "humano";
  else if (normalized.includes("draconato")) targetRaceId = "draconato";
  else if (normalized.includes("gnomo")) targetRaceId = "gnomo";
  else if (normalized.includes("meio-orc") || normalized.includes("meio orc")) targetRaceId = "meio-orc";
  else if (normalized.includes("meio-elfo") || normalized.includes("meio elfo")) targetRaceId = "meio-elfo";
  else if (normalized.includes("tiefling")) targetRaceId = "tiefling";

  const matches = Object.values(SUBRACES_DATA).filter(
    (sub) => sub.raceId === targetRaceId
  );

  return matches.length > 0 ? matches : [SUBRACES_DATA.anao_colina];
}
