import { armas } from "Array/Armas";
import ARMADURAS from "Array/Armaduras";

// Mapa de sinônimos e plurais para armas de D&D 5e
const WEAPON_ALIASES = {
  "machados de mão": "Machadinha",
  "machado de mão": "Machadinha",
  "machados de arremesso": "Machadinha",
  "machado de arremesso": "Machadinha",
  "azagaias": "Azagaia",
  "adagas": "Adaga",
  "dardos": "Dardo",
  "bordões": "Bordão",
  "fundas": "Funda",
  "lanças": "Lança",
  "arcos curtos": "Arco Curto",
  "bestas leves": "Besta Leve",
  "cimitarras": "Cimitarra",
  "espadas curtas": "Espada Curta",
  "espadas longas": "Espada Longa",
};

// Propriedades oficiais de armas D&D 5e
const WEAPON_PROPS_CONFIG = {
  "Adaga": { agil: true, leve: true, arremesso: true },
  "Azagaia": { arremesso: true },
  "Bordão": { versatil: true, versatileDice: "1d8" },
  "Clava Grande": { duasMaos: true },
  "Foice Curta": { leve: true },
  "Lança": { arremesso: true, versatil: true, versatileDice: "1d8" },
  "Maça": {},
  "Machadinha": { leve: true, arremesso: true },
  "Martelo Leve": { leve: true, arremesso: true },
  "Porrete": { leve: true },
  "Arco Curto": { duasMaos: true, municao: true },
  "Besta Leve": { duasMaos: true, municao: true, recarga: true },
  "Dardo": { agil: true, arremesso: true },
  "Funda": { municao: true },
  "Alabarda": { alcance: true, duasMaos: true, pesada: true },
  "Cimitarra": { agil: true, leve: true },
  "Chicote": { agil: true, alcance: true },
  "Espada Curta": { agil: true, leve: true },
  "Espada Grande": { duasMaos: true, pesada: true },
  "Espada Longa": { versatil: true, versatileDice: "1d10" },
  "Glaive": { alcance: true, duasMaos: true, pesada: true },
  "Lança de Montaria": { alcance: true },
  "Lança Longa": { alcance: true, duasMaos: true },
  "Maça Estrela": {},
  "Machado Grande": { duasMaos: true, pesada: true },
  "Machado de Batalha": { versatil: true, versatileDice: "1d10" },
  "Malho": { duasMaos: true, pesada: true },
  "Mangual": {},
  "Martelo de Guerra": { versatil: true, versatileDice: "1d10" },
  "Picareta de Guerra": {},
  "Rapieira": { agil: true },
  "Tridente": { arremesso: true, versatil: true, versatileDice: "1d8" },
  "Arco Longo": { duasMaos: true, pesada: true, municao: true },
  "Besta de Mão": { leve: true, municao: true, recarga: true },
  "Besta Pesada": { duasMaos: true, pesada: true, municao: true, recarga: true },
};

// Descrições ricas para pacotes de equipamentos
const PACK_DESCRIPTIONS = {
  "pacote de explorador": "Inclui: Mochila, saco de dormir, kit de refeição, caixa de fogo, 10 tochas, 10 rações, cantil e 15m de corda de cânhamo.",
  "pacote de aventureiro": "Inclui: Mochila, pé de cabra, martelo, 10 pítons, 10 tochas, caixa de fogo, 10 rações, cantil e 15m de corda de cânhamo.",
  "pacote de estudioso": "Inclui: Mochila, livro de estudo, vidro de tinta, pena, 10 folhas de pergaminho, saquinho de areia e pequena faca.",
  "pacote de sacerdote": "Inclui: Mochila, cobertor, 10 velas, caixa de fogo, caixa de esmolas, 2 blocos de incenso, incensário, vestimentas, 2 rações e cantil.",
  "pacote de artista": "Inclui: Mochila, saco de dormir, 2 fantasias, 5 velas, 5 rações diárias, cantil e kit de disfarce.",
  "pacote de diplomata": "Inclui: Baú, 2 caixas para mapas/pergaminhos, roupas finas, frasco de tinta, pena, lâmpada, 2 frascos de óleo, 5 folhas de pergaminho, perfume e sabão.",
  "pacote de diplomacia": "Inclui: Baú, 2 caixas para mapas/pergaminhos, roupas finas, frasco de tinta, pena, lâmpada, 2 frascos de óleo, 5 folhas de pergaminho, perfume e sabão.",
  "pacote de assaltante": "Inclui: Mochila, 1000 esferas de metal, 3m de linha, sino, 5 velas, pé de cabra, martelo, 10 pítons, lanterna coberta, 2 óleos, 5 rações, caixa de fogo e 15m corda.",
};

