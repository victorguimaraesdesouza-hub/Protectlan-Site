---
name: Protectlan Informática
description: Catálogo técnico para suporte de TI corporativo em Mogi das Cruzes.
colors:
  action-green: "#43c86b"
  action-green-hover: "#52d67a"
  action-green-dark: "#217a44"
  action-green-ink: "#062616"
  structural-blue: "#305081"
  structural-blue-soft: "#dbe5ec"
  highlight-yellow: "#ffe45e"
  surface-paper: "#f2f6f7"
  surface-paper-2: "#e8eef0"
  surface-sheet: "#ffffff"
  surface-navy: "#112138"
  ink: "#0b1a26"
  rule: "#c9d5db"
  rule-soft: "#dfe7ea"
  muted: "#485b66"
  muted-2: "#5f727c"
  danger: "#a3261d"
  danger-soft: "#fbeae8"
  focus: "#1f5fbf"
typography:
  display:
    fontFamily: "Archivo Narrow, Arial Narrow, Arial, sans-serif"
    fontSize: "clamp(2.8rem, 1.7rem + 4.7vw, 5.4rem)"
    fontWeight: 700
    lineHeight: 0.88
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Archivo Narrow, Arial Narrow, Arial, sans-serif"
    fontSize: "clamp(2.1rem, 1.5rem + 2.6vw, 3.3rem)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Archivo, Segoe UI, Arial, sans-serif"
    fontSize: "clamp(1.2rem, 1.05rem + 0.55vw, 1.45rem)"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Archivo, Segoe UI, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Fragment Mono, Courier New, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.12em"
rounded:
  xs: "1px"
  sm: "2px"
spacing:
  shell: "1320px"
  gutter: "clamp(20px, 4.4vw, 64px)"
  space-1: "0.4rem"
  space-2: "0.75rem"
  space-3: "1.15rem"
  space-4: "1.75rem"
  space-5: "2.6rem"
  space-6: "clamp(3.5rem, 7vw, 7rem)"
components:
  button-primary:
    backgroundColor: "{colors.action-green}"
    textColor: "{colors.action-green-ink}"
    rounded: "{rounded.sm}"
    padding: "12px 18px"
  button-primary-hover:
    backgroundColor: "{colors.action-green-hover}"
    textColor: "{colors.action-green-ink}"
    rounded: "{rounded.sm}"
    padding: "12px 18px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "12px 18px"
  input:
    backgroundColor: "{colors.surface-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "10px 12px"
    height: "44px"
  plate:
    backgroundColor: "{colors.surface-sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "16px"
---

# Design System: Protectlan Informática

## Overview

**Creative North Star: "Catálogo Técnico"**

A Protectlan se apresenta como uma empresa de infraestrutura, não como uma startup de software. O sistema visual traduz essa postura em uma linguagem de catálogo industrial: papéis claros, réguas finas, códigos de figura, carimbos e tipografia condensada. A composição é densa, mas ordenada, para que o visitante leia a empresa como quem folheia uma ficha técnica confiável.

O contraste estrutural vem do navy e do azul; o verde é reservado para ação, disponibilidade e confirmação. Amarelo aparece como marcação pontual, nunca como decoração de fundo. A experiência deve parecer impressa em papel técnico e, ao mesmo tempo, funcionar com a clareza de um site contemporâneo.

**Key Characteristics:**
- Fundo paper com grid isométrico sutil, nunca gradientes decorativos.
- Tipografia display condensada em contraste com Archivo e Fragment Mono.
- Réguas de 1px, bordas de 2px e raio de 2px; superfícies planas.
- Códigos, fichas, protocolos e carimbos como vocabulário visual recorrente.
- Verde de ação usado com parcimônia; azul como cor estrutural.

## Colors

Uma paleta de papel técnico, azul de planta e verde de sinalização.

