import { css } from 'lit-element';

export default css`
  pre {
    color: black;
    background: none;
    font-family: var(--ave-monospace-font);
    font-size: 0.875rem;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    line-height: 1.5;
    tab-size: 4;
    hyphens: none;
    text-shadow: none;
  }

  code {
    font-family: inherit;
  }

  .token.comment {
    color: slategray;
  }

  .token.punctuation {
    color: #999;
  }

  .token.property,
  .token.tag,
  .token.boolean,
  .token.number,
  .token.constant {
    color: #905;
  }

  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char {
    color: #690;
  }

  .token.operator,
  .token.entity,
  .token.url,
  .style .token.string {
    color: #9a6e3a;
    background: hsla(0, 0%, 100%, 0.5);
  }

  .token.attr-value,
  .token.keyword {
    color: #07a;
  }

  .token.function,
  .token.class-name {
    color: #dd4a68;
  }

  .token.important,
  .token.variable {
    color: #e90;
  }

  .token.important,
  .token.bold {
    font-weight: bold;
  }

  .token.italic {
    font-style: italic;
  }

  .token.entity {
    cursor: help;
  }
`;
