// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://dsprimetransporteexecutivo.com.br',
  trailingSlash: 'ignore',
  build: {
    inlineStylesheets: 'auto',
    format: 'directory',
  },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      changefreq: 'weekly',
      lastmod: new Date(),
      filter: (page) => !page.includes('/404'),
      serialize(item) {
        // Remove a barra final para bater exatamente com a URL canônica
        // servida pela Vercel/Netlify (cleanUrls). URLs divergentes entre
        // sitemap e canonical geram avisos no Search Console.
        const isRoot = /\.com\.br\/?$/.test(item.url);
        if (!isRoot) item.url = item.url.replace(/\/+$/, '');

        const url = item.url;
        if (isRoot) item.priority = 1.0;
        else if (url.includes('/transfer-aeroporto') || url.includes('/transporte-executivo')) item.priority = 0.9;
        else if (url.includes('/rotas/')) item.priority = 0.7;
        else if (url.includes('/politica-de-privacidade')) { item.priority = 0.2; item.changefreq = 'yearly'; }
        else item.priority = 0.8;
        return item;
      },
    }),
  ],
  image: {
    responsiveStyles: true,
  },
  vite: {
    build: {
      cssCodeSplit: false,
      assetsInlineLimit: 2048,
    },
  },
});
