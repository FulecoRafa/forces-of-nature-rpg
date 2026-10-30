/**
 * Créditos das artes feitas por pessoas, pelo nome do arquivo em src/assets/arte.
 * Imagem sem crédito aqui é tratada como gerada por IA e ganha o aviso de canto.
 *
 * Exemplo: 'penrose-portal.png': { artist: 'Fulana', url: 'https://…' },
 */
export const credits: Record<string, { artist: string; url?: string }> = {};

/** "…/penrose-portal.Ab12.webp?x" → "penrose-portal" */
export const artKey = (src: string) => decodeURIComponent(src.split(/[?#]/)[0].split('/').pop() ?? '').split('.')[0];

export const creditFor = (src: string) =>
  Object.entries(credits).find(([file]) => artKey(file) === artKey(src))?.[1];
