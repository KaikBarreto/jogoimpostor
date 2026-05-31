# Design — "Amigos de Merda" + Hub de Jogos

**Data:** 2026-05-31
**Status:** Aprovado (brainstorming)

## Visão geral

Transformar o app (hoje um único jogo "Impostor" com 3 modos) numa **coletânea de jogos de festa**, e adicionar o primeiro jogo novo: **"Amigos de Merda"** — um jogo de votação/consenso aberto, estilo "Quem é mais provável".

Diferença de mecânica em relação ao Impostor:
- **Impostor:** dedução secreta (cada jogador vê algo privado no "passa o celular").
- **Amigos de Merda:** votação aberta (todos veem a mesma carta e o grupo aponta uma pessoa) + **placar acumulado**.

## Decisões tomadas

1. **Fluxo do jogo:** infinito — puxa cartas até o grupo apertar "Finalizar".
2. **Atribuição da carta:** toque único — o grupo chega num consenso verbal e uma pessoa toca no nome do escolhido. Sem votação individual.
3. **Lugar no app:** jogo **separado**. A rota "/" vira uma tela-hub com seletor de jogos. Cada jogo tem fluxo e visual próprios.
4. **Conteúdo:** deck **único, sem filtro (+18)**. Sem níveis/temas. Starter deck de **100 perguntas** estilo "Quem...", em arquivo de dados editável.

## Arquitetura

App shell com hub + jogos isolados:

```
App
 ├── HomeScreen        ← rota "/" : seletor de jogos (cards: Impostor, Amigos de Merda)
 ├── <ImpostorGame>    ← jogo atual, intacto, com seu GameStore
 └── <AmigosGame>      ← jogo novo, store + visual próprios
```

- Estado de nível-app simples: `activeGame = "home" | "impostor" | "amigos"`. **Sem react-router** por enquanto (mantém leve pro PWA); URLs reais podem vir depois.
- Cada jogo é **auto-contido** (store, telas, visual próprios). Mexer no Amigos não pode quebrar o Impostor.
- **Componentes compartilhados** extraídos do Impostor para reuso:
  - Cadastro de jogadores (mín. 3, máx. 16).
  - (Passa o celular fica no Impostor por ora — Amigos não usa.)

## Fluxo do "Amigos de Merda"

### 1. Setup
- Reusa o cadastro de jogadores compartilhado (mín. 3).
- Botão "Começar". Sem seleção de tema/nível.

### 2. Jogo (loop principal)
- Topo: a **carta** com a pergunta.
- Abaixo: **lista de jogadores** como botões grandes.
- Consenso verbal → tocar no nome → essa pessoa ganha +1 carta e o app puxa a próxima pergunta automaticamente.
- Contador discreto ("Carta 7").
- Botão **"Pular"** (avança sem atribuir).
- Botão **"Finalizar"** sempre acessível → vai pro placar.

### 3. Resultado
- **Ranking** por nº de cartas (do campeão ao mais inocente).
- Tocar num jogador expande e mostra **quais cartas** ele levou.
- Botões: "Jogar de novo" (zera placar, mesmos jogadores) e "Voltar ao início" (Home).

## Estado e dados (store do Amigos)

```
players: [{ id, name }]              // reusa o cadastro
deck: [ids embaralhados]             // ordem das 100 perguntas
deckIdx: número                      // carta atual na mesa
scores: { playerId: [cardId, …] }    // cartas que cada um levou
screen: "setup" | "game" | "result"
```

- Atribuir carta: empurra `cardId` atual em `scores[playerId]`, `deckIdx++`.
- Pular: só `deckIdx++`.
- Ranking final: ordenar `players` por `scores[id].length` (desc).
- Deck embaralhado no início; sem repetição até esgotar as 100; ao passar de 100, reembaralha e recomeça.
- Perguntas em `data/amigosQuestions.js` (mesmo padrão de `themes.js` / `questions.js`), fácil de editar.

## Visual

- **Impostor:** mantém a cara de cassino/baralho (naipes ◆?§, cartas creme, tinta vermelha).
- **Amigos de Merda:** clima oposto, "caos noturno" — fundo escuro, tipografia pesada/condensada, destaque **verde-ácido**. Carta-pergunta grande no centro com vibe de "carta amaldiçoada". Nomes dos jogadores como botões chunky que "acendem" ao toque.
- **Home (hub):** neutro; dois cards lado a lado, cada um exibindo a identidade visual do seu jogo.

## Fora de escopo (YAGNI por enquanto)

- react-router / URLs reais.
- Níveis de intensidade / temas no Amigos.
- Votação individual, desfazer toque, persistência do placar entre sessões.
- Multiplayer online.
