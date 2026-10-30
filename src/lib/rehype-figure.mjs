// Transforma um parágrafo que contém só uma imagem em <figure>.
// O título da imagem vira a legenda: ![alt](src "LEGENDA").
// Toda figura ganha o aviso de "gerada por IA" (mesmo markup de AiBadge.astro),
// a menos que o arquivo tenha crédito em src/data/art.ts.
import { creditFor } from '../data/art.ts';
import { ui } from '../i18n/ui.ts';

export default function rehypeFigure({ base = '' } = {}) {
  return (tree, file) => {
    const lang = /[\\/]en[\\/]/.test(file.path ?? '') ? 'en' : 'pt';
    walk(tree, { lang, href: `${base}${lang === 'pt' ? '' : '/' + lang}/artes` });
  };
}

function badge(src, { lang, href }) {
  const credit = creditFor(String(src ?? ''));
  const t = ui[lang];
  const el = (tagName, properties, children) => ({ type: 'element', tagName, properties, children });
  const text = (value) => ({ type: 'text', value });
  if (credit) {
    const who = credit.url ? el('a', { href: credit.url }, [text(credit.artist)]) : text(credit.artist);
    return el('span', { className: ['ai-badge', 'credit', 'md'] }, [text(t.art.credited + ' '), who]);
  }
  return el('a', { className: ['ai-badge', 'md'], href, title: t.ai.label }, [
    el('span', { className: ['b'] }, [text(t.ai.badge)]),
    el('span', { className: ['i'] }, [text(t.ai.invite)]),
  ]);
}

function walk(node, ctx) {
  if (!node.children) return;
  node.children = node.children.map((child) => {
    if (child.type === 'element' && child.tagName === 'p') {
      const kids = child.children.filter((c) => !(c.type === 'text' && !c.value.trim()));
      if (kids.length === 1 && kids[0].type === 'element' && kids[0].tagName === 'img') {
        const img = kids[0];
        const caption = img.properties?.title;
        if (img.properties) delete img.properties.title;
        const figure = { type: 'element', tagName: 'figure', properties: {}, children: [img, badge(img.properties?.src, ctx)] };
        if (caption) {
          figure.children.push({
            type: 'element',
            tagName: 'figcaption',
            properties: {},
            children: [{ type: 'text', value: String(caption) }],
          });
        }
        return figure;
      }
    }
    walk(child, ctx);
    return child;
  });
}

// Tudo o que vem depois de <hr class="descent" /> (no nível de topo) fica dentro de
// <div class="descent">, para o leitor pintar a descida às cavernas.
export function rehypeDescent() {
  return (tree) => {
    const i = tree.children.findIndex(isDescentMarker);
    if (i < 0) return;
    const after = tree.children.slice(i + 1);
    tree.children = [
      ...tree.children.slice(0, i),
      { type: 'element', tagName: 'div', properties: { className: ['descent'] }, children: after },
    ];
  };
}

function isDescentMarker(node) {
  if (node.type === 'raw') return /<hr[^>]*class="descent"/.test(node.value);
  if (node.type === 'element' && node.tagName === 'hr') {
    const cls = node.properties?.className;
    return Array.isArray(cls) ? cls.includes('descent') : cls === 'descent';
  }
  return false;
}
