import { getCollection, type CollectionEntry } from 'astro:content';
import naturesData from '../data/natures.json';
import naturesEn from '../data/natures.en.json';
import { DEFAULT_LANG, type Lang } from '../i18n';

export type Nature = CollectionEntry<'natures'>['data'];
export type Typography = Nature['typography'];

export const GROUPS: { id: string; label: string }[] = naturesData.groups;
const ORDER = naturesData.natures.map((n) => n.id);

/**
 * Cor da natureza: mesma luminosidade e croma para todas.
 * A luminosidade vem de `--nat-l`, que o modo escuro aumenta.
 */
export const natColor = (h: number, a?: number) =>
  a == null ? `oklch(var(--nat-l) 0.16 ${h})` : `oklch(var(--nat-l) 0.16 ${h} / ${a})`;
/** Variante para fundo escuro. */
export const natColorDark = (h: number) => `oklch(0.72 0.14 ${h})`;

type Overlay = {
  groups: Record<string, string>;
  natures: Record<string, Partial<Record<'name' | 'short' | 'description' | 'can' | 'uiBehavior' | 'scale', string>> & { interactions?: string[] }>;
};
const OVERLAYS: Partial<Record<Lang, Overlay>> = { en: naturesEn };

/** Naturezas com os textos no idioma pedido (o português é a base). */
export async function getNatures(lang: Lang = DEFAULT_LANG): Promise<Nature[]> {
  const all = (await getCollection('natures')).map((e) => e.data);
  const ov = OVERLAYS[lang];
  return all
    .map((n) => {
      const o = ov?.natures[n.id];
      if (!o) return n;
      const { interactions, ...texts } = o;
      return {
        ...n,
        ...texts,
        interactions: n.interactions.map((x, i) => ({ ...x, text: interactions?.[i] ?? x.text })),
      };
    })
    .sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));
}

export async function getNatureMap(lang: Lang = DEFAULT_LANG): Promise<Record<string, Nature>> {
  return Object.fromEntries((await getNatures(lang)).map((n) => [n.id, n]));
}

/** "N-01", "N-02"… pela posição na lista. */
export const natureNumber = (index: number) => 'N-' + String(index + 1).padStart(2, '0');

export const groupLabel = (id: string, lang: Lang = DEFAULT_LANG) =>
  OVERLAYS[lang]?.groups[id] ?? GROUPS.find((g) => g.id === id)?.label ?? id.toUpperCase();

/**
 * Estilo tipográfico da natureza, aplicado sempre que o nome dela aparece.
 * `shadowScale` aumenta os text-shadows (o H1 usa 2.2).
 */
export function typeStyle(t: Typography, opts: { shadow?: boolean; shadowScale?: number; transform?: boolean } = {}) {
  const { shadow = true, shadowScale = 1, transform = true } = opts;
  const sh =
    shadowScale === 1 ? t.sh : t.sh.replace(/(\d+(?:\.\d+)?)px/g, (_, v) => (Number(v) * shadowScale).toFixed(0) + 'px');
  return [
    `font-weight:${t.fw}`,
    `font-style:${t.fs}`,
    `letter-spacing:${t.ls}`,
    shadow ? `text-shadow:${sh}` : '',
    transform && t.tr !== 'none' ? `transform:${t.tr};display:inline-block` : '',
  ]
    .filter(Boolean)
    .join(';');
}

/** Escala das coordenadas de partícula por tamanho (base 14px). */
export const SPEC_SIZES = {
  sm: { px: 8, k: 0.57, border: 1 },
  md: { px: 14, k: 1, border: 1.5 },
  lg: { px: 34, k: 2.4, border: 2.5 },
} as const;
export type SpecSize = keyof typeof SPEC_SIZES;

const pick = <T,>(v: T | T[], i: number): T => (Array.isArray(v) ? v[i] : v);

/**
 * Variáveis CSS de cada partícula para os dois estados (repouso e ativo).
 * O CSS em NatureSpecimen alterna entre `--r-*` e `--a-*`.
 */
export function particleVars(n: Nature, size: SpecSize) {
  const { k, border } = SPEC_SIZES[size];
  const { shape, active: a } = n.particles;
  const c = natColor(n.hue);
  return a.x.map((_, i) => {
    const fill = pick(shape.fill, i);
    const shadow = shape.glow
      ? `0 0 ${(10 * k).toFixed(1)}px ${c}`
      : shape.ring && i === 2
        ? `0 0 0 ${(4 * k).toFixed(1)}px ${natColor(n.hue, 0.22)}, 0 0 0 ${(9 * k).toFixed(1)}px ${natColor(n.hue, 0.1)}`
        : 'none';
    return [
      `--bg:${fill ? c : 'transparent'}`,
      `--bd:${border}px ${shape.dashed ? 'dashed' : 'solid'} ${c}`,
      `--r-rad:${pick(shape.rad, 0)}`,
      `--a-rad:${pick(shape.rad, i)}`,
      `--a-tr:translate(${(a.x[i] * k).toFixed(1)}px, ${(a.y[i] * k).toFixed(1)}px) rotate(${a.r[i]}deg) scale(${a.s[i]})`,
      `--a-op:${a.o[i]}`,
      `--a-sh:${shadow}`,
    ].join(';');
  });
}

/** Fio horizontal que atravessa o espécime (Alma). */
export const threadBg = (h: number, width: number) =>
  `linear-gradient(transparent calc(50% - ${width / 2}px), ${natColor(h, 0.55)} calc(50% - ${width / 2}px), ${natColor(h, 0.55)} calc(50% + ${width / 2}px), transparent calc(50% + ${width / 2}px))`;
