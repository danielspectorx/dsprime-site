# DS Prime — Auditoria do site antigo e o que mudou no novo

Documento para quem vai manter o site. Explica **o que estava errado**, **o que foi feito** e **o que ainda depende de você**.

---

## Parte 1 — O que estava errado no site antigo

### 1.1 Problemas que impediam o Google de ranquear

**O Google via uma página vazia.**
O site era um SPA em React + Vite. O HTML entregue ao Google era literalmente isto:

```html
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
```

Todo o conteúdo — títulos, textos, links — só existia depois que o navegador baixava e executava ~500 KB de JavaScript. O Google até renderiza JavaScript, mas isso vai para uma fila secundária que pode demorar dias ou semanas, e falha com frequência. Bing e outros buscadores são bem piores nisso. Na prática, cada palavra do site competia com um site concorrente cujo texto estava disponível de imediato.

**Uma página só, disputando dezenas de palavras-chave.**
Todo o conteúdo vivia em `/` com âncoras (`#servicos`, `#frota`, `#rotas`). Âncora não é URL: o Google não indexa `#servicos` como página separada. Resultado: uma única URL tentando ranquear ao mesmo tempo para "transporte executivo chapecó", "transfer aeroporto chapecó", "transporte corporativo chapecó", "van executiva chapecó"… Nenhuma consegue autoridade suficiente. E não havia nenhuma página para as buscas de rota — "chapecó florianópolis carro", "transporte chapecó curitiba" —, que são exatamente as buscas de quem já decidiu contratar.

**Sitemap com uma URL.**
O `sitemap.xml` listava só a home. Nada mais existia para o Google descobrir, porque nada mais existia.

**Dado estruturado que viola a política do Google.**
Este bloco estava no `index.html`:

```json
"aggregateRating": {
  "ratingValue": "5.0",
  "reviewCount": "47"
}
```

A política de spam de dados estruturados do Google exige que a nota agregada seja gerada por avaliações **exibidas na própria página**. As avaliações estavam num widget de terceiros (Elfsight) carregado por JavaScript — ou seja, invisíveis para o rastreador no momento da leitura do schema. Isso é passível de **ação manual**: perda das estrelas nos resultados e, em casos mais graves, penalização do site. Foi removido.

**Sem `og:image` próprio.**
A imagem de compartilhamento apontava para um domínio da plataforma de desenvolvimento (`pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev`). Se aquela URL saísse do ar, todo link compartilhado no WhatsApp e no Instagram apareceria sem imagem.

### 1.2 Problemas de velocidade (que também são de SEO)

Velocidade de carregamento é fator de ranqueamento confirmado, e o Google mede pela experiência real dos usuários no celular.

| O que | Peso | Efeito |
|---|---|---|
| Vídeo de fundo no hero | **19,9 MB** | Começava a baixar antes de tudo. Em 4G do interior, dezenas de segundos de tela escura. |
| 6 fotos da frota | 1,3 a 2,0 MB **cada** | ~9,6 MB só de frota, todas em JPEG sem redimensionar. |
| JavaScript do React + 40 componentes de UI | ~500 KB | Precisava ser baixado e executado antes de qualquer texto aparecer. |
| Widget Elfsight (avaliações) | script externo | Bloqueava a thread principal e dependia de um servidor de terceiros. |
| Google Tag Manager | no topo do `<head>` | Carregado antes do conteúdo, atrasando a primeira renderização. |
| Google Fonts via `@import` no CSS | conexão externa | `@import` dentro do CSS é serial: o navegador só descobre a fonte depois de baixar o CSS. |

### 1.3 Outros pontos

- Nenhuma página tinha `<h1>` no HTML servido.
- Sem breadcrumbs, sem schema de serviço, sem schema por página.
- 49 dependências de produção para um site institucional.
- Nenhuma opção de recusar cookies de análise (LGPD).
- Links de rodapé e navegação com área de toque menor que o mínimo recomendado no celular.

---

## Parte 2 — O que foi construído

### 2.1 Tecnologia

**Astro 5 + Tailwind CSS.** O Astro gera HTML puro no momento do build. O que o Google recebe é a página inteira, pronta, com todo o texto — sem depender de JavaScript.

O JavaScript que sobra é só o das interações: menu, acordeão, animações de entrada, contadores. Ao todo:

| | Antes | Agora |
|---|---|---|
| JavaScript entregue | ~500 KB | **5,8 KB** |
| CSS | ~60 KB | 52 KB (9 KB comprimido) |
| Peso da home (HTML comprimido) | — | 22 KB |
| Dependências de produção | 49 | **5** |
| Vídeo do hero | 19,9 MB | removido (imagem otimizada) |
| Imagens da frota | 9,6 MB | 600 KB (AVIF/WebP responsivos) |

### 2.2 De 1 para 17 páginas indexáveis

```
/                                            Home
/servicos                                    Índice de serviços
/servicos/transporte-executivo
/servicos/transfer-aeroporto-chapeco
/servicos/viagens-regionais-interestaduais
/servicos/transporte-corporativo
/servicos/eventos-e-congressos
/servicos/van-e-onibus-para-grupos
/rotas                                       Índice de rotas
/rotas/chapeco-florianopolis
/rotas/chapeco-curitiba
/rotas/chapeco-porto-alegre
/rotas/chapeco-sao-paulo
/frota
/sobre
/contato
/politica-de-privacidade
```

