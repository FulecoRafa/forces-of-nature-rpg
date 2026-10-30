/** Cronologia da página de Lore. `nature` pinta o marcador; sem natureza usa o accent. */
export const chronology: { era: string; title: string; text: string; nature?: string }[] = [
  {
    era: 'ERA DOS ANTEPASSADOS',
    title: 'A rede de buracos de minhoca',
    text: 'Antepassados de Penrose espalham portais por Navajo usando tecnologias gravitacionais.',
    nature: 'gravidade',
  },
  {
    era: 'A DECADÊNCIA',
    title: 'Sociedades fogem de Navajo',
    text: 'Grupos em busca de refúgio levam estruturas até um buraco negro intergaláctico e fundam a Cidade de Penrose.',
    nature: 'gravidade',
  },
  {
    era: 'O PESO DA MAGIA',
    title: 'A pressão mental sobre a humanidade',
    text: 'Desde que aprendeu a manipular as forças básicas, a humanidade sofre com a loucura. Os monges de Silence Penascle dizem resistir a ela.',
    nature: 'alma',
  },
  {
    era: 'AGORA',
    title: 'Uma grande guerra em Navajo',
    text: 'Penrose retira seus agentes de nível 1 e 2 do planeta. Voss atravessa o portal; Lars deixa a guerra e procura os monges.',
  },
];

export const places: { name: string; kind: string; text: string; href: string }[] = [
  { name: 'Navajo', kind: 'PLANETA', text: 'O planeta prometido. Hoje em guerra.', href: '/wiki/navajo' },
  { name: 'Grupo Local', kind: 'REGIÃO', text: 'Onde está escondida a Cidade de Penrose.', href: '/sociedades/penrose-city' },
  {
    name: 'Cidade de Penrose',
    kind: 'SOCIEDADE · ESPACIAL',
    text: 'Refúgio às margens de um buraco negro.',
    href: '/sociedades/penrose-city',
  },
  {
    name: 'Silence Penascle',
    kind: 'SOCIEDADE · TERRENA',
    text: 'Templo de monges esculpido numa montanha oca.',
    href: '/sociedades/silence-penascle',
  },
];
