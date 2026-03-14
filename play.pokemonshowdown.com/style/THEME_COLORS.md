# Onde mudar as cores do cliente

As cores branco/cinza dos elementos vêm principalmente destes arquivos. Edite os valores de `background`, `color`, `border-color` conforme o tema desejado.

---

## 1. `client.css` (principal)

| Seletor / uso | Aprox. linha | O que controla |
|---------------|--------------|----------------|
| `body` | 17 | Fundo da página (imagem de fundo) |
| `.tabbar a.button`, `.tabbar a.button.cur` | 183–239 | Abas do topo (Home, Teambuilder, Lobby) – fundo cinza/claro |
| `.ps-room.ps-room-light` | 385–388 | **Painel principal (área de conteúdo)** – `rgba(242,247,250,.85)` |
| `.ps-room.ps-room-opaque` | 389–392 | Versão opaca do painel – `#EEF2F5` |
| `.ps-overlay` | 395–402 | Overlay de popups – cinza |
| `.ps-popup` | 408–418 | **Janelas popup (ex.: News)** – `#E1E8E8` |
| `.pm-window.focused h3`, `.pm-window.focused .pm-log` | 711–742 | **Caixa News (título e conteúdo)** – `rgba(242,247,250,...)` e `#f8f8f8` |
| `.menugroup .button` | 821–866 | **Botões grandes (Connecting..., Teambuilder, Ladder, etc.)** – azul/cinza; o cinza é o `.button.disabled` |
| `.mainmenu` | 610+ | Container do menu principal |
| `input.textbox`, `select` | 558–565, 521–523 | **Campos de texto e selects** – fundo branco/cinza claro |
| `.header` | 64–66 | Barra do topo – imagem `client-topbar-bg.png` |

Busca rápida no arquivo: use "background:" ou "#f8f8f8" ou "#EEF2F5" ou "rgba(242,247,250".

---

## 2. `teambuilder.css`

| Seletor | O que controla |
|---------|----------------|
| `.folderpane`, `.teampane` (e variantes) | Fundos da lista de pastas e da área de times – tons `#d7e3ec`, `#c7d3dc` |
| `.ps-room-light` (no teambuilder) | Fundo da área do Teambuilder |

---

## 3. Override centralizado: `custom-theme.css`

O arquivo **`custom-theme.css`** é carregado em **`client.template.html`** logo após `client.css`, com variáveis CSS e regras que sobrescrevem os cinzas principais.  
Altere as variáveis no topo de `custom-theme.css` para mudar o tema sem mexer em `client.css`/`teambuilder.css`.

O `client.html` / `client.template.html` precisam carregar `custom-theme.css` **depois** de `client.css` para o override valer.
