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

## Examples

### Playground

Import the components documented in JSON file to enable demos:

```html
<script type="module">
  import 'my-element';
</script>
<api-viewer src="./custom-elements.json"></api-viewer>
```

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

### Templates

Use `<template data-element="my-element">` for configuring complex content:

```html
<api-viewer src="./custom-elements.json">
  <template data-element="fancy-accordion">
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
| `--ave-monospace-font`           | Monospace font stack for the API items          |
| `--ave-primary-color`            | Primary color, used for header and active tab   |
| `--ave-tab-color`                | Inactive tabs color                             |

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
