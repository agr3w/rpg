export const CHRONICLE_TEMPLATES = {
  adventure: {
    id: "adventure",
    name: "Registro de Aventura (Padrão)",
    defaultTags: ["Aventura", "Exploração"],
    body: `**Resumo dos Eventos:**
- 

**Encontros & Combates:**
- Inimigos enfrentados: 
- Recursos críticos gastos (Spell slots, Poções): 

**NPCs Relevantes:**
- Nome / Facção: 
- Informação ou promessa feita: 

**Tesouros, Moedas & Espólios:**
- Moedas (PO/PP/PC): 
- Itens e artefatos: 

**Próximos Objetivos:**
- `
  },

  dungeon: {
    id: "dungeon",
    name: "Incursão em Masmorra (Dungeon Crawl)",
    defaultTags: ["Dungeon", "Combate", "Perigo"],
    body: `**Local / Nível da Masmorra:**
- 

**Armadilhas, Enigmas & Perigos Ambientais:**
- 

**Bestiário Enfrentado:**
- Criaturas: 
- Baixas ou estados persistentes no grupo: 

**Saque & Chaves Encontradas:**
- 

**Passagens Não Exploradas / Rotas de Fuga:**
- `
  },

  mystery: {
    id: "mystery",
    name: "Investigação & Mistério",
    defaultTags: ["Investigação", "Intriga", "Roleplay"],
    body: `**O Mistério em Questão:**
- 

**Pistas & Evidências Coletadas:**
- 

**Interrogatórios & Testemunhas:**
- 

**Principais Suspeitos & Motivações:**
- 

**Teorias e Conclusões Atuais do Grupo:**
- `
  },

  downtime: {
    id: "downtime",
    name: "Downtime & Interlúdio (Entre Sessões)",
    defaultTags: ["Downtime", "Descanso", "Cidade"],
    body: `**Período Transcorrido:** (Ex: 5 dias em Águas Profundas)

**Atividades Individuais dos Heróis:**
- 

**Rumores Ouvidos na Taverna / Mercados:**
- 

**Compras, Forja & Transações:**
- 

**Correspondências & Mensagens Recebidas:**
- `
  },

  blank: {
    id: "blank",
    name: "Crônica Livre (Página em Branco)",
    defaultTags: ["Anotações"],
    body: ""
  }
};
