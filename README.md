# tree-sitter-zorg

Tree-sitter grammar for Zorg `.z` files.

This repository supplies the parser and editor-query foundation for the Zorg
toolchain. The syntax contract lives in `../zorg/docs`, especially:

- `../zorg/docs/syntax.md`
- `../zorg/docs/model.md`
- `../zorg/fixtures/README.md`

## Epic 2 Scope

Epic 2 turns the Epic 1 token skeleton into the parser of record for Zorg v1
source. The grammar should model Zorg structure and source spans, while leaving
semantic validation to the Rust model and query layers.

The public grammar contract is documented in `docs/grammar.md`. Keep that file
in sync when adding or renaming public nodes.

The grammar owns syntax nodes for:

- file headers and their opening/closing fence boundaries
- nested zettel openings and list nesting
- paragraphs, blank lines, and fenced code blocks
- IDs, local IDs, links, tags, type tags, properties, todo markers, and title
  text

The grammar intentionally does not implement:

- link resolution, local-ID resolution, duplicate-ID detection, tag inheritance,
  property value typing, query execution, or template expansion
- broad Markdown parsing beyond the Zorg structures needed for source spans
- compatibility syntax for the Python-era formats

The current checked-in grammar is a structural block grammar. It recognizes:

- percent-fenced file headers
- header opening, header body, and header closing lines
- nested zettel openings and ordinary indented body spans
- paragraphs and blank line separators
- absolute IDs such as `@project/plan`
- local IDs such as `^task`
- type tags such as `#z/todo`, ordinary tags such as `#area/work`, and
  paragraph absolute links such as `#project/plan`
- child and sibling links such as `+task` and `~review`
- `key::value` properties
- todo markers `[ ]`, `[N]`, `[X]`, and `[?]`
- Markdown-style fenced code blocks, including fence boundaries, info strings,
  raw body wrappers, and raw body lines
- title text

Query and template definitions use the ordinary zettel grammar. A `#z/query`
zettel may carry either `query::...` or a fenced `swog` block, and a `#z/tmpl`
zettel may carry a fenced `zorg-template` block. The grammar preserves those
fence info strings and raw bodies without parsing SWOG filters or template
variables internally.

The grammar models common two-space Zorg list indentation directly for stable
source spans. It does not try to implement full Markdown list semantics.

There are no nodes for `.zo`, `.zoq`, `.zot`, `.zoc`, `ID::`, `LID::`,
`tick::`, old folgezettel IDs, tag sugar, or Python-era link behavior.

## Repository Layout

- `grammar.js`: minimal executable grammar. Add new grammar rules here.
- `docs/grammar.md`: public node names, naming rules, and semantic boundaries.
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

Before handing off grammar work, run:

```sh
npm run generate
npm test
```
