export const antecedenteAcólito = {
  nome: "Acólito",
  tracoPersonalidade: [
    "Eu idolatro um herói particular da minha fé, e constantemente me refiro a seus feitos e exemplos.",
    "Eu consigo encontrar semelhanças mesmo entre os inimigos mais violentos, com empatia e sempre trabalhando pela paz.",
    "Eu vejo presságios em cada evento e ação. Os deuses estão falando conosco, nós apenas temos de ouvi-los.",
    "Nada pode abalar minha atitude otimista.",
    "Eu cito (corretamente ou não) textos sagrados e provérbios em quase qualquer situação.",
    "Eu sou tolerante (ou intolerante) a qualquer outra fé, e respeito (ou condeno) a adoração a outros deuses.",
    "Eu aprecio comida requintada, bebidas e a elite entre o alto escalão de meu templo. Uma vida dura me irrita.",
    "Eu passei tanto tempo no templo que possuo pouca prática em lidar com as pessoas mundo a fora.",
  ],
  ideal: [
    "Tradição. As tradições ancestrais de adoração e sacrifício devem ser preservadas e perpetradas. (Leal)",
    "Caridade. Eu sempre tento ajudar aqueles em necessidade, não importando o custo pessoal. (Bom)",
    "Mudança. Nós devemos ajudar a conduzir as mudanças que os deuses estão constantemente trabalhando para o mundo. (Caótico)",
    "Poder. Eu espero que um dia eu consiga chegar ao topo na hierarquia da minha religião. (Leal)",
    "Fé. Eu acredito que minha divindade guia minhas ações. Eu tenho fé que, se eu trabalhar duro, coisas boas acontecerão. (Leal)",
    "Aspiração. Eu busco ser digno da graça do meu deus ao corresponder minhas ações aos seus ensinamentos. (Qualquer)",
  ],
  vinculo: [
    "Eu morreria para recuperar uma relíquia ancestral de minha fé, perdida há muito tempo.",
    "Eu ainda terei minha vingança contra o templo corrupto que me acusou de heresia.",
    "Eu devo minha vida ao sacerdote que me acolheu quando meus pais morreram.",
    "Tudo o que faço, faço pelo povo.",
    "Eu farei qualquer coisa para proteger o templo que sirvo.",
    "Eu busco guardar um texto sagrado que meus inimigos dizem ser herético e tentam destruí-lo.",
  ],
  defeito: [
    "Eu julgo os outros severamente, e a mim mesmo mais ainda.",
    "Eu deposito muita confiança naqueles que detêm o poder na hierarquia de meu templo.",
    "Minha devoção é muitas vezes me cega perante aqueles que professam a fé do meu deus.",
    "Meu pensamento é inflexível.",
    "Eu suspeito de estranhos e sempre espero o pior deles.",
    "Depois de escolher um objetivo, eu fico obcecado em cumpri-lo, até mesmo em detrimento de qualquer outra coisa em minha vida.",
  ],
  proficienciaPericia: ["Intuição", "Religião"],
  equipamento:
    "Um símbolo sagrado (um presente dado quando você entrou no templo), um livro de preces ou uma conta de orações, 5 varetas de incenso, vestimentas, um conjunto de roupas comuns e uma algibeira contendo 15 po",
  CaracteristicaDoAntecedente: {
    LabelCaracteristicaTexto1: "Abrigo Dos Fiéis",
    CaracteristicaTexto1:
      "Como um acólito, você é respeitado por aqueles que compartilham sua fé, pode realizar cerimônias religiosas e receber cura e caridade de locais de culto. Pessoas da mesma religião podem apoiar seu estilo de vida modesto. Você pode até ter vínculos com um templo específico e pedir ajuda quando estiver por perto, desde que não seja perigoso e mantenha boas relações com o templo.",
    caracteristicasSugeridas:
      "Acólitos são moldados pela sua experiência em templos ou comunidades religiosas. Seu estudo da história e dogmas de sua fé, e sua relação com os templos, santuários ou hierarquias afetam seus maneirismos e ideais. Seus defeitos podem ser uma hipocrisia oculta ou ideias hereges, ou um ideal ou vínculo visto como fanatismo.",
    CaracteristicaSelect1: [""],
  },
};

