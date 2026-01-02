Ferramentas para Jogador
------------------------

1.  **Diário de Campanha (Session Log)** 🟢 Concluido!
    -   Entrada por sessão: resumo, NPCs vistos, quests, decisões, loot, XP.
    -   Linkar com notas/itens/NPCs (referências rápidas). 
2.  **Inventário inteligente** 🟦 Parcialmente Concluído
    -   Itens com peso, quantidade, valor, raridade.
    -   "Kits" (ex.: kit de exploração) e cálculo automático de carga.
3.  **Spellbook / Lista de magias** 🟦 Parcialmente Concluído
    -   Filtros por nível, escola, components, concentração, ritual.
    -   "Preparadas hoje" + contadores rápidos (slots, pact magic).
4.  **Tracker de recursos** 🟦 Parcialmente Concluído
    -   HP/Temp HP, dados de vida, cargas, usos por descanso curto/longo.
    -   Botão "Descanso Curto/Longo" que reseta o que estiver marcado.
5.  **Anotações por personagem** 🟢 Concluido!
    -   Notas privadas do jogador separadas do "diário de mesa".

Ferramentas para DM
-------------------

1.  **Gerenciador de Encontros**
    -   Builder de encontro: monstros, quantidade, ambiente, notas.
    -   Calculadora de XP/CR ajustada por número de players (5e).
2.  **Iniciativa + Combate**
    -   Ordem de iniciativa, condições (cego, envenenado...), concentração.
    -   Rodadas/turnos, timers e "marcadores" (ex.: efeitos até rodada X).
3.  **Banco de NPCs**
    -   NPC: nome, traços, voz, motivação, segredos, relações, tags.
    -   "Apareceu na sessão X" e link com locais/quests.
4.  **Mapa/Localizações (Lore Manager)**
    -   Locais com descrição, facções, pontos de interesse, handouts.
    -   Links para notas e NPCs.
5.  **Loot & Recompensas**
    -   Tabelas simples e um "gerador" por categoria (mundano/mágico).
    -   Registro de loot entregue (evita inconsistência).
6.  **Timeline / Rumores / Hooks**
    -   Lista de ganchos com status (ativo/pendente/concluído), prioridade e sessão sugerida.

Ferramentas "neutras" (servem pros dois)
----------------------------------------

1.  **Rolador de dados (Dice Roller)**
    -   Expressões tipo `2d20kh1+5`, vantagem/desvantagem, histórico.
    -   "Macros" por personagem/campanha.
2.  **Biblioteca de Handouts** 🟢 Concluido!
    -   Upload/organização de imagens/PDFs por campanha (mapas, cartas).
3.  **Campanhas e Permissões**
    -   Campanha com membros (DM + jogadores), e compartilhamento seletivo:
        -   "Visível para todos" vs "Só DM".

* * * * *

Sugestão de roadmap (pra entregar rápido)
-----------------------------------------

1.  **Campanhas + Session Log + NPCs** (muito valor e pouco atrito)
2.  **Iniciativa/Combate** (diferencial forte para DM)
3.  **Dice Roller + Macros** (engaja jogadores e reduz alt-tab)

* * * * *

Perguntas rápidas pra eu desenhar a estrutura certa
---------------------------------------------------

1.  Você quer **multi-campanha** com usuários compartilhando dados, ou tudo ainda fica **privado por usuário**?
2.  Você prefere salvar no Realtime DB como:
    -   `campaigns/{campaignId}` + `campaignMembers/{campaignId}/{uid}`\
        ou
    -   `users/{uid}/campaigns/{campaignId}` (mais simples, menos compartilhamento)?