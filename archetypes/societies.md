+++
date = '{{ .Date }}'
draft = true
title = '{{ replace .File.ContentBaseName "-" " " | title }}'
# Allowed: {{ range site.Data.natures.values }}{{ . }} {{ end }}
nature = '{{ (index site.Data.natures.values 0)}}'
tech = true
+++
## Introdução

## Mais sobre

## A cidade

## Valores