const antecedenteArtesaoGuilda = {
  nome: "Artesão de Guilda",
  proficienciaPericia: ["Intuição", "Persuasão"],
  proficienciaFerramentasAntecedente: ["Um tipo de ferramenta de artesão"],
  equipamento:
    "Um conjunto de ferramentas de artesão (à sua escolha), uma carta de apresentação da sua guilda, um conjunto de roupas de viajante e uma algibeira com 15 po",
  CaracteristicaDoAntecedente: {
    LabelCaracteristicaSelect1: "Negocios Da Guilda",
    CaracteristicaSelect1: [
      "Alquimistas e boticários",
      "Armeiros, chaveiros e ferreiros finos",
      "Cervejeiros, destiladores e viticultores",
      "Calígrafos, escribas e escrivães",
      "Carpinteiros, construtores de telhado e estucadores",
      "Cartógrafos, agrimensores e desenhistas",
      "Remendões e sapateiros",
      "Cozinheiros e padeiros",
      "Vidraceiros e escultores",
      "Joalheiros e lapidários",
      "Coureiros, peleiros e curtidores",
      "Pedreiros e marceneiros",
      "Pintores, iluminadores e construtores de placas",
      "Oleiros e telheiros",
      "Armadores e veleiros",
      "Ferreiros e forjadores",
      "Funileiros, latoeiros e galheteiros",
      "Fabricantes de carroças e fabricantes de rodas",
      "Tecelões e tintureiros",
      "Entalhadores, tanoeiros e construtores de arcos",
    ],
    LabelCaracteristicaSelect2: "Caracteristicas Da Guilda",
    CaracteristicaSelect2: [
      "Como membro cativo e respeitado da guilda, você pode contar com certos benefícios que a sociedade garante.",
      "Seus camaradas, membros da guilda, irão provê-lo com hospedagem e comida, se necessário, e pagarão pelo seu funeral se preciso for.",
      "Em algumas cidades e vilas, um salão da guilda oferece um local central para conhecer outros membros de profissão, podendo ser um bom lugar para se conhecer patrões, aliados e empregados em potencial.",
      "Guildas, muitas vezes, detêm tremendos poderes políticos. Se você for acusado de um crime, sua guilda irá ampará-lo se uma boa defesa puder ser apresentada para provar sua inocência ou se o crime for justificável.",
      "Você pode, também, ter acesso a figuras políticas poderosas através da guilda, se você for um membro bem posicionado. Tais conexões devem exigir doações de dinheiro ou itens mágicos para os cofres da guilda.",
      "Você deve pagar cotas de 5 po por mês à guilda. Se você não pagar, você irá contrair uma dívida para permanecer nas boas graças da guilda.",
    ],
    caracteristicasSugeridas:
      "Artesões de guilda estão dentre as pessoas mais comuns do mundo – até que eles largam suas ferramentas e fazem uma carreira como aventureiros. Eles compreendem o valor do trabalho duro e a importância da comunidade, mas eles são vulneráveis aos pegados da ganância e cobiça.",
  },
  tracoPersonalidade: [
    "Eu acredito que tudo que valha a pena fazer, vale a pena ser feito direito. Eu não posso evitar – Eu sou perfeccionista.",
    "Eu sou um esnobe que olha de cima a baixo aqueles que não sabem apreciar artes requintadas.",
    "Eu sempre quero aprender como as coisas funcionam e o que deixa as pessoas motivadas.",
    "Eu sou cheio de aforismos espirituosos e tenho um provérbio para cada ocasião.",
    "Eu sou grosso com as pessoas que não têm o mesmo comprometimento que eu com o trabalho duro e honesto.",
    "Eu gosto de falar longamente sobre minha profissão.",
    "Eu não gasto meu dinheiro facilmente e vou barganhar incansavelmente para conseguir o melhor acordo possível.",
    "Eu sou bem conhecido pelo meu trabalho e quero ter certeza que todos o apreciam. Eu sempre fico surpreso quando conheço pessoas que não ouviram falar de mim.",
  ],
  ideal: [
    "Comunidade. É dever de todo cidadão civilizado fortalecer os elos da comunidade e a segurança da civilização. (Leal)",
    "Generosidade. Meus talentos me foram dados para que eu pudesse usá-los para beneficiar o mundo. (Bom)",
    "Liberdade. Todos deveriam ser livres para perseguir seus próprios meios de vida. (Caótico)",
    "Ganância. Eu só estou aqui pelo dinheiro. (Mau)",
    "Povo. Eu sou comprometido com o povo com quem me importo, não com ideias. (Neutro)",
    "Aspiração. Eu trabalho duro para ser o melhor no meu ofício. (Qualquer)",
  ],
  vinculo: [
    "A oficina onde aprendi meu negócio é o local mais importante do mundo para mim.",
    "Eu criei um trabalho incrível para alguém, mas descobri que ele não era merecedor de recebê-lo. Ainda estou à procura de alguém que seja merecedor.",
    "Eu tenho uma grande dívida para com minha guilda por fazer de mim a pessoa que sou hoje.",
    "Eu busco riqueza para conseguir o amor de alguém.",
    "Um dia eu voltarei para a minha guilda e provarei que sou o maior artesão dentre eles.",
    "Eu irei me vingar das forças malignas que destruíram meu local de negócios e arruinaram meu estilo de vida.",
  ],
  defeito: [
    "Eu farei de tudo para pôr minhas mãos em algo raro ou inestimável.",
    "Eu rapidamente presumo que alguém está tentando me trapacear.",
    "Ninguém nunca poderá saber que eu, certa vez, roubei dinheiro dos cofres da guilda.",
    "Eu nunca estou satisfeito com o que tenho – eu sempre quero mais.",
    "Eu mataria para adquirir um título de nobreza.",
    "Eu sou terrivelmente invejoso com qualquer um que possa ofuscar meu ofício. Todo lugar que eu vou, estou cercado de rivais.",
  ],
};

const antecedenteArtista = {
  nome: "Artista",
  proficienciaPericia: ["Acrobacia", "Atuação"],
  proficienciaFerramentasAntecedente: [
    "Kit de disfarce",
    "Um tipo de instrumento musical",
  ],
  equipamento:
    "Um instrumento musical (à sua escolha), um presente de um admirador (carta de amor, mecha de cabelo ou uma bijuteria), um traje e uma algibeira contendo 15 po",
  CaracteristicaDoAntecedente: {
    LabelCaracteristicaSelect1: "Rotina Do Artista",
    CaracteristicaSelect1: ["Acrobata", "Ator", "Cantor", "Dançarino", "Poeta"],
    LabelCaracteristicaTexto1: "Demanda Popular",
    CaracteristicaTexto1:
      "Você sempre encontra um lugar para atuar, geralmente em tavernas ou estalagens, mas, possivelmente em circos, teatros ou até em cortes nobres. Em tais lugares, você recebe alojamento e comida modesta ou de patrões confortáveis, de graça (dependendo da qualidade do estabelecimento), contanto que você atue a cada noite. Além disso, sua atuação torna você um tipo de figura local. Quando estranhos reconhecem você em uma cidade em que você já tenha atuado, eles geralmente gostam de você.",
    caracteristicasSugeridas: [
      "Artistas bem sucedidos têm que ser capazes de capturar e prender a atenção da plateia, por isso, eles tendem a ter personalidades extravagantes ou conturbadas. Eles são propensos ao romantismo e, muitas vezes, se agarram a nobres ideais sobre a prática da arte e apreciação da beleza.",
    ],
  },
  tracoPersonalidade: [
    "Eu conheço uma história relevante de praticamente todas as situações.",
    "Sempre que eu chego em um lugar novo, eu coleto os rumores locais e espalho fofocas.",
    "Eu sou um romântico incorrigível, sempre em busca daquele 'alguém especial.'",
    "Ninguém fica com raiva de mim ou perto de mim por muito tempo, já que eu posso acabar com qualquer tipo de tensão.",
    "Eu amo um bom insulto, até os direcionados a mim.",
    "Eu gosto de ver os sorrisos nos rostos das pessoas quando eu atuo. Isso é tudo que importa.",
    "A arte deve refletir a alma; ela deve vir de dentro e revelar quem realmente somos.",
    "Eu viro um idiota quando vejo um rosto bonito.",
  ],
  ideal: [
    "Beleza. Quando eu atuo, eu torno o mundo um lugar melhor. (Bom)",
    "Tradição. As histórias, lendas e canções do passado nunca devem ser esquecidas, pois elas nos ensinam quem nós somos. (Leal)",
    "Criatividade. O mundo precisa de novas ideias e ações ousadas. (Caótico)",
    "Ganância. Eu só estou aqui pelo dinheiro e pela fama. (Mau)",
    "Povo. Eu gosto de ver os sorrisos nos rostos das pessoas quando eu atuo. Isso é tudo que importa. (Neutro)",
    "A arte deve refletir a alma; ela deve vir de dentro e revelar quem realmente somos. (Qualquer)",
  ],
  vinculo: [
    "Meu instrumento é meu bem mais valioso e ele me lembra de alguém que eu amo.",
    "Alguém roubou meu precioso instrumento e, algum dia, eu vou pegá-lo de volta.",
    "Eu quero ser famoso, custe o que custar.",
    "Eu idolatro um herói dos contos antigos e mensuro meus feitos baseados nessa personalidade.",
    "Eu faria qualquer coisa pelos membros da minha antiga trupe.",
    "Eu conheci um amor verdadeiro durante uma de minhas atuações, e esse amor me motiva a ser melhor.",
  ],
  defeito: [
    "Eu farei de tudo para ganhar fama e renome.",
    "Eu viro um idiota quando vejo um rosto bonito.",
    "Um escândalo me impede de voltar para casa novamente. Esse tipo de problema parece me perseguir por aí.",
    "Eu, certa vez, satirizei um nobre que ainda quer minha cabeça. Foi um erro que eu adoraria repetir.",
    "Eu tenho problemas em esconder meus verdadeiros sentimentos. Minha língua afiada me mete em confusão.",
    "Apesar dos meus melhores esforços, meus amigos não me consideram confiável.",
  ],
};

