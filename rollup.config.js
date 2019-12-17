import cpy from 'rollup-plugin-cpy';
import { createDefaultConfig } from '@open-wc/building-rollup';

const config = createDefaultConfig({
  input: './demo/index.html',
  indexHTMLPlugin: {
    minify: false
  }
});

export default {
  ...config,
  plugins: [
    ...config.plugins,
    cpy({
      files: ['demo/*.css'],
      dest: 'dist'
    })
  ]
};
