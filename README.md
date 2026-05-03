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

Stable public node names are:

- Blocks: `source_file`, `file_header`, `file_header_open`,
  `file_header_close`, `zettel_item`, `zettel_opening`, `paragraph`,
  `blank_line`, `fenced_code_block`, `fence_start`, `code_fence_body`,
  `code_fence_content`, and `fence_end`.
- Opening and fence tokens: `percent_fence`, `list_marker`,
  `code_fence_delimiter`, and `info_string`.
- Inline primitives: `id`, `id_segment`, `local_id`, `absolute_link`,
  `child_link`, `sibling_link`, `tag`, `type_tag`, `property`,
  `property_key`, `property_value`, `todo_marker`, and `title_text`.
- Supporting line nodes: `header_line` and `paragraph_line`.

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
- `queries/highlights.scm`: syntax highlight captures for IDs, links, tags,
  properties, todos, list/header/code fences, fence languages, and opening
  titles.
- `queries/folds.scm`: fold captures for file headers, zettel subtrees, and
  fenced code blocks.
- `queries/locals.scm`: conservative local-ID declaration captures scoped to
  zettel items. Reference resolution remains semantic.
- `queries/injections.scm`: fenced-code body injections using the fence
  `info_string` as the injection language, including `swog`, `zorg-template`,
  and ordinary language names.
- `tree-sitter.json`: CLI grammar metadata and query locations.

## Generated Artifacts

Epic 2 keeps generated parser output out of git. `tree-sitter generate` creates
`src/parser.c`, `src/grammar.json`, `src/node-types.json`, and helper headers
under `src/tree_sitter/`; `.gitignore` excludes `src/`, and
`tree-sitter.json` keeps language bindings disabled.

Downstream Rust and Neovim integration work must run `npm install` and
`npm run generate` before consuming generated files. Treat `grammar.js`,
`docs/grammar.md`, `queries/*.scm`, and corpus fixtures as the committed parser
contract until a packaging phase deliberately commits generated C sources and
enables bindings.

## Downstream Handoff

Rust model work in `zorg-parse` should consume the public nodes above for
source spans, then perform semantic validation for IDs, links, inherited tags,
properties, query definitions, and diagnostics.

Neovim work in `zorg-nvim` should register parser name `zorg` for filetype
`zorg` and use the query files from this repository. The query files are
tolerant of optional recovered nodes and rely only on public node names.

Do not add compatibility behavior for `.zo`, `.zoq`, `.zot`, `.zoc`, `ID::`,
`LID::`, `tick::`, `@@@` fences, old folgezettel IDs, tag sugar, or Python-era
link behavior in downstream consumers.

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

To validate the full Zorg MVP across the Rust, Tree-sitter, and Neovim sibling
repositories, run the Rust-root gate from `../zorg`:

```sh
../zorg/tools/validate_cross_repo.sh
```

Smoke-test editor highlighting with the representative `.z` fixture:

```sh
npx tree-sitter highlight test/highlight/smoke.z
```

If using a globally installed CLI instead of npm, run:

```sh
tree-sitter highlight test/highlight/smoke.z
```

The CLI may warn when no global parser directories are configured; that warning
does not block this local grammar smoke test when highlighted output is
produced.

Compile the editor query files against the smoke fixture before changing node
names or query captures:

```sh
npx tree-sitter query queries/highlights.scm test/highlight/smoke.z
npx tree-sitter query queries/folds.scm test/highlight/smoke.z
npx tree-sitter query queries/injections.scm test/highlight/smoke.z
npx tree-sitter query queries/locals.scm test/highlight/smoke.z
```

As a final integration check, parse the shared Zorg fixtures:

```sh
npx tree-sitter parse ../zorg/fixtures/corpus/*.z ../zorg/fixtures/corpus/dir/*.z
```

Valid fixtures should not emit `ERROR` nodes. Legacy-looking fixtures may
recover as ordinary text or syntax errors, but must not produce legacy
compatibility nodes.