const antecedenteCharlatao = {
  nome: "Charlatão",
  proficienciaPericia: ["Enganação", "Prestidigitação"],
  proficienciaFerramentasAntecedente: [
    "Kit de disfarce",
    "Kit de falsificação",
  ],
  equipamento:
    "Um conjunto de roupas finas, um kit de disfarce, ferramentas de trapaça à sua escolha (dez garrafas tampadas preenchidas com líquidos coloridos, um conjunto de dados viciados, um baralho de cartas marcadas ou um anel de sinete de um duque imaginário), e uma algibeira contendo 15po",

  CaracteristicaDoAntecedente: {
    LabelCaracteristicaSelect1: "Esquemas Prediletos",
    CaracteristicaSelect1: [
      "Eu trapaceio em jogos de azar.",
      "Eu falsifico moedas ou forjo documentos.",
      "Eu me infiltro na vida das pessoas para descobrir suas fraquezas e ficar com suas fortunas.",
      "Eu troco de identidade como troco de roupa.",
      "Eu faço furtos rápidos nas esquinas das ruas.",
      "Eu convenço as pessoas que tranqueiras inúteis valem seu suado dinheiro.",
    ],
    caracteristicasSugeridas:
      "Charlatães são personagens de múltiplas facetas que ocultam seu verdadeiro eu atrás de máscaras que eles constroem. Eles refletem o que as pessoas querem ver, o que elas querem acreditar e como elas veem o mundo. Mas seu verdadeiro eu, às vezes é atormentado por uma consciência inquieta, um velho inimigo ou problemas de confiança profundos.",
    LabelCaracteristicaTexto1: "Identidade Falsa",
    CaracteristicaTexto1:
      "Você criou uma segunda identidade que inclui documentos, conhecidos estabelecidos e disfarces que possibilitam que você assuma essa persona. Além disso, você pode forjar documentos, incluindo papeis oficiais e cartas pessoais, contanto que você tenha visto um exemplo desse tipo de documento ou a caligrafia de quem você está tentando copiar.",
  },

  tracoPersonalidade: [
    "Eu me apaixono e desapaixono facilmente, e estou sempre em busca de alguém.",
    "Eu tenho uma piada para cada ocasião, especialmente ocasiões em que o humor é inapropriado.",
    "Bajulação é meu truque predileto para conseguir o que eu quero.",
    "Eu sou um jogador nato que não consegue resistir a se arriscar por uma possível recompensa.",
    "Eu minto sobre quase tudo, mesmo quando não existe qualquer boa razão.",
    "Sarcasmo e insultos são minhas armas prediletas.",
    "Eu tenho vários símbolos sagrados comigo, e invoco a divindade que seja mais útil em cada dado momento.",
    "Eu furto qualquer coisa que eu vejo que possa ter algum valor.",
  ],
  ideal: [
    "Independência. Sou um espírito livre – ninguém me diz o que fazer. (Caótico)",
    "Justiça. Eu nunca roubo de pessoas que não podem perder algumas moedas. (Leal)",
    "Caridade. Eu distribuo o dinheiro que adquiro com as pessoas que realmente precisam. (Bom)",
    "Criatividade. Eu nunca faço a mesma trapaça duas vezes. (Caótico)",
    "Amizade. Bens materiais vêm e vão. Os laços de amizade duram para sempre. (Bom)",
    "Aspiração. Eu estou determinado a fazer algo por mim mesmo. (Qualquer)",
  ],
  vinculo: [
    "Eu extorqui a pessoa errada e devo trabalhar para que esse indivíduo nunca mais cruze meu caminho ou o das pessoas com quem me importo.",
    "Eu devo tudo ao meu mentor – uma pessoa terrível que, provavelmente, está apodrecendo na cadeia em algum lugar.",
    "Em algum lugar por aí, eu tenho um filho que não me conhece. Eu estou tornando o mundo melhor para ele.",
    "Eu vim de uma família nobre e, um dia, irei reivindicar minhas terras e título daqueles que o roubaram de mim.",
    "Uma pessoa poderosa matou alguém que eu amava. Algum dia, em breve, terei minha vingança.",
    "Eu enganei e arruinei a vida de uma pessoa que não merecia. Eu busco reparar meus erros, mas talvez nunca seja capaz de me perdoar.",
  ],
  defeito: [
    "Não resisto um rostinho bonito.",
    "Estou sempre com dívidas. Eu gasto meus lucros ilícitos com luxúrias decadentes mais rápido do que os ganho...",
    "Estou convencido que ninguém pode me enganar da forma que eu engano os outros.",
    "Eu sou ganancioso demais para o meu próprio bem. Eu não consigo resistir a me arriscar se tiver dinheiro envolvido.",
    "Eu não resisto a enganar pessoas que são mais poderosas que eu.",
    "Eu odeio admitir e vou me odiar por isso, mas, eu vou correr e salvar minha própria pele se as coisas engrossarem.",
  ],
};
const antecedenteCriminoso = {
  nome: "Criminoso",
  proficienciaPericia: ["Enganação", "Furtividade"],
  proficienciaFerramentasAntecedente: [
    "Um tipo de kit de jogo",
    "Ferramentas de ladrão",
  ],
  equipamento:
    "Um pé de cabra, um conjunto de roupas escuras comuns com capuz e uma algibeira contendo 15 po",

  CaracteristicaDoAntecedente: {
    LabelCaracteristicaSelect1: "Especialidade Criminosa",
    CaracteristicaSelect1: [
      "Assaltante",
      "Assassino de aluguel",
      "Batedor de carteira",
      "Chantagista",
      "Contrabandista",
      "Executor",
      "Ladrão de estrada",
      "Receptador",
    ],
    LabelCaracteristicaTexto1: "Contato Criminal",
    CaracteristicaTexto1:
      "Você possui contatos de confiança que agem como seus informantes em uma rede criminosa. Você sabe como se comunicar com eles mesmo em grandes distâncias. Você conhece em especial os mensageiros locais, mestres de caravana corruptos, e marinheiros escusos que podem transmitir seus recados.",
    caracteristicasSugeridas:
      "Criminosos parecem ser vilões por fora, e muitos deles são vilões por dentro também. Mas alguns possuem características simpáticas, senão redentoras. Pode sim haver honra entre ladrões, mas criminosos raramente mostram qualquer respeito pela lei ou autoridade.",
  },

  tracoPersonalidade: [
    "Eu sempre tenho um plano para quando as coisas dão errado.",
    "Eu estou sempre calmo, não importa a situação. Eu nunca levanto minha voz ou deixo minhas emoções me controlarem.",
    "A primeira coisa que faço ao chegar a um novo local é decorar a localização de coisas valiosas – ou onde essas coisas podem estar escondidas.",
    "Eu prefiro fazer um novo amigo a um novo inimigo.",
    "Eu sou incrivelmente receoso em confiar. Aqueles que parecem mais amigáveis geralmente têm mais a esconder.",
    "Eu não presto atenção aos riscos envolvidos em uma situação, nunca me alerte sobre as probabilidades de fracasso.",
    "A melhor maneira de me levar a fazer algo é dizendo que eu não posso fazer.",
    "Eu explodo ao menor insulto.",
  ],

  ideal: [
    "Honra. Eu não roubo de irmãos de profissão. (Leal)",
    "Liberdade. Correntes foram feitas para serem partidas, assim como aqueles que as forjaram. (Caótico)",
    "Caridade. Eu roubo dos ricos para dar aos que realmente precisam. (Bom)",
    "Ganância. Eu farei qualquer coisa para me tornar rico. (Mal)",
    "Povo. Eu sou leal aos meus amigos, não a qualquer ideal, e todos sabem que posso viajar até o Estige por aqueles que me importo. (Neutro)",
    "Redenção. Há uma centelha de bondade em todo mundo. (Bom)",
  ],

  vinculo: [
    "Eu estou tentando quitar uma dívida que tenho com um generoso benfeitor.",
    "Meus ganhos, honestos ou não, são para sustentar minha família.",
    "Algo importante foi roubado de mim, e eu vou recuperá-lo.",
    "Eu me tornarei o maior ladrão que já existiu.",
    "Eu sou culpado por um terrível crime, espero algum dia poder me redimir.",
    "Alguém que amo morreu por causa de um erro que cometi. Isso nunca acontecerá novamente.",
  ],

  defeito: [
    "Quando vejo algo valioso, não consigo pensar em mais nada, além de roubá-lo.",
    "Quando confrontado com uma escolha entre dinheiro e amigo, eu bem que escolho o dinheiro.",
    "Se há um plano, eu vou esquecê-lo. Se eu não esquecê-lo, vou ignorá-lo.",
    "Eu tenho um 'tique' que revela se estou mentindo.",
    "Eu viro as costas e corro quando as coisas começam a ficar ruins.",
    "Um inocente foi preso por um crime que eu cometi. Por mim, tudo bem.",
  ],
};

