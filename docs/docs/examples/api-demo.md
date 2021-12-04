# Examples >> api-demo || 30

```js script
import { html } from '@mdjs/mdjs-preview';
import '../../../lib/api-demo.js';
import '../../../lib/fixtures/expansion-panel.js';
import '../../../lib/fixtures/fancy-accordion.js';
import '../../../lib/fixtures/intl-currency.js';
import '../../../lib/fixtures/progress-bar.js';
```

```html preview-story
<api-demo src="/assets/custom-elements.json">
  <template data-element="expansion-panel" data-target="knob" data-attr="dir" data-type="select">
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
</api-demo>
<style>
  api-demo {
    max-width: 100%;
    outline: solid 4px white;
  }
</style>
```