### Primary
- **Action Green** (#43c86b): botões primários, indicadores de disponibilidade, confirmações e destaques de status. É a única cor que autoriza preenchimento de ação em massa.
- **Action Green Dark** (#217a44): texto de status sobre paper e pequenos rótulos de confirmação.
- **Action Green Ink** (#062616): texto sobre verde, garantindo contraste de ação.

### Secondary
- **Structural Blue** (#305081): links, códigos, títulos de tabela, ícones e a faixa de consultoria. É a cor que organiza a leitura.
- **Structural Blue Soft** (#dbe5ec): fundos auxiliares e estados de baixa ênfase.

### Tertiary
- **Highlight Yellow** (#ffe45e): seleção de texto, foco em superfícies escuras e marcações de atenção. Nunca usar como fundo de seção inteira.

### Neutral
- **Ink** (#0b1a26): texto principal, bordas fortes e botões escuros.
- **Surface Navy** (#112138): header, faixas escuras e rodapé.
- **Surface Paper** (#f2f6f7): fundo global.
- **Surface Paper 2** (#e8eef0): trilhos de scrollbar e camadas de apoio.
- **Surface Sheet** (#ffffff): fichas, formulários e superfícies elevadas.
- **Rule** (#c9d5db): divisórias padrão.
- **Rule Soft** (#dfe7ea): divisórias internas de tabelas e listas.
- **Muted** (#485b66): texto secundário.
- **Muted 2** (#5f727c): metadados e placeholders com contraste mínimo de 4.5:1 sobre paper.
- **Danger** (#a3261d): erros de validação.
- **Danger Soft** (#fbeae8): fundo de campo inválido.
- **Focus** (#1f5fbf): anel de foco padrão; sobre navy, o foco passa a amarelo.

**The Signal Rule.** O verde só aparece quando há uma ação, um status positivo ou uma confirmação. Se não houver nada para sinalizar, a tela permanece paper, azul e tinta.

## Typography

**Display Font:** Archivo Narrow (com Arial Narrow e Arial)
**Body Font:** Archivo (com Segoe UI e Arial)
**Label/Mono Font:** Fragment Mono (com Courier New)

**Character:** A condensada dá voz de catálogo e relatório; a Archivo mantém a leitura confortável; a mono transforma metadados em evidência técnica.

### Hierarchy
- **Display** (700, `clamp(2.8rem, 1.7rem + 4.7vw, 5.4rem)`, 0.88): h1 e números de campanha. Pode chegar a 0.88 de entrelinha por ser tipografia de cartaz.
- **Headline** (700, `clamp(2.1rem, 1.5rem + 2.6vw, 3.3rem)`, 0.92): h2 de seção e títulos de ficha.
- **Title** (650, `clamp(1.2rem, 1.05rem + 0.55vw, 1.45rem)`, 1.2): h3, nomes de plano e títulos de card.
- **Body** (400, `1.0625rem`, 1.6): parágrafos; largura máxima de 60–72ch.
- **Label** (400, `0.6875rem`, 0.12em, caixa alta): códigos, metadados, rótulos de formulário e cabeçalhos de tabela. Nunca abaixo de 11px.

**The Catalog Label Rule.** Todo rótulo mono é curto, em caixa alta e com tracking; se precisar de uma frase inteira, ele deixa de ser rótulo e vira corpo.

A implementação mantém alguns tamanhos intermediários para tabelas e metadados legados. Novas telas devem partir dos papéis acima e não criar novos degraus sem necessidade.

## Layout

O container principal tem 1320px de largura máxima e gutter fluido de `clamp(20px, 4.4vw, 64px)`. A hierarquia espacial usa uma grade editorial de 12 colunas implícita, com composições assimétricas: hero em 5/7, cabeçalho de página em 8/4 e faixas de consultoria em 1.4fr/auto.

O ritmo vertical é controlado por `--space-1` a `--space-6`, com seções em `clamp(3.5rem, 7vw, 7rem)`. Blocos densos usam réguas para separar sem criar cards flutuantes. Em 1180px as grades principais colapsam para uma coluna; em 980px o TOC e os layouts de serviço mudam; em 820px a navegação vira painel de tela cheia e o header reduz para 68px; em 760px produtos, planos e formulários passam a uma coluna; em 520px os botões ocupam a largura toda.

## Elevation & Depth

O sistema é predominantemente plano. Profundidade vem de camadas tonais (paper, sheet, navy) e de réguas, não de sombras. A exceção são as placas técnicas e o menu fixo: `--shadow-plate` (0 30px 70px -42px rgba(11, 26, 38, 0.55)) e `--shadow-soft` (0 18px 44px -30px rgba(11, 26, 38, 0.45)) sugerem papel apoiado, não flutuação de app.

### Shadow Vocabulary
- **Plate** (`0 30px 70px -42px rgba(11, 26, 38, 0.55)`): diagrama isométrico e grandes superfícies de ficha.
- **Soft** (`0 18px 44px -30px rgba(11, 26, 38, 0.45)`): formulários e placas menores.
- **Stuck header** (`0 18px 40px -32px rgba(0, 0, 0, 0.8)`): apenas quando o header fixo está ativo.

**The Flat-by-Default Rule.** Superfícies são planas em repouso. Sombra só entra quando o elemento representa uma folha física ou quando o header gruda no topo.

## Shapes

O raio é quase inexistente: 2px em botões, campos e cards. Bordas de 1px em `--rule` e `--rule-soft` desenham tabelas, fichas e listas. Bordas de 2px em `--ink` marcam o início de seções e o topo de tabelas comparativas. O grid isométrico do hero é a única geometria decorativa; ele pertence ao diagrama, não ao fundo global.

## Components

### Buttons
- **Shape:** retângulo de 2px de raio, altura mínima de 44px.
- **Primary:** verde com texto `--green-ink`; padding 12px 18px; nunca branco sobre verde.
- **Hover / Focus:** verde clareia para #52d67a; foco visível em `--focus` ou amarelo sobre navy.
- **Secondary / Ghost:** contorno de tinta sobre paper; preenchimento de tinta no hover. Sobre faixas escuras, usar `.btn-outline-light` com borda translúcida.
- **Light:** paper com texto de tinta; sobre azul/navy, o texto continua tinta.

### Cards / Containers
- **Corner Style:** 2px.
- **Background:** `--sheet` para fichas; `--paper` para campos; `--navy` para faixas de fechamento.
- **Shadow Strategy:** flat by default; usar `--shadow-soft` apenas em placas de formulário.
- **Border:** 1px `--ink` em fichas; 1px `--rule` em tabelas internas.
- **Internal Padding:** 16–36px, com `clamp()` em blocos grandes.

### Inputs / Fields
- **Style:** fundo paper, borda de 1px `--rule`, raio de 2px, altura mínima de 44px.
- **Focus:** borda azul e anel de 2px em `rgba(48, 80, 129, 0.22)`.
- **Error:** borda `--danger` e fundo `--danger-soft`; mensagem em 12px.
- **Placeholder:** `--muted-2` com opacidade 1.

### Navigation
- **Desktop:** header navy fixo, wordmark branco, links em Archivo 0.9rem, indicador verde de 2px que cresce da direita.
- **Mobile:** em 820px, painel navy em tela cheia, links em Archivo Narrow 1.85rem, foco preso ao menu e `inert` no conteúdo.

### Technical Plate
A placa de diagrama é a assinatura do sistema: cabeçalho mono com status, SVG isométrico, índice de pontos clicáveis e rodapé com figura/revisão. Ela combina função de navegação com linguagem de desenho técnico e não deve virar card genérico.

## Do's and Don'ts

### Do:
- **Do** usar 2px de raio, réguas de 1px e bordas de 2px como vocabulário estrutural.
- **Do** manter rótulos funcionais em mono com no mínimo 11px e tracking entre 0.08em e 0.12em.
- **Do** reservar o verde para ação, disponibilidade e confirmação.
- **Do** usar `--muted-2` ou mais escuro para texto pequeno sobre paper.
- **Do** testar contraste de qualquer botão claro sobre faixa azul ou navy.

### Don't:
- **Don't** usar gradientes decorativos, glassmorphism, pills ou cards com sombra difusa.
- **Don't** colocar branco puro sobre paper ou texto verde sobre verde.
- **Don't** transformar o grid isométrico em textura de fundo de páginas inteiras.
- **Don't** reduzir texto funcional abaixo de 11px nem usar tracking largo em parágrafos.
- **Don't** inventar preços, depoimentos ou credenciais para preencher layout.
