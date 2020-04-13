import merge from 'deepmerge';
import copy from 'rollup-plugin-copy';
import { createSpaConfig } from '@open-wc/building-rollup';

const config = createSpaConfig({
  html: {
    minify: false
  }
});

export default merge(config, {
  input: './demo/index.html',
  plugins: [
    copy({
      targets: [{ src: './demo/*.css', dest: './dist' }]
    })
  ]
});
