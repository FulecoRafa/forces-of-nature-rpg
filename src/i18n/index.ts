import { url, routeOf } from '../lib/url';
import { ui } from './ui';

export const LANGS = ['pt', 'en'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'pt';
export const LANG_NAMES: Record<Lang, string> = { pt: 'PT', en: 'EN' };

/** Idioma pela rota: o português fica na raiz, os outros sob /<lang>. */
export function langOf(pathname: string): Lang {
  const seg = routeOf(pathname).split('/')[1];
  return (LANGS as readonly string[]).includes(seg) && seg !== DEFAULT_LANG ? (seg as Lang) : DEFAULT_LANG;
}

/** Rota sem o prefixo de idioma ("/en/lore" → "/lore"). */
export function unlocalized(pathname: string): string {
  const route = routeOf(pathname);
  const lang = langOf(pathname);
  if (lang === DEFAULT_LANG) return route;
  return route.slice(lang.length + 1) || '/';
}

/** Rota interna no idioma ("/lore" → "/en/lore"). */
export function localized(lang: Lang, path: string): string {
  if (/^[a-z]+:/i.test(path) || lang === DEFAULT_LANG) return path;
  return `/${lang}${path === '/' ? '' : path}`;
}

/** Tudo o que uma página ou componente precisa para falar o idioma da rota atual. */
export function useI18n(astroUrl: URL) {
  const lang = langOf(astroUrl.pathname);
  return {
    lang,
    t: ui[lang],
    /** Link interno no idioma atual, já com o base do site. */
    u: (path: string) => url(localized(lang, path)),
  };
}

/** Parâmetro `[...lang]` das rotas: vazio para o português, "en" para o inglês. */
export const langParam = (lang: Lang) => (lang === DEFAULT_LANG ? undefined : lang);

/** getStaticPaths de uma página sem outros parâmetros. */
export const langPaths = () => LANGS.map((lang) => ({ params: { lang: langParam(lang) } }));

/** Ordenação alfabética no idioma. */
export const collator = (lang: Lang) => new Intl.Collator(ui[lang].meta.locale).compare;
