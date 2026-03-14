# Estrutura do projeto (cliente)

Visão geral das pastas e onde fica cada parte do sistema.

## Raiz do repositório

| Pasta / arquivo | Uso |
|-----------------|-----|
| `play.pokemonshowdown.com/` | App principal do cliente (tela de jogo, menu, chat, batalha). É o “front” que você altera. |
| `config/` | Configuração global: `config.js` (servidor, rotas), `routes.json`, exemplos. |
| `build-tools/` | Scripts de build: compilação TS → JS, cache-bust no HTML, índices, etc. |
| `replay.pokemonshowdown.com/` | App de replay (visualização de replays). |
| `teams.pokemonshowdown.com/` | App de teams (export/import de times). |
| `caches/` | Cache e dados gerados (ex.: clone do pokemon-showdown para alguns builds). |
| `vite.config.js` | Config do servidor de desenvolvimento (`npm run dev`). |
| `package.json` | Scripts: `dev`, `build`, `build-full`, `lint`, `test`. |

## Dentro de `play.pokemonshowdown.com/`

| Pasta / arquivo | Uso |
|-----------------|-----|
| `client.html` | Página principal do cliente de jogo (gerada a partir de `client.template.html` no build). |
| `client.template.html` | Template da página principal; não editar o `client.html` manualmente. |
| `index.html` | Redirecionamento para `client.html` (gerado no build). |
| `style/` | CSS (battle, client, utilichart, font-awesome, etc.). |
| `js/` | JavaScript compilado e libs: `client.js`, `client-*.js`, `battle*.js`, `lib/` (jQuery, Backbone, etc.). |
| `src/` | Código fonte TypeScript/JS que vira arquivos em `js/` e `data/` após o build. |
| `data/` | Dados do jogo (pokedex, moves, items, abilities, etc.) em JS/JSON; parte é gerada pelo build. |

## Fluxo de build

1. `npm run build` (ou `node build`)  
   - Compila `src/` → `js/` (e gera alguns em `data/`).  
   - Lê `index.template.html`, aplica cache-bust e rotas, grava `index.html`.  
   - Pode rodar passos extras (indexes, learnsets, etc.) conforme o script `build`.

2. `npm run dev`  
   - Sobe o Vite com root em `play.pokemonshowdown.com/`.  
   - Serve `/config/*` da pasta `config/` na raiz.  
   - Em dev, o HTML é transformado para usar paths relativos (sem `//play.pokemonshowdown.com`).  
   - Requer ter rodado `npm run build` pelo menos uma vez para existir `index.html` e os JS compilados.

## Servidor que o cliente usa

O cliente se conecta ao servidor definido em `config/config.js` (por exemplo `Config.defaultserver`).  
O backend (servidor de batalha/login) é outro projeto; este repositório é só o front-end.  
Para usar seu próprio servidor depois, basta apontar a config para o host/porta dele.
