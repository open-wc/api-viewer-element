# API >> Elements || 10

API Viewer consists of two major features: documentation and demo (interactive live playground).
Both features reuse the same manifest data, by default you can switch between them using radio buttons.

Alternatively, you can use separate elements for documentation and demo.
This does not mean having to load manifest data twice: it can be fetched once and then passed to the elements using `manifest` property.

## Entrypoints

There are two ES module entrypoints available for each of the web components that are public parts of the API Viewer.
The main entrypoint recommended for most users defines a custom element with default styles.

### `<api-viewer>` element

A custom element that provides both API docs and live playground:

```js
import 'api-viewer-element';
```

### `<api-docs>` element

A custom element that only provides API docs (no live playground):

```js
import 'api-viewer-element/lib/api-docs.js';
```

### `<api-demo>` element

A custom element that only provides live playground (no API docs):

```js
import 'api-viewer-element/lib/api-demo.js';
```

Note: the default entrypoint shares most of the code with both `<api-docs>` and `<api-demo>`.
However, it does not contain custom element definitions for these components.
You need to import them separately.

## Base classes

API Viewer provides a set of [Lit](https://lit.dev/docs/components/defining/) based classes that can be imported without defining custom elements.
This is useful if you want to create an extension and register your own component with a different tag name.

Please note that attempting to register the same base class twice will result in an error.
Do not pass any base class directly to `customElements.define()`: make sure to extend it instead, as shown in the examples below.

### `ApiViewerBase` class

A class that you can use to create your own version of `<api-viewer>`.
If you don't need `<template>` support in the live demo, feel free to remove corresponding code.
API documentation does not use templates.

```js
import { ApiViewerBase } from 'api-viewer-element/lib/api-viewer-base.js';
import { setTemplates } from 'api-viewer-element/lib/lib/utils.js';
import { css } from 'lit';

class CustomViewer extends ApiViewerBase {
  static get styles() {
    return css`
      /* Define your own styles here */
    `;
  }

  /* Remove if you want to call `setTemplates` lazily */
  firstUpdated() {
    this.setTemplates();
  }

  setTemplates(templates) {
    setTemplates(this._id, templates || Array.from(this.querySelectorAll('template')));
  }
}

customElements.define('custom-viewer', CustomViewer);
```

### `ApiDocsBase` class

A class that you can use to create your own version of `<api-docs>`.

```js
import { ApiDocsBase } from 'api-viewer-element/lib/api-docs-base.js';
import { css } from 'lit';

class CustomDocs extends ApiDocsBase {
  static get styles() {
    return css`
      /* Define your own styles here */
    `;
  }
}

customElements.define('custom-docs', CustomDocs);
```

### `ApiDemoBase` class

A class that you can use to create your own version of `<api-demo>`.

```js
import { ApiDemoBase } from 'api-viewer-element/lib/api-demo-base.js';
import { setTemplates } from 'api-viewer-element/lib/lib/utils.js';
import { css } from 'lit';

class CustomDemo extends ApiDemoBase {
  static get styles() {
    return css`
      /* Define your own styles here */
    `;
  }

  /* Remove if you want to call `setTemplates` lazily */
  firstUpdated() {
    this.setTemplates();
  }

  setTemplates(templates) {
    setTemplates(this._id, templates || Array.from(this.querySelectorAll('template')));
  }
}

customElements.define('custom-demo', CustomDemo);
```

Note: as you might have noticed, there is a protected `_id` property used to manipulate `<template>` elements.
This is necessary to make sure every instance of `<api-viewer>` or `<api-demo>` uses its own templates.
