# &lt;api-viewer&gt;

API documentation and live playground for Web Components. Based on [web-component-analyzer](https://github.com/runem/web-component-analyzer) JSON format.

```html
<api-viewer src="./custom-elements.json"></api-viewer>
```

[Live Demo ↗](https://api-viewer-element.netlify.com/)

[<img src="https://raw.githubusercontent.com/web-padawan/api-viewer-element/master/screenshot-docs.png" alt="Screenshot of api-viewer docs" width="800">](https://api-viewer-element.netlify.com/)

[<img src="https://raw.githubusercontent.com/web-padawan/api-viewer-element/master/screenshot-demo.png" alt="Screenshot of api-viewer demo" width="800">](https://api-viewer-element.netlify.com/)

## Features

- API docs viewer
  - Properties - JS properties publicly exposed by the component
  - Attributes - HTML attributes (except those that match properties)
  - Events - DOM events dispatched by the component
  - Slots - default `<slot>` and / or named slots, if any
  - CSS Custom Properties - styling API of the component
  - CSS Shadow Parts - elements that can be styled using `::part`
- Live playground
  - Source - code snippet matching the rendered component
  - Knobs - change properties and slotted content dynamically
  - Styles - change values of the custom CSS properties
  - Event log - output the events fired by the component
  - Templates - configure complex slotted content

## Install

```sh
$ npm install api-viewer-element
```

Or grab from [unpkg.com CDN](https://unpkg.com/api-viewer-element?module):

```html
<script src="https://unpkg.com/api-viewer-element?module" type="module"></script>
```

## Usage

1. Install [web-component-analyzer](https://github.com/runem/web-component-analyzer):

```sh
$ npm install -g web-component-analyzer
```

2. Analyze your components using `--format json`:

```sh
$ wca analyze my-element.js --outFile custom-elements.json --format json
```

3. Create an HTML file and import the component:

```html
<!DOCTYPE html>
<html>
  <head>
    <script type="module">
      import 'api-viewer-element';
    </script>
  </head>

  <body>
    <api-viewer src="./custom-elements.json"></api-viewer>
  </body>
</html>
```

4. Use [es-dev-server](https://open-wc.org/developing/es-dev-server.html) to serve your HTML page.

## Playground

Import the components documented in JSON file to enable demos:

```html
<script type="module">
  import 'my-element';
</script>
<api-viewer src="./custom-elements.json"></api-viewer>
```

In order to ensure that all the playground features work properly and knobs for properties and CSS
custom properties are in sync, please read the following sections and update the code of your custom
elements accordingly if needed.

### Knobs

The playground listens to all the events dispatched by the rendered component. This can be used to
sync knobs with the property changes caused by the user. In order to make it work, dispatch and
document `[property]-changed` events:

```js
/**
 * A custom element that fires event on value change.
 *
 * @element my-element
 *
 * @prop {String} value - Value of the component
 * @fires value-changed - Event fired when value is changed
 */
```

### Styles

The playground collects the default values for the documented CSS custom properties on the
rendered component using `getComputedStyle(element).getPropertyValue()`. In order to make it work,
use the following CSS structure:

```css
:host {
  --button-color: red;
}

button {
  color: var(--button-color);
}
```

## Configuration

### Properties

The following properties can be set on the `<api-viewer>` element:

#### `section`

Use `section` property to toggle between demo and API docs:

```html
<api-viewer src="./custom-elements.json" section="demo"></api-viewer>
```

#### `selected`

Use `selected` property to configure the displayed element:

```html
<api-viewer src="./custom-elements.json" selected="my-element"></api-viewer>
```

#### `exclude-knobs`

Use `exclude-knobs` attribute to exclude properties from demo:

```html
<api-viewer src="./custom-elements.json" exclude-knobs="autofocus"></api-viewer>
```

#### `elements`

Use `elements` property instead of `src` to pass data directly:

```html
<api-viewer></api-viewer>
<script>
  fetch('./custom-elements.json')
    .then(res => res.json())
    .then(data => {
      document.querySelector('api-viewer').elements = data.tags;
    });
</script>
```

### Methods

#### `setTemplates`

Use `setTemplates` method to override `<template>` elements:

```js
// gather the template elements placed in the DOM
const templates = document.querySelectorAll('template[data-target]');

// configure the api-viewer to use the templates
document.querySelector('api-viewer').setTemplates(templates);
```

*Note*: the method is available on `api-viewer` and `api-demo` elements only. Corresponding base
classes do not have it. When extending a base class, you have to re-implement it yourself if you
need to preserve the existing behavior.

### Templates

The following templates can be passed to `<api-viewer>` element:

#### `<template data-target="host">`

Use "host" template to configure property values:

```html
<api-viewer src="./custom-elements.json">
  <template data-element="progress-bar" data-target="host">
    <progress-bar max="100" min="1" value="50"></progress-bar>
  </template>
</api-viewer>
```

#### `<template data-target="slot">`

Use "slot" template to configure complex content:

```html
<api-viewer src="./custom-elements.json">
  <template data-element="fancy-accordion" data-target="slot">
    <expansion-panel>
      <div slot="header">Panel 1</div>
      <div>Content 1</div>
    </expansion-panel>
    <expansion-panel>
      <div slot="header">Panel 2</div>
      <div>Content 2</div>
    </expansion-panel>
  </template>
</api-viewer>
```

*Note*: do not minify HTML to keep proper indentation.

## Styling

### Custom CSS properties

The following custom CSS properties are available:

| Property                         | Description                                     |
| -------------------------------- | ----------------------------------------------- |
| `--ave-accent-color`             | Accent color, used for property names           |
| `--ave-border-color`             | Color used for borders and dividers             |
| `--ave-border-radius`            | Border radius used for the outer border         |
| `--ave-button-active-background` | Color of the `:focus` and `:hover` button       |
| `--ave-button-background`        | Background of the button (code snippet, events) |
| `--ave-button-color`             | Color of the button (code snippet, events)      |
| `--ave-header-color`             | Header text color used for tag name             |
| `--ave-item-color`               | API items content color (main text)             |
| `--ave-label-color`              | API items labels color                          |
| `--ave-link-color`               | API description links default color             |
| `--ave-link-hover-color`         | API description links hover color               |
| `--ave-monospace-font`           | Monospace font stack for the API items          |
| `--ave-primary-color`            | Primary color, used for header and active tab   |
| `--ave-tab-color`                | Inactive tabs color                             |
| `--ave-tab-indicator-size`       | Size of the selected tab indicator              |

### CSS shadow parts

The following CSS shadow parts are available:

### Common UI parts

| Part                     | Description                                             |
| -------------------------| --------------------------------------------------------|
| `header`                 | Header containing element name and navigation controls  |
| `tab`                    | `<api-viewer-tab>` component used in docs and demo      |
| `tab-panel`              | `<api-viewer-panel>` component used in docs and demo    |
| `warning`                | Message shown when no elements or API docs are found    |

#### API docs

| Part                     | Description                                             |
| -------------------------| --------------------------------------------------------|
| `docs-description`       | Custom element description                              |
| `docs-column`            | Column, child of a `docs-row` part                      |
| `docs-item`              | Item representing a single entry  (property, event etc) |
| `docs-label`             | Label (name, attribute, type, description)              |
| `docs-markdown`          | Iem description with parsed markdown content            |
| `docs-row`               | Row containing columns. Child of a `docs-item` part     |
| `docs-value`             | Sibling of a `docs-label` part (name, attribute, type)  |
| `md-h1`                  | Markdown `<h1>` elements                                |
| `md-h2`                  | Markdown `<h2>` elements                                |
| `md-h3`                  | Markdown `<h3>` elements                                |
| `md-h4`                  | Markdown `<h4>` elements                                |
| `md-h5`                  | Markdown `<h5>` elements                                |
| `md-h6`                  | Markdown `<h6>` elements                                |
| `md-a`                   | Markdown `<a>` elements                                 |
| `md-p`                   | Markdown `<p>` elements                                 |
| `md-ul`                  | Markdown `<ul>` elements                                |
| `md-ol`                  | Markdown `<ol>` elements                                |
| `md-li`                  | Markdown `<li>` elements                                |
| `md-pre`                 | Markdown `<pre>` elements                               |
| `md-code`                | Markdown `<code>` elements                              |
| `md-strong`              | Markdown `<strong>` elements                            |
| `md-em`                  | Markdown `<em>` elements                                |
| `md-blockquote`          | Markdown `<blockquote>` elements                        |
| `md-del`                 | Markdown `<del>` elements                               |

#### Live demo

| Part                     | Description                                             |
| -------------------------| ------------------------------------------------------- |
| `demo-output`            | Wrapper of the rendered component in the live demo      |
| `demo-tabs`              | Tabs component used to switch panels in the live demo   |
| `event-log`              | Wrapper of the event log tab content                    |
| `event-record`           | `<p>` used as a record in the event log                 |
| `knobs`                  | Wrapper of in the properties / styles knobs panel       |
| `knobs-column`           | Column in the properties / styles knobs panel           |
| `knobs-header`           | Header of the properties / styles knobs column          |
| `knob-label`             | Label associated with an input in the knobs panel       |

#### Interactive elements

| Part                     | Description                                             |
| ------------------------ | ------------------------------------------------------- |
| `button`                 | `<button>` used to copy code / clear events log         |
| `checkbox`               | `<input type="checkbox">` used by boolean knobs         |
| `input`                  | `<input type="text">` used by knobs                     |
| `radio-button`           | `<input type="radio">` used to toggle docs / demo       |
| `radio-label`            | `<label>` associated with the radio button element      |
| `select`                 | `<select>` used to choose displayed component           |
| `select-label`           | `<label>` associated with the select element            |

Read more about using `::part()` at [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/::part).

## Contributing

### Install dependencies

```sh
$ yarn
```

### Run demo in browser

```sh
$ yarn dev
```

Open http://127.0.0.1:8081/demo/

### Create dist folder

```sh
$ yarn dist
```

### Serve dist folder

```sh
$ yarn serve:dist
```

## Acknowledgements

- Big thanks to [@runem](http://github.com/runem) for creating Web Component Analyzer.
- Thanks to [@bahrus](https://github.com/bahrus) for [wc-info](https://github.com/bahrus/wc-info) component which inspired me.
- The visual appearance is largely inspired by [Vuetify](https://vuetifyjs.com/en/getting-started/quick-start) API docs.
- The tabs component is based on the [howto-tabs](https://developers.google.com/web/fundamentals/web-components/examples/howto-tabs) example.
- Thanks to [open-wc.org](https://open-wc.org/) for [es-dev-server](https://github.com/open-wc/open-wc/tree/master/packages/es-dev-server) and [rollup preset](https://open-wc.org/building/building-rollup.html).
