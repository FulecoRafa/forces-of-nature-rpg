#!/usr/bin/env bash
# Publica o site sem GitHub Actions: compila aqui e envia ./dist para a branch gh-pages.
# A branch guarda só o artefato estático; cada deploy substitui o anterior.
set -euo pipefail

cd "$(dirname "$0")/.."
remote=$(git remote get-url origin)
rev=$(git rev-parse --short HEAD)

npm run build
touch dist/.nojekyll # serve as pastas _astro/ sem passar pelo Jekyll

cd dist
rm -rf .git
git init -q -b gh-pages
git add -A
git commit -qm "deploy: site em ${rev}"
git push -f "$remote" gh-pages
rm -rf .git

echo "Publicado: https://fulecorafa.github.io/forces-of-nature-rpg/"