const antecedenteEremita = {
  nome: "Eremita",
  proficienciaPericia: ["Medicina", "Religião"],
  proficienciaFerramentasAntecedente: ["Kit de herbalismo"],
  idiomas: ["Um à sua escolha"],
  equipamento:
    "Um estojo de pergaminho cheio de notas dos seus estudos e orações, um cobertor de inverno, um conjunto de roupas comuns, um kit de herbalismo e 5 po.",

  CaracteristicaDoAntecedente: {
    LabelCaracteristicaSelect1: "Vida de Isolamento",
    CaracteristicaSelect1: [
      "Eu estava em busca de esclarecimento espiritual.",
      "Eu estava participando da vida comunal de acordo com os ditames de uma ordem religiosa.",
      "Eu fui exilado por um crime que não cometi.",
      "Eu me afastei da sociedade após um evento que mudou minha vida.",
      "Eu precisava de um lugar tranquilo para trabalhar minha arte, literatura, música ou manifesto.",
      "Eu precisava comungar com a natureza, longe da civilização.",
      "Eu era o guardião de uma ruína ou relíquia antiga.",
      "Eu era um peregrino em busca de uma pessoa, lugar ou relíquia de grande significância espiritual.",
    ],
    caracteristicasSugeridas:
      "Eremitas são indivíduos que buscam conhecimento e clareza através do isolamento. Eles podem ter estudado filosofia, religião ou ciências naturais durante seu tempo de reclusão. O isolamento pode tê-los afastado da sociedade, mas também pode ter proporcionado uma profunda compreensão da natureza humana.",
    LabelCaracteristicaTexto1: "Descoberta Pessoal",
    CaracteristicaTexto1:
      "Você obteve uma compreensão profunda sobre um aspecto particular do mundo ou de si mesmo durante seu isolamento. Isso pode ser uma revelação espiritual, uma nova habilidade ou um entendimento profundo sobre a natureza humana.",
  },

  tracoPersonalidade: [
    "Eu me sinto mais confortável na solidão do que em multidões.",
    "Minha mente está sempre buscando respostas para perguntas profundas.",
    "Eu prefiro passar meu tempo meditando e refletindo.",
    "Eu sou reservado e falo pouco.",
    "Tenho uma paciência infinita e não me apresso em nada.",
    "Eu procuro harmonia interior e busco evitar conflitos.",
    "Acredito que o conhecimento é a chave para a verdadeira iluminação.",
    "Eu tenho um grande respeito pela natureza e busco viver em harmonia com ela.",
  ],

  ideal: [
    "Iluminação. Busco a verdadeira compreensão e iluminação espiritual. (Neutro)",
    "Renovação. Acredito no ciclo de renovação e transformação. (Caótico)",
    "Sabedoria. O conhecimento é o caminho para melhorar a si mesmo e a sociedade. (Bom)",
    "Solidão. A solidão e a reflexão são necessárias para entendermos nosso lugar no mundo. (Neutro)",
    "Disciplina. A disciplina mental e física é a chave para aprimorar nossa existência. (Leal)",
    "Harmonia. Busco viver em harmonia comigo mesmo e com o mundo ao meu redor. (Neutro)",
  ],

  vinculo: [
    "Eu encontrei um grande mentor durante meu período de reclusão e sigo seus ensinamentos.",
    "Estou em busca de uma relíquia antiga que acredito possuir grandes segredos.",
    "Minha reclusão foi causada por uma tragédia e busco superá-la com sabedoria.",
    "Tenho uma ligação especial com uma criatura ou entidade que encontrei durante meu isolamento.",
    "Busco espalhar os ensinamentos que adquiri durante minha reclusão para beneficiar a sociedade.",
    "Ainda mantenho contato com minha comunidade de eremitas e procuro apoiá-los da melhor maneira possível.",
  ],

  defeito: [
    "Fico desconfortável em ambientes sociais e prefiro a solidão.",
    "Tenho dificuldade em confiar nas intenções dos outros.",
    "Às vezes, me perco em meus pensamentos e me desconecto do mundo ao meu redor.",
    "Tenho uma visão idealizada da vida e do mundo, que pode me levar à decepção.",
    "Tenho dificuldade em lidar com o caos e a imprevisibilidade da vida cotidiana.",
    "Fico obcecado com ideias ou conceitos e tenho dificuldade em deixá-los de lado.",
  ],
};

