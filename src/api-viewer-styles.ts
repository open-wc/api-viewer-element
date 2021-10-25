import { css } from 'lit';
import sharedStyles from './shared-styles.js';
import docsStyles from './api-docs-styles.js';
import demoStyles from './api-demo-styles.js';

export default css`
  ${sharedStyles}
  ${docsStyles}
  ${demoStyles}

  api-viewer-content {
    display: block;
  }

  [part='radio-label'] {
    margin: 0 0.75rem 0 0.25rem;
    color: var(--ave-header-color);
    font-size: 0.875rem;
  }
`;
