# &lt;api-viewer&gt;

API documentation and live playground for Web Components. Based on [custom elements manifest](https://github.com/webcomponents/custom-elements-manifest) JSON format.

```html
<api-viewer src="./custom-elements.json"></api-viewer>
```

[Documentation →](https://api-viewer.open-wc.org/docs/guide/intro/)

[Live Demo →](https://api-viewer.open-wc.org/docs/examples/api-viewer/)

[<img src="https://raw.githubusercontent.com/open-wc/api-viewer-element/master/screenshot-docs.png" alt="Screenshot of api-viewer docs" width="800">](https://api-viewer.open-wc.org)

[<img src="https://raw.githubusercontent.com/open-wc/api-viewer-element/master/screenshot-demo.png" alt="Screenshot of api-viewer demo" width="800">](https://api-viewer.open-wc.org)

## Install

```sh
npm install api-viewer-element
```

Check out the [Getting Started](https://api-viewer.open-wc.org/docs/guide/intro/#usage) guide.

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