const antecedenteForasteiro = {
  nome: "Forasteiro",
  proficienciaPericia: ["Atletismo", "Sobrevivência"],
  proficienciaFerramentasAntecedente: ["Um tipo de instrumento musical"],
  idiomas: ["Um à sua escolha"],
  equipamento:
    "Um bordão, uma armadilha de caça, um fetiche de um animal que você matou, um conjunto de roupas de viajante e uma algibeira contendo 10 po",

  CaracteristicaDoAntecedente: {
    LabelCaracteristicaSelect1: "Origem",
    CaracteristicaSelect1: [
      "Assentado",
      "Armadilheiro",
      "Caçador de recompensa",
      "Exilado ou pária",
      "Forrageador",
      "Guia",
      "Mateiro",
      "Nômade tribal",
      "Peregrino",
      "Saqueador tribal",
    ],

    LabelCaracteristicaTexto1: "Andarilho",
    CaracteristicaTexto1:
      "Você tem uma memória excelente para mapas e geografia, e você sempre pode recobrar o plano geral de terrenos, assentamentos ou outras características ao seu redor. Além disso, você pode encontrar comida e água fresca para você a até cinco outras pessoas a cada dia, considerando que a terra ofereça bagas, pequenas frutas, água e similares.",
  },

  tracoPersonalidade: [
    "Eu fui guiado por uma sede de viagens que me levou a abandonar meu lar.",
    "Eu cuido dos meus amigos como se eles fossem filhotes recém-nascidos.",
    "Certa vez, eu corri quarenta quilômetros sem parar para alertar meu clã da aproximação de uma horda orc. Eu faria de novo se fosse necessário.",
    "Eu tenho uma lição para cada situação, aprendida observando a natureza.",
    "Eu não vejo lugar para o povo rico e educado. Dinheiro e modos não vão salvá-lo de um urso-coruja faminto.",
    "Estou sempre pegando coisas, distraidamente brincando com elas e, às vezes, quebrando-as.",
    "Eu me sinto muito mais confortável entre animais do que entre pessoas.",
    "Eu fui, de fato, criado por lobos.",
  ],

  ideal: [
    "Mudança. A vida é como as estações, em constante mudança, e nós devemos mudar com ela. (Caótico)",
    "Bem maior. É responsabilidade de todos trazer a maior felicidade para toda a tribo. (Bom)",
    "Honra. Se eu me desonrar, eu desonrarei todo o meu clã. (Leal)",
    "Força. O mais forte deve governar. (Mau)",
    "Natureza. O mundo natural é mais importante que todas as construções da civilização. (Neutro)",
    "Glória. Eu devo adquirir glória em batalha, para mim e para meu clã. (Qualquer)",
  ],

  vinculo: [
    "Minha família, clã ou tribo é a coisa mais importante na minha vida, mesmo quando eles estão longe.",
    "Uma ofensa à natureza intocada do meu lar é uma ofensa a mim.",
    "Eu trarei uma fúria terrível aos malfeitores que destruíram minha terra natal.",
    "Eu sou o último da minha tribo e cabe a mim garantir que seus nomes façam parte das lendas.",
    "Eu sofro de visões terríveis de um desastre vindouro, e farei qualquer coisa para impedi-lo.",
    "É meu dever prover filhos para sustentar minha tribo.",
  ],

  defeito: [
    "Sou muito apaixonado por cerveja, vinho e outras bebidas.",
    "Não existe lugar para precaução em uma vida vivida ao máximo.",
    "Eu lembro de cada insulto que sofri e nutro um ressentimento silencioso contra qualquer um que já tenha me insultado.",
    "Eu tenho dificuldade em confiar em membros de outras raças, tribos ou sociedades.",
    "A violência é minha resposta para quase todos os obstáculos.",
    "Não espere que eu salve aqueles que não conseguem se virar sozinhos. É a lei da natureza que os fortes prosperem e os fracos pereçam.",
  ],
};

const antecedenteHeroiDoPovo = {
  nome: "Herói do Povo",
  proficienciaPericia: ["Adestrar Animais", "Sobrevivência"],
  proficienciaFerramentasAntecedente: [
    "Um tipo de ferramenta de artesão",
    "Veículos (terrestre)",
  ],
  equipamento:
    "Um conjunto de ferramentas de artesão (à sua escolha), uma pá, um pote de ferro, um conjunto de roupas comuns e uma algibeira contendo 10 po",

  CaracteristicaDoAntecedente: {
    LabelCaracteristicaSelect1: "Evento Definidor",
    CaracteristicaSelect1: [
      "Eu me opus contra agentes de um tirano.",
      "Eu salvei pessoas durante um desastre natural.",
      "Eu enfrentei sozinho um terrível monstro.",
      "Eu roubei de um mercador corrupto para ajudar os pobres.",
      "Eu liderei uma milícia na batalha contra um exército.",
      "Eu invadi o castelo de um tirano e roubei armas para entregar ao povo.",
      "Eu treinei os camponeses no uso de ferramentas do campo como armas para enfrentar soldados de um tirano.",
      "Um lorde rescindiu um decreto que desfavorecia o povo após eu protestar contra ele.",
      "Um ser celestial, feérico, ou similar, deu-me uma bênção ou revelou minha origem secreta.",
      "Recrutado para o exército de um lorde, eu prevaleci na liderança e fui condecorado por heroísmo.",
    ],

    LabelCaracteristicaTexto1: "Hospitalidade Rústica",
    CaracteristicaTexto1:
      "Já que você ascendeu da categoria de pessoas comuns até onde você está agora, é fácil se misturar a eles. Você pode encontrar lugar entre os camponeses para se esconder, descansar ou se recuperar, a menos que isso ofereça um risco direto a eles. Eles o esconderão da lei e de qualquer um que venha perguntando por você, desde que não tenham que arriscar suas vidas.",
  },

  tracoPersonalidade: [
    "Eu julgo as pessoas por suas ações, não por suas palavras.",
    "Se alguém está em apuros, eu estou sempre pronto para ajudar.",
    "Quando eu fixo minha mente em algo, eu sigo esse caminho, não importa o que fique no caminho.",
    "Eu possuo um forte senso de justiça e sempre tento encontrar a solução mais equilibrada para as discussões.",
    "Eu confio em minhas habilidades e farei o que for necessário para que os outros confiem também.",
    "Pensar é para os outros, eu prefiro agir.",
    "Eu abuso de palavras longas na tentativa de soar inteligente.",
    "Eu me entedio fácil. Para onde devo ir para me encontrar com meu destino?",
  ],

  ideal: [
    "Respeito. As pessoas merecem ser tratadas com dignidade e respeito. (Bom)",
    "Justiça. Ninguém merece tratamento diferenciado perante a lei, muito menos estar acima dela. (Leal)",
    "Liberdade. Não pode haver permissão para tiranos oprimirem o povo. (Caótico)",
    "Força. Se eu ficar forte, eu posso pegar tudo o que eu quiser – o que eu desejar. (Mal)",
    "Sinceridade. Não há nada de bom em fingir ser algo que não sou. (Neutro)",
    "Destino. Nada, nem ninguém, pode me manter longe do meu chamado. (Qualquer)",
  ],

  vinculo: [
    "Eu tenho família, embora não faça a mínima ideia de onde eles estão, espero encontrá-los um dia.",
    "Eu trabalho a terra, eu amo a terra e eu vou defender a terra.",
    "Um nobre orgulhoso me deu uma bela surra, e eu vou ter minha vingança em qualquer valentão que encontrar.",
    "Minhas ferramentas são símbolo de minha vida passada, eu as carregarei para nunca me esquecer de minhas origens.",
    "Eu devo proteger aqueles que não podem se defender.",
    "Gostaria que meu amor viesse comigo para seguir meu destino.",
  ],

  defeito: [
    "O tirano que comanda minha terra não vai parar até ver meu cadáver.",
    "Eu estou convencido sobre o significado do meu destino, e cego aos riscos e falhas.",
    "As pessoas que me conhecem desde criança sabem de um vergonhoso segredo meu, eu não poderei voltar para casa nunca.",
    "Eu tenho uma fraqueza pelos vícios da cidade, especialmente a bebedeira.",
    "Secretamente, eu acredito que as coisas estariam melhores se algum tirano comandasse a região.",
    "Eu tenho dificuldades em confiar em meus aliados.",
  ],
};