/**
 * Encontra o registro de arma correspondente no D&D 5e
 */
const findArmaRecord = (rawName) => {
  if (!Array.isArray(armas) || !rawName) return null;
  const clean = rawName.trim().toLowerCase();

  if (WEAPON_ALIASES[clean]) {
    const alias = WEAPON_ALIASES[clean];
    const match = armas.find((a) => a.nome.toLowerCase() === alias.toLowerCase());
    if (match) return match;
  }

  let found = armas.find((a) => a.nome.toLowerCase() === clean);
  if (found) return found;

  if (clean.endsWith("s")) {
    const singular = clean.slice(0, -1);
    found = armas.find((a) => a.nome.toLowerCase() === singular);
    if (found) return found;
  }

  found = armas.find(
    (a) => clean.includes(a.nome.toLowerCase()) || a.nome.toLowerCase().includes(clean)
  );
  return found || null;
};

/**
 * Detecta se uma string representa armadura ou escudo
 */
const checkArmorRecord = (rawName) => {
  const clean = rawName.trim().toLowerCase();
  if (clean.includes("escudo")) {
    return { isShield: true };
  }
  if (!Array.isArray(ARMADURAS)) return null;

  if (clean.includes("cota de malha") && !clean.includes("camisao") && !clean.includes("camisão")) {
    return ARMADURAS.find((a) => a.id === "cota-malha") || null;
  }
  if (clean.includes("camisao") || clean.includes("camisão")) {
    return ARMADURAS.find((a) => a.id === "camisao-cota-malha") || null;
  }
  if (clean.includes("couro batido")) {
    return ARMADURAS.find((a) => a.id === "couro-batido") || null;
  }
  if (clean.includes("gibão de peles") || clean.includes("gibao de peles")) {
    return ARMADURAS.find((a) => a.id === "gibao-peles") || null;
  }
  if (clean.includes("couro") && !clean.includes("batido")) {
    return ARMADURAS.find((a) => a.id === "couro") || null;
  }
  if (clean.includes("brunea") || clean.includes("brúnea")) {
    return ARMADURAS.find((a) => a.id === "brunea") || null;
  }
  if (clean.includes("placas")) {
    return ARMADURAS.find((a) => a.id === "placas") || null;
  }
  if (clean.includes("acolchoada")) {
    return ARMADURAS.find((a) => a.id === "acolchoado") || null;
  }
  return null;
};

/**
 * Gera o inventário inicial completo estruturado para o Realtime Database e FichaDetalhes
 * @param {Object} equipamentosFormatados - Objeto com equipamentos selecionados (slot1..4)
 * @param {Array|string} equipamentoObgt - Equipamentos obrigatórios de classe
 * @returns {{ backpack: Object, equipped: Object, caDetalhes: Object|null }}
 */
