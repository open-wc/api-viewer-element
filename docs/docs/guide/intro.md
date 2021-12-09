# Guide >> Introduction || 10

API Viewer is a set of custom elements and helpers providing interactive UI for documenting web components.
This project is based on [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest), a file format that describes custom HTML elements.

## Install

```bash
npm i api-viewer-element --save-dev
```

## Usage

1. Install [custom elements manifest analyzer](https://custom-elements-manifest.open-wc.org/analyzer/getting-started/):

```bash
npm install @custom-elements-manifest/analyzer
```

2. Analyze your components:

```bash
cem analyze --globs "src/components/my-element.js"
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

## ES modules

Api Viewer is authored using ES modules which are [natively supported](https://caniuse.com/es6-module)
by modern browsers. However, it also uses "bare module imports" which are [not yet standardized](https://github.com/WICG/import-maps)
and require a small transform.

We recommend using of the modern tools that leverage ES modules based development, such as
[Web Dev Server](https://modern-web.dev/docs/dev-server/overview/) or [Vite](https://vitejs.dev).
We also recommend [Rollup Plugin HTML](https://modern-web.dev/docs/building/rollup-plugin-html/) when bundling API Viewer docs for production.

## CDN

You can import API Viewer from one of the content delivery networks that support ES modules:

[unpkg.com CDN](https://unpkg.com):

```html
<script type="module" src="https://unpkg.com/api-viewer-element?module"></script>
```

[Skypack CDN](https://www.skypack.dev):

```html
<script type="module" src="https://cdn.skypack.dev/api-viewer-element"></script>
```

[JSPM CDN](https://jspm.org):

```html
<script type="module" src="https://jspm.dev/api-viewer-element"></script>
```
