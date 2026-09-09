export const RACES_DATA = {
  anao: {
    id: "anao",
    name: "Anão",
    quote: "Reinos antigos esculpidos na rocha, lealdade férrea ao clã e armas forjadas com maestria.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80",
    quickStats: {
      abilityBonus: "Constituição +2",
      speed: "7,5 metros",
      size: "Médio (1,20m - 1,50m)",
      darkvision: "18 metros",
      subraces: ["Anão da Colina", "Anão da Montanha"]
    },
    traits: [
      {
        name: "Resiliência Anã",
        desc: "Vantagem em salvaguardas contra veneno e resistência contra dano de veneno."
      },
      {
        name: "Treinamento Anão em Combate",
        desc: "Proficiência com machados de batalha, machadinhas, martelos leves e martelos de guerra."
      },
      {
        name: "Especialização em Rochas",
        desc: "Adiciona o dobro do bônus de proficiência em testes de História relacionados à cantaria e pedra."
      },
      {
        name: "Proficiência com Ferramentas",
        desc: "Escolha proficiência entre ferramentas de ferreiro, cervejeiro ou pedreiro."
      }
    ],
    lore: {
      behavior: "Audazes e resistentes, anões valorizam tradições ancestrais e raramente esquecem ofensas ou favores. Possuem forte senso de dever familiar e devoção à forja e aos deuses do clã.",
      appearance: "Baixos e compactos, pesam tanto quanto humanos muito mais altos. Pele de tons terrosos, cabelos longos e barbas cuidadosamente trançadas e zeladas.",
      society: "Vivem em reinos e fortalezas montanhosas subterrâneas, organizados rigidamente em clãs. Perder a filiação de um clã é a pior desonra para um anão."
    },
    names: {
      male: ["Adrik", "Baern", "Bruenor", "Dain", "Fargrim", "Flint", "Harbek", "Thorin", "Tordek"],
      female: ["Amber", "Artin", "Audhild", "Dagnal", "Eldeth", "Helja", "Kathra", "Torgga", "Vistra"],
      clans: ["Battlehammer", "Balderk", "Brawnanvil", "Fireforge", "Frostbeard", "Ironfist"]
    }
  },

  elfo: {
    id: "elfo",
    name: "Elfo",
    quote: "Graça sobrenatural, visão atemporal e conexão profunda com a trama mágica e os ermos.",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80",
    quickStats: {
      abilityBonus: "Destreza +2",
      speed: "9 metros",
      size: "Médio (1,50m - 1,80m)",
      darkvision: "18 metros",
      subraces: ["Alto Elfo", "Elfo da Floresta", "Elfo Negro (Drow)"]
    },
    traits: [
      {
        name: "Sentidos Aguçados",
        desc: "Proficiência automática na perícia Percepção."
      },
      {
        name: "Ancestral Feérico",
        desc: "Vantagem em testes contra ser encantado e imune a sono mágico."
      },
      {
        name: "Transe",
        desc: "Não precisam dormir; entram em meditação semiconsciente por 4 horas para descansar plenamente."
      }
    ],
    lore: {
      behavior: "Com séculos de vida, enxergam eventos transitórios com serenidade e desapego. Quando escolhem um objetivo, são pacientes e obstinados até a perfeição.",
      appearance: "Eslguios e finos, sem pelos faciais e com traços aristocráticos. Cabelos que variam de fios dourados a tons azulados e olhos brilhantes como gemas.",
      society: "Habitam santuários florestais ou torres de alabastro. Valorizam a arte, música, erudição e maestria marcial elegante com espadas e arcos."
    },
    names: {
      male: ["Adran", "Aelar", "Aramil", "Erdan", "Heian", "Laucian", "Quarion", "Soveliss", "Varis"],
      female: ["Adrie", "Caelynn", "Enna", "Jelenneth", "Keyleth", "Leshanna", "Mialee", "Sariel"],
      clans: ["Amakiir (Joia Florida)", "Galanodel (Sussurro da Lua)", "Liadon (Folha de Prata)", "Siannodel (Córrego Lunar)"]
    }
  },

  halfling: {
    id: "halfling",
    name: "Halfling",
    quote: "A coragem do pequeno coração diante das grandes sombras, cercado pelo calor de uma boa refeição.",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
    quickStats: {
      abilityBonus: "Destreza +2",
      speed: "7,5 metros",
      size: "Pequeno (aprox. 0,90m)",
      darkvision: "Não possui",
      subraces: ["Pés-Leves", "Robusto"]
    },
    traits: [
      {
        name: "Sortudo",
        desc: "Ao rolar um 1 natural em ataques, testes de habilidade ou salvaguardas, você pode rerrolar o dado."
      },
      {
        name: "Bravura",
        desc: "Vantagem em testes de resistência contra ficar amedrontado."
      },
      {
        name: "Agilidade Halfling",
        desc: "Pode mover-se através do espaço de qualquer criatura que seja de tamanho maior que o seu."
      }
    ],
    lore: {
      behavior: "Afáveis, curiosos e pacíficos, preferem a paz da lareira a impérios e glória. Quando amigos ou seus vilarejos são ameaçados, mostram ferocidade e coragem inesperadas.",
      appearance: "Diminutos e robustos, cabelos cacheados, pés ágeis e roupas práticas de cores aconchegantes.",
      society: "Vivem em comunidades bucólicas integradas à natureza ou caravanas mercantes errantes."
    },
    names: {
      male: ["Alton", "Corrin", "Eldon", "Finnan", "Garret", "Lyle", "Merric", "Milo", "Perrin", "Reed"],
      female: ["Andry", "Bree", "Callie", "Cora", "Jillian", "Kithri", "Lidda", "Merla", "Seraphina"],
      clans: ["Bom-Barril", "Folha de Chá", "Alta Colina", "Prato Cheio", "Garrafa Verde"]
    }
  },

  humano: {
    id: "humano",
    name: "Humano",
    quote: "Ambição implacável, adaptabilidade pioneira e o fogo de quem vive rápido e intenso.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    quickStats: {
      abilityBonus: "Todos os Atributos +1",
      speed: "9 metros",
      size: "Médio (1,60m - 1,90m)",
      darkvision: "Não possui",
      subraces: ["Padrão (+1 em todos)", "Variante (Talento + Perícia)"]
    },
    traits: [
      {
        name: "Versatilidade Humana",
        desc: "Recebe +1 em todos os seis valores de habilidade ou opção de Talento adicional na criação."
      },
      {
        name: "Idioma Extra",
        desc: "Conhecimento de um idioma adicional à sua escolha além do Comum."
      }
    ],
    lore: {
      behavior: "Determinados a deixar uma marca indelével na história, fundam reinos e ordens religiosas duradouras.",
      appearance: "Variação extrema de etnias, alturas, tons de pele e culturas em todos os cantos do multiverso.",
      society: "Cosmopolita e expansiva, constrói cidades monumentais que acolhem viajantes de todas as raças."
    },
    names: {
      male: ["Ander", "Darvin", "Dorn", "Gorstag", "Malark", "Pavel", "Salazar", "Urth"],
      female: ["Amafrey", "Bethrynna", "Katernin", "Mara", "Natali", "Rowan", "Tessele"],
      clans: ["Dundragon", "Evenwood", "Greycastle", "Stormwind", "Tallstag"]
    }
  },

  draconato: {
    id: "draconato",
    name: "Draconato",
    quote: "O orgulho dos dragões ancestrais encarnado em guerreiros de honra implacável e sopro letal.",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80",
    quickStats: {
      abilityBonus: "Força +2, Carisma +1",
      speed: "9 metros",
      size: "Médio (mais de 1,80m e 120kg)",
      darkvision: "Não possui",
      subraces: ["Linhagens Cromáticas", "Linhagens Metálicas"]
    },
    traits: [
      {
        name: "Arma de Sopro",
        desc: "Exala energia destrutiva elemental (fogo, ácido, frio, elétrico ou veneno) baseada no seu ancestral."
      },
      {
        name: "Resistência a Dano",
        desc: "Resistência inata contra o mesmo elemento da sua arma de sopro."
      }
    ],
    lore: {
      behavior: "A honra do clã é soberana. Desonrar o clã leva ao exílio; buscam a maestria técnica e marcial obstinadamente.",
      appearance: "Aspecto dracônico bípede imponente, escamas grossas de tons bronze, latão, escarlate ou dourado, mãos com garras fortes.",
      society: "Estruturada em clãs militares autossuficientes com lealdade mútua inabalável."
    },
    names: {
      male: ["Arjhan", "Balasar", "Bharash", "Donaar", "Ghesh", "Heskan", "Kriv", "Rhogar", "Torinn"],
      female: ["Akra", "Biri", "Daar", "Farideh", "Harann", "Kava", "Mishann", "Surina", "Uadjit"],
      clans: ["Clethtinthiallor", "Daardendrian", "Drachedandion", "Kepeshkmolik", "Turnuroth"]
    }
  },

  gnomo: {
    id: "gnomo",
    name: "Gnomo",
    quote: "Entusiasmo inventivo incessante, mentes brilhantes e alegria vibrante em cada engrenagem.",
    image: "https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=400&q=80",
    quickStats: {
      abilityBonus: "Inteligência +2",
      speed: "7,5 metros",
      size: "Pequeno (0,90m - 1,20m)",
      darkvision: "18 metros",
      subraces: ["Gnomo das Rochas", "Gnomo da Floresta", "Svirfneblin"]
    },
    traits: [
      {
        name: "Esperteza Gnômica",
        desc: "Vantagem em todas as salvaguardas de Inteligência, Sabedoria e Carisma contra magia."
      }
    ],
    lore: {
      behavior: "Celebram a vida e o conhecimento com paixão. Encaram erros científicos e explosões como degraus do progresso.",
      appearance: "Estatura miúda, olhos brilhantes cor turquesa ou avelã, sorrisos expressivos e roupas práticas com bordados intrincados.",
      society: "Vilas subterrâneas e tocas repletas de oficinas mecânicas, laboratórios de alquimia e pedras preciosas."
    },
    names: {
      male: ["Alston", "Alvyn", "Boddynock", "Brocc", "Burgell", "Dimble", "Gerbo", "Gimble", "Zook"],
      female: ["Bimpnottin", "Breena", "Caramip", "Ella", "Ellywick", "Lilli", "Loopmottin", "Waywocket"],
      clans: ["Beren", "Daergel", "Folkor", "Garrick", "Nackle", "Ningel", "Raulnor", "Timbers"]
    }
  },

  "meio-elfo": {
    id: "meio-elfo",
    name: "Meio-Elfo",
    quote: "O equilíbrio entre a impetuosidade humana e a sensibilidade mágica élfica, navegando dois mundos.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    quickStats: {
      abilityBonus: "Carisma +2, dois à sua escolha +1",
      speed: "9 metros",
      size: "Médio (1,50m - 1,80m)",
      darkvision: "18 metros",
      subraces: ["Variantes Élficas Opcionais"]
    },
    traits: [
      {
        name: "Ancestral Feérico",
        desc: "Vantagem contra ser encantado e imunidade a sono mágico."
      },
      {
        name: "Versatilidade em Perícias",
        desc: "Ganha proficiência automática em duas perícias de sua livre escolha."
      }
    ],
    lore: {
      behavior: "Frequentemente atuam como embaixadores ou negociadores graças à empatia refinada e carisma natural.",
      appearance: "Combinam a robustez e barba humanas com as orelhas pontiagudas e olhos profundos dos elfos.",
      society: "Transitam com facilidade entre cidades humanas cosmopolitas e os bosques élficos."
    },
    names: {
      male: ["Adran", "Dorn", "Fargrim", "Galinndan", "Morn", "Tanis", "Theren"],
      female: ["Adrie", "Callie", "Enna", "Lia", "Mara", "Rowan", "Valanthe"],
      clans: ["Adotam sobrenomes élficos ou humanos conforme a região em que cresceram"]
    }
  },

  "meio-orc": {
    id: "meio-orc",
    name: "Meio-Orc",
    quote: "Fúria ancestral contida sob cicatrizes de batalha e uma determinação obstinada em resistir à queda.",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&q=80",
    quickStats: {
      abilityBonus: "Força +2, Constituição +1",
      speed: "9 metros",
      size: "Médio (1,80m - 2,10m)",
      darkvision: "18 metros",
      subraces: ["Linhagem Única"]
    },
    traits: [
      {
        name: "Ameaçador",
        desc: "Proficiência automática na perícia Intimidação."
      },
      {
        name: "Resistência Implacável",
        desc: "Ao cair a 0 pontos de vida sem morrer imediatamente, você pode optar por permanecer com 1 PV (1x por descanso longo)."
      },
      {
        name: "Ataques Selvagens",
        desc: "Ao acertar um ataque crítico corpo a corpo, role um dado de dano adicional da arma."
      }
    ],
    lore: {
      behavior: "Sentem emoções com intensidade física ardente: a fúria queima e o riso é alto. Valorizam a prova de valor pelo mérito das próprias ações.",
      appearance: "Pele com matizes acinzentados ou esverdeados, caninos inferiores protuberantes e cicatrizes de provações marciais.",
      society: "Muitos buscam aceitação em companhias de mercenários ou vilarejos fronteiriços."
    },
    names: {
      male: ["Dench", "Feng", "Gell", "Henk", "Holg", "Imsh", "Keth", "Krusk", "Mhurren", "Ront", "Thokk"],
      female: ["Baggi", "Emen", "Engong", "Kansif", "Myev", "Neega", "Ovak", "Shautha", "Vola", "Yevelda"],
      clans: ["Adotam apelidos guerreiros ou o nome de sua tribo de origem"]
    }
  },

  tiefling: {
    id: "tiefling",
    name: "Tiefling",
    quote: "A marca dos Nove Infernos em sua carne não dita o seu destino; o fogo interior obedece à sua vontade.",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80",
    quickStats: {
      abilityBonus: "Carisma +2, Inteligência +1",
      speed: "9 metros",
      size: "Médio (estatura humana)",
      darkvision: "18 metros",
      subraces: ["Linhagem de Asmodeus", "Variantes Infernais"]
    },
    traits: [
      {
        name: "Resistência Infernal",
        desc: "Resistência natural a dano de fogo."
      },
      {
        name: "Legado Infernal",
        desc: "Conhece o truque Taumaturgia. No 3º nível conjura Repreensão Infernal; no 5º nível conjura Escuridão (recarrega em descanso longo)."
      }
    ],
    lore: {
      behavior: "Acostumados com o preconceito e o medo alheio, desenvolvem autoconfiança extrema ou cinismo mordaz, mas são aliados inabaláveis para quem conquista sua lealdade.",
      appearance: "Chifres marcantes, cauda musculosa de até 1,5m, caninos afiados, olhos em cores sólidas brilhantes e pele em tons rubros ou morenos.",
      society: "Não possuem pátria unificada; vivem em enclaves urbanos ou seguem o caminho da magia e da aventura."
    },
    names: {
      male: ["Akmenos", "Amnon", "Barakas", "Damakos", "Ekemon", "Iados", "Kairon", "Mordai", "Therai"],
      female: ["Akta", "Anakis", "Bryseis", "Criella", "Damaia", "Kallista", "Lerissa", "Makaria", "Orianna"],
      clans: ["Nomes Conceituais: Glória, Esperança, Ideal, Ímpeto, Mágoa, Tormenta, Temeridade"]
    }
  }
};
