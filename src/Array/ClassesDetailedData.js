export const CLASSES_DATA = {
  barbaro: {
    id: "barbaro",
    name: "Bárbaro",
    quote: "Um feroz guerreiro primitivo que entra em fúria mortal para dilacerar seus inimigos.",
    bgImage: "https://cdna.artstation.com/p/assets/images/images/054/021/038/large/julio-sidharta-wolf-totem-barbarian-signed.jpg?1663595468",
    portrait: "https://cdna.artstation.com/p/assets/images/images/054/021/038/large/julio-sidharta-wolf-totem-barbarian-signed.jpg?1663595468",
    quickStats: {
      hitDie: "d12 (Mais alto do jogo)",
      primaryStat: "Força",
      savingThrows: "Força & Constituição",
      spellcasting: "Não conjura magias"
    },
    proficiencies: {
      armors: "Armaduras leves, médias e escudos",
      weapons: "Armas simples e armas marciais",
      tools: "Nenhuma",
      savingThrows: "Força, Constituição",
      skills: "Escolha 2 entre: Adestrar Animais, Atletismo, Intimidação, Natureza, Percepção e Sobrevivência"
    },
    equipmentText: "• Um machado grande ou qualquer arma marcial corpo a corpo\n• Duas machadinhas ou qualquer arma simples\n• Um pacote de explorador e 4 azagaias",
    features: [
      {
        level: 1,
        name: "Fúria",
        actionType: "Ação Bônus",
        recharge: "Descanso Longo",
        summary: "Vantagem em Força, bônus de dano corpo a corpo e resistência a dano cortante, perfurante e concussão.",
        desc: "Em batalha, você luta com ferocidade primal. No seu turno, você pode entrar em fúria como uma ação bônus. Enquanto estiver em fúria, você recebe vantagem em testes e salvaguardas de Força, bônus nas jogadas de dano com armas baseadas em Força (+2 no nível 1) e resistência a dano de concussão, cortante e perfurante."
      },
      {
        level: 1,
        name: "Defesa sem Armadura",
        actionType: "Passiva",
        recharge: "Permanente",
        summary: "Sua CA se torna 10 + Destreza + Constituição quando não estiver usando armadura.",
        desc: "Quando não estiver usando nenhuma armadura, sua Classe de Armadura é igual a 10 + seu modificador de Destreza + seu modificador de Constituição. Você pode usar um escudo e ainda receber esse benefício."
      },
      {
        level: 2,
        name: "Ataque Imprudente",
        actionType: "Especial no Ataque",
        recharge: "Por Turno",
        summary: "Ganha vantagem no ataque, mas inimigos também atacam você com vantagem.",
        desc: "Você pode deixar de lado toda preocupação com a defesa para atacar com fúria desesperada. Ao realizar seu primeiro ataque no turno, você pode escolher atacar imprudentemente: você tem vantagem nas jogadas de ataque com Força neste turno, mas as jogadas de ataque contra você também têm vantagem até o início do seu próximo turno."
      },
      {
        level: 2,
        name: "Sentido de Perigo",
        actionType: "Passiva",
        recharge: "Permanente",
        summary: "Vantagem em salvaguardas de Destreza contra armadilhas e magias que você possa ver.",
        desc: "Você adquire um senso misterioso de quando as coisas ao seu redor não estão como deveriam. Você tem vantagem em salvaguardas de Destreza contra efeitos que você possa ver, como armadilhas e magias."
      },
      {
        level: 3,
        name: "Caminho Primitivo (Subclasse)",
        actionType: "Escolha de Especialização",
        recharge: "Permanente",
        summary: "Escolha a fonte que alimenta sua fúria (ex: Caminho do Furioso, Totêmico).",
        desc: "Você escolhe o arquétipo que define a natureza de sua fúria no 3º nível, concedendo características adicionais nos níveis 3, 6, 10 e 14."
      }
    ]
  },

  bardo: {
    id: "bardo",
    name: "Bardo",
    quote: "Um mestre da canção, oratória e magia que tece palavras de encanto e inspira heróis.",
    bgImage: "https://cdnb.artstation.com/p/assets/images/images/061/230/005/large/justin-gerard-2305-v2x02-a-300m.jpg?1680284508",
    portrait: "https://cdna.artstation.com/p/assets/images/images/061/230/012/large/justin-gerard-2305-v2x02-b-300m.jpg?1680284519",
    quickStats: {
      hitDie: "d8",
      primaryStat: "Carisma",
      savingThrows: "Destreza & Carisma",
      spellcasting: "Carisma (Arcana Versátil)"
    },
    proficiencies: {
      armors: "Armaduras leves",
      weapons: "Armas simples, bestas de mão, espadas longas, rapieiras e espadas curtas",
      tools: "Três instrumentos musicais à sua escolha",
      savingThrows: "Destreza, Carisma",
      skills: "Escolha 3 perícias quaisquer"
    },
    equipmentText: "• Uma rapieira, espada longa ou qualquer arma simples\n• Um pacote de diplomata ou pacote de artista\n• Um alaúde ou qualquer instrumento musical e armadura de couro com adaga",
    features: [
      {
        level: 1,
        name: "Conjuração de Bardo",
        actionType: "Variável por Magia",
        recharge: "Descanso Longo",
        summary: "Capacidade de conjurar truques e magias da lista de bardo usando Carisma.",
        desc: "Você aprendeu a moldar a Trama através da música e da poesia. Você conhece 2 truques e 4 magias de 1º círculo no nível 1. Carisma é sua habilidade chave de conjuração."
      },
      {
        level: 1,
        name: "Inspiração de Bardo",
        actionType: "Ação Bônus",
        recharge: "Descanso Longo (depois Curto)",
        summary: "Concede um dado d6 para um aliado somar a um ataque, teste ou salvaguarda.",
        desc: "Você pode inspirar outros através de palavras ou música. Use uma ação bônus para escolher uma criatura a até 18 metros: ela recebe um dado de Inspiração (d6 no nível 1) que pode somar a um teste de atributo, jogada de ataque ou salvaguarda nos próximos 10 minutos."
      },
      {
        level: 2,
        name: "Pau pra Toda Obra",
        actionType: "Passiva",
        recharge: "Permanente",
        summary: "Adiciona metade da proficiência a qualquer teste em que você não seja proficiente.",
        desc: "Você pode adicionar metade do seu bônus de proficiência, arredondado para baixo, a qualquer teste de habilidade que você ainda não adicione seu bônus de proficiência."
      },
      {
        level: 2,
        name: "Canção de Descanso",
        actionType: "Especial em Descanso",
        recharge: "Descanso Curto",
        summary: "Aliados recuperam +1d6 pontos de vida adicionais durante um descanso curto.",
        desc: "Você pode usar música ou palavras suaves para ajudar seus companheiros feridos a se recuperarem durante um descanso curto. Quem gastar Dados de Vida recupera 1d6 PV extras."
      },
      {
        level: 3,
        name: "Colégio de Bardo (Subclasse)",
        actionType: "Escolha de Especialização",
        recharge: "Permanente",
        summary: "Escolha entre Colégio do Conhecimento, Bravura ou Espadas.",
        desc: "No 3º nível, você entra para um colégio de bardos que dita suas técnicas marciais ou o domínio de magias adicionais de qualquer classe."
      }
    ]
  },

  bruxo: {
    id: "bruxo",
    name: "Bruxo",
    quote: "Um conjurador cujo poder provém de um pacto secreto selado com uma entidade de outro plano.",
    bgImage: "https://cdnb.artstation.com/p/assets/images/images/030/319/817/large/billy-christian-415050-boltseeker-mage-final2.jpg?1600253782",
    portrait: "https://cdna.artstation.com/p/assets/images/images/030/319/817/large/billy-christian-415050-boltseeker-mage-final2.jpg?1600253782",
    quickStats: {
      hitDie: "d8",
      primaryStat: "Carisma",
      savingThrows: "Sabedoria & Carisma",
      spellcasting: "Magia de Pacto (Slots recarregam em Descanso Curto)"
    },
    proficiencies: {
      armors: "Armaduras leves",
      weapons: "Armas simples",
      tools: "Nenhuma",
      savingThrows: "Sabedoria, Carisma",
      skills: "Escolha 2 entre: Arcanismo, Enganação, História, Intimidação, Investigação, Natureza e Religião"
    },
    equipmentText: "• Uma besta leve e 20 virotes ou qualquer arma simples\n• Uma bolsa de componentes ou foco arcano\n• Pacote de estudioso ou masmorreiro, armadura de couro e adaga",
    features: [
      {
        level: 1,
        name: "Patrono Transcendental (Subclasse)",
        actionType: "Escolha de Pacto",
        recharge: "Permanente",
        summary: "Pacto com O Corruptor (Infernal), O Grande Antigo ou Arquifada.",
        desc: "Você sela uma barganha cósmica com uma entidade planar no 1º nível, o que molda sua lista de magias expandidas e habilidades fundamentais."
      },
      {
        level: 1,
        name: "Magia de Pacto",
        actionType: "Variável",
        recharge: "Descanso Curto",
        summary: "Poucos espaços de magia, mas todos são conjurados no círculo máximo e recarregam rapidamente.",
        desc: "Diferente de outras classes, todos os seus slots de magia são do mesmo nível (o mais alto que você tiver acesso) e recarregam tanto em descanso curto quanto longo."
      },
      {
        level: 2,
        name: "Invocações Oculares",
        actionType: "Passiva / Ativa",
        recharge: "Variável",
        summary: "Fragmentos de poder proibido que concedem magias infinitas ou aprimoram a Rajada Mística.",
        desc: "Você ganha duas invocações místicas à sua escolha (ex: Rajada Agonizante, Visão Diabólica), que personalizam drasticamente seu arsenal arcano."
      }
    ]
  },

  clerigo: {
    id: "clerigo",
    name: "Clérigo",
    quote: "Um campeão sacerdotal que canaliza o poder dos deuses para curar, expurgar mortos-vivos e guerrear.",
    bgImage: "https://cdna.artstation.com/p/assets/images/images/043/861/076/large/marta-nael-hitpoint-angel-final.jpg?1638451036",
    portrait: "https://cdnb.artstation.com/p/assets/images/images/043/861/233/large/marta-nael-hitpoint-angel-final.jpg?1638451314",
    quickStats: {
      hitDie: "d8",
      primaryStat: "Sabedoria",
      savingThrows: "Sabedoria & Carisma",
      spellcasting: "Sabedoria (Divina Preparada)"
    },
    proficiencies: {
      armors: "Armaduras leves, médias e escudos",
      weapons: "Armas simples",
      tools: "Nenhuma",
      savingThrows: "Sabedoria, Carisma",
      skills: "Escolha 2 entre: História, Intuição, Medicina, Persuasão e Religião"
    },
    equipmentText: "• Uma maça ou martelo de guerra (se proficiente)\n• Cota de escamas, corselete de couro ou cota de malha (se proficiente)\n• Besta leve ou arma simples, escudo e símbolo sagrado",
    features: [
      {
        level: 1,
        name: "Domínio Divino (Subclasse)",
        actionType: "Escolha Religiosa",
        recharge: "Permanente",
        summary: "Escolha entre Vida, Luz, Guerra, Tempestade, Enganação, etc. no 1º nível.",
        desc: "Você consagra sua alma a um domínio específico de sua divindade, garantindo magias de domínio sempre preparadas e proficiências de combate adicionais."
      },
      {
        level: 2,
        name: "Canalizar Divindade: Expulsar Mortos-Vivos",
        actionType: "Ação",
        recharge: "Descanso Curto",
        summary: "Força mortos-vivos próximos a fugirem aterrorizados perante seu símbolo sagrado.",
        desc: "Como uma ação, você ergue seu símbolo sagrado e ora. Cada morto-vivo a até 9 metros que possa ver ou ouvir você deve ser bem-sucedido em uma salvaguarda de Sabedoria ou será expulso por 1 minuto."
      }
    ]
  },

  druida: {
    id: "druida",
    name: "Druida",
    quote: "Um sacerdote da Mãe Terra que assume a forma de bestas ferozes e comanda as tempestades.",
    bgImage: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/741259c9-3c34-4eae-b137-5df787a4c49e/daatv86-088355fd-ac3f-4cf9-a1e9-77aac4cdb2a4.png/v1/fill/w_1192,h_670,q_70,strp/exiled_druids_of_lornwood_by_huussii_daatv86-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTA4MCIsInBhdGgiOiIvZi83NDEyNTljOS0zYzM0LTRlYWUtYjEzNy01ZGY3ODdhNGM0OWUvZGFhdHY4Ni0wODgzNTVmZC1hYzNmLTRjZjktYTFlOS03N2FhYzRjZGIyYTQucG5nIiwid2lkdGgiOiI8PTE5MjAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.RkKahj1hCOuA2fneE4zb3ead4LOSDAU9QhCTx0H_qiw",
    portrait: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/741259c9-3c34-4eae-b137-5df787a4c49e/daatv86-088355fd-ac3f-4cf9-a1e9-77aac4cdb2a4.png/v1/fill/w_1192,h_670,q_70,strp/exiled_druids_of_lornwood_by_huussii_daatv86-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTA4MCIsInBhdGgiOiIvZi83NDEyNTljOS0zYzM0LTRlYWUtYjEzNy01ZGY3ODdhNGM0OWUvZGFhdHY4Ni0wODgzNTVmZC1hYzNmLTRjZjktYTFlOS03N2FhYzRjZGIyYTQucG5nIiwid2lkdGgiOiI8PTE5MjAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.RkKahj1hCOuA2fneE4zb3ead4LOSDAU9QhCTx0H_qiw",
    quickStats: {
      hitDie: "d8",
      primaryStat: "Sabedoria",
      savingThrows: "Inteligência & Sabedoria",
      spellcasting: "Sabedoria (Natureza Primitiva)"
    },
    proficiencies: {
      armors: "Armaduras leves, médias e escudos (não usam metal)",
      weapons: "Clavas, adagas, dardos, azagaias, maças, bordões, cimitarras, foices, fundas e lanças",
      tools: "Kit de herbalismo",
      savingThrows: "Inteligência, Sabedoria",
      skills: "Escolha 2 entre: Adestrar Animais, Arcanismo, Intuição, Medicina, Natureza, Percepção, Religião e Sobrevivência"
    },
    equipmentText: "• Um escudo de madeira ou qualquer arma simples\n• Uma cimitarra ou qualquer arma simples corpo a corpo\n• Armadura de couro, pacote de explorador e foco druídico",
    features: [
      {
        level: 1,
        name: "Druídico",
        actionType: "Idioma Secreto",
        recharge: "Permanente",
        summary: "Você conhece o idioma secreto dos druidas e pode deixar mensagens ocultas.",
        desc: "Você sabe Druídico, a linguagem secreta dos druidas. Você pode falar o idioma e usá-lo para deixar mensagens secretas em troncos ou rochas que apenas outros druidas decifram."
      },
      {
        level: 2,
        name: "Forma Selvagem",
        actionType: "Ação Bônus / Ação",
        recharge: "Descanso Curto",
        summary: "Transforma seu corpo fisicamente em qualquer besta que você já tenha visto.",
        desc: "Você pode assumir magicamente a forma de uma besta. Suas estatísticas de jogo são substituídas pelas estatísticas da besta, assumindo os PVs temporários dela enquanto mantiver sua inteligência."
      }
    ]
  },

  feiticeiro: {
    id: "feiticeiro",
    name: "Feiticeiro",
    quote: "A magia não é aprendida: ela queima em seu próprio sangue por dádiva dracônica ou caos cósmico.",
    bgImage: "https://rare-gallery.com/thumbs/350727-4k-wallpaper.jpg",
    portrait: "https://rare-gallery.com/thumbs/350727-4k-wallpaper.jpg",
    quickStats: {
      hitDie: "d6",
      primaryStat: "Carisma",
      savingThrows: "Constituição & Carisma",
      spellcasting: "Metamagia & Pontos de Feitiçaria"
    },
    proficiencies: {
      armors: "Nenhuma",
      weapons: "Adagas, dardos, fundas, bordões e bestas leves",
      tools: "Nenhuma",
      savingThrows: "Constituição, Carisma",
      skills: "Escolha 2 entre: Arcanismo, Enganação, Intuição, Intimidação, Persuasão e Religião"
    },
    equipmentText: "• Uma besta leve com 20 virotes ou qualquer arma simples\n• Uma bolsa de componentes ou foco arcano\n• Um pacote de masmorreiro ou pacote de explorador e 2 adagas",
    features: [
      {
        level: 1,
        name: "Origem de Feitiçaria (Subclasse)",
        actionType: "Escolha de Linhagem",
        recharge: "Permanente",
        summary: "Linhagem Dracônica (escamas naturais) ou Magia Selvagem (surtos de caos).",
        desc: "A fonte de seu poder inato se revela no 1º nível: sangue de dragões ancestrais ou a influência caótica da magia pura."
      },
      {
        level: 2,
        name: "Fonte de Magia",
        actionType: "Ação Bônus",
        recharge: "Descanso Longo",
        summary: "Pontos de Feitiçaria que você pode converter em slots de magia adicionais.",
        desc: "Você possui uma reserva de poder mágico bruto representada por Pontos de Feitiçaria, usados para alimentar a Metamagia ou recuperar espaços de magia gastos."
      },
      {
        level: 3,
        name: "Metamagia",
        actionType: "Modificador de Magia",
        recharge: "Consome Pontos de Feitiçaria",
        summary: "Altera o funcionamento de suas magias (Magia Acelerada, Magia Sutil, etc.).",
        desc: "Você ganha a habilidade de dobrar e distorcer as regras da conjuração, como lançar magias sem componentes verbais ou conjurá-las com ação bônus."
      }
    ]
  },

  guerreiro: {
    id: "guerreiro",
    name: "Guerreiro",
    quote: "Um mestre do combate com todas as armas e armaduras imagináveis, forjado pelo treinamento militar.",
    bgImage: "https://cdna.artstation.com/p/assets/images/images/026/097/502/large/-3-1-1.jpg?1587866547",
    portrait: "https://cdna.artstation.com/p/assets/images/images/026/097/502/large/-3-1-1.jpg?1587866547",
    quickStats: {
      hitDie: "d10",
      primaryStat: "Força ou Destreza",
      savingThrows: "Força & Constituição",
      spellcasting: "Apenas Cavaleiro Arcano (Nível 3)"
    },
    proficiencies: {
      armors: "Todas as armaduras e escudos",
      weapons: "Armas simples e marciais",
      tools: "Nenhuma",
      savingThrows: "Força, Constituição",
      skills: "Escolha 2 entre: Acrobacia, Adestrar Animais, Atletismo, História, Intuição, Intimidação, Percepção e Sobrevivência"
    },
    equipmentText: "• Cota de malha ou armadura de couro com arco longo e 20 flechas\n• Uma arma marcial e escudo, ou duas armas marciais\n• Uma besta leve com 20 virotes ou duas machadinhas",
    features: [
      {
        level: 1,
        name: "Estilo de Luta",
        actionType: "Passiva",
        recharge: "Permanente",
        summary: "Especialização tática em Arquearia, Defesa, Duelismo ou Armas Grandes.",
        desc: "Você adota um estilo de combate particular como sua especialidade (ex: Arquearia concede +2 em jogadas de ataque à distância; Duelismo concede +2 no dano com arma de uma mão)."
      },
      {
        level: 1,
        name: "Retomar o Fôlego",
        actionType: "Ação Bônus",
        recharge: "Descanso Curto",
        summary: "Recupera 1d10 + nível de guerreiro em pontos de vida no calor da batalha.",
        desc: "Você possui uma reserva de vigor que pode utilizar para se proteger contra danos. No seu turno, você pode usar uma ação bônus para recuperar PV iguais a 1d10 + seu nível de guerreiro."
      },
      {
        level: 2,
        name: "Surto de Ação",
        actionType: "Ação Livre no Turno",
        recharge: "Descanso Curto",
        summary: "Realiza uma ação adicional completa no seu turno.",
        desc: "Você pode ultrapassar seus limites físicos comuns momentaneamente. No seu turno, você pode realizar uma ação adicional além da sua ação normal e de qualquer possível ação bônus."
      }
    ]
  },

  ladino: {
    id: "ladino",
    name: "Ladino",
    quote: "Um especialista em furtividade, perito em armadilhas e letal ao atacar dos pontos cegos.",
    bgImage: "https://cdna.artstation.com/p/assets/images/images/006/077/360/large/enrico-ottini-dis-sign.jpg?1495877705",
    portrait: "https://cdna.artstation.com/p/assets/images/images/006/077/360/large/enrico-ottini-dis-sign.jpg?1495877705",
    quickStats: {
      hitDie: "d8",
      primaryStat: "Destreza",
      savingThrows: "Destreza & Inteligência",
      spellcasting: "Apenas Trapaceiro Arcano (Nível 3)"
    },
    proficiencies: {
      armors: "Armaduras leves",
      weapons: "Armas simples, bestas de mão, espadas longas, rapieiras e espadas curtas",
      tools: "Ferramentas de ladrão",
      savingThrows: "Destreza, Inteligência",
      skills: "Escolha 4 entre: Acrobacia, Atletismo, Enganação, Furtividade, Intimidação, Intuição, Investigação, Percepção, Atuação, Prestidigitação e Persuasão"
    },
    equipmentText: "• Uma rapieira ou espada curta\n• Um arco curto com aljava de 20 flechas ou uma espada curta\n• Pacote de assaltante, armadura de couro, duas adagas e ferramentas de ladrão",
    features: [
      {
        level: 1,
        name: "Especialização",
        actionType: "Passiva",
        recharge: "Permanente",
        summary: "Dobra o bônus de proficiência em 2 perícias à sua escolha (ou ferramentas de ladrão).",
        desc: "Seu domínio técnico em duas perícias de sua escolha (como Furtividade e Prestidigitação) dobra o bônus de proficiência adicionado aos testes."
      },
      {
        level: 1,
        name: "Ataque Furtivo",
        actionType: "Ataque Especial",
        recharge: "1x por Turno",
        summary: "Causa dano extra (+1d6 inicial) ao atingir com vantagem ou aliado adjacente ao alvo.",
        desc: "Você sabe como desferir golpes cirúrgicos nos pontos vitais. Uma vez por turno, você pode causar 1d6 de dano extra a uma criatura atingida com arma acurada ou à distância se tiver vantagem ou se um aliado estiver adjacente a ela."
      },
      {
        level: 2,
        name: "Ação Ardilosa",
        actionType: "Ação Bônus",
        recharge: "Por Turno",
        summary: "Pode disparar, desengajar ou esconder-se como ação bônus a cada rodada.",
        desc: "Sua agilidade mental e física permite que você se mova e aja com extrema velocidade: você pode usar uma ação bônus para Correr, Desengajar ou Esconder-se."
      }
    ]
  },

  mago: {
    id: "mago",
    name: "Mago",
    quote: "O erudito supremo das artes arcanas, capaz de dobrar a realidade estudando seu grimório.",
    bgImage: "hhttps://cdna.artstation.com/p/assets/images/images/013/951/556/large/eddie-mendoza-the-meditation-garden.jpg?1541792549",
    portrait: "https://cdnb.artstation.com/p/assets/images/images/074/183/051/large/billy-christian-335021-wizardclassopener-final2.jpg?1711452902",
    quickStats: {
      hitDie: "d6",
      primaryStat: "Inteligência",
      savingThrows: "Inteligência & Sabedoria",
      spellcasting: "Grimório Arcano & Rituais"
    },
    proficiencies: {
      armors: "Nenhuma",
      weapons: "Adagas, dardos, fundas, bordões e bestas leves",
      tools: "Nenhuma",
      savingThrows: "Inteligência, Sabedoria",
      skills: "Escolha 2 entre: Arcanismo, História, Intuição, Investigação, Medicina e Religião"
    },
    equipmentText: "• Um bordão ou adaga\n• Uma bolsa de componentes ou foco arcano\n• Pacote de estudioso ou explorador e o indispensável Grimório",
    features: [
      {
        level: 1,
        name: "Conjuração de Grimório",
        actionType: "Variável",
        recharge: "Descanso Longo",
        summary: "Prepara magias diariamente a partir das anotações e fórmulas do seu livro místico.",
        desc: "Como um estudante de magia arcana, você possui um grimório contendo 6 magias de 1º círculo no nível 1. Você prepara uma lista de magias diariamente e pode conjurar rituais diretamente do livro sem gastar slots."
      },
      {
        level: 1,
        name: "Recuperação Arcana",
        actionType: "Especial em Descanso",
        recharge: "Descanso Curto (1x por dia)",
        summary: "Recupera uma quantidade de espaços de magia gastos durante um descanso curto.",
        desc: "Você aprendeu a recuperar parte de sua energia mágica através do estudo de seu livro durante pausas. Uma vez por dia, ao terminar um descanso curto, você recupera slots de magia cujo círculo somado não ultrapasse metade do seu nível de mago."
      },
      {
        level: 2,
        name: "Tradição Arcana (Subclasse)",
        actionType: "Escolha de Escola",
        recharge: "Permanente",
        summary: "Especialização em Evocação, Necromancia, Ilusão, Abjuração, etc.",
        desc: "Você escolhe sua escola de magia preferida, reduzindo pela metade o tempo e custo em ouro para transcrever magias daquela escola em seu grimório."
      }
    ]
  },

  monge: {
    id: "monge",
    name: "Monge",
    quote: "O domínio do próprio Ki transformando o corpo em arma letal com golpes estonteantes e reflexos velozes.",
    bgImage: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
    portrait: "https://cdnb.artstation.com/p/assets/images/images/020/189/905/large/christian-benavides-christian-benavides-walking-to-amitabha-art-half-1.jpg?1566772304",
    quickStats: {
      hitDie: "d8",
      primaryStat: "Destreza & Sabedoria",
      savingThrows: "Força & Destreza",
      spellcasting: "Energia Ki (Pontos de Ki)"
    },
    proficiencies: {
      armors: "Nenhuma",
      weapons: "Armas simples e espadas curtas",
      tools: "Um tipo de instrumento musical ou ferramentas de artesão",
      savingThrows: "Força, Destreza",
      skills: "Escolha 2 entre: Acrobacia, Atletismo, História, Intuição, Religião e Furtividade"
    },
    equipmentText: "• Uma espada curta ou qualquer arma simples\n• Pacote de masmorreiro ou pacote de explorador\n• 10 dardos",
    features: [
      {
        level: 1,
        name: "Defesa sem Armadura do Monge",
        actionType: "Passiva",
        recharge: "Permanente",
        summary: "Sua CA se torna 10 + Destreza + Sabedoria sem armadura ou escudo.",
        desc: "Quando não estiver usando armadura nem empunhando escudo, sua Classe de Armadura é igual a 10 + mod. de Destreza + mod. de Sabedoria."
      },
      {
        level: 1,
        name: "Artes Marciais",
        actionType: "Ação / Ação Bônus",
        recharge: "Permanente",
        summary: "Usa Destreza para ataques desarmados, causa d4 inicial e desfere golpe bônus.",
        desc: "Seus golpes desarmados e com armas de monge podem usar Destreza no lugar de Força, causam 1d4 de dano inicial e permitem desferir um ataque desarmado extra com ação bônus."
      },
      {
        level: 2,
        name: "Ki: Rajada de Golpes e Passo do Vento",
        actionType: "Consome Pontos de Ki",
        recharge: "Descanso Curto",
        summary: "Gasta pontos de Ki para desferir dois ataques desarmados extras ou dobrar seu salto e esquivar.",
        desc: "Você acessa a energia mística do Ki: gaste 1 ponto para desferir 2 ataques desarmados adicionais (Rajada de Golpes), esquivar como ação bônus (Defesa Paciente) ou desengajar/correr com salto dobrado (Passo do Vento)."
      }
    ]
  },

  paladino: {
    id: "paladino",
    name: "Paladino",
    quote: "Um cavaleiro sagrado investido por um juramento divino inquebrável, destruidor do mal.",
    bgImage: "https://images.unsplash.com/photo-1548092372-0d1bd40894a3?auto=format&fit=crop&w=1200&q=80",
    portrait: "https://cdna.artstation.com/p/assets/images/images/058/537/806/large/carlos-justino-the-paladin.jpg?1674407567",
    quickStats: {
      hitDie: "d10",
      primaryStat: "Força & Carisma",
      savingThrows: "Sabedoria & Carisma",
      spellcasting: "Carisma (Destruição Divina)"
    },
    proficiencies: {
      armors: "Todas as armaduras e escudos",
      weapons: "Armas simples e armas marciais",
      tools: "Nenhuma",
      savingThrows: "Sabedoria, Carisma",
      skills: "Escolha 2 entre: Atletismo, Intuição, Intimidação, Medicina, Persuasão e Religião"
    },
    equipmentText: "• Uma arma marcial e um escudo, ou duas armas marciais\n• Cinco azagaias ou qualquer arma simples corpo a corpo\n• Pacote de sacerdote ou explorador, cota de malha e símbolo sagrado",
    features: [
      {
        level: 1,
        name: "Sentido Divino",
        actionType: "Ação",
        recharge: "Descanso Longo",
        summary: "Sente a presença de celestiais, corruptores e mortos-vivos a até 18 metros.",
        desc: "A presença do mal primordial ressoa nos seus sentidos como um odor nocivo. Você detecta a localização exata de qualquer celestial, íncubo/súcubo ou morto-vivo próximo."
      },
      {
        level: 1,
        name: "Cura pelas Mãos",
        actionType: "Ação",
        recharge: "Descanso Longo",
        summary: "Reserva de cura sagrada igual a 5 x seu nível de paladino.",
        desc: "Seu toque abençoado cura ferimentos. Você possui uma reserva de pontos de vida que pode transferir para criaturas tocadas ou gastar 5 pontos para curar uma doença ou veneno."
      },
      {
        level: 2,
        name: "Destruição Divina (Divine Smite)",
        actionType: "Ao Acertar Ataque",
        recharge: "Consome Espaço de Magia",
        summary: "Converte slots de magia em dano radiante massivo (+2d8 inicial) no impacto da arma.",
        desc: "Ao atingir uma criatura com um ataque corpo a corpo, você pode gastar um espaço de magia para canalizar fogo sagrado através de sua lâmina, causando 2d8 de dano radiante extra (+1d8 contra mortos-vivos ou corruptores)."
      }
    ]
  },

  patrulheiro: {
    id: "patrulheiro",
    name: "Patrulheiro",
    quote: "O caçador implacável das fronteiras selvagens, mestre do arco e rastreador de predadores.",
    bgImage: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1200&q=80",
    portrait: "https://cdnb.artstation.com/p/assets/images/images/076/868/565/large/theresa-konigseder-haller-exotic-monstrous-airgenasi-art-portfolio.jpg?1718029184",
    quickStats: {
      hitDie: "d10",
      primaryStat: "Destreza & Sabedoria",
      savingThrows: "Força & Destreza",
      spellcasting: "Sabedoria (Magia Natural)"
    },
    proficiencies: {
      armors: "Armaduras leves, médias e escudos",
      weapons: "Armas simples e marciais",
      tools: "Nenhuma",
      savingThrows: "Força, Destreza",
      skills: "Escolha 3 entre: Adestrar Animais, Atletismo, Furtividade, Intuição, Investigação, Natureza, Percepção e Sobrevivência"
    },
    equipmentText: "• Cota de escamas ou armadura de couro\n• Duas espadas curtas ou duas armas simples corpo a corpo\n• Um pacote de masmorreiro ou explorador, arco longo e 20 flechas",
    features: [
      {
        level: 1,
        name: "Inimigo Favorito",
        actionType: "Passiva",
        recharge: "Permanente",
        summary: "Vantagem em Sobrevivência para rastrear certos inimigos e aprender seus idiomas.",
        desc: "Você possui experiência significativa em estudar, rastrear e caçar um tipo específico de inimigo (ex: feras, orcs, mortos-vivos), ganhando vantagem em testes e conhecimento de seus idiomas."
      },
      {
        level: 1,
        name: "Explorador Natural",
        actionType: "Passiva",
        recharge: "Permanente",
        summary: "Terreno difícil não reduz a marcha do grupo e você não se perde em seu bioma favorito.",
        desc: "Você é um mestre da navegação em um tipo de ambiente natural (floresta, pântano, montanha, etc.), garantindo que seu grupo nunca se perca e viaje com eficiência máxima."
      },
      {
        level: 2,
        name: "Estilo de Luta & Magia de Patrulheiro",
        actionType: "Passiva / Variável",
        recharge: "Descanso Longo",
        summary: "Ganha estilo de combate (Arquearia +2) e magias de caçador como Marca do Caçador.",
        desc: "Você complementa sua destreza marcial com magias selvagens que amplificam seu dano de rastreio e flechadas letais."
      }
    ]
  }
};
