import { createDefaultConfig } from '@open-wc/building-rollup';

export default createDefaultConfig({
  input: './demo/index.html',
  indexHTMLPlugin: {
    minify: false
  }
});
