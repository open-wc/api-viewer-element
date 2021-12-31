# `@api-viewer/docs`

API documentation for Web Components. Based on [custom elements manifest](https://github.com/webcomponents/custom-elements-manifest) JSON format.

```html
<api-docs src="./custom-elements.json"></api-docs>
```

[Documentation →](https://api-viewer.open-wc.org/docs/guide/intro/)

[Live Demo →](https://api-viewer.open-wc.org/docs/examples/api-docs/)

[<img src="https://raw.githubusercontent.com/open-wc/api-viewer-element/master/screenshot-docs.png" alt="Screenshot of api-viewer docs" width="800">](https://api-viewer.open-wc.org)

## Install

```sh
npm install @api-viewer/docs
```

Check out the [Getting Started](https://api-viewer.open-wc.org/docs/guide/intro/#usage) guide.

## Features

- [Properties](https://api-viewer.open-wc.org/docs/guide/writing-jsdoc/#properties) - JS properties publicly exposed by the component.
- [Attributes](https://api-viewer.open-wc.org/docs/guide/writing-jsdoc/#attributes) - HTML attributes (except those that match properties).
- [Events](https://api-viewer.open-wc.org/docs/guide/writing-jsdoc/#events) - DOM events dispatched by the component.
- [Slots](https://api-viewer.open-wc.org/docs/guide/writing-jsdoc/#slots) - Default `<slot>` and / or named slots, if any.
- [CSS Custom Properties](https://api-viewer.open-wc.org/docs/guide/writing-jsdoc/#css-custom-properties) - Styling API of the component.
- [CSS Shadow Parts](https://api-viewer.open-wc.org/docs/guide/writing-jsdoc/#css-shadow-parts) - Elements that can be styled using `::part()`.
