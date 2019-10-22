# &lt;api-viewer&gt;

API viewer for [web-component-analyzer](https://github.com/runem/web-component-analyzer) JSON output.

## Usage

```html
<api-viewer src="./custom-elements.json"></api-viewer>
```

[Live Demo ↗](https://api-viewer-element.netlify.com/)

[<img src="https://raw.githubusercontent.com/web-padawan/api-viewer-element/master/screenshot.png" alt="Screenshot of api-viewer element" width="800">](https://api-viewer-element.netlify.com/)

## Preparing a JSON

First, install [web-component-analyzer](https://github.com/runem/web-component-analyzer):

```sh
npm install -g web-component-analyzer
```

Analyze your components using `--format json`:

```sh
wca analyze my-element.js --outFile custom-elements.json --format json
```

## Styling

The following custom CSS properties are available:

| Property               | Description                                   |
|------------------------|-----------------------------------------------|
| `--ave-accent-color`   | Accent color, used for property names         |
| `--ave-border-color`   | Color used for borders and dividers           |
| `--ave-border-radius`  | Border radius used for the outer border       |
| `--ave-header-color`   | Header text color used for tag name           |
| `--ave-item-color`     | API items content color (main text)           |
| `--ave-label-color`    | API items labels color                        |
| `--ave-monospace-font` | Monospace font stack for the API items        |
| `--ave-primary-color`  | Primary color, used for header and active tab |
| `--ave-tab-color`      | Inactive tabs color                           |

## Contributing

### Install dependencies

```sh
yarn
```

### Run demo in browser

```sh
yarn dev
```

Open http://127.0.0.1:8081/demo/

### Create dist folder

```sh
yarn dist
```

### Serve dist folder

```sh
yarn serve:dist
```

## Acknowledgements

- Big thanks to [@runem](http://github.com/runem) for creating Web Component Analyzer.
- Thanks to [@bahrus](https://github.com/bahrus) for [wc-info](https://github.com/bahrus/wc-info) component which inspired me.
- The visual appearance is largely inspired by [Vuetify](https://vuetifyjs.com/en/getting-started/quick-start) API docs.
- The tabs component is based on the [howto-tabs](https://developers.google.com/web/fundamentals/web-components/examples/howto-tabs) example.
