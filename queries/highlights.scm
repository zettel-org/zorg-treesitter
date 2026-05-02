; Initial Zorg highlight query.
; These captures are intentionally token-level until the grammar grows
; semantic nodes for file headers, nested zettel, and fenced code bodies.

(id) @constant
(local_id) @constant
(hash_reference) @tag
(property) @property
(todo_marker) @keyword
(child_link) @reference
(sibling_link) @reference
(percent_fence) @punctuation.delimiter
(code_fence) @punctuation.special
