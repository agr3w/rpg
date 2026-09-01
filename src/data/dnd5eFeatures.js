// Base de dados estruturada de Traços Raciais e Habilidades de Classe de D&D 5e

export const ACTION_TYPES = {
  PASSIVA: { label: "Passiva", color: "#78909c", bg: "rgba(120, 144, 156, 0.15)", border: "rgba(120, 144, 156, 0.4)" },
  ACAO: { label: "1 Ação", color: "#e53935", bg: "rgba(229, 57, 53, 0.15)", border: "rgba(229, 57, 53, 0.4)" },
  ACAO_BONUS: { label: "Ação Bônus", color: "#fb8c00", bg: "rgba(251, 140, 0, 0.15)", border: "rgba(251, 140, 0, 0.4)" },
  REACAO: { label: "Reação", color: "#ffd600", bg: "rgba(255, 214, 0, 0.18)", border: "rgba(255, 214, 0, 0.45)" },
  ESPECIAL: { label: "Especial", color: "#ab47bc", bg: "rgba(171, 71, 188, 0.15)", border: "rgba(171, 71, 188, 0.4)" },
};

export const RECHARGE_TYPES = {
  ILIMITADO: "Ilimitado",
  DESCANSO_CURTO: "Descanso Curto",
  DESCANSO_LONGO: "Descanso Longo",
  DESCANSO_CURTO_LONGO: "Descanso Curto ou Longo",
  CARGAS: "Cargas",
  ESPECIAL: "Especial",
};

