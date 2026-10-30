import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import naturesData from './data/natures.json';

const natureIds = naturesData.natures.map((n) => n.id) as [string, ...string[]];
const NatureId = z.enum(natureIds);
const KV = z.object({ k: z.string(), v: z.string() });
const Person = z.object({ name: z.string(), role: z.string(), href: z.string().optional() });

const natures = defineCollection({
  loader: file('src/data/natures.json', { parser: (text) => JSON.parse(text).natures }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    symbol: z.string(),
    hue: z.number(),
    group: z.string(),
    short: z.string(),
    description: z.string(),
    can: z.string(),
    uiBehavior: z.string(),
    scale: z.string(),
    typography: z.object({ fw: z.number(), fs: z.string(), ls: z.string(), sh: z.string(), tr: z.string() }),
    particles: z.object({
      shape: z.object({
        rad: z.union([z.string(), z.array(z.string())]),
        fill: z.union([z.boolean(), z.array(z.boolean())]),
        glow: z.boolean().optional(),
        ring: z.boolean().optional(),
        dashed: z.boolean().optional(),
        thread: z.boolean().optional(),
      }),
      activeGap: z.number(),
      active: z.object({
        x: z.array(z.number()),
        y: z.array(z.number()),
        r: z.array(z.number()),
        s: z.array(z.number()),
        o: z.array(z.number()),
      }),
    }),
    interactions: z.array(z.object({ with: NatureId, text: z.string() })),
  }),
});

const societies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/societies' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Título quebrado em linhas no hero (usa \n). */
      displayTitle: z.string().optional(),
      navLabel: z.string(),
      code: z.string(),
      nature: NatureId,
      tech: z.boolean(),
      kind: z.string(),
      theme: z.enum(['penrose', 'silence']),
      lead: z.string(),
      cardSummary: z.string(),
      date: z.coerce.date().optional(),
      heroImage: image().optional(),
      heroCaption: z.string().optional(),
      images: z.array(z.object({ id: z.string(), src: image(), caption: z.string() })).default([]),
      values: z
        .array(
          z.object({
            title: z.string(),
            motto: z.string(),
            description: z.string().optional(),
            appearance: z.string().optional(),
            featured: z.boolean().default(false),
          }),
        )
        .default([]),
      law: z.object({ title: z.string(), text: z.string() }).optional(),
      infobox: z.array(KV).default([]),
      people: z.array(Person).default([]),
      ranks: z.array(z.object({ name: z.string(), description: z.string(), swatch: z.string() })).default([]),
      secret: z
        .object({
          label: z.string(),
          body: z.string(),
          image: image().optional(),
          imageCaption: z.string().optional(),
          values: z.array(z.object({ title: z.string(), motto: z.string() })).default([]),
          notes: z.array(z.object({ label: z.string(), text: z.string() })).default([]),
          people: z.array(Person).default([]),
        })
        .optional(),
      draft: z.boolean().default(false),
    }),
});

const stories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stories' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      society: z.string(),
      nature: NatureId,
      readingMinutes: z.number(),
      cover: image(),
      summary: z.string(),
      spoiler: z.boolean().default(false),
      order: z.number().default(0),
      draft: z.boolean().default(false),
    }),
});

const entries = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/entries' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      type: z.enum(['Feitiço', 'Máquina', 'Item', 'Sociedade', 'Personagem', 'Lugar', 'Mecânica']),
      nature: NatureId.nullable().default(null),
      path: z.enum(['orgânica', 'maquinal']).optional(),
      cost: z.string().optional(),
      society: z.string().optional(),
      summary: z.string(),
      code: z.string().optional(),
      image: image().optional(),
      imageCaption: z.string().optional(),
      /** Valores de regra ainda provisórios. */
      example: z.boolean().default(false),
      infobox: z.array(KV).default([]),
      rules: z.array(KV).default([]),
      /** Se definido, a busca leva direto para esta rota (ex.: página da sociedade). */
      href: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { natures, societies, stories, entries };
