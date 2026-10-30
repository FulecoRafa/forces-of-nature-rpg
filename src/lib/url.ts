const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefixa o `base` do site numa rota interna ("/lore" → "/forces-of-nature-rpg/lore"). */
export function url(path = '/'): string {
  if (/^[a-z]+:/i.test(path)) return path;
  const p = path.startsWith('/') ? path : '/' + path;
  return BASE + p;
}

/** Rota atual sem o base e sem barra final ("/" para a home). */
export function routeOf(pathname: string): string {
  let p = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  p = p.replace(/\/$/, '');
  return p || '/';
}