const antecedenteMarinheiro = {
  nome: "Marinheiro",
  proficienciaPericia: ["Atletismo", "Percepção"],
  proficienciaFerramentasAntecedente: [
    "Ferramentas de navegador",
    "Veículo (aquático)",
  ],
  equipamento:
    "Uma malagueta (clava), 15 metros de corda de seda, um amuleto da sorte como um pé de coelho ou uma pequena pedra com um furo no centro (ou você pode rolar uma bugiganga da tabela Bugigangas no capítulo 5), um conjunto de trajes comuns e uma algibeira contendo 10 po",

  CaracteristicaDoAntecedente: {
    caracteristicasSugeridas:
      "Marinheiros podem ser muito rudes, mas as responsabilidades da vida em um navio tendem a torná-los confiáveis também. A vida a bordo de um navio molda sua visão e forma suas mais importantes amizades.",

    LabelCaracteristicaTexto1: "Passagem de Navio",
    CaracteristicaTexto1:
      "Quando você precisar, você pode conseguir passagem de graça em um navio para você e seus companheiros de aventura. Você precisa viajar no navio em que você trabalhou ou em outro navio com o qual você teve boas relações (talvez um comandado por um ex-companheiro de tripulação). Por ser um favor, você não pode solicitar uma programação ou rota que atenda à todas as suas necessidades. Seu Mestre determina quanto tempo levará pra chegar aonde você quer ir. Em troca da passagem grátis, espera-se que você e seus companheiros ajudem a tripulação durante a viagem.",
  },

  tracoPersonalidade: [
    "Meus amigos sabem que podem contar comigo pro que der e vier.",
    "Eu trabalho duro para que possa me divertir muito quando o trabalho estiver pronto.",
    "Eu gosto de navegar para novos portos e fazer novas amizades acompanhado de uma jarra de cerveja.",
    "Eu modifico alguns fatos para o bem de uma boa história.",
    "Pra mim, uma briga de taverna é uma ótima forma de conhecer uma nova cidade.",
    "Eu nunca deixo passar uma aposta amigável.",
    "Meu vocabulário é tão sujo quanto o covil de um otyugh.",
    "Eu gosto de trabalhos bem feitos, especialmente se eu puder convencer alguém a fazê-los.",
  ],

  ideal: [
    "Respeito. A coisa que mantém um navio unido é o respeito mútuo entre o capitão e a tripulação. (Bem)",
    "Justiça. Todos nós fazemos o trabalho, portanto, todos partilhamos os espólios. (Leal)",
    "Liberdade. O mar é liberdade – a liberdade de ir aonde quiser. (Caótico)",
    "Domínio. Eu sou um predador e os outros navios no mar são minhas presas. (Mau)",
    "Povo. Eu sou apegado aos meus companheiros de tripulação, não a ideais. (Neutro)",
    "Aspiração. Algum dia eu serei dono do meu próprio navio e traçarei meu próprio destino. (Qualquer)",
  ],

  vinculo: [
    "Eu sou leal ao meu capitão, primeiramente, o resto vem em segundo.",
    "O navio é o mais importante – tripulantes e capitães vêm e vão.",
    "Eu sempre me lembrarei do meu primeiro navio.",
    "Em uma cidade portuária, eu tenho uma amante que quase me roubou do mar.",
    "Eu fui enganado na divisão dos espólios e eu quero o que me é devido.",
    "Cruéis piratas mataram meu capitão e companheiros de tripulação, saquearam nosso navio e me deixaram para morrer. A vingança será minha.",
  ],

  defeito: [
    "Eu sigo ordens, mesmo que eu ache que estão erradas.",
    "Eu direi qualquer coisa para evitar trabalho extra.",
    "Certa vez, alguém duvidou da minha coragem, eu nunca recuo, não importa o quão perigosa seja a situação.",
    "Quando começo a beber, é difícil pra mim parar.",
    "Eu não resisto a uma sacolinha de moedas dando sopa ou outras bugigangas que encontro.",
    "Meu orgulho provavelmente levará a minha destruição.",
  ],
};

const antecedenteNobre = {
  nome: "Nobre",
  proficienciaPericia: ["História", "Persuasão"],
  proficienciaFerramentasAntecedente: ["Um tipo de kit de jogos"],
  idiomas: ["Um à sua escolha"],
  equipamento:
    "Um conjunto de trajes finos, um anel de sinete, um pergaminho de linhagem e uma algibeira contendo 25 po",

  CaracteristicaDoAntecedente: {
    caracteristicasSugeridas:
      "Nobres nascem e são criados para uma vida muito diferente do que a maioria das pessoas, e suas personalidades refletem sua educação. Um título nobre vem com uma infinidade de vínculos – responsabilidades com a família, com outros nobres (incluindo o soberano), com o povo que confia nos cuidados da família ou mesmo com o próprio título. Mas essa responsabilidade é uma boa maneira de enfraquecer um nobre.",

    LabelCaracteristicaTexto1: "Posição Privilegiada",
    CaracteristicaTexto1:
      "Graças a sua origem nobre, as pessoas tendem a pensar o melhor de você. Você é bem-vindo na alta sociedade e as pessoas assumem que você tem o direito de estar onde está. As pessoas comuns fazem todos os esforços para acomodá-lo e evitar seu desprazer, e outros nobres o tratam como um membro da mesma classe social. Você pode conseguir uma audiência com um nobre local se precisar.",
  },

  tracoPersonalidade: [
    "Minha bajulação eloquente faz com que todos com quem eu converse se sintam a pessoa mais maravilhosa e importante do mundo.",
    "As pessoas comuns me amam por minha bondade e generosidade.",
    "Ninguém pode duvidar, olhando para o meu porte real, que estou acima das massas plebeias.",
    "Eu tenho grande cuidado de sempre estar no meu melhor e seguir as últimas modas.",
    "Eu não gosto de sujar minhas mãos, e eu não vou ser pego em acomodações inadequadas.",
    "Apesar da minha origem nobre, eu não estou acima dos outros. O sangue é um só.",
    "Meu apoio, uma vez perdido, não volta.",
    "Se você me ferir, eu irei esmagá-lo, arruinar seu nome, e salgar seus campos.",
  ],

  ideal: [
    "Respeito. O respeito a mim é devido por causa da minha posição, mas todas as pessoas, independentemente da posição merecem ser tratadas com dignidade. (Bom)",
    "Responsabilidade. É o meu dever respeitar a autoridade daqueles acima de mim, assim como aqueles abaixo de mim devem me respeitar. (Leal)",
    "Independência. Devo provar que posso me cuidar sem os mimos da minha família. (Caótico)",
    "Poder. Se eu puder alcançar mais poder, ninguém vai me dizer o que fazer. (Mau)",
    "Família. O sangue corre mais grosso que a água. (Qualquer)",
    "Obrigação Nobre. É o meu dever proteger e cuidar das pessoas abaixo de mim. (Bom)",
  ],

  vinculo: [
    "Eu vou encarar qualquer desafio para ganhar a aprovação da minha família.",
    "A aliança da minha casa com outra família nobre deve ser mantida a todo custo.",
    "Nada é mais importante do que os outros membros da minha família.",
    "Eu sou apaixonado pela herdeira de uma família que a minha família despreza.",
    "Minha lealdade ao meu soberano é inabalável.",
    "As pessoas comuns devem me ver como um herói do povo.",
  ],

  defeito: [
    "Eu secretamente acredito que todos estão abaixo de mim.",
    "Eu escondo um segredo verdadeiramente escandaloso que poderia arruinar minha família para sempre.",
    "Muitas vezes eu ouço insultos e ameaças veladas em cada palavra dirigida a mim, e me irrito muito rápido.",
    "Eu tenho um desejo insaciável por prazeres carnais.",
    "Na verdade, o mundo gira ao meu redor.",
    "Pelas minhas palavras e ações, muitas vezes, envergonho minha família.",
  ],
};

