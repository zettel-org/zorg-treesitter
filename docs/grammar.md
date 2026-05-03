# Zorg Grammar Contract

This document defines the public Tree-sitter node contract for Zorg v1 `.z`
files. `grammar.js` is the implementation source of truth; this file is the
contributor-facing agreement for node names and grammar boundaries across
`zorg-treesitter`, `zorg-parse`, and `zorg-nvim`.

The upstream syntax and semantic contracts live in:

- `../zorg/docs/syntax.md`
- `../zorg/docs/model.md`
- `../zorg/docs/query.md`
- `../zorg/docs/capture.md`
- `../zorg/fixtures/corpus/`

## Scope

The grammar parses source-backed Zorg structure:

- file zettel headers with percent fences
- nested zettel openings and ordinary body text
- paragraphs and blank line separators
- Markdown triple-backtick fenced code blocks
- v1 inline primitives used by zettel openings, headers, and paragraphs

The grammar should keep source spans precise and recover locally from malformed
input where possible. It should not validate semantic constraints such as link
targets, duplicate IDs, inherited tags, local-ID resolution, property value
types, query execution, or template expansion.

Do not add broad Markdown parsing unless the Zorg syntax contract depends on a
specific construct.

## Naming Rules

Public node names use lowercase `snake_case`. Rules beginning with `_` are
private implementation details and must not be referenced by downstream code.

Keep public nodes conservative. Rename or remove them only through an explicit
contract update and matching downstream audit.

## Public Block Nodes

- `source_file`: root node for a parsed `.z` file.
- `file_header`: percent-fenced file or directory zettel header at the top of a
  source file.
- `file_header_open`: opening header fence line. The line begins with `%%%` and
  may contain inline primitives and title text.
- `file_header_close`: closing header fence line. The closing marker is `%%%`
  with optional surrounding whitespace.
- `zettel_item`: nested zettel block beginning with a list marker and a
  `zettel_opening`.
- `zettel_opening`: the first line of a nested zettel, including its marker,
  inline primitives, and title text.
- `paragraph`: contiguous prose lines that are not another structural block.
- `blank_line`: source-backed blank line used where separators or folds need
  stable spans.
- `comment`: reserved public node name. Zorg v1 does not currently document a
  comment syntax, so the grammar should not emit this node until the syntax
  contract adds one.
- `fenced_code_block`: Markdown triple-backtick code fence with raw body text.
- `fence_start`: opening triple-backtick fence, including optional info string.
- `code_fence_body`: source-backed raw body between the opening and closing
  fence. The grammar does not parse language-specific internals here.
- `code_fence_content`: one non-empty raw body line inside a fenced code block.
- `fence_end`: closing triple-backtick fence.

Zettel nesting is line-oriented and currently models normal Zorg two-space
indentation for source spans and folds. It is intentionally not a complete
Markdown list parser.

Zorg v1 does not document comment syntax, so `comment` remains reserved and is
not emitted.

## Public Inline Nodes

- `id`: absolute zettel ID declaration, such as `@alpha` or `@alpha/beta`.
- `id_segment`: source-backed segment inside `id`, `local_id`, and slash-based
  links or tags where the implementation can expose segments without making the
  grammar brittle.
- `local_id`: local zettel ID declaration, such as `^meeting-notes`.
- `absolute_link`: hash reference parsed in a link position, such as
  `#alpha/beta`.
- `child_link`: child-relative link, such as `+task`.
- `sibling_link`: sibling-relative link, such as `~review`.
- `tag`: non-type tag parsed in a tag position, such as `#project` or
  `#area/work`.
- `type_tag`: tag in the reserved `#z/...` namespace.
- `property`: complete `key::value` property.
- `property_key`: key portion of a property. In the current grammar this node
  includes the trailing `::` delimiter so ordinary prose words do not tokenize
  as keys before the parser can see whether a value follows.
- `property_value`: raw value portion of a property. Trimming and type parsing
  belong to semantic consumers.
- `todo_marker`: one of `[ ]`, `[N]`, `[X]`, or `[?]`.
- `title_text`: plain opening/header text that is not one of the inline
  primitives above.

Hash-prefixed syntax is context sensitive in Zorg v1: `#area/work` may be a tag
in a zettel opening while `#project/plan` may be a link in prose. The grammar
should use parse position to choose `tag`, `type_tag`, or `absolute_link` where
possible. If a future rule cannot distinguish a hash form syntactically, it must
preserve the source span with one stable public node and document the semantic
handoff.

## Semantic Boundaries

The following behavior is intentionally outside the Tree-sitter grammar:

- Resolving `#absolute`, `+child`, `~sibling`, and `^local` references.
- Detecting duplicate IDs or missing ID-bearing ancestors.
- Applying tag inheritance from directories, file headers, or parent zettel.
- Validating property keys or typed values beyond syntax shape.
- Parsing SWOG query internals inside fenced `swog` blocks.
- Parsing template variables inside fenced `zorg-template` blocks.
- Deciding whether a recovered malformed construct is an indexing diagnostic.

Query and template definitions are ordinary Zorg zettel tagged with `#z/query`
or `#z/tmpl`. Fenced `swog` and `zorg-template` blocks are represented by the
same `fenced_code_block`, `fence_start`, `info_string`, `code_fence_body`,
`code_fence_content`, and `fence_end` nodes as any other language fence.
Consumers decide from tags and info strings whether to run query, template, or
editor-injection behavior.

## Generated Parser Policy

Generated parser output is not part of the committed source contract today.
Keep `src/` ignored, keep bindings disabled in `tree-sitter.json`, and
regenerate locally with `npm run generate` before running tests or consuming
`src/node-types.json`.

Until a packaging phase deliberately commits generated C sources and enables
bindings, downstream agents should treat these files as the stable inputs:

- `grammar.js`
- `docs/grammar.md`
- `queries/*.scm`
- `test/corpus/*.txt`
- shared examples in `../zorg/fixtures/corpus/`

Rust consumers should use the public nodes for source spans and perform
semantic validation after parsing. Neovim consumers should use parser name
`zorg`, filetype `zorg`, and the committed query files in this repository.

## No-Legacy Policy

Legacy Python-era syntax is not v1 compatibility syntax. Do not add public nodes
or aliases for `.zo`, `.zoq`, `.zot`, `.zoc`, `ID::`, `LID::`, `tick::`, custom
`@@@` fences, old folgezettel IDs, tag sugar, or Python-era link behavior.

Strict semantic checks may diagnose legacy-looking text. The grammar may recover
it as ordinary text or parse errors so diagnostics can retain source spans, but
it must not translate it into v1 model objects.

## Corpus Contract

Corpus tests should stay small and representative. Prefer copying or lightly
adapting examples from `../zorg/fixtures/corpus/` so downstream repositories
share the same source examples.

Each grammar phase should update corpus expected trees alongside rule changes.
Valid examples should parse without `ERROR` nodes. Malformed or legacy-looking
examples should prove recovery behavior without creating compatibility nodes.