Cada página tem título, meta description, palavras-chave, conteúdo original e dados estruturados próprios. Todas entram no sitemap automaticamente.

**Por que as páginas de rota importam.** Quem busca "chapecó florianópolis carro" já decidiu que vai contratar — só está escolhendo com quem. É uma busca de baixo volume e altíssima conversão, e antes o site não tinha nada para responder a ela. Cada página traz distância, duração, cidades do trajeto, veículos indicados e um FAQ próprio.

### 2.3 Dados estruturados (Schema.org)

Todas as páginas compartilham um grafo `@graph` com `LocalBusiness` + `TaxiService`, `WebSite` e `WebPage`. Além disso, por tipo de página:

| Página | Schemas adicionais |
|---|---|
| Home | `FAQPage` (12 perguntas), `ItemList` dos serviços |
| Serviço | `Service`, `HowTo` (passo a passo), `FAQPage`, `BreadcrumbList` |
| Rota | `Trip` com itinerário, `FAQPage`, `BreadcrumbList` |
| Frota | `ItemList` de `Vehicle`, `FAQPage` |
| Sobre / Contato | `AboutPage` / `ContactPage` |

`aggregateRating` **não** está presente — de propósito. Veja a seção 4.1.

### 2.4 Velocidade

- Imagens convertidas para AVIF e WebP com múltiplos tamanhos (`srcset`), servidas conforme a tela do visitante.
- Imagem do hero com `fetchpriority="high"` e `loading="eager"` — é o elemento de LCP e precisa vir primeiro.
- Imagens abaixo da dobra em `lazy`.
- Fontes auto-hospedadas em `/fonts` com `preload`. Sem conexão ao Google Fonts: mais rápido e não envia o IP do visitante para outro servidor.
- Todas as imagens com `width` e `height` — o layout não "pula" enquanto carrega (CLS zero).
- GTM só carrega após consentimento (veja 2.6).

### 2.5 Efeitos visuais

Tudo em CSS e Intersection Observer, animando apenas `transform` e `opacity` — as duas propriedades que a GPU compõe sem recalcular layout. Não trava em celular.

- Entrada em cascata das seções conforme a rolagem (`.reveal`)
- Brilho dourado que segue o cursor nos cartões
- Inclinação 3D nos cartões de rota e nas fotos de serviço
- Contadores animados
- Varredura de brilho nos botões dourados
- Barra de progresso de leitura no topo
- Letreiro contínuo, halo pulsante no botão do WhatsApp, hover com zoom nas fotos
- Menu flyout no desktop, menu em painel deslizante no celular

Tudo respeita `prefers-reduced-motion`: quem configurou o sistema para reduzir animações recebe o site estático. E há um `<noscript>` que mantém o conteúdo visível se o JavaScript falhar.

### 2.6 Acessibilidade e LGPD

O site foi auditado e corrigido em cima dos achados:

- Contraste mínimo medido: **5,31:1** (WCAG AA exige 4,5:1)
- Todos os alvos de toque no celular com **44 px ou mais**
- Menu mobile com foco preso dentro do painel; o resto da página fica `inert`
- Acordeão com `role="region"`, `aria-labelledby` e conteúdo fechado fora da árvore de acessibilidade
- Link "pular para o conteúdo", foco visível em tudo, hierarquia de títulos sem saltos
- Zero erros de JavaScript nas 18 páginas
- Sem overflow horizontal em 390 px, 768 px e 1440 px

**Consentimento de cookies.** O GTM antes carregava sempre, sem opção de recusa. Agora existe um banner: o GTM só é injetado depois do "Aceitar", a escolha fica salva e o banner não reaparece. Quem recusa nunca carrega o Google Analytics.

---

## Parte 3 — Como publicar

### Vercel (recomendado)

