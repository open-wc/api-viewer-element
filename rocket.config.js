/* eslint-disable import/no-extraneous-dependencies */
import { absoluteBaseUrlNetlify } from '@rocket/core/helpers';
import { rocketLaunch } from '@rocket/launch';
import { rocketSearch } from '@rocket/search';

export default {
  absoluteBaseUrl: absoluteBaseUrlNetlify('http://localhost:8080'),
  presets: [rocketLaunch(), rocketSearch()],
  eleventy(eleventyConfig) {
    eleventyConfig.addWatchTarget('docs/_assets/**/*.css');
  }
};
