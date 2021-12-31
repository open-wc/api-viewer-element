# Examples >> api-viewer || 10

```js script
import { html } from '@mdjs/mdjs-preview';
import '../../../packages/api-viewer/lib/api-viewer.js';
import '../../../fixtures/expansion-panel/lib/expansion-panel.js';
import '../../../fixtures/fancy-accordion/lib/fancy-accordion.js';
import '../../../fixtures/intl-currency/lib/intl-currency.js';
import '../../../fixtures/progress-bar/lib/progress-bar.js';
```

```html preview-story
<api-viewer src="/assets/custom-elements.json">
  <template
    data-element="expansion-panel"
    data-target="knob"
    data-attr="dir"
    data-type="select"
  >
    <select>
      <option value=""></option>
      <option value="ltr"></option>
      <option value="rtl"></option>
    </select>
  </template>
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
  }
</style>
```