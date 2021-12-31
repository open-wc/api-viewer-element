import { css } from 'lit';
import sharedStyles from '@api-viewer/common/lib/shared-styles.js';
import demoStyles from '@api-viewer/demo/lib/styles.js';
import docsStyles from '@api-viewer/docs/lib/styles.js';

export default css`
  ${sharedStyles}
  ${docsStyles}
  ${demoStyles}

  [part='radio-label'] {
    margin: 0 0.75rem 0 0.25rem;
    color: var(--ave-header-color);
    font-size: 0.875rem;
  }
`;
