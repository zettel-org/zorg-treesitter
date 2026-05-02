/**
 * @file Zorg grammar.
 * @author Zettel Org
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "zorg",

  extras: _ => [],

  rules: {
    source_file: $ => repeat($._block),

    _block: $ => choice(
      $.file_header,
      alias($._zettel_item0, $.zettel_item),
      alias(prec(-1, $._zettel_item1), $.zettel_item),
      alias(prec(-1, $._zettel_item2), $.zettel_item),
      alias(prec(-1, $._zettel_item3), $.zettel_item),
      alias($._fenced_code_block0, $.fenced_code_block),
      alias(prec(-1, $._fenced_code_block1), $.fenced_code_block),
      alias(prec(-1, $._fenced_code_block2), $.fenced_code_block),
      alias(prec(-1, $._fenced_code_block3), $.fenced_code_block),
      alias(prec(-1, $._fenced_code_block4), $.fenced_code_block),
      alias($._paragraph0, $.paragraph),
      alias(prec(-1, $._paragraph1), $.paragraph),
      alias(prec(-1, $._paragraph2), $.paragraph),
      alias(prec(-1, $._paragraph3), $.paragraph),
      alias(prec(-1, $._paragraph4), $.paragraph),
      $.blank_line,
    ),

    file_header: $ => seq(
      $.file_header_open,
      repeat(choice(
        $.header_line,
        $.blank_line,
      )),
      $.file_header_close,
    ),

    file_header_open: $ => seq(
      optional($._hspace),
      $.percent_fence,
      optional(seq($._hspace, $._inline_run)),
      $._line_end,
    ),

    header_line: $ => seq(
      optional($._hspace),
      $._inline_run,
      $._line_end,
    ),

    file_header_close: $ => seq(
      optional($._hspace),
      $.percent_fence,
      $._line_end,
    ),

    _zettel_item0: $ => prec.right(2, seq(
      alias($._zettel_opening0, $.zettel_opening),
      repeat(choice(
        alias($._fenced_code_block1, $.fenced_code_block),
        alias($._zettel_item1, $.zettel_item),
        alias($._paragraph1, $.paragraph),
        $.blank_line,
      )),
    )),

    _zettel_item1: $ => prec.right(2, seq(
      alias($._zettel_opening1, $.zettel_opening),
      repeat(choice(
        alias($._fenced_code_block2, $.fenced_code_block),
        alias($._zettel_item2, $.zettel_item),
        alias($._paragraph2, $.paragraph),
        $.blank_line,
      )),
    )),

    _zettel_item2: $ => prec.right(2, seq(
      alias($._zettel_opening2, $.zettel_opening),
      repeat(choice(
        alias($._fenced_code_block3, $.fenced_code_block),
        alias($._zettel_item3, $.zettel_item),
        alias($._paragraph3, $.paragraph),
        $.blank_line,
      )),
    )),

    _zettel_item3: $ => prec.right(2, seq(
      alias($._zettel_opening3, $.zettel_opening),
      repeat(choice(
        alias($._fenced_code_block4, $.fenced_code_block),
        alias($._paragraph4, $.paragraph),
        $.blank_line,
      )),
    )),

    _zettel_opening0: $ => seq(
      $.list_marker,
      optional(seq($._hspace, $._inline_run)),
      $._line_end,
    ),

    _zettel_opening1: $ => seq(
      alias($._list_marker1, $.list_marker),
      optional(seq($._hspace, $._inline_run)),
      $._line_end,
    ),

    _zettel_opening2: $ => seq(
      alias($._list_marker2, $.list_marker),
      optional(seq($._hspace, $._inline_run)),
      $._line_end,
    ),

    _zettel_opening3: $ => seq(
      alias($._list_marker3, $.list_marker),
      optional(seq($._hspace, $._inline_run)),
      $._line_end,
    ),

    _paragraph0: $ => prec.right(repeat1(alias($._paragraph_line0, $.paragraph_line))),

    _paragraph1: $ => prec.right(repeat1(alias($._paragraph_line1, $.paragraph_line))),

    _paragraph2: $ => prec.right(repeat1(alias($._paragraph_line2, $.paragraph_line))),

    _paragraph3: $ => prec.right(repeat1(alias($._paragraph_line3, $.paragraph_line))),

    _paragraph4: $ => prec.right(repeat1(alias($._paragraph_line4, $.paragraph_line))),

    _paragraph_line0: $ => seq(
      $._paragraph_inline_run,
      $._line_end,
    ),

    _paragraph_line1: $ => seq(
      $._indent1,
      $._paragraph_inline_run,
      $._line_end,
    ),

    _paragraph_line2: $ => seq(
      $._indent2,
      $._paragraph_inline_run,
      $._line_end,
    ),

    _paragraph_line3: $ => seq(
      $._indent3,
      $._paragraph_inline_run,
      $._line_end,
    ),

    _paragraph_line4: $ => seq(
      $._indent4,
      $._paragraph_inline_run,
      $._line_end,
    ),

    _fenced_code_block0: $ => seq(
      alias($._fence_start0, $.fence_start),
      repeat(choice(
        $.code_fence_content,
        $.blank_line,
      )),
      alias($._fence_end0, $.fence_end),
    ),

    _fenced_code_block1: $ => seq(
      alias($._fence_start1, $.fence_start),
      repeat(choice(
        $.code_fence_content,
        $.blank_line,
      )),
      alias($._fence_end1, $.fence_end),
    ),

    _fenced_code_block2: $ => seq(
      alias($._fence_start2, $.fence_start),
      repeat(choice(
        $.code_fence_content,
        $.blank_line,
      )),
      alias($._fence_end2, $.fence_end),
    ),

    _fenced_code_block3: $ => seq(
      alias($._fence_start3, $.fence_start),
      repeat(choice(
        $.code_fence_content,
        $.blank_line,
      )),
      alias($._fence_end3, $.fence_end),
    ),

    _fenced_code_block4: $ => seq(
      alias($._fence_start4, $.fence_start),
      repeat(choice(
        $.code_fence_content,
        $.blank_line,
      )),
      alias($._fence_end4, $.fence_end),
    ),

    _fence_start0: $ => seq(
      $.code_fence_delimiter,
      optional($.info_string),
      $._line_end,
    ),

    _fence_start1: $ => seq(
      alias($._code_fence_delimiter1, $.code_fence_delimiter),
      optional($.info_string),
      $._line_end,
    ),

    _fence_start2: $ => seq(
      alias($._code_fence_delimiter2, $.code_fence_delimiter),
      optional($.info_string),
      $._line_end,
    ),

    _fence_start3: $ => seq(
      alias($._code_fence_delimiter3, $.code_fence_delimiter),
      optional($.info_string),
      $._line_end,
    ),

    _fence_start4: $ => seq(
      alias($._code_fence_delimiter4, $.code_fence_delimiter),
      optional($.info_string),
      $._line_end,
    ),

    fence_start: $ => seq(
      $.code_fence_delimiter,
      optional($.info_string),
      $._line_end,
    ),

    _fence_end0: $ => seq(
      $.code_fence_delimiter,
      $._line_end,
    ),

    _fence_end1: $ => seq(
      alias($._code_fence_delimiter1, $.code_fence_delimiter),
      $._line_end,
    ),

    _fence_end2: $ => seq(
      alias($._code_fence_delimiter2, $.code_fence_delimiter),
      $._line_end,
    ),

    _fence_end3: $ => seq(
      alias($._code_fence_delimiter3, $.code_fence_delimiter),
      $._line_end,
    ),

    _fence_end4: $ => seq(
      alias($._code_fence_delimiter4, $.code_fence_delimiter),
      $._line_end,
    ),

    fence_end: $ => seq(
      $.code_fence_delimiter,
      $._line_end,
    ),

    code_fence_content: $ => seq(
      repeat1($._code_text),
      $._newline,
    ),

    _inline_run: $ => seq(
      $._inline_item,
      repeat(choice(
        seq($._hspace, $._inline_item),
        alias($._attached_text, $.title_text),
      )),
    ),

    _paragraph_inline_run: $ => seq(
      $._paragraph_inline_item,
      repeat(choice(
        seq($._hspace, $._inline_item),
        alias($._attached_text, $.title_text),
      )),
    ),

    _inline_item: $ => choice(
      $.todo_marker,
      $.property,
      $.id,
      $.local_id,
      $.child_link,
      $.sibling_link,
      $.hash_reference,
      alias($._legacy_text, $.title_text),
      $.title_text,
    ),

    _paragraph_inline_item: $ => choice(
      $.todo_marker,
      $.property,
      $.id,
      $.local_id,
      $.child_link,
      $.sibling_link,
      $.hash_reference,
      alias($._legacy_text, $.title_text),
      alias($._paragraph_text, $.title_text),
    ),

    percent_fence: _ => token(prec(2, "%%%")),

    list_marker: _ => token(prec(2, /-/)),

    _list_marker1: _ => token(prec(3, /[ \t]{2}-/)),

    _list_marker2: _ => token(prec(3, /[ \t]{4}-/)),

    _list_marker3: _ => token(prec(3, /[ \t]{6}-/)),

    code_fence_delimiter: _ => token(prec(2, "```")),

    _code_fence_delimiter1: _ => token(prec(3, /[ \t]{2}```/)),

    _code_fence_delimiter2: _ => token(prec(3, /[ \t]{4}```/)),

    _code_fence_delimiter3: _ => token(prec(3, /[ \t]{6}```/)),

    _code_fence_delimiter4: _ => token(prec(3, /[ \t]{8}```/)),

    info_string: _ => token(prec(2, /[A-Za-z0-9_-]+/)),

    todo_marker: _ => token(prec(2, /\[( |N|X|\?)\]/)),

    property: _ => token(prec(2, /[A-Za-z][A-Za-z0-9_-]*::[^\s]+/)),

    id: _ => token(prec(2, /@[A-Za-z0-9][A-Za-z0-9_-]*(\/[A-Za-z0-9][A-Za-z0-9_-]*)*/)),

    local_id: _ => token(prec(2, /\^[A-Za-z0-9][A-Za-z0-9_-]*/)),

    child_link: _ => token(prec(2, /\+[A-Za-z0-9][A-Za-z0-9_-]*/)),

    sibling_link: _ => token(prec(2, /~[A-Za-z0-9][A-Za-z0-9_-]*/)),

    hash_reference: _ => token(prec(2, /#[A-Za-z0-9][A-Za-z0-9_-]*(\/[A-Za-z0-9][A-Za-z0-9_-]*)*/)),

    // Legacy-looking property names must not be tokenized as v1 properties.
    _legacy_text: _ => token(prec(3, /(ID|LID|tick)::[^\s]+/)),

    title_text: _ => token(prec(1, choice(
      /[^`\s]+/,
      /`[^`\r\n]*`[.,]?/,
    ))),

    _paragraph_text: _ => token(prec(1, choice(
      /[^`\s-][^`\s]*/,
      /`[^`\r\n]*`[.,]?/,
    ))),

    _code_text: _ => token(prec(1, /[^`\r\n]+/)),

    _attached_text: _ => token(prec(1, /[.,:;!?]+/)),

    blank_line: $ => $._newline,

    _newline: _ => /\r?\n/,

    _line_end: $ => $._newline,

    _hspace: _ => token(prec(1, /[ \t]+/)),

    _indent1: _ => token(prec(2, /[ \t]{2}/)),

    _indent2: _ => token(prec(2, /[ \t]{4}/)),

    _indent3: _ => token(prec(2, /[ \t]{6}/)),

    _indent4: _ => token(prec(2, /[ \t]{8}/)),
  },
});
