/**
 * @file Zorg grammar skeleton.
 * @author Zettel Org
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "zorg",

  extras: $ => [
    /[\s]/,
  ],

  rules: {
    source_file: $ => repeat($._item),

    _item: $ => choice(
      $.file_header,
      $.list_marker,
      $.code_fence,
      $.todo_marker,
      $.property,
      $.id,
      $.local_id,
      $.child_link,
      $.sibling_link,
      $.hash_reference,
      $.text,
    ),

    file_header: $ => seq(
      $.percent_fence,
      repeat($._header_item),
      $.percent_fence,
    ),

    _header_item: $ => choice(
      $.todo_marker,
      $.property,
      $.id,
      $.local_id,
      $.child_link,
      $.sibling_link,
      $.hash_reference,
      $.text,
    ),

    percent_fence: _ => token(prec(2, "%%%")),

    list_marker: _ => token(prec(2, /-/)),

    code_fence: _ => token(prec(2, /```[A-Za-z0-9_-]*/)),

    todo_marker: _ => token(prec(2, /\[( |N|X|\?)\]/)),

    property: _ => token(prec(2, /[A-Za-z][A-Za-z0-9_-]*::[^\s]+/)),

    id: _ => token(prec(2, /@[A-Za-z0-9][A-Za-z0-9_-]*(\/[A-Za-z0-9][A-Za-z0-9_-]*)*/)),

    local_id: _ => token(prec(2, /\^[A-Za-z0-9][A-Za-z0-9_-]*/)),

    child_link: _ => token(prec(2, /\+[A-Za-z0-9][A-Za-z0-9_-]*/)),

    sibling_link: _ => token(prec(2, /~[A-Za-z0-9][A-Za-z0-9_-]*/)),

    hash_reference: _ => token(prec(2, /#[A-Za-z0-9][A-Za-z0-9_-]*(\/[A-Za-z0-9][A-Za-z0-9_-]*)*/)),

    text: _ => token(prec(1, /[^\s]+/)),
  },
});
