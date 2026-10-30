/** Lore page chronology (English). `nature` colors the marker; without a nature it uses the accent. */
export const chronology: { era: string; title: string; text: string; nature?: string }[] = [
  {
    era: 'AGE OF THE ANCESTORS',
    title: 'The wormhole network',
    text: 'The ancestors of Penrose scatter portals across Navajo using gravitational technologies.',
    nature: 'gravidade',
  },
  {
    era: 'THE DECLINE',
    title: 'Societies flee Navajo',
    text: 'Groups seeking refuge haul structures to an intergalactic black hole and found Penrose City.',
    nature: 'gravidade',
  },
  {
    era: 'THE WEIGHT OF MAGIC',
    title: 'The mental strain on humanity',
    text: 'Ever since it learned to manipulate the basic forces, humanity has suffered from madness. The monks of Silence Penascle claim to resist it.',
    nature: 'alma',
  },
  {
    era: 'NOW',
    title: 'A great war on Navajo',
    text: 'Penrose withdraws its level 1 and 2 agents from the planet. Voss crosses the portal; Lars leaves the war and seeks out the monks.',
  },
];

export const places: { name: string; kind: string; text: string; href: string }[] = [
  { name: 'Navajo', kind: 'PLANET', text: 'The promised planet. Now at war.', href: '/wiki/navajo' },
  { name: 'Local Group', kind: 'REGION', text: 'Where Penrose City lies hidden.', href: '/sociedades/penrose-city' },
  {
    name: 'Penrose City',
    kind: 'SOCIETY · SPACEBORNE',
    text: 'A refuge on the edge of a black hole.',
    href: '/sociedades/penrose-city',
  },
  {
    name: 'Silence Penascle',
    kind: 'SOCIETY · TERRESTRIAL',
    text: 'A temple of monks carved into a hollow mountain.',
    href: '/sociedades/silence-penascle',
  },
];
