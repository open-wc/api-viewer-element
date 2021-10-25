import { css } from 'lit';
import demoStyles from './demo-styles.js';
import docsStyles from './docs-styles.js';
import sharedStyles from './shared-styles.js';

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