// -------------------------------------------------------------------------------------------------
// TRAÇOS RACIAIS D&D 5E
// -------------------------------------------------------------------------------------------------
export const DND5E_RACIAL_TRAITS = {
  anao: [
    {
      id: "anao_visao_escuro",
      nome: "Visão no Escuro",
      origem: "raca",
      subOrigem: "Anão",
      nivel: 0,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Acostumado à vida subterrânea, você enxerga na penumbra a até 18 metros como se fosse luz plena, e no escuro como se fosse penumbra. Não é possível discernir cores no escuro, apenas tons de cinza.",
    },
    {
      id: "anao_resiliencia",
      nome: "Resiliência Anã",
      origem: "raca",
      subOrigem: "Anão",
      nivel: 0,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você possui vantagem em testes de resistência contra venenos e resistência a dano de veneno.",
    },
    {
      id: "anao_treinamento_combate",
      nome: "Treinamento Anão em Combate",
      origem: "raca",
      subOrigem: "Anão",
      nivel: 0,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você tem proficiência com machados de batalha, machadinhas, martelos leves e martelos de guerra.",
    },
    {
      id: "anao_especializacao_rochas",
      nome: "Especialização em Rochas",
      origem: "raca",
      subOrigem: "Anão",
      nivel: 0,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Sempre que você realizar um teste de Inteligência (História) relacionado à origem de um trabalho em pedra, você adiciona o dobro do seu bônus de proficiência ao teste.",
    },
    {
      id: "anao_colina_tenacidade",
      nome: "Tenacidade Anã (Anão da Colina)",
      origem: "raca",
      subOrigem: "Anão da Colina",
      nivel: 0,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Seu máximo de pontos de vida aumenta em 1, e aumenta em 1 adicional a cada vez que você subir de nível.",
    },
    {
      id: "anao_montanha_armaduras",
      nome: "Treinamento com Armaduras (Anão da Montanha)",
      origem: "raca",
      subOrigem: "Anão da Montanha",
      nivel: 0,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você possui proficiência em armaduras leves e médias.",
    },
  ],

  elfo: [
    {
      id: "elfo_visao_escuro",
      nome: "Visão no Escuro",
      origem: "raca",
      subOrigem: "Elfo",
      nivel: 0,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você enxerga na penumbra a até 18 metros como se fosse luz plena, e no escuro como se fosse penumbra.",
    },
    {
      id: "elfo_sentidos_agucados",
      nome: "Sentidos Aguçados",
      origem: "raca",
      subOrigem: "Elfo",
      nivel: 0,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você tem proficiência na perícia Percepção.",
    },
    {
      id: "elfo_ancestral_feerico",
      nome: "Ancestral Feérico",
      origem: "raca",
      subOrigem: "Elfo",
      nivel: 0,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você tem vantagem em testes de resistência para resistir a ser enfeitiçado e magia não pode colocá-lo para dormir.",
    },
    {
      id: "elfo_transe",
      nome: "Transe",
      origem: "raca",
      subOrigem: "Elfo",
      nivel: 0,
      tipoAcao: "Especial",
      recarga: "Descanso Longo",
      descricao: "Elfos não precisam dormir. Em vez disso, meditam profundamente por 4 horas por dia, obtendo os mesmos benefícios de 8 horas de sono humano.",
    },
    {
      id: "alto_elfo_truque",
      nome: "Truque Adicional (Alto Elfo)",
      origem: "raca",
      subOrigem: "Alto Elfo",
      nivel: 0,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você conhece um truque à sua escolha da lista de magias de Mago. Inteligência é o seu atributo de conjuração para este truque.",
    },
    {
      id: "elfo_floresta_mascara",
      nome: "Máscara da Natureza (Elfo da Floresta)",
      origem: "raca",
      subOrigem: "Elfo da Floresta",
      nivel: 0,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você pode tentar se esconder mesmo quando estiver apenas levemente obscurecido por folhagem, chuva forte, neve ou outros fenômenos naturais.",
    },
    {
      id: "drow_magia",
      nome: "Magia Drow (Elfo Negro)",
      origem: "raca",
      subOrigem: "Drow",
      nivel: 0,
      tipoAcao: "1 Ação",
      recarga: "Descanso Longo",
      descricao: "Você conhece o truque Globos de Luz. No 3º nível, pode conjurar Fogo das Fadas 1 vez por descanso longo. No 5º nível, pode conjurar Escuridão 1 vez por descanso longo. Carisma é seu atributo de conjuração.",
    },
  ],

  halfling: [
    {
      id: "halfling_sorte",
      nome: "Sortudo",
      origem: "raca",
      subOrigem: "Halfling",
      nivel: 0,
      tipoAcao: "Reação",
      recarga: "Ilimitado",
      descricao: "Quando você rolar um 1 natural em uma jogada de ataque, teste de habilidade ou teste de resistência, você pode jogar o dado novamente e deve usar a nova rolagem.",
    },
    {
      id: "halfling_bravura",
      nome: "Bravura",
      origem: "raca",
      subOrigem: "Halfling",
      nivel: 0,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você tem vantagem em testes de resistência para resistir a ser amedrontado.",
    },
    {
      id: "halfling_agilidade",
      nome: "Agilidade Halfling",
      origem: "raca",
      subOrigem: "Halfling",
      nivel: 0,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você pode mover-se através do espaço de qualquer criatura que seja de um tamanho maior que o seu.",
    },
    {
      id: "halfling_furtividade_natural",
      nome: "Furtividade Natural (Pés-Leves)",
      origem: "raca",
      subOrigem: "Pés-Leves",
      nivel: 0,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você pode tentar se esconder mesmo quando estiver obscurecido apenas por uma criatura que seja pelo menos um tamanho maior que você.",
    },
  ],

  humano: [
    {
      id: "humano_versatilidade",
      nome: "Versatilidade Humana",
      origem: "raca",
      subOrigem: "Humano",
      nivel: 0,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Humanos ganham +1 em todos os atributos e proficiência em um idioma adicional à sua escolha.",
    },
  ],

  draconato: [
    {
      id: "draconato_sopro",
      nome: "Arma de Sopro",
      origem: "raca",
      subOrigem: "Draconato",
      nivel: 0,
      tipoAcao: "1 Ação",
      recarga: "Descanso Curto ou Longo",
      temUsos: true,
      usosMax: 1,
      descricao: "Você pode exalar energia destrutiva (Cone de 4,5m ou Linha de 9m conforme seu ancestral dracônico). Cada criatura na área deve fazer um teste de resistência (CD 8 + mod Con + prof). Causa 2d6 de dano (aumenta para 3d6 no 6º, 4d6 no 11º e 5d6 no 16º).",
    },
    {
      id: "draconato_resistencia",
      nome: "Resistência a Dano",
      origem: "raca",
      subOrigem: "Draconato",
      nivel: 0,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você tem resistência ao tipo de dano associado ao seu ancestral dracônico (Fogo, Frio, Ácido, Elétrico ou Veneno).",
    },
  ],

  gnomo: [
    {
      id: "gnomo_visao_escuro",
      nome: "Visão no Escuro",
      origem: "raca",
      subOrigem: "Gnomo",
      nivel: 0,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você enxerga na penumbra a até 18 metros como se fosse luz plena, e no escuro como se fosse penumbra.",
    },
    {
      id: "gnomo_esperteza",
      nome: "Esperteza Gnômica",
      origem: "raca",
      subOrigem: "Gnomo",
      nivel: 0,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você tem vantagem em todos os testes de resistência de Inteligência, Sabedoria e Carisma contra magia.",
    },
    {
      id: "gnomo_rochas_engenhoqueiro",
      nome: "Engenhoqueiro (Gnomo das Rochas)",
      origem: "raca",
      subOrigem: "Gnomo das Rochas",
      nivel: 0,
      tipoAcao: "1 Ação",
      recarga: "Ilimitado",
      descricao: "Você tem proficiência com ferramentas de artesão (ferramentas de funileiro). Usando essas ferramentas, você pode gastar 1 hora e 10 PO em materiais para construir um dispositivo mecânico Pequeno (Acendedor, Brinquedo ou Caixa de Música).",
    },
  ],

  "meio-elfo": [
    {
      id: "meio_elfo_visao_escuro",
      nome: "Visão no Escuro",
      origem: "raca",
      subOrigem: "Meio-Elfo",
      nivel: 0,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você enxerga na penumbra a até 18 metros como se fosse luz plena, e no escuro como se fosse penumbra.",
    },
    {
      id: "meio_elfo_ancestral_feerico",
      nome: "Ancestral Feérico",
      origem: "raca",
      subOrigem: "Meio-Elfo",
      nivel: 0,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você tem vantagem em testes de resistência para resistir a ser enfeitiçado e magia não pode colocá-lo para dormir.",
    },
    {
      id: "meio_elfo_versatilidade_pericias",
      nome: "Versatilidade em Perícias",
      origem: "raca",
      subOrigem: "Meio-Elfo",
      nivel: 0,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você ganha proficiência em duas perícias à sua escolha.",
    },
  ],

  "meio-orc": [
    {
      id: "meio_orc_visao_escuro",
      nome: "Visão no Escuro",
      origem: "raca",
      subOrigem: "Meio-Orc",
      nivel: 0,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você enxerga na penumbra a até 18 metros como se fosse luz plena, e no escuro como se fosse penumbra.",
    },
    {
      id: "meio_orc_ameacador",
      nome: "Ameaçador",
      origem: "raca",
      subOrigem: "Meio-Orc",
      nivel: 0,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você ganha proficiência na perícia Intimidação.",
    },
    {
      id: "meio_orc_resistencia_implacavel",
      nome: "Resistência Implacável",
      origem: "raca",
      subOrigem: "Meio-Orc",
      nivel: 0,
      tipoAcao: "Reação",
      recarga: "Descanso Longo",
      temUsos: true,
      usosMax: 1,
      descricao: "Quando você for reduzido a 0 pontos de vida mas não for morto instantaneamente, você pode optar por cair a 1 ponto de vida em vez disso. Você não pode usar esse traço novamente até terminar um descanso longo.",
    },
    {
      id: "meio_orc_ataques_selvagens",
      nome: "Ataques Selvagens",
      origem: "raca",
      subOrigem: "Meio-Orc",
      nivel: 0,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Quando você atinge um acerto crítico com uma arma corpo a corpo, você pode rolar um dos dados de dano da arma mais uma vez e adicioná-lo ao dano extra do acerto crítico.",
    },
  ],

  tiefling: [
    {
      id: "tiefling_visao_escuro",
      nome: "Visão no Escuro",
      origem: "raca",
      subOrigem: "Tiefling",
      nivel: 0,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você enxerga na penumbra a até 18 metros como se fosse luz plena, e no escuro como se fosse penumbra.",
    },
    {
      id: "tiefling_resistencia_infernal",
      nome: "Resistência Infernal",
      origem: "raca",
      subOrigem: "Tiefling",
      nivel: 0,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você possui resistência a dano de fogo.",
    },
    {
      id: "tiefling_legado_infernal",
      nome: "Legado Infernal",
      origem: "raca",
      subOrigem: "Tiefling",
      nivel: 0,
      tipoAcao: "1 Ação",
      recarga: "Descanso Longo",
      descricao: "Você conhece o truque Taumaturgia. No 3º nível, pode conjurar Repreensão Infernal como magia de 2º nível 1 vez por descanso longo. No 5º nível, pode conjurar Escuridão 1 vez por descanso longo. Carisma é seu atributo de conjuração.",
    },
  ],
};