export const gerarInventarioInicial = (equipamentosFormatados = {}, equipamentoObgt = []) => {
  const backpack = {};
  const equipped = {};
  let detectedArmor = null;
  let hasShield = false;

  const listaBruta = [];

  // Coleta escolhas dos slots 1 a 4
  Object.values(equipamentosFormatados || {}).forEach((valor) => {
    if (typeof valor === "string" && valor.trim()) {
      listaBruta.push(valor.trim());
    }
  });

  // Coleta itens obrigatórios da classe
  if (Array.isArray(equipamentoObgt)) {
    equipamentoObgt.forEach((item) => {
      if (typeof item === "string" && item.trim()) {
        listaBruta.push(item.trim());
      }
    });
  } else if (typeof equipamentoObgt === "string" && equipamentoObgt.trim()) {
    listaBruta.push(equipamentoObgt.trim());
  }

  let indexCounter = 0;

  listaBruta.forEach((itemStr) => {
    let str = itemStr.trim();

    // Extrai sub-seleção entre parênteses finais: ex: "(a) Uma arma marcial e um escudo (Espada Longa)"
    const matchParenteses = str.match(/\(([^()]+)\)$/);
    let subSelectedItems = [];
    if (matchParenteses) {
      const conteudo = matchParenteses[1];
      if (conteudo.includes(" e ")) {
        subSelectedItems = conteudo.split(/\s+e\s+/i).map((s) => s.trim());
      } else {
        subSelectedItems = [conteudo.trim()];
      }
      str = str.replace(/\s*\([^()]+?\)$/, "").trim();
    }

    // Remove prefixo de letra de opção: "(a) ", "(b) ", etc.
    str = str.replace(/^\([a-z]\)\s*/i, "").trim();

    let itensParaProcessar = [];
    if (subSelectedItems.length > 0) {
      if (str.toLowerCase().includes("escudo")) {
        itensParaProcessar = [...subSelectedItems, "Escudo"];
        hasShield = true;
      } else {
        itensParaProcessar = subSelectedItems;
      }
    } else {
      const commaParts = str.split(",").map((s) => s.trim()).filter(Boolean);
      commaParts.forEach((part) => {
        const eParts = part.split(/\s+e\s+/i).map((s) => s.trim()).filter(Boolean);
        itensParaProcessar.push(...eParts);
      });
    }

    itensParaProcessar.forEach((nomeItem) => {
      indexCounter += 1;
      let nomeFinal = nomeItem.trim();
      let qtd = 1;

      // Detecta quantidades numéricas ou por extenso
      const matchNumber = nomeFinal.match(/^(\d+)\s+(.*)/);
      if (matchNumber) {
        qtd = parseInt(matchNumber[1], 10);
        nomeFinal = matchNumber[2];
      } else if (nomeFinal.toLowerCase().startsWith("duas ")) {
        qtd = 2;
        nomeFinal = nomeFinal.substring(5);
      } else if (nomeFinal.toLowerCase().startsWith("dois ")) {
        qtd = 2;
        nomeFinal = nomeFinal.substring(5);
      } else if (nomeFinal.toLowerCase().startsWith("quatro ")) {
        qtd = 4;
        nomeFinal = nomeFinal.substring(7);
      } else if (nomeFinal.toLowerCase().startsWith("cinco ")) {
        qtd = 5;
        nomeFinal = nomeFinal.substring(6);
      } else if (nomeFinal.toLowerCase().startsWith("dez ")) {
        qtd = 10;
        nomeFinal = nomeFinal.substring(4);
      } else if (nomeFinal.toLowerCase().startsWith("vinte ")) {
        qtd = 20;
        nomeFinal = nomeFinal.substring(6);
      } else if (nomeFinal.toLowerCase().startsWith("um ") || nomeFinal.toLowerCase().startsWith("uma ")) {
        nomeFinal = nomeFinal.substring(nomeFinal.indexOf(" ") + 1);
      }

      // Tratamento especial para flechas com aljava
      if (nomeFinal.toLowerCase().includes("com aljava")) {
        const parts = nomeFinal.split(/\s+com\s+/i);
        nomeFinal = parts[0].trim();
        const idAljava = `bp_${Date.now()}_${indexCounter}_alj`;
        backpack[idAljava] = {
          id: idAljava,
          name: "Aljava com 20 flechas",
          qty: 1,
          weight: 1,
          rarity: "comum",
          notes: "Contém 20 flechas para arco",
          createdAt: Date.now() + indexCounter,
        };
      }

      // Verifica se é armadura ou escudo
      const armorCheck = checkArmorRecord(nomeFinal);
      if (armorCheck) {
        if (armorCheck.isShield) {
          hasShield = true;
        } else {
          detectedArmor = armorCheck;
        }
      }

      // Detalhes especiais para pacotes
      let itemNotes = "Item inicial de classe";
      const cleanLower = nomeFinal.toLowerCase();
      Object.entries(PACK_DESCRIPTIONS).forEach(([packKey, desc]) => {
        if (cleanLower.includes(packKey)) {
          itemNotes = desc;
        }
      });

      const capitalizedName = nomeFinal.charAt(0).toUpperCase() + nomeFinal.slice(1);
      const bpId = `bp_${Date.now()}_${indexCounter}`;

      backpack[bpId] = {
        id: bpId,
        name: capitalizedName,
        qty: qtd,
        weight: armorCheck?.peso ? parseFloat(armorCheck.peso) || 0 : 1,
        rarity: "comum",
        notes: itemNotes,
        createdAt: Date.now() + indexCounter,
      };

      // Se for arma cadastrada, cadastra também no Arsenal (equipped) para combate
      const armaFound = findArmaRecord(capitalizedName);
      if (armaFound) {
        const existingCount = Object.values(equipped).filter(
          (eq) => eq.weaponBaseName === armaFound.nome
        ).length;

        // Limita a até 2 instâncias equipadas de uma mesma arma (ex: duas espadas curtas)
        if (existingCount < Math.min(qtd, 2)) {
          const eqId = `eq_${Date.now()}_${indexCounter}`;
          const isDistancia =
            armaFound.alcance === "Distância" ||
            armaFound.nome.toLowerCase().includes("arco") ||
            armaFound.nome.toLowerCase().includes("besta") ||
            armaFound.nome.toLowerCase().includes("funda");

          const props = WEAPON_PROPS_CONFIG[armaFound.nome] || {};
          const isAgil = Boolean(props.agil);

          // Extrai dado de dano e tipo
          const [danoDado, ...tipoParts] = (armaFound.dano || "1d6 concussão").split(" ");
          const danoTipoRaw = tipoParts.join(" ") || "concussão";
          const damageType = danoTipoRaw.charAt(0).toUpperCase() + danoTipoRaw.slice(1).toLowerCase();

          const weaponDisplayName = existingCount === 1 ? `${armaFound.nome} (Secundária)` : armaFound.nome;

          equipped[eqId] = {
            id: eqId,
            weaponBaseName: armaFound.nome,
            name: weaponDisplayName,
            category: isDistancia ? "ranged" : "melee",
            attackStat: isDistancia ? "Destreza" : (isAgil ? "Destreza" : "Força"),
            damageDice: danoDado || "1d6",
            damageType: damageType,
            attackBonus: 0,
            proficiente: true,
            props: { ...props },
            versatileDice: props.versatileDice || "1d10",
            notes: `${armaFound.tipo} • ${armaFound.alcance} • ${armaFound.dano}`,
            kind: "weapon",
          };
        }
      }
    });
  });

  // Configura a CA calculada inicial baseada na armadura e escudo
  let caDetalhes = null;
  if (detectedArmor || hasShield) {
    const baseCa = detectedArmor ? detectedArmor.caBase : 10;
    const shieldBonus = hasShield ? 2 : 0;
    caDetalhes = {
      base: baseCa,
      usaEscudo: hasShield,
      armorId: detectedArmor ? detectedArmor.id : null,
      armorNome: detectedArmor ? detectedArmor.nome : (hasShield ? "Nenhuma" : ""),
      total: baseCa + shieldBonus,
      propriedades: detectedArmor ? [detectedArmor.categoria] : [],
    };
  }

  return {
    backpack,
    equipped,
    caDetalhes,
  };
};

export default gerarInventarioInicial;
