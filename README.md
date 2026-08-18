# DS Prime Transporte Executivo — site

Site institucional da DS Prime Transporte Executivo (Chapecó, SC).
Astro 5 + Tailwind CSS, 100% estático.

📄 **Leia primeiro:** [`RELATORIO-SEO.md`](./RELATORIO-SEO.md) — o que estava errado no site antigo, o que mudou, como publicar e o que ainda depende de você.

---

## Rodar

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # gera dist/
npm run preview    # testa o build de produção
```

Requer Node 20 ou superior.

---

## Estrutura

```
src/
├── data/
│   ├── site.ts          ← TODO o conteúdo do site (edite aqui)
│   └── images.ts        ← mapa nome → imagem importada
├── layouts/
│   └── Base.astro       ← <html>, head, header, footer
├── components/
│   ├── Seo.astro        ← metatags + JSON-LD de todas as páginas
│   ├── Header.astro     ← navegação desktop + menu mobile
│   ├── Footer.astro
│   ├── Icon.astro       ← ícones SVG inline (sem biblioteca)
│   ├── Effects.astro    ← todo o JS de interação (~2 KB)
│   ├── ConsentBanner.astro  ← consentimento LGPD, controla o GTM
│   ├── Faq.astro / CtaBand.astro / PageHero.astro / SectionHead.astro / Breadcrumbs.astro
│   └── home/            ← seções da página inicial
├── pages/
│   ├── index.astro
│   ├── servicos/[slug].astro   ← gera as 6 páginas de serviço
│   ├── rotas/[slug].astro      ← gera as 4 páginas de rota
│   ├── frota.astro / sobre.astro / contato.astro
│   ├── politica-de-privacidade.astro
│   └── 404.astro
├── styles/global.css    ← design tokens, @font-face, utilitários
└── assets/              ← imagens originais (Astro otimiza no build)
```

---

## Editar conteúdo

**Quase tudo está em `src/data/site.ts`.** Mudar o telefone ali atualiza header, rodapé, links de WhatsApp, página de contato e dados estruturados de uma vez.

### Adicionar um serviço

Adicione um objeto ao array `SERVICOS`. A página, a entrada no menu, o link no rodapé, o sitemap e o schema são gerados automaticamente.

### Adicionar uma rota

Adicione um objeto ao array `ROTAS`. Precisa de uma imagem em `src/assets/rotas/` registrada em `src/data/images.ts`.

### Trocar cores

`src/styles/global.css`, bloco `:root` — os valores são HSL sem a função `hsl()`:

```css
--gold: 42 65% 55%;      /* dourado principal */
--bg: 220 15% 6%;        /* fundo */
--ink: 40 20% 94%;       /* texto */
```

---

## Publicar

**Vercel / Netlify:** conecte o repositório. Configuração já incluída (`vercel.json`, `netlify.toml`).

**Hospedagem tradicional:** `npm run build` e envie o conteúdo de `dist/` para `public_html`.

Detalhes passo a passo no [`RELATORIO-SEO.md`](./RELATORIO-SEO.md#parte-3--como-publicar).

---

## Notas de manutenção

- **Não use `aggregateRating` no schema** enquanto não houver avaliações reais visíveis na página. Explicação em `src/components/Seo.astro` e no relatório.
- **`overflow-x: clip`** em `html`/`body` é intencional: as animações de entrada usam `translate` e sem isso o documento fica alguns pixels mais largo que a tela no celular.
- **Michroma** é usada só na marca e em numerais curtos. Títulos usam Inter com tracking apertado — Michroma é larga demais e quebra em telas pequenas.
- **Fontes auto-hospedadas** em `public/fonts/`. Se trocar de fonte, atualize os `@font-face` em `global.css` **e** os `preload` em `Seo.astro`.
- **GTM (`GTM-WWNXVRKQ`)** só carrega após consentimento, em `ConsentBanner.astro`.
