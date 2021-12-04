# Examples >> Theming || 40

```js script
import { html } from '@mdjs/mdjs-preview';
import '../../../lib/api-viewer.js';
import '../../../lib/fixtures/expansion-panel.js';
import '../../../lib/fixtures/fancy-accordion.js';
import '../../../lib/fixtures/intl-currency.js';
import '../../../lib/fixtures/progress-bar.js';
```

```html preview-story
<!-- Custom theme styles -->
<link rel="stylesheet" href="/assets/theme.css">

<api-viewer src="/assets/custom-elements.json" theme="custom">
  <template data-element="fancy-accordion" data-target="slot">
    <expansion-panel>
      <div slot="header">Panel 1</div>
      <div>Content 1</div>
    </expansion-panel>
    <expansion-panel disabled>
      <div slot="header">Panel 2</div>
      <div>Content 2</div>
    </expansion-panel>
    <expansion-panel>
      <div slot="header">Panel 3</div>
      <div>Content 3</div>
    </expansion-panel>
  </template>
  <template data-element="intl-currency" data-target="prefix">
    <em>
      Shipping:
    </em>
  </template>
  <template data-element="intl-currency" data-target="suffix">
    <strong style="text-transform: uppercase">free!</strong>
  </template>
  <template data-element="intl-currency" data-target="wrapper">
    <s></s>
  </template>
  <template data-element="progress-bar" data-target="host">
    <progress-bar max="100" min="1" value="50"></progress-bar>
  </template>
</api-viewer>

<style>
  api-viewer {
    max-width: 100%;
    box-shadow: 0 0 0 4px white;
  }
</style>
```
