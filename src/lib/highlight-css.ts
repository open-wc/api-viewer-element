import { LanguageDef } from 'highlight-ts/es/types';
import {
  APOS_STRING_MODE,
  QUOTE_STRING_MODE,
  CSS_NUMBER_MODE,
  C_BLOCK_COMMENT_MODE
} from 'highlight-ts/es/common';

const FUNCTION_LIKE = {
  begin: /[\w-]+\(/,
  returnBegin: true,
  contains: [
    {
      className: 'built_in',
      begin: /[\w-]+/
    },
    {
      begin: /\(/,
      end: /\)/,
      contains: [APOS_STRING_MODE, QUOTE_STRING_MODE, CSS_NUMBER_MODE]
    }
  ]
};

const ATTRIBUTE = {
  className: 'attribute',
  begin: /\S/,
  end: ':',
  excludeEnd: true,
  starts: {
    endsWithParent: true,
    excludeEnd: true,
    contains: [
      FUNCTION_LIKE,
      CSS_NUMBER_MODE,
      QUOTE_STRING_MODE,
      APOS_STRING_MODE,
      C_BLOCK_COMMENT_MODE,
      {
        className: 'number',
        begin: '#[0-9A-Fa-f]+'
      },
      {
        className: 'meta',
        begin: '!important'
      }
    ]
  }
};

const IDENT_RE = '[a-zA-Z-][a-zA-Z0-9_-]*';

const RULE = {
  begin: /(?:[A-Z_.-]+|--[a-zA-Z0-9_-]+)\s*:/,
  returnBegin: true,
  end: ';',
  endsWithParent: true,
  contains: [ATTRIBUTE]
};

export const CSS: LanguageDef = {
  name: 'css',
  case_insensitive: true, // eslint-disable-line @typescript-eslint/camelcase
  illegal: /[=/|'$]/,
  contains: [
    C_BLOCK_COMMENT_MODE,
    {
      className: 'selector-attr',
      begin: /\[/,
      end: /\]/,
      illegal: '$',
      contains: [APOS_STRING_MODE, QUOTE_STRING_MODE]
    },
    {
      className: 'selector-tag',
      begin: IDENT_RE,
      relevance: 0
    },
    {
      begin: '{',
      end: '}',
      illegal: /\S/,
      contains: [C_BLOCK_COMMENT_MODE, RULE]
    }
  ]
};
