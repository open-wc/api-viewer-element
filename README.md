# &lt;api-viewer&gt;

API documentation and live playground for Web Components. Based on [custom elements manifest](https://github.com/webcomponents/custom-elements-manifest) JSON format.

```html
<api-viewer src="./custom-elements.json"></api-viewer>
```

[Documentation →](https://api-viewer.open-wc.org/docs/guide/intro/)

[Live Demo →](https://api-viewer.open-wc.org/docs/examples/api-viewer/)

[<img src="https://raw.githubusercontent.com/open-wc/api-viewer-element/master/screenshot-docs.png" alt="Screenshot of api-viewer docs" width="800">](https://api-viewer.open-wc.org)

[<img src="https://raw.githubusercontent.com/open-wc/api-viewer-element/master/screenshot-demo.png" alt="Screenshot of api-viewer demo" width="800">](https://api-viewer.open-wc.org)

## Features

- [API docs viewer](https://api-viewer.open-wc.org/docs/guide/writing-jsdoc/)
  - [Properties](https://api-viewer.open-wc.org/docs/guide/writing-jsdoc/#properties) - JS properties publicly exposed by the component.
  - [Attributes](https://api-viewer.open-wc.org/docs/guide/writing-jsdoc/#attributes) - HTML attributes (except those that match properties).
  - [Events](https://api-viewer.open-wc.org/docs/guide/writing-jsdoc/#events) - DOM events dispatched by the component.
  - [Slots](https://api-viewer.open-wc.org/docs/guide/writing-jsdoc/#slots) - Default `<slot>` and / or named slots, if any.
  - [CSS Custom Properties](https://api-viewer.open-wc.org/docs/guide/writing-jsdoc/#css-custom-properties) - Styling API of the component.
  - [CSS Shadow Parts](https://api-viewer.open-wc.org/docs/guide/writing-jsdoc/#css-shadow-parts) - Elements that can be styled using `::part()`.
- [Live playground](https://api-viewer.open-wc.org/docs/guide/using-demo/)
  - [Source](https://api-viewer.open-wc.org/docs/guide/using-demo/#source) - Code snippet matching the rendered component.
  - [Knobs](https://api-viewer.open-wc.org/docs/guide/using-demo/#knobs) - Change properties and slotted content dynamically.
  - [Styles](https://api-viewer.open-wc.org/docs/guide/using-demo/#styles) - Change values of the custom CSS properties.
  - [Event log](https://api-viewer.open-wc.org/docs/guide/using-demo/#events) - Output the events fired by the component.
  - [Templates](https://api-viewer.open-wc.org/docs/api/templates/) - Provide additional HTML to be shown.

## Install

```sh
npm install api-viewer-element
```

Check out the [Getting Started](https://api-viewer.open-wc.org/docs/guide/intro/#usage) guide.

## Usage

The following web components are available:

- [`<api-viewer>`](https://api-viewer.open-wc.org/docs/api/elements/#api-viewer-element)
- [`<api-docs>`](https://api-viewer.open-wc.org/docs/api/elements/#api-docs-element)
- [`<api-demo>`](https://api-viewer.open-wc.org/docs/api/elements/#api-demo-element)

## Contributing

### Install dependencies

```sh
yarn
```

### Run demo in browser

```sh
yarn dev
```

Open http://127.0.0.1:8000

### Run the docs locally

```sh
yarn start
```

Open http://127.0.0.1:8000

### Build the docs site

```sh
yarn dist
```

## Acknowledgements

- Big thanks to [@runem](http://github.com/runem) for creating Web Component Analyzer, which previous versions of this package were based on.
- Thanks to [@bahrus](https://github.com/bahrus) for [wc-info](https://github.com/bahrus/wc-info) component which inspired me.
- The visual appearance is largely inspired by [Vuetify](https://vuetifyjs.com/en/getting-started/quick-start) API docs.
- The tabs component is based on the [howto-tabs](https://developers.google.com/web/fundamentals/web-components/examples/howto-tabs) example.
- Thanks to [Modern Web](https://modern-web.dev) for [Web Dev Server](https://modern-web.dev/docs/dev-server/overview/) and [Rollup Plugin HTML](https://modern-web.dev/docs/building/rollup-plugin-html/).
