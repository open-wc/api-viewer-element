# API >> Properties || 20

The following properties can be set on the `<api-viewer>` element:

## `section`

Use `section` property to toggle between demo and API docs:

```html
<api-viewer src="./custom-elements.json" section="demo"></api-viewer>
```

## `selected`

Use `selected` property to configure the displayed element:

```html
<api-viewer src="./custom-elements.json" selected="my-element"></api-viewer>
```

## `exclude-knobs`

Use `exclude-knobs` attribute to exclude properties from demo:

```html
<api-viewer src="./custom-elements.json" exclude-knobs="autofocus,items"></api-viewer>
```

## `manifest`

Use `manifest` property instead of `src` to pass manifest data directly:

```html
<api-viewer></api-viewer>
<script>
  fetch('./custom-elements.json')
    .then(res => res.json())
    .then(manifest => {
      document.querySelector('api-viewer').manifest = manifest;
    });
</script>
```
