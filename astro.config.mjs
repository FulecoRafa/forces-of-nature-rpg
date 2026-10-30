// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import rehypeFigure, { rehypeDescent } from './src/lib/rehype-figure.mjs';

// Publicado em GitHub Pages como página de projeto.
const base = '/forces-of-nature-rpg';

export default defineConfig({
  site: 'https://fulecorafa.github.io',
  base,
  trailingSlash: 'ignore',
  markdown: {
    // Imagem sozinha num parágrafo vira <figure> (com o aviso de IA); o title vira legenda;
    // <hr class="descent" /> abre o bloco escuro dos contos.
    processor: unified({ rehypePlugins: [[rehypeFigure, { base }], rehypeDescent] }),
  },
  redirects: {
    '/naturezas': `${base}/naturezas/gravidade`,
    '/en/naturezas': `${base}/en/naturezas/gravidade`,
    // URLs antigas do site Hugo
    '/societies': `${base}/sociedades`,
    '/societies/penrose-city': `${base}/sociedades/penrose-city`,
    '/societies/silence-penascle': `${base}/sociedades/silence-penascle`,
  },
});
