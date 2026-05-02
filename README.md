# tree-sitter-zorg

Tree-sitter grammar skeleton for Zorg `.z` files.

This repository supplies the parser and editor-query foundation for the Zorg
toolchain. The syntax contract lives in `../zorg/docs`, especially:

- `../zorg/docs/syntax.md`
- `../zorg/docs/model.md`
- `../zorg/fixtures/README.md`

## Current Scope

The Epic 1 grammar is intentionally small. It recognizes a document as a stream
of conservative tokens:

- percent-fenced file headers
- absolute IDs such as `@project/plan`
- local IDs such as `^task`
- hash references such as `#z/todo` and `#project/plan`
- child and sibling links such as `+task` and `~review`
- `key::value` properties
- todo markers `[ ]`, `[N]`, `[X]`, and `[?]`
- Markdown-style code fences
- basic text

It does not implement the full semantic model, link resolution, tag
inheritance, query execution, template expansion, diagnostics, or legacy syntax
compatibility. In particular, there are no nodes for `.zo`, `.zoq`, `.zot`,
`.zoc`, `ID::`, `LID::`, `tick::`, old folgezettel IDs, tag sugar, or
Python-era link behavior.

## Repository Layout

- `grammar.js`: minimal executable grammar. Add new grammar rules here.
- `test/corpus/`: Tree-sitter corpus tests seeded from the shared Zorg fixtures.
- `corpus`: compatibility symlink to `test/corpus` for agents expecting the
  top-level path named in the Epic 1 plan.
- `queries/highlights.scm`: starter syntax highlight captures.
- `queries/locals.scm`: placeholder for future local-ID scope captures.
- `queries/folds.scm`: placeholder for future fold captures.
- `queries/injections.scm`: placeholder for future fenced-code injections.
- `tree-sitter.json`: CLI grammar metadata and query locations.

## Generated Artifacts

Generated parser output is not committed in Epic 1. `tree-sitter generate`
creates `src/parser.c`, `src/grammar.json`, `src/node-types.json`, and helper
headers under `src/tree_sitter/`; `.gitignore` excludes those files for now.

When this grammar is ready for published bindings, a later phase should decide
which generated parser and binding files to commit, then enable the matching
bindings in `tree-sitter.json`.

## Development

Install dependencies:

```sh
npm install
```

Generate the parser:

```sh
npm run generate
```

Run corpus tests:

```sh
npm test
```

The same commands can be run directly with a globally installed Tree-sitter CLI:

```sh
tree-sitter generate
tree-sitter test
```

Use `../zorg/fixtures/corpus` as the source for additional shared examples.
Keep new corpus cases small and avoid encoding speculative syntax before the
semantic parser work lands.
