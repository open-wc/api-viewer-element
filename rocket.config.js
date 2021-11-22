/* eslint-disable import/no-extraneous-dependencies */
import { absoluteBaseUrlNetlify } from '@rocket/core/helpers';
import { rocketLaunch } from '@rocket/launch';

export default {
  absoluteBaseUrl: absoluteBaseUrlNetlify('http://localhost:8080'),
  presets: [rocketLaunch()]
};
