import { getCollection, type CollectionEntry } from 'astro:content';
import { DEFAULT_LANG, type Lang } from '../i18n';

type Coll = 'societies' | 'stories' | 'entries';

/**
 * Entrada no idioma pedido. O conteúdo fica em `<coleção>/<idioma>/<slug>.md`;
 * sem tradução, cai no português e marca `translated: false`.
 */
export type Localized<C extends Coll> = CollectionEntry<C> & { slug: string; translated: boolean };

export async function getLocalized<C extends Coll>(coll: C, lang: Lang): Promise<Localized<C>[]> {
  const all = (await getCollection(coll)) as CollectionEntry<C>[];
  const byLang = (l: Lang) =>
    new Map(all.filter((e) => e.id.startsWith(l + '/')).map((e) => [e.id.slice(l.length + 1), e]));
  const base = byLang(DEFAULT_LANG);
  const local = lang === DEFAULT_LANG ? base : byLang(lang);
  return [...base]
    .filter(([, e]) => !e.data.draft)
    .map(([slug, e]) => {
      const l = local.get(slug);
      return { ...(l ?? e), slug, translated: Boolean(l) };
    });
}

export async function getLocalizedMap<C extends Coll>(coll: C, lang: Lang) {
  return Object.fromEntries((await getLocalized(coll, lang)).map((e) => [e.slug, e]));
}

export async function getSocieties(lang: Lang) {
  return (await getLocalized('societies', lang)).sort((a, b) => a.data.code.localeCompare(b.data.code));
}