const antecedenteOrfao = {
  nome: "Órfão",
  proficienciaPericia: ["Furtividade", "Prestidigitação"],
  proficienciaFerramentasAntecedente: [
    "Kit de disfarce",
    "Ferramentas de ladrão",
  ],
  equipamento:
    "Uma faca pequena, um mapa da cidade em que você cresceu, um rato de estimação, um pequeno objeto para lembrar dos seus pais, um conjunto de roupas comuns e uma algibeira contendo 10 po",

  CaracteristicaDoAntecedente: {
    caracteristicasSugeridas:
      "Órfãos foram moldados por vidas de pobreza extrema, para o bem ou para o mal. Eles tendem a serem guiados pelo comprometimento com as pessoas com quem dividiram a vida nas ruas ou por um desejo incontrolável de encontrar uma vida melhor – e, talvez, obter algo em retorno de todas as pessoas ricas que o trataram tão mau.",

    LabelCaracteristicaTexto1: "Segredos da Cidade",
    CaracteristicaTexto1:
      "Você conhece os padrões secretos e o fluxo das cidades e pode encontrar passagens através da expansão urbana que os outros deixariam passar. Quando você não estiver em combate, você (e os companheiros que você guiar) podem viajar entre dois locais quaisquer na cidade com o dobro da velocidade normalmente permitida.",
  },

  tracoPersonalidade: [
    "Eu escondo pedaços de comida e bugigangas em meus bolsos.",
    "Eu pergunto um monte e coisas.",
    "Eu gosto de me espremer em locais pequenos onde ninguém possa me alcançar.",
    "Eu durmo encostado em um muro ou árvore, abraçado com todas as minhas posses.",
    "Eu como feito um porco e tenho maus modos.",
    "Eu acho que todos que são gentis comigo têm segundas intenções.",
    "Eu não gosto de tomar banho.",
    "Eu digo na cara o que as outras pessoas insinuam ou escondem.",
  ],

  ideal: [
    "Respeito. Todas as pessoas, ricas ou pobres, merecem respeito. (Bom)",
    "Comunidade. Nós temos que tomar conta uns dos outros, porque ninguém mais o fará. (Leal)",
    "Mudança. Os baixos se erguerão e os altos irão tombar. A mudança é a natureza das coisas. (Caótico)",
    "Retribuição. Os ricos precisam ver como a vida e morte é nas sarjetas. (Mau)",
    "Povo. Eu ajudo as pessoas que me ajudam – é isso que nos mantém vivos. (Neutro)",
    "Aspiração. Eu vou provar que sou merecedor de uma vida melhor. (Qualquer)",
  ],

  vinculo: [
    "Minha cidade ou vila é meu lar, e eu vou lutar para defendê-lo.",
    "Eu patrocino um orfanato para que outros não passem pelo que fui forçado a passar.",
    "Eu devo minha sobrevivência a outros órfãos que me ensinaram a vida nas ruas.",
    "Eu tenho uma dívida que nunca poderei pagar com uma pessoa que teve pena de mim.",
    "Eu sai da minha vida de pobreza roubando uma pessoa importante, eu sou procurado por isso.",
    "Ninguém deveria ter que suportar as dificuldades pelas quais passei.",
  ],

  defeito: [
    "Se eu estiver em desvantagem, eu vou fugir de uma briga.",
    "Ouro parece ser muito dinheiro pra mim, e eu faria praticamente qualquer coisa por mais dele.",
    "Eu nunca vou confiar em ninguém plenamente, além de mim mesmo.",
    "Eu prefiro matar alguém enquanto dorme do que numa luta justa.",
    "Não é roubo se eu preciso mais que outra pessoa.",
    "As pessoas que não podem se virar sozinhas têm o que merecem.",
  ],
};

