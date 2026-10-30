import type { Lang } from '../i18n';
import { getLocalized, getLocalizedMap } from './content';

export async function getStories(lang: Lang) {
  return (await getLocalized('stories', lang)).sort((a, b) => a.data.order - b.data.order);
}

/** Conto e a sociedade a que pertence (o tema visual vem dela). */
export async function getStoryWithSociety(lang: Lang, slug: string) {
  const story = (await getStories(lang)).find((s) => s.slug === slug);
  if (!story) throw new Error(`Conto não encontrado: ${slug}`);
  const society = (await getLocalizedMap('societies', lang))[story.data.society];
  if (!society) throw new Error(`Sociedade "${story.data.society}" do conto "${slug}" não existe.`);
  return { story, society };
}
