# &lt;api-viewer&gt;

API viewer for [web-component-analyzer](https://github.com/runem/web-component-analyzer) JSON output.

## Usage

```html
<api-viewer src="./custom-elements.json"></api-viewer>
```

<img src="https://raw.githubusercontent.com/web-padawan/api-viewer-element/master/screenshot.png" alt="Screenshot of api-viewer element" width="800">

## Preparing a JSON

First, install [web-component-analyzer](https://github.com/runem/web-component-analyzer):

```sh
npm install -g web-component-analyzer
```

Analyze your components using `--format json`:

```sh
wca analyze my-element.js --outFile custom-elements.json --format json
```

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
