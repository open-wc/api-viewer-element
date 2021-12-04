# API >> Properties || 20

API Viewer uses [reactive properties](https://lit.dev/docs/components/properties/) for configuration.
String properties, such as `src`, can be set declaratively using HTML attributes.
In such cases, it's up to you to decide whether to use a property or an attribute.

## Common

The following properties can be set on each of the web components that are public parts of the API Viewer.

### `src`

Use `src` property to provide URL for fetching manifest data as JSON:

```html
<api-viewer src="./custom-elements.json"></api-viewer>
```

### `manifest`

Use `manifest` property instead of `src` to pass manifest data directly:

```html
<api-viewer></api-viewer>
<script>
  fetch('./custom-elements.json')
    .then((res) => res.json())
    .then((manifest) => {
      document.querySelector('api-viewer').manifest = manifest;
    });
</script>
```

### `selected`

Use `selected` property to configure the displayed element.
This property is only used if the manifest contains data about multiple elements.
When a user selects another element, the property is updated accordingly.

```html
<api-viewer src="./custom-elements.json" selected="my-element"></api-viewer>
```

## Additional

The following properties are not available for all the web components, but only for a subset of them.

### `section`

Use `section` property on the `<api-viewer>` to toggle between demo and API docs:

```html
<api-viewer src="./custom-elements.json" section="demo"></api-viewer>
```

### `exclude-knobs`

Use `exclude-knobs` property to prevent creating knobs for certain properties.
For example, you can exclude properties that accept objects or arrays.
This property is available on both `<api-viewer>` and `<api-demo>`.

```html
<api-viewer
  src="./custom-elements.json"
  exclude-knobs="autofocus,items"
></api-viewer>
```
