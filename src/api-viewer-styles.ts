import { css } from 'lit-element';

export default css`
  :host {
    display: block;
    text-align: left;
    box-sizing: border-box;
    max-width: 800px;
    min-width: 360px;
    font-size: 1rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      'Oxygen-Sans', Ubuntu, Cantarell, sans-serif;
    border: 1px solid var(--ave-border-color);
    border-radius: var(--ave-border-radius);

    --ave-primary-color: #01579b;
    --ave-accent-color: #d63200;
    --ave-border-color: rgba(0, 0, 0, 0.12);
    --ave-border-radius: 4px;
    --ave-header-color: #fff;
    --ave-item-color: rgba(0, 0, 0, 0.87);
    --ave-label-color: #424242;
    --ave-link-color: #01579b;
    --ave-link-hover-color: #d63200;
    --ave-tab-color: rgba(0, 0, 0, 0.54);
    --ave-monospace-font: Menlo, 'DejaVu Sans Mono', 'Liberation Mono', Consolas,
      'Courier New', monospace;
  }

  [hidden] {
    display: none !important;
  }

  .warn {
    padding: 1rem;
  }

  p {
    margin: 1rem 0;
    font-size: 0.9375rem;
    line-height: 1.5;
  }

  a {
    color: var(--ave-link-color);
  }

  a:hover {
    color: var(--ave-link-hover-color);
  }

  button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    text-transform: uppercase;
    border: none;
    border-radius: 0.25em;
    cursor: pointer;
    background: var(--ave-button-background, rgba(0, 0, 0, 0.3));
    color: var(--ave-button-color, #fff);
  }

  button:focus,
  button:hover {
    background: var(--ave-button-active-background, rgba(0, 0, 0, 0.6));
  }

  api-viewer-content,
  api-viewer-docs,
  api-viewer-demo,
  api-viewer-demo-layout {
    display: block;
  }

  api-viewer-demo-css,
  api-viewer-demo-knobs {
    display: block;
    padding: 1rem;
  }

  .description {
    display: block;
    padding: 0 1rem;
    border-bottom: solid 1px var(--ave-border-color);
  }

  .radio-label {
    padding-right: 0.5rem;
  }

  /* Docs styles */
  api-viewer-tab[heading^='CSS'] {
    font-size: 0.8125rem;
  }

  api-viewer-item {
    display: block;
    padding: 0.5rem;
    color: var(--ave-item-color);
  }

  .api-row {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }

  .api-col {
    box-sizing: border-box;
    flex-basis: 25%;
    padding-right: 0.5rem;
  }

  .api-col:only-child {
    flex-basis: 100%;
  }

  .api-col-type {
    flex-basis: 50%;
  }

  .api-label {
    color: var(--ave-label-color);
    font-size: 0.75rem;
    line-height: 1rem;
    letter-spacing: 0.1rem;
  }

  .api-value {
    font-family: var(--ave-monospace-font);
    font-size: 0.875rem;
    line-height: 1.5rem;
  }

  .api-row p {
    margin: 0.5rem 0;
  }

  .accent {
    color: var(--ave-accent-color);
  }

  /* Demo styles */
  api-viewer-item:not(:first-of-type),
  .demo-tabs,
  .rendered {
    border-top: solid 1px var(--ave-border-color);
  }

  .demo-tabs api-viewer-panel {
    box-sizing: border-box;
    background: #fafafa;
  }

  .rendered {
    padding: 1.5rem;
  }

  .source {
    position: relative;
  }

  .columns {
    display: flex;
  }

  .column {
    width: 50%;
  }

  .column h3 {
    font-size: 1rem;
    font-weight: bold;
    margin: 0 0 0.25rem;
  }

  td {
    padding: 0.25rem 0.25rem 0.25rem 0;
    font-size: 0.9375rem;
    white-space: nowrap;
  }

  api-viewer-demo-events {
    display: block;
    position: relative;
    padding: 0 1rem;
    min-height: 50px;
    max-height: 200px;
    overflow: auto;
  }

  .event {
    margin: 0 0 0.25rem;
    font-family: var(--ave-monospace-font);
    font-size: 0.875rem;
  }

  .event:first-of-type {
    margin-top: 1rem;
  }

  .event:last-of-type {
    margin-bottom: 1rem;
  }

  @media (max-width: 480px) {
    .api-col-type {
      flex-basis: 100%;
      margin-top: 1rem;
    }

    .columns {
      flex-direction: column;
    }

    .column:not(:last-child) {
      margin-bottom: 1rem;
    }
  }
`;
