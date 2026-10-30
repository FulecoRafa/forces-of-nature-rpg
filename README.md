# Forces of Nature RPG

Site de referência do RPG, feito com [Astro](https://astro.build) e publicado no GitHub Pages
em <https://fulecorafa.github.io/forces-of-nature-rpg/>.

## Desenvolvimento

```sh
npm install
npm run dev      # http://localhost:4321/forces-of-nature-rpg/
npm run build    # gera ./dist
npm run preview  # serve ./dist
npm run check    # checagem de tipos
npm run deploy   # compila e publica no GitHub Pages
```

O deploy é feito daqui, sem GitHub Actions: `npm run deploy` compila o site e envia `./dist`
para a branch `gh-pages`, de onde o GitHub Pages serve o site. Rode depois de cada mudança
que deve ir ao ar.

## Onde fica o conteúdo

| O quê | Onde |
| --- | --- |
| Naturezas (cores, tipografia, partículas, interações) | `src/data/natures.json` (textos em inglês: `natures.en.json`) |
| Sociedades | `src/content/societies/{pt,en}/*.md` |
| Contos | `src/content/stories/{pt,en}/*.md` |
| Verbetes do arquivo | `src/content/entries/{pt,en}/*.md` |
| Cronologia e lugares da página de Lore | `src/data/lore.ts` / `lore.en.ts` |
| Textos da interface | `src/i18n/ui.ts` |
| Artes | `src/assets/arte/` (créditos em `src/data/art.ts`) |

Os campos aceitos em cada coleção estão em `src/content.config.ts`.

Nos contos, uma imagem sozinha num parágrafo vira figura (o `title` vira legenda), e
`<hr class="descent" />` abre o trecho escuro do conto.

### Idiomas

O português fica na raiz (`/`) e o inglês em `/en/`, com os mesmos slugs. Para traduzir um
texto, crie o arquivo com o mesmo nome em `en/`. Enquanto ele não existir, a página em inglês
mostra o texto em português com a marca "NOT YET TRANSLATED".

### Artes

Toda imagem leva o selo "GERADA POR IA", que leva para `/artes` (o chamado para artistas).
Quando uma arte feita por gente substituir uma imagem, registre o autor em `credits`, no
arquivo `src/data/art.ts`, com a chave igual ao nome do arquivo sem extensão. O selo vira
"Arte de …".

## Licenças

- **Código**: Apache 2.0 – veja `LICENSE`
- **Textos**: CC-BY 4.0 – veja `LICENSE-CONTENT.md`
- **Artes**: CC-BY-NC 4.0 – veja `LICENSE-ART.md`