const antecedenteSabio = {
  nome: "Sábio",
  proficienciaPericia: ["Arcanismo", "História"],
  equipamento:
    "Um vidro de tinta escura, uma pena, uma faca pequena, uma carta de um falecido colega perguntando a você algo que você nunca terá a chance de responder, um conjunto de roupas comuns e uma algibeira contendo 10 po",

  CaracteristicaDoAntecedente: {
    LabelCaracteristicaSelect1: "Especialidade",
    CaracteristicaSelect1: [
      "Acadêmico desacreditado",
      "Alquimista",
      "Aprendiz de mago",
      "Astrônomo",
      "Bibliotecário",
      "Escriba",
      "Pesquisador",
      "Professor",
    ],
    caracteristicasSugeridas:
      "Sábios são definidos por seus extensivos estudos, e suas características refletem essa vida que levaram. Devotados a perseguir o conhecimento, um sábio valoriza qualquer informação acadêmica – algumas vezes como apenas importante, outras vezes mais importantes que seus próprios ideais.",

    LabelCaracteristicaTexto1: "Pesquisador",
    CaracteristicaTexto1:
      "Quando tentar obter ou recuperar um fragmento de conhecimento que você não saiba, você descobre aonde e com quem pode obter essa informação. Normalmente ela será adquirida em bibliotecas, arquivos de escribas, universidade ou outros sábios e pessoas aptas. Seu Mestre pode decidir que o conhecimento que busca está escondido em algum lugar quase inacessível, ou é simplesmente impossível de se obter. Desvendar os segredos mais profundos do multiverso pode requerer uma campanha inteira.",
  },

  tracoPersonalidade: [
    "Eu uso palavras polissilábicas para endossar minha impressão de grande erudição.",
    "Eu já li todos os livros das grandes bibliotecas – ou gosto de me vangloriar e dizer que li.",
    "Eu costumo ajudar os outros que não são tão inteligentes quanto eu, e pacientemente explico tudo quantas vezes forem necessárias.",
    "Nada para mim é melhor que um bom mistério.",
    "Eu voluntariamente escuto cada lado, e seus argumentos, antes de tomar uma decisão final.",
    "Eu falo lentamente ao conversar com idiotas que tentam se comparar comigo.",
    "Eu sou horrível e estranho em situações sociais.",
    "Estou convencido de que todos tentam roubar os meus segredos de mim.",
  ],

  ideal: [
    "Conhecimento. O caminho para o poder e o auto aperfeiçoamento é através do conhecimento. (Neutro)",
    "Beleza. O que é belo nos mostra o que está além disso perto do que é verdadeiro. (Bom)",
    "Lógica. Emoções não devem nublar seu pensamento lógico. (Leal)",
    "Sem Limites. Nada pode apaziguar a possibilidade infinita de toda a existência. (Caótico)",
    "Poder. Conhecimento é o caminho para o poder e a dominação. (Mau)",
    "Auto Aperfeiçoamento. O objetivo de uma vida de estudos é a melhoria de si mesmo. (Qualquer)",
  ],

  vinculo: [
    "É meu dever proteger meus estudantes.",
    "Eu guardo um texto ancestral que contém terríveis segredos que não podem cair em mãos erradas.",
    "Eu trabalho para preservar uma biblioteca, universidade, arquivo de escribas ou monastério.",
    "O trabalho a da minha vida é uma série de tomos relatando um campo de conhecimento específico.",
    "Eu venho procurando a minha vida inteira pela resposta de certa questão.",
    "Eu vendi minha alma por conhecimento. Espero realizar grandes feitos para ganhá-la de volta.",
  ],

  defeito: [
    "Eu me distraio facilmente com a promessa de informação.",
    "Muitas pessoas gritam e correm quando veem um corruptor. Eu paro e tomo notas de sua anatomia.",
    "Desvendar um mistério ancestral pode muito bem valer o preço de uma civilização.",
    "Eu prefiro soluções óbvias a complicadas.",
    "Eu falo sem antes pensar em minhas palavras, invariavelmente insultando outros.",
    "Eu não consigo guardar um segredo para salvar minha vida. Ou a vida de qualquer outra pessoa.",
  ],
};

const antecedenteSoldado = {
  nome: "Soldado",
  proficienciaPericia: ["Atletismo", "Intimidação"],
  proficienciaFerramentasAntecedente: [
    "Um tipo de kit de jogo",
    "Veículo (terrestre)",
  ],
  equipamento:
    "Uma insígnia de patente, um fetiche obtido de um inimigo caído (uma adaga, lâmina partida ou tira de estandarte), um conjunto de dados de osso ou baralho, um conjunto de roupas comuns e uma algibeira contendo 10 po",

  CaracteristicaDoAntecedente: {
    LabelCaracteristicaSelect1: "Especialidade",
    CaracteristicaSelect1: [
      "Batedor",
      "Cavaleiro",
      "Contramestre",
      "Equipe de apoio (cozinheiro, ferreiro)",
      "Infantaria",
      "Médico",
      "Oficial",
      "Porta-estandarte",
    ],
    caracteristicasSugeridas:
      "Os horrores de guerra combinados com a rígida disciplina que o serviço militar cobra, deixam marcas em todos os soldados, moldando seus ideais, criando fortes vínculos e até mesmo os deixando assustados e vulneráveis ao medo, vergonha e ódio.",
    LabelCaracteristicaTexto1: "Patente Militar",
    CaracteristicaTexto1:
      "Você possui uma patente militar da sua época como soldado. Soldados leais à sua antiga organização reconhecem sua autoridade e influência, e o prestam deferência se forem de uma patente mais baixa. Você pode invocar sua patente para exercer influência sobre soldados, e requisitar equipamentos simples ou cavalos para uso temporário. Você também pode ganhar acesso a acampamentos militares aliados, e fortalezas onde usa patente é reconhecida.",
  },

  tracoPersonalidade: [
    "Eu sou sempre polido e respeitoso.",
    "Eu sou assombrado pelas memórias da guerra. Não consigo tirar aquelas imagens da minha cabeça.",
    "Eu perdi muitos amigos, e sou muito devagar para fazer novos.",
    "Eu tenho muitas histórias de inspiração e cautela da época de minha experiência militar que são relevantes em todas as situações de combate.",
    "Eu não consigo encarar um cão infernal sem vacilar.",
    "Eu gosto de ser forte e de quebrar coisas.",
    "Eu tenho um senso de humor grosseiro.",
    "Eu enfrento os problemas de frente. Uma solução direta é o melhor caminho para o sucesso.",
  ],

  ideal: [
    "Bem Maior. Nosso destino é dar nossas vidas em defesa de terceiros. (Bom)",
    "Responsabilidade. Eu faço o que tenho que fazer e obedeço apenas a autoridade. (Leal)",
    "Independência. Quando pessoas seguem ordens cegas elas apoiam um tipo de tirania. (Caótico)",
    "Força. A vida é como uma guerra, o mais forte vence. (Mau)",
    "Viva e Deixa Viver. Ideais não valem a pena se você matar, ou for à guerra por eles. (Neutro)",
    "Aspiração. Minha cidade, nação ou meu povo, são tudo o que importa para mim. (Qualquer)",
  ],

  vinculo: [
    "Eu ainda daria a minha vida pelas pessoas com quem servi.",
    "Alguém salvou minha vida no campo de batalha. Desde aquele dia eu nunca deixo nenhum amigo para trás.",
    "Minha honra é minha vida.",
    "Eu nunca esquecerei a destruidora derrota que minha companhia sofreu ou os inimigos que a causaram.",
    "Aqueles que lutam ao meu lado são aqueles por quem vale a pena morrer.",
    "Eu luto por aqueles que não podem lutar por si mesmos.",
  ],

  defeito: [
    "O inimigo monstruoso que enfrentei em uma batalha ainda me deixa tremendo de medo.",
    "Eu tenho pouco respeito por aqueles que não se provam bons combatentes.",
    "Eu cometi um terrível erro em batalha, o que custou muitas vidas – eu farei de tudo para manter esse erro em segredo.",
    "Meu ódio por meus inimigos é cego e irracional.",
    "Eu obedeço a lei, mesmo se a lei trouxer a angústia.",
    "Eu prefiro comer minha armadura a admitir que estou errado.",
  ],
};

export const antecedentes = [
  antecedenteCharlatao,
  antecedenteAcólito,
  antecedenteArtesaoGuilda,
  antecedenteArtista,
  antecedenteCriminoso,
  antecedenteEremita,
  antecedenteForasteiro,
  antecedenteHeroiDoPovo,
  antecedenteMarinheiro,
  antecedenteNobre,
  antecedenteOrfao,
  antecedenteSabio,
  antecedenteSoldado,
];