// -------------------------------------------------------------------------------------------------
// RECURSOS DE CLASSE D&D 5E (NÍVEIS 1 A 20)
// -------------------------------------------------------------------------------------------------
export const DND5E_CLASS_FEATURES = {
  barbaro: [
    {
      id: "barb_furia",
      nome: "Fúria",
      origem: "classe",
      subOrigem: "Bárbaro",
      nivel: 1,
      tipoAcao: "Ação Bônus",
      recarga: "Descanso Longo",
      temUsos: true,
      usosFormula: (lvl) => (lvl >= 20 ? 999 : lvl >= 17 ? 6 : lvl >= 12 ? 5 : lvl >= 6 ? 4 : lvl >= 3 ? 3 : 2),
      descricao: "Em combate, você pode entrar em fúria com uma ação bônus. Enquanto enfurecido: você tem vantagem em testes e salvaguardas de Força; ganha bônus no dano corpo a corpo (+2 no nvl 1, +3 no nvl 9, +4 no nvl 16); e tem resistência a dano concussivo, cortante e perfurante.",
    },
    {
      id: "barb_defesa_sem_armadura",
      nome: "Defesa sem Armadura",
      origem: "classe",
      subOrigem: "Bárbaro",
      nivel: 1,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Quando você não estiver vestindo nenhuma armadura, sua Classe de Armadura será igual a 10 + mod Destreza + mod Constituição. Você pode usar um escudo e ainda obter esse benefício.",
    },
    {
      id: "barb_ataque_descuidado",
      nome: "Ataque Descuidado",
      origem: "classe",
      subOrigem: "Bárbaro",
      nivel: 2,
      tipoAcao: "Especial",
      recarga: "Ilimitado",
      descricao: "No seu primeiro ataque no seu turno, você pode optar por atacar descuidadamente. Você ganha vantagem nas jogadas de ataque corpo a corpo usando Força durante esse turno, mas as jogadas de ataque contra você também têm vantagem até o início do seu próximo turno.",
    },
    {
      id: "barb_sentido_perigo",
      nome: "Sentido de Perigo",
      origem: "classe",
      subOrigem: "Bárbaro",
      nivel: 2,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você tem vantagem em testes de resistência de Destreza contra efeitos que você possa ver, como armadilhas e magias, desde que você não esteja cego, surdo ou incapacitado.",
    },
    {
      id: "barb_caminho_primitivo",
      nome: "Caminho Primitivo (Subclasse)",
      origem: "classe",
      subOrigem: "Bárbaro",
      nivel: 3,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você escolhe um caminho que molda a natureza de sua fúria, como o Caminho do Furioso ou o Caminho do Guerreiro Totêmico.",
    },
    {
      id: "barb_ataque_extra",
      nome: "Ataque Extra",
      origem: "classe",
      subOrigem: "Bárbaro",
      nivel: 5,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você pode atacar duas vezes, em vez de uma, sempre que realizar a ação de Ataque no seu turno.",
    },
    {
      id: "barb_movimento_rapido",
      nome: "Movimento Rápido",
      origem: "classe",
      subOrigem: "Bárbaro",
      nivel: 5,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Seu deslocamento aumenta em 3 metros enquanto você não estiver usando armadura pesada.",
    },
    {
      id: "barb_instinto_selvagem",
      nome: "Instinto Feral",
      origem: "classe",
      subOrigem: "Bárbaro",
      nivel: 7,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Seus instintos são tão aguçados que você tem vantagem em jogadas de iniciativa. Além disso, se você for surpreendido no início do combate e não estiver incapacitado, você pode agir normalmente no seu primeiro turno, mas apenas se entrar em fúria antes de fazer qualquer outra coisa.",
    },
    {
      id: "barb_critico_brutal",
      nome: "Crítico Brutal",
      origem: "classe",
      subOrigem: "Bárbaro",
      nivel: 9,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você pode rolar um dado de dano adicional de arma ao determinar o dano extra de um acerto crítico com um ataque corpo a corpo (2 dados adicionais no 13º nível, 3 dados no 17º).",
    },
    {
      id: "barb_furia_implacavel",
      nome: "Fúria Implacável",
      origem: "classe",
      subOrigem: "Bárbaro",
      nivel: 11,
      tipoAcao: "Reação",
      recarga: "Descanso Curto ou Longo",
      descricao: "Sua fúria pode mantê-lo lutando apesar de ferimentos terríveis. Se você cair a 0 pontos de vida enquanto estiver em fúria e não morrer instantaneamente, pode fazer um teste de resistência de Constituição CD 10. Se for bem-sucedido, você cai para 1 ponto de vida em vez disso.",
    },
  ],

  bardo: [
    {
      id: "bardo_conjuracao",
      nome: "Conjuração de Bardo",
      origem: "classe",
      subOrigem: "Bardo",
      nivel: 1,
      tipoAcao: "1 Ação",
      recarga: "Ilimitado",
      descricao: "Você aprendeu a desvendar e remodelar a trama da realidade em harmonia com seus desejos e música. Carisma é seu atributo de conjuração (CD = 8 + prof + mod Carisma).",
    },
    {
      id: "bardo_inspiracao",
      nome: "Inspiração de Bardo",
      origem: "classe",
      subOrigem: "Bardo",
      nivel: 1,
      tipoAcao: "Ação Bônus",
      recarga: "Descanso Longo",
      temUsos: true,
      usosFormula: (lvl, mods) => Math.max(1, Number(mods?.Carisma || 1)),
      descricao: "Você pode inspirar outros através de palavras ou música. Com uma ação bônus, escolha uma criatura a até 18m. Ela ganha um dado de Inspiração (d6 no nvl 1, d8 no nvl 5, d10 no nvl 10, d12 no nvl 15) para adicionar em uma jogada de ataque, teste de habilidade ou salvaguarda nos próximos 10 minutos.",
    },
    {
      id: "bardo_versatilidade",
      nome: "Especialista / Versatilidade",
      origem: "classe",
      subOrigem: "Bardo",
      nivel: 2,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você pode adicionar metade do seu bônus de proficiência, arredondado para baixo, a qualquer teste de habilidade que você fizer que já não inclua seu bônus de proficiência.",
    },
    {
      id: "bardo_cancao_descanso",
      nome: "Canção de Descanso",
      origem: "classe",
      subOrigem: "Bardo",
      nivel: 2,
      tipoAcao: "Especial",
      recarga: "Descanso Curto",
      descricao: "Você pode usar música ou oratória reconfortante para ajudar a revitalizar seus aliados durante um descanso curto. Se você ou quaisquer criaturas amistosas recuperarem pontos de vida ao final do descanso curto usando Dados de Vida, cada criatura recupera 1d6 pontos de vida adicionais (aumenta para d8 no nvl 9, d10 no nvl 13, d12 no nvl 17).",
    },
    {
      id: "bardo_colegio_bardico",
      nome: "Colégio Bárdico (Subclasse)",
      origem: "classe",
      subOrigem: "Bardo",
      nivel: 3,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você aprofunda seus estudos e se dedica a um Colégio Bárdico, como o Colégio do Conhecimento ou Colégio da Bravura.",
    },
    {
      id: "bardo_especializacao",
      nome: "Especialização (Expertise)",
      origem: "classe",
      subOrigem: "Bardo",
      nivel: 3,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Escolha duas das suas perícias com as quais você é proficiente. Seu bônus de proficiência é dobrado para qualquer teste de habilidade que faça uso de qualquer uma das perícias escolhidas.",
    },
    {
      id: "bardo_fonte_inspiracao",
      nome: "Fonte de Inspiração",
      origem: "classe",
      subOrigem: "Bardo",
      nivel: 5,
      tipoAcao: "Passiva",
      recarga: "Descanso Curto ou Longo",
      descricao: "Você recupera todos os seus usos gastos de Inspiração de Bardo ao terminar um descanso curto ou longo.",
    },
    {
      id: "bardo_contra_encanto",
      nome: "Contra-Encanto",
      origem: "classe",
      subOrigem: "Bardo",
      nivel: 6,
      tipoAcao: "1 Ação",
      recarga: "Ilimitado",
      descricao: "Você ganha a habilidade de usar notas musicais ou palavras de poder para romper efeitos que influenciam a mente. Como uma ação, você pode iniciar uma performance que dura até o final do seu próximo turno. Você e aliados a até 9m ganham vantagem em testes de resistência contra serem amedrontados ou enfeitiçados.",
    },
    {
      id: "bardo_segredos_magicos",
      nome: "Segredos Mágicos",
      origem: "classe",
      subOrigem: "Bardo",
      nivel: 10,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você escolheu duas magias de qualquer classe, incluindo esta. As magias escolhidas devem ser de um nível que você possa conjurar. Elas contam como magias de bardo para você.",
    },
  ],

  bruxo: [
    {
      id: "bruxo_patrono",
      nome: "Patrono Transcendental (Subclasse)",
      origem: "classe",
      subOrigem: "Bruxo",
      nivel: 1,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você firmou um pacto com um ser transcendental à sua escolha: o Corruptor, o Grande Antigo ou a Arquifada.",
    },
    {
      id: "bruxo_magia_pacto",
      nome: "Magia de Pacto",
      origem: "classe",
      subOrigem: "Bruxo",
      nivel: 1,
      tipoAcao: "1 Ação",
      recarga: "Descanso Curto ou Longo",
      descricao: "Sua pesquisa arcana e a barganha concedida pelo seu patrono lhe deram facilidade com magias. Todos os seus espaços de magia de bruxo são do mesmo círculo e se recuperam em descansos curtos ou longos.",
    },
    {
      id: "bruxo_invocacoes_ocultas",
      nome: "Invocações Ocultas",
      origem: "classe",
      subOrigem: "Bruxo",
      nivel: 2,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Em seus estudos sobre o conhecimento oculto, você descobriu invocações sobrenaturais que lhe concedem habilidades mágicas permanentes (ex: Rajada Agonizante, Armadura de Sombras).",
    },
    {
      id: "bruxo_dadiva_pacto",
      nome: "Dádiva do Pacto",
      origem: "classe",
      subOrigem: "Bruxo",
      nivel: 3,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Seu patrono lhe concede um presente especial: o Pacto da Corrente (familiar aprimorado), o Pacto da Lâmina (arma mágica convocável) ou o Pacto do Tomo (livro de sombras com truques extras).",
    },
    {
      id: "bruxo_arcanum_mistico",
      nome: "Arcanum Místico",
      origem: "classe",
      subOrigem: "Bruxo",
      nivel: 11,
      tipoAcao: "1 Ação",
      recarga: "Descanso Longo",
      descricao: "Seu patrono concede a você um segredo mágico chamado arcanum. Escolha uma magia de 6º nível da lista de magias de bruxo como este arcanum. Você pode conjurá-la uma vez sem gastar um espaço de magia.",
    },
  ],

  clerigo: [
    {
      id: "clerigo_conjuracao",
      nome: "Conjuração Divina",
      origem: "classe",
      subOrigem: "Clérigo",
      nivel: 1,
      tipoAcao: "1 Ação",
      recarga: "Ilimitado",
      descricao: "Como um canalizador de poder divino, você pode conjurar magias de clérigo. Sabedoria é o seu atributo de conjuração (CD = 8 + prof + mod Sabedoria).",
    },
    {
      id: "clerigo_dominio_divino",
      nome: "Domínio Divino (Subclasse)",
      origem: "classe",
      subOrigem: "Clérigo",
      nivel: 1,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Escolha um domínio relacionado à sua divindade: Vida, Luz, Trapaça, Guerra, Tempestade, Forja ou Conhecimento.",
    },
    {
      id: "clerigo_canalizar_divindade",
      nome: "Canalizar Divindade: Expulsar Mortos-Vivos",
      origem: "classe",
      subOrigem: "Clérigo",
      nivel: 2,
      tipoAcao: "1 Ação",
      recarga: "Descanso Curto ou Longo",
      temUsos: true,
      usosFormula: (lvl) => (lvl >= 18 ? 3 : lvl >= 6 ? 2 : 1),
      descricao: "Você pode canalizar energia divina diretamente de sua divindade. Como uma ação, você empunha seu símbolo sagrado e cada morto-vivo a até 9m que puder ver ou ouvir você deve fazer uma salvaguarda de Sabedoria. Se falhar, a criatura é expulsa por 1 minuto ou até sofrer dano.",
    },
    {
      id: "clerigo_destruir_mortos_vivos",
      nome: "Destruir Mortos-Vivos",
      origem: "classe",
      subOrigem: "Clérigo",
      nivel: 5,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Quando um morto-vivo falhar no teste de resistência contra seu Expulsar Mortos-Vivos, a criatura é instantaneamente destruída se seu Nível de Desafio (ND) for igual ou inferior a um certo limite (ND 1/2 no nvl 5, ND 1 no nvl 8, ND 2 no nvl 11, ND 3 no nvl 14, ND 4 no nvl 17).",
    },
    {
      id: "clerigo_intervencao_divina",
      nome: "Intervenção Divina",
      origem: "classe",
      subOrigem: "Clérigo",
      nivel: 10,
      tipoAcao: "1 Ação",
      recarga: "7 Dias (ou Descanso Longo)",
      descricao: "Você pode implorar à sua divindade por auxílio. Descreva o auxílio que procura e role um d100. Se rolar um número menor ou igual ao seu nível de clérigo, sua divindade intervém.",
    },
  ],

  druida: [
    {
      id: "druida_conjuracao",
      nome: "Conjuração Druídica",
      origem: "classe",
      subOrigem: "Druida",
      nivel: 1,
      tipoAcao: "1 Ação",
      recarga: "Ilimitado",
      descricao: "Você empunha o poder primordial da natureza para conjurar magias. Sabedoria é o seu atributo de conjuração (CD = 8 + prof + mod Sabedoria).",
    },
    {
      id: "druida_druidico",
      nome: "Druídico",
      origem: "classe",
      subOrigem: "Druida",
      nivel: 1,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você conhece o Druídico, a linguagem secreta dos druidas. Você pode falar o idioma e usá-lo para deixar mensagens ocultas.",
    },
    {
      id: "druida_forma_selvagem",
      nome: "Forma Selvagem",
      origem: "classe",
      subOrigem: "Druida",
      nivel: 2,
      tipoAcao: "1 Ação",
      recarga: "Descanso Curto ou Longo",
      temUsos: true,
      usosMax: 2,
      descricao: "Você pode usar sua ação para assumir magicamente a forma de uma besta que você já tenha visto antes. Você pode usar esta característica duas vezes por descanso curto ou longo.",
    },
    {
      id: "druida_circulo",
      nome: "Círculo Druídico (Subclasse)",
      origem: "classe",
      subOrigem: "Druida",
      nivel: 2,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você escolhe se identificar com um círculo de druidas: o Círculo da Terra, Círculo da Lua, Círculo dos Esporos, etc.",
    },
  ],

  feiticeiro: [
    {
      id: "feiti_conjuracao",
      nome: "Conjuração Inata",
      origem: "classe",
      subOrigem: "Feiticeiro",
      nivel: 1,
      tipoAcao: "1 Ação",
      recarga: "Ilimitado",
      descricao: "Um evento no seu passado, ou na vida de seus pais ou ancestrais, deixou uma marca em você, infundindo-o com magia arcana. Carisma é seu atributo de conjuração (CD = 8 + prof + mod Carisma).",
    },
    {
      id: "feiti_origem_feiticaria",
      nome: "Origem da Feitiçaria (Subclasse)",
      origem: "classe",
      subOrigem: "Feiticeiro",
      nivel: 1,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Escolha uma origem de feitiçaria, que descreve a fonte do seu poder mágico inato: Linhagem Dracônica, Magia Selvagem, etc.",
    },
    {
      id: "feiti_fonte_magia",
      nome: "Fonte de Magia (Pontos de Feitiçaria)",
      origem: "classe",
      subOrigem: "Feiticeiro",
      nivel: 2,
      tipoAcao: "Ação Bônus",
      recarga: "Descanso Longo",
      temUsos: true,
      usosFormula: (lvl) => Math.max(0, lvl),
      descricao: "Você possui uma fonte de magia dentro de si representada por Pontos de Feitiçaria (iguais ao seu nível). Você pode gastar pontos de feitiçaria para criar espaços de magia adicionais ou converter espaços em pontos.",
    },
    {
      id: "feiti_metamagia",
      nome: "Metamagia",
      origem: "classe",
      subOrigem: "Feiticeiro",
      nivel: 3,
      tipoAcao: "Especial",
      recarga: "Ilimitado",
      descricao: "Você adquire a habilidade de dobrar e moldar suas magias de acordo com suas necessidades (ex: Magia Acelerada, Magia Gêmea, Magia Sutil, Magia Potencializada).",
    },
  ],

  guerreiro: [
    {
      id: "guerreiro_estilo_luta",
      nome: "Estilo de Luta",
      origem: "classe",
      subOrigem: "Guerreiro",
      nivel: 1,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você adota um estilo de combate particular que aprimora seus ataques: Arquearia, Defesa, Duelo, Luta com Armas Grandes, Proteção ou Combate com Duas Armas.",
    },
    {
      id: "guerreiro_segundo_folego",
      nome: "Segundo Fôlego",
      origem: "classe",
      subOrigem: "Guerreiro",
      nivel: 1,
      tipoAcao: "Ação Bônus",
      recarga: "Descanso Curto ou Longo",
      temUsos: true,
      usosMax: 1,
      descricao: "Você possui uma reserva de vigor que pode utilizar para se proteger do perigo. Com uma ação bônus, você recupera pontos de vida iguais a 1d10 + seu nível de guerreiro.",
    },
    {
      id: "guerreiro_surto_acao",
      nome: "Surto de Ação (Action Surge)",
      origem: "classe",
      subOrigem: "Guerreiro",
      nivel: 2,
      tipoAcao: "Especial",
      recarga: "Descanso Curto ou Longo",
      temUsos: true,
      usosFormula: (lvl) => (lvl >= 17 ? 2 : 1),
      descricao: "Você pode empurrar a si mesmo além de seus limites normais por um instante. No seu turno, você pode realizar uma ação adicional além da sua ação normal e de qualquer possível ação bônus.",
    },
    {
      id: "guerreiro_arquetipo",
      nome: "Arquétipo Marcial (Subclasse)",
      origem: "classe",
      subOrigem: "Guerreiro",
      nivel: 3,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você escolhe um arquétipo que define seu estilo de maestria marcial: Campeão, Mestre de Batalha ou Cavaleiro Arcano.",
    },
    {
      id: "guerreiro_ataque_extra",
      nome: "Ataque Extra",
      origem: "classe",
      subOrigem: "Guerreiro",
      nivel: 5,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você pode atacar duas vezes ao realizar a ação de Ataque (três vezes no 11º nível e quatro vezes no 20º nível).",
    },
    {
      id: "guerreiro_indomavel",
      nome: "Indomável",
      origem: "classe",
      subOrigem: "Guerreiro",
      nivel: 9,
      tipoAcao: "Reação",
      recarga: "Descanso Longo",
      temUsos: true,
      usosFormula: (lvl) => (lvl >= 17 ? 3 : lvl >= 13 ? 2 : 1),
      descricao: "Você pode jogar de novo um teste de resistência que você tenha falhado. Se o fizer, você deve usar o novo resultado.",
    },
  ],

  ladino: [
    {
      id: "ladino_especializacao",
      nome: "Especialização (Expertise)",
      origem: "classe",
      subOrigem: "Ladino",
      nivel: 1,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Escolha duas de suas proficiências em perícias ou uma perícia e suas ferramentas de ladrão. Seu bônus de proficiência é dobrado para qualquer teste de habilidade feito com elas (duas adicionais no 6º nível).",
    },
    {
      id: "ladino_ataque_furtivo",
      nome: "Ataque Furtivo",
      origem: "classe",
      subOrigem: "Ladino",
      nivel: 1,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Uma vez por turno, você pode causar dano extra a uma criatura que você atingir se você tiver vantagem na jogada de ataque ou se outro inimigo do alvo estiver a até 1,5m dele e você não tiver desvantagem. Dano: 1d6 no nvl 1 (+1d6 a cada 2 níveis adicionais: 2d6 no 3º, 3d6 no 5º, etc).",
    },
    {
      id: "ladino_giria_ladroes",
      nome: "Gíria de Ladrão",
      origem: "classe",
      subOrigem: "Ladino",
      nivel: 1,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você aprendeu a gíria dos ladrões, uma mistura secreta de dialetos, jargões e códigos que permite esconder mensagens em conversas aparentemente normais.",
    },
    {
      id: "ladino_acao_astuta",
      nome: "Ação Astuta",
      origem: "classe",
      subOrigem: "Ladino",
      nivel: 2,
      tipoAcao: "Ação Bônus",
      recarga: "Ilimitado",
      descricao: "Sua agilidade e velocidade permitem que você se mova e aja rapidamente. Você pode usar uma ação bônus em cada um dos seus turnos de combate para Disparar, Desengajar ou Esconder-se.",
    },
    {
      id: "ladino_arquetipo",
      nome: "Arquétipo Ladino (Subclasse)",
      origem: "classe",
      subOrigem: "Ladino",
      nivel: 3,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você escolhe um arquétipo que espelha sua especialidade: Assassino, Ladrão ou Trapaceiro Arcano.",
    },
    {
      id: "ladino_esquiva_sobrenatural",
      nome: "Esquiva Sobrenatural",
      origem: "classe",
      subOrigem: "Ladino",
      nivel: 5,
      tipoAcao: "Reação",
      recarga: "Ilimitado",
      descricao: "Quando um atacante que você possa ver atinge você com um ataque, você pode usar sua reação para reduzir o dano desse ataque pela metade contra você.",
    },
    {
      id: "ladino_evasao",
      nome: "Evasão",
      origem: "classe",
      subOrigem: "Ladino",
      nivel: 7,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Sua agilidade instintiva permite que você se esquive de certos perigos de área (como o sopro de um dragão). Se passar em um teste de resistência de Destreza para sofrer metade do dano, você não sofre dano algum; se falhar, sofre apenas metade do dano.",
    },
  ],

  mago: [
    {
      id: "mago_conjuracao",
      nome: "Conjuração Arcana & Grimório",
      origem: "classe",
      subOrigem: "Mago",
      nivel: 1,
      tipoAcao: "1 Ação",
      recarga: "Ilimitado",
      descricao: "Como um estudante de magia arcana, você possui um grimório contendo magias. Inteligência é o seu atributo de conjuração (CD = 8 + prof + mod Inteligência).",
    },
    {
      id: "mago_recuperacao_arcana",
      nome: "Recuperação Arcana",
      origem: "classe",
      subOrigem: "Mago",
      nivel: 1,
      tipoAcao: "Especial",
      recarga: "Descanso Longo",
      temUsos: true,
      usosMax: 1,
      descricao: "Você aprendeu a recuperar parte de sua energia mágica através do estudo do seu grimório. Uma vez por dia, quando terminar um descanso curto, você pode escolher espaços de magia gastos para recuperar, cujo total de círculos combinados seja igual ou menor que metade do seu nível de mago (arredondado para cima, máx 5º círculo).",
    },
    {
      id: "mago_tradicao_arcana",
      nome: "Tradição Arcana (Subclasse)",
      origem: "classe",
      subOrigem: "Mago",
      nivel: 2,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Escolha uma tradição arcana que molda sua escola de magia: Evocação, Abjuração, Necromancia, Ilusão, Adivinhação, Encantamento, Transmutação ou Conjuração.",
    },
    {
      id: "mago_maestria_magias",
      nome: "Maestria em Magias",
      origem: "classe",
      subOrigem: "Mago",
      nivel: 18,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você alcançou tamanha maestria sobre certas magias que você pode conjurá-las à vontade. Escolha uma magia de 1º círculo e uma de 2º círculo do seu grimório. Você pode conjurar essas magias no seu menor círculo sem gastar espaços de magia.",
    },
  ],

  monge: [
    {
      id: "monge_defesa_sem_armadura",
      nome: "Defesa sem Armadura",
      origem: "classe",
      subOrigem: "Monge",
      nivel: 1,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Enquanto você não estiver usando nenhuma armadura e nem empunhando um escudo, sua CA é igual a 10 + mod Destreza + mod Sabedoria.",
    },
    {
      id: "monge_artes_marciais",
      nome: "Artes Marciais",
      origem: "classe",
      subOrigem: "Monge",
      nivel: 1,
      tipoAcao: "Ação Bônus",
      recarga: "Ilimitado",
      descricao: "Você pode usar Destreza em vez de Força para ataques desarmados e armas de monge; pode rolar 1d4 (aumenta com o nível) no dano desarmado; e quando usa a ação de Ataque com armas de monge ou desarmado, pode fazer um ataque desarmado adicional como ação bônus.",
    },
    {
      id: "monge_ki",
      nome: "Pontos de Ki",
      origem: "classe",
      subOrigem: "Monge",
      nivel: 2,
      tipoAcao: "Especial",
      recarga: "Descanso Curto ou Longo",
      temUsos: true,
      usosFormula: (lvl) => Math.max(0, lvl),
      descricao: "Você aprende a manipular a energia Ki (pontos iguais ao seu nível). Você pode gastar pontos de Ki para: Rajada de Golpes (1 Ki: 2 ataques desarmados como ação bônus), Defesa Paciente (1 Ki: Esquivar como ação bônus) e Passo do Vento (1 Ki: Desengajar ou Disparar como ação bônus).",
    },
    {
      id: "monge_movimento_sem_armadura",
      nome: "Movimento sem Armadura",
      origem: "classe",
      subOrigem: "Monge",
      nivel: 2,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Seu deslocamento aumenta em 3 metros enquanto você não estiver usando armadura ou empunhando um escudo (aumenta progressivamente até +9m no 18º nível).",
    },
    {
      id: "monge_tradicao_monastica",
      nome: "Tradição Monástica (Subclasse)",
      origem: "classe",
      subOrigem: "Monge",
      nivel: 3,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você se dedica a uma tradição monástica: Caminho da Mão Aberta, Caminho das Sombras ou Caminho dos Quatro Elementos.",
    },
    {
      id: "monge_desviar_projeteis",
      nome: "Desviar Projéteis",
      origem: "classe",
      subOrigem: "Monge",
      nivel: 3,
      tipoAcao: "Reação",
      recarga: "Ilimitado",
      descricao: "Você pode usar sua reação para defletir ou apanhar o projétil quando for atingido por um ataque com arma à distância. O dano é reduzido em 1d10 + mod Des + seu nível de monge.",
    },
    {
      id: "monge_queda_lenta",
      nome: "Queda Lenta",
      origem: "classe",
      subOrigem: "Monge",
      nivel: 4,
      tipoAcao: "Reação",
      recarga: "Ilimitado",
      descricao: "Você pode usar sua reação quando cair para reduzir qualquer dano de queda que você sofra em um valor igual a 5 vezes seu nível de monge.",
    },
    {
      id: "monge_ataque_atordoante",
      nome: "Ataque Atordoante",
      origem: "classe",
      subOrigem: "Monge",
      nivel: 5,
      tipoAcao: "Especial",
      recarga: "Ilimitado",
      descricao: "Você pode interferir com o fluxo de Ki no corpo de um oponente. Ao atingir uma criatura com um ataque desarmado ou arma de monge, você pode gastar 1 ponto de Ki. O alvo deve passar em uma salvaguarda de Con ou ficar atordoado até o final do seu próximo turno.",
    },
  ],

  paladino: [
    {
      id: "paladino_sentido_divino",
      nome: "Sentido Divino",
      origem: "classe",
      subOrigem: "Paladino",
      nivel: 1,
      tipoAcao: "1 Ação",
      recarga: "Descanso Longo",
      temUsos: true,
      usosFormula: (lvl, mods) => 1 + Math.max(0, Number(mods?.Carisma || 0)),
      descricao: "A presença de um mal poderoso registra-se em seus sentidos como um odor nocivo. Com uma ação, até o final do seu próximo turno, você sabe a localização de qualquer celestial, corruptor ou morto-vivo a até 18m que não esteja sob cobertura total.",
    },
    {
      id: "paladino_cura_maos",
      nome: "Cura pelas Mãos (Lay on Hands)",
      origem: "classe",
      subOrigem: "Paladino",
      nivel: 1,
      tipoAcao: "1 Ação",
      recarga: "Descanso Longo",
      temUsos: true,
      usosFormula: (lvl) => lvl * 5,
      descricao: "Seu toque abençoado pode curar ferimentos. Você possui uma reserva de poder de cura que se recupera quando você termina um descanso longo. Com essa reserva, você pode restaurar um número total de pontos de vida igual ao seu nível de paladino × 5.",
    },
    {
      id: "paladino_estilo_luta",
      nome: "Estilo de Luta",
      origem: "classe",
      subOrigem: "Paladino",
      nivel: 2,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você adota um estilo particular de combate: Defesa, Duelo, Luta com Armas Grandes ou Proteção.",
    },
    {
      id: "paladino_destruicao_divina",
      nome: "Destruição Divina (Divine Smite)",
      origem: "classe",
      subOrigem: "Paladino",
      nivel: 2,
      tipoAcao: "Especial",
      recarga: "Ilimitado",
      descricao: "Ao atingir uma criatura com um ataque corpo a corpo com arma, você pode gastar um espaço de magia de paladino para causar dano radiante extra ao alvo (2d6 para 1º círculo + 1d8 para cada círculo acima, máx 5d8; +1d8 extra contra mortos-vivos ou corruptores).",
    },
    {
      id: "paladino_saude_divina",
      nome: "Saúde Divina",
      origem: "classe",
      subOrigem: "Paladino",
      nivel: 3,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "A magia divina fluindo através de você concede imunidade total a doenças.",
    },
    {
      id: "paladino_juramento_sagrado",
      nome: "Juramento Sagrado (Subclasse)",
      origem: "classe",
      subOrigem: "Paladino",
      nivel: 3,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você faz um juramento que o vincula como um paladino para sempre: Juramento de Devoção, Juramento dos Anciões ou Juramento de Vingança.",
    },
    {
      id: "paladino_aura_protecao",
      nome: "Aura de Proteção",
      origem: "classe",
      subOrigem: "Paladino",
      nivel: 6,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Sempre que você ou uma criatura amistosa a até 3m de você realizar um teste de resistência, a criatura ganha um bônus no teste igual ao seu modificador de Carisma (mínimo de +1). No 18º nível, o alcance aumenta para 9m.",
    },
  ],

  patrulheiro: [
    {
      id: "patrulheiro_inimigo_favorito",
      nome: "Inimigo Favorito",
      origem: "classe",
      subOrigem: "Patrulheiro",
      nivel: 1,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você possui uma vasta experiência estudando, rastreando e caçando um tipo específico de inimigo. Você tem vantagem em testes de Sabedoria (Sobrevivência) para rastrear seus inimigos favoritos, bem como em testes de Inteligência para lembrar informações sobre eles.",
    },
    {
      id: "patrulheiro_explorador_natural",
      nome: "Explorador Natural",
      origem: "classe",
      subOrigem: "Patrulheiro",
      nivel: 1,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você é particularmente familiarizado com um tipo de ambiente natural: Terreno difícil não atrasa a viagem do seu grupo; seu grupo não pode se perder exceto por meios mágicos; você permanece alerta ao perigo mesmo engajado em outra atividade de viagem.",
    },
    {
      id: "patrulheiro_estilo_luta",
      nome: "Estilo de Luta",
      origem: "classe",
      subOrigem: "Patrulheiro",
      nivel: 2,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você adota um estilo de combate: Arquearia (+2 em ataques à distância), Defesa, Duelo ou Combate com Duas Armas.",
    },
    {
      id: "patrulheiro_arquetipo",
      nome: "Arquétipo de Patrulheiro (Subclasse)",
      origem: "classe",
      subOrigem: "Patrulheiro",
      nivel: 3,
      tipoAcao: "Passiva",
      recarga: "Ilimitado",
      descricao: "Você escolhe um arquétipo que define suas técnicas de caça: Caçador ou Mestre das Feras.",
    },
    {
      id: "patrulheiro_consciencia_primitiva",
      nome: "Consciência Primitiva",
      origem: "classe",
      subOrigem: "Patrulheiro",
      nivel: 3,
      tipoAcao: "1 Ação",
      recarga: "Ilimitado",
      descricao: "Você pode gastar um espaço de magia de patrulheiro para focar sua consciência na região ao seu redor. Por 1 minuto por círculo de magia gasto, você sente se há aberrações, celestiais, dragões, elementais, fadas, corruptores ou mortos-vivos a até 1,5 km.",
    },
  ],
};