1. Suba a pasta do projeto para um repositório no GitHub.
2. Em [vercel.com](https://vercel.com) → **Add New** → **Project** → selecione o repositório.
3. A Vercel detecta o Astro sozinho. Não mexa em nada, clique em **Deploy**.
4. Em **Settings → Domains**, adicione `dsprimetransporteexecutivo.com.br` e siga as instruções de DNS.

O `vercel.json` já está no projeto com os cabeçalhos de segurança e cache.

### Netlify

Mesmo fluxo. O `netlify.toml` já define comando de build (`npm run build`) e pasta de publicação (`dist`).

### Hospedagem tradicional (cPanel, Hostinger)

```bash
npm install
npm run build
```

Envie **o conteúdo da pasta `dist/`** para `public_html`. Nada de Node no servidor — são arquivos estáticos.

### Rodar localmente

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # gera dist/
npm run preview  # testa o build de produção
```

---

## Parte 4 — O que depende de você

### 4.1 Avaliações do Google (prioridade alta)

Em `src/components/home/Avaliacoes.astro` há um array vazio:

```ts
const AVALIACOES: { autor: string; nota: number; data: string; texto: string }[] = [];
```

Copie 3 a 6 avaliações **reais** do perfil do Google Business e preencha:

```ts
const AVALIACOES = [
  { autor: 'Marcelo R.', nota: 5, data: '2026-02-14', texto: 'Texto exato da avaliação...' },
];
```

A seção passa a exibir os depoimentos automaticamente. **Só depois disso** é seguro reativar o `aggregateRating` — as avaliações precisam estar visíveis na página, senão volta a ser violação de política.

Enquanto o array estiver vazio, a página mostra três cartões de credibilidade e o selo com link para o perfil público do Google.

### 4.2 Confirme os números

Estes vieram do site antigo e nunca foram verificados. Se algum não bater, ajuste antes de publicar:

- "+4.800 viagens realizadas" e "+100 empresas atendidas" — `src/components/home/Numeros.astro`
- Nota 5,0 no Google — mesma linha
- Marcos de 2023 e 2024 na linha do tempo — `src/pages/sobre.astro`
- Razão social em `/sobre` está usando o nome fantasia. Se a razão social registrada for diferente, corrija.

### 4.3 E-mail de contato

Coloquei `contato@dsprimetransporteexecutivo.com.br` como placeholder em `src/data/site.ts`. Troque pelo endereço real — ele aparece no rodapé, na página de contato, na política de privacidade e nos dados estruturados.

### 4.4 Fotos

As imagens vieram do projeto antigo e são renders de banco de imagens, não fotos da operação. Duas consequências:

- A foto do hero é um BMW Série 7, que não está na frota declarada.
- As fotos "da frota" não são os veículos reais da DS Prime.

Para SEO local e credibilidade, **fotos reais valem muito mais**. Substitua os arquivos em `src/assets/fleet/` mantendo os nomes (`byd.jpg`, `corolla.jpg`, etc.) e o site usa as novas automaticamente.

Duas fotos de rota também não retratam a cidade que nomeiam — `route-sc.jpg` é Balneário Camboriú (não Florianópolis) e `route-rs.jpg` é Gramado (não Porto Alegre). Os textos alternativos já foram corrigidos para descrever o que a foto realmente mostra, e ambas as cidades são atendidas nessas rotas. Ainda assim, o ideal é trocar por fotos das cidades corretas.

### 4.5 Depois de publicar

1. **Google Search Console** → adicione a propriedade → envie `https://dsprimetransporteexecutivo.com.br/sitemap-index.xml`.
2. **Teste de resultados aprimorados** ([search.google.com/test/rich-results](https://search.google.com/test/rich-results)) → cole a URL de uma página de serviço e confirme que `Service`, `HowTo` e `FAQPage` aparecem sem erro.
3. **PageSpeed Insights** → rode na home e numa página de serviço.
4. **Google Business** → confirme que nome, endereço e telefone estão idênticos aos do site. Divergência entre os dois enfraquece o SEO local.
5. **Bing Webmaster Tools** → envie o mesmo sitemap.

---

## Parte 5 — Onde mexer no conteúdo

Quase tudo está centralizado em **`src/data/site.ts`**. Editar ali reflete no site inteiro:

| O que | Onde |
|---|---|
| Telefone, endereço, CNPJ, e-mail, Instagram | `CONTACT` |
| Mensagens pré-prontas do WhatsApp | `WA` |
| Serviços (título, textos, FAQ, benefícios) | `SERVICOS` |
| Rotas (distância, duração, cidades, FAQ) | `ROTAS` |
| Cidades da região atendida | `CIDADES_REGIAO` |
| Frota | `FROTA` |
| FAQ da home | `FAQ_GERAL` |
| Diferenciais e itens inclusos | `DIFERENCIAIS`, `INCLUSO` |

Adicionar um serviço ou uma rota nova = adicionar um objeto ao array. A página, o menu, o rodapé, o sitemap e os dados estruturados são gerados sozinhos.

Cores e tipografia ficam em `src/styles/global.css` (bloco `:root`) e `tailwind.config.mjs`.

---

## Parte 6 — Próximos passos para crescer no orgânico

Em ordem de retorno:

1. **Preencher as avaliações reais** (4.1) — social proof é o que converte visita em contato.
2. **Trocar por fotos reais** (4.4) — imagens próprias com geolocalização ajudam no SEO local.
3. **Blog.** Um artigo por mês respondendo dúvidas reais ("Quanto tempo antes chegar no aeroporto de Chapecó", "Vale a pena ir de carro ou avião de Chapecó a São Paulo") atrai quem ainda está pesquisando. A estrutura do Astro já suporta — é criar `src/pages/blog/`.
4. **Mais páginas de rota.** Chapecó → Erechim, Passo Fundo, Xanxerê, Concórdia, Joaçaba. Cada uma é um objeto novo no array `ROTAS`.
5. **Google Business ativo.** Postar semanalmente, responder todas as avaliações, manter fotos atualizadas. Para negócio local, o perfil pesa tanto quanto o site.
6. **Citações locais (NAP).** Cadastrar nome, endereço e telefone — sempre idênticos — em ACIC Chapecó, catálogos regionais e associações do setor.