// -------------------------------------------------------------------------------------------------
// FUNÇÕES UTILITÁRIAS DE NORMALIZAÇÃO E EXTRAÇÃO
// -------------------------------------------------------------------------------------------------

export function normalizeKey(str) {
  return String(str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

/**
 * Retorna estilo de cor para o tipo de ação
 */
export function getActionTypeStyle(tipoAcao) {
  const norm = String(tipoAcao || "").toLowerCase().trim();
  if (norm.includes("bônus") || norm.includes("bonus")) return ACTION_TYPES.ACAO_BONUS;
  if (norm.includes("reação") || norm.includes("reacao")) return ACTION_TYPES.REACAO;
  if (norm.includes("1 ação") || norm.includes("acao") || norm === "ação" || norm === "acao") return ACTION_TYPES.ACAO;
  if (norm.includes("especial")) return ACTION_TYPES.ESPECIAL;
  return ACTION_TYPES.PASSIVA;
}

/**
 * Obtém todos os traços raciais estruturados para uma dada raça e sub-raça
 */
export function getRacialTraitsForRace(racaNome, subRacaNome = "", fallbackTraits = []) {
  const normRaca = normalizeKey(racaNome);
  let traits = [];

  // Busca na base oficial
  Object.entries(DND5E_RACIAL_TRAITS).forEach(([key, list]) => {
    if (normRaca.includes(normalizeKey(key)) || normalizeKey(key).includes(normRaca)) {
      traits.push(...list);
    }
  });

  // Se a raça tiver sub-raça específica, filtra ou mantém traços aplicáveis
  if (subRacaNome && traits.length > 0) {
    const normSub = normalizeKey(subRacaNome);
    traits = traits.filter((t) => {
      if (!t.subOrigem) return true;
      const tSubNorm = normalizeKey(t.subOrigem);
      if (tSubNorm === normalizeKey(racaNome)) return true;
      return tSubNorm.includes(normSub) || normSub.includes(tSubNorm);
    });
  }

  // Se não encontrou na base oficial, converte os fallbackTraits (strings do banco)
  if (traits.length === 0 && Array.isArray(fallbackTraits) && fallbackTraits.length > 0) {
    traits = fallbackTraits
      .map((item, idx) => {
        if (!item) return null;
        if (typeof item === "object" && item.nome) return item;
        const str = String(item).trim();
        const parts = str.split(":");
        const nome = parts[0]?.trim() || `Traço Racial ${idx + 1}`;
        const descricao = parts.slice(1).join(":")?.trim() || str;
        return {
          id: `raca_fallback_${idx}_${normalizeKey(nome)}`,
          nome,
          origem: "raca",
          subOrigem: subRacaNome || racaNome || "Raça",
          nivel: 0,
          tipoAcao: "Passiva",
          recarga: "Ilimitado",
          descricao,
        };
      })
      .filter(Boolean);
  }

  return traits;
}

/**
 * Obtém todos os recursos de classe estruturados até o nível especificado
 */
export function getClassFeaturesForClass(classeNome, currentLevel = 1, fallbackFeatures = [], abilityMods = {}) {
  const normClasse = normalizeKey(classeNome);
  const lvl = Math.max(1, Number(currentLevel || 1));
  let officialList = [];

  Object.entries(DND5E_CLASS_FEATURES).forEach(([key, list]) => {
    if (normClasse.includes(normalizeKey(key)) || normalizeKey(key).includes(normClasse)) {
      officialList.push(...list);
    }
  });

  // Mapeia e calcula usos dinâmicos (como Fúria por nível, Inspiração por Carisma, etc.)
  let structured = officialList.map((feat) => {
    let maxUses = feat.usosMax;
    if (feat.usosFormula) {
      maxUses = feat.usosFormula(lvl, abilityMods);
    }
    return {
      ...feat,
      usosMax: maxUses,
      desbloqueado: Number(feat.nivel || 1) <= lvl,
    };
  });

  // Se a lista oficial estiver vazia ou se houver fallbacks adicionais
  if (structured.length === 0 && Array.isArray(fallbackFeatures) && fallbackFeatures.length > 0) {
    structured = fallbackFeatures
      .map((f, idx) => {
        if (!f) return null;
        const nome = f.name || f.nome || String(f);
        const featLvl = Number(f.level || f.nivel || 1);
        return {
          id: f.id || `class_fallback_${idx}_${normalizeKey(nome)}`,
          nome,
          origem: "classe",
          subOrigem: classeNome || "Classe",
          nivel: featLvl,
          tipoAcao: f.tipoAcao || "Passiva",
          recarga: f.recarga || "Ilimitado",
          descricao: f.description || f.descricao || `Habilidade de classe desbloqueada no nível ${featLvl}.`,
          desbloqueado: featLvl <= lvl,
        };
      })
      .filter(Boolean);
  }

  return structured;
}
