# API >> Templates || 30

API Viewer uses the [`<template>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) element for configuring the live demo.
With templates, you can customize the default properties values, set up custom [knobs](../../guide/using-demo/#knobs), or provide additional HTML to be shown in the demo.

## Setting templates

Both `<api-viewer>` and `<api-demo>` elements collect `<template>` elements passed to them declaratively at the time of initialization.
Alternatively, you can call `setTemplates()` method to provide a set of templates lazily.

```js
// Father the template elements placed in the DOM
const templates = document.querySelectorAll('template[data-target]');

// Configure the api-viewer to use the templates
document.querySelector('api-viewer').setTemplates(templates);
```

You can also create a template element with JavaScript, for example, using a [tagged template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates).
Note, while `<api-viewer>` is a web component built with Lit, it does not have any special API to handle Lit templates.

## Template types

There are 6 types of `<template>` that are recognized by the API Viewer using `data-` attributes.
Internally, the templates are processed with [`templateContent`](https://lit.dev/docs/templates/directives/#templatecontent) Lit directive.
Note, API Viewer does not sanitize templates, so the template content should be developer-controlled and must not be created using an untrusted string.

### `<template data-target="host">`

Use `"host"` template to configure default property values for a web component rendered in the demo.
This can be useful, for example, to provide a meaningful state that allows to better illustrate the component.

```html
<api-viewer src="./custom-elements.json">
  <template data-element="progress-bar" data-target="host">
    <progress-bar max="100" min="1" value="50"></progress-bar>
  </template>
</api-viewer>
```

### `<template data-target="slot">`

Use `"slot"` template to configure rich content for a web component that expects other HTML elements or web components to be passed to its slots.
A typical use case is a complex component, like tabs or accordion:

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

Note, the HTML created from the template content is also inserted to the demo snippet as is, using its original indentation.
If you want it to be preserved, make sure to not minify HTML as part of your build process.

### `<template data-target="prefix">`

Use `"prefix"` template to provide HTML to be inserted **before** the web component in the demo.
This is useful to create complex UI samples for small components that are typically meant to be used in the inline context.

```html
<api-viewer src="./custom-elements.json">
  <template data-element="intl-currency" data-target="prefix">
    <em>
      Shipping:
    </em>
  </template>
</api-viewer>
```

### `<template data-target="suffix">`

Use `"suffix"` template to provide HTML to be inserted **after** the web component in the demo.
Note, same as `"prefix"`, this template type can be used to provide [`<style>`](https://github.com/open-wc/api-viewer-element/issues/45#issuecomment-677458882) tag with CSS to customize the component.

```html
<api-viewer src="./custom-elements.json">
  <template data-element="expansion-panel" data-target="suffix">
    <style>
      expansion-panel[focused]::part(summary) {
        background-color: #e2e2e2;
      }
    </style>
  </template>
</api-viewer>
```

### `<template data-target="wrapper">`

Use `"suffix"` template to provide HTML to be used for **wrapping** the web component in the demo.
This can be used to change place the component inside another HTML element to showcase DOM composition.

```html
<api-viewer src="./custom-elements.json">
  <template data-element="intl-currency" data-target="wrapper">
    <strong></strong>
  </template>
</api-viewer>
```

### `<template data-target="knob">`

Use `"knob"` template to provide a custom UI control for setting attributes on the web component in the demo.
Apart from `data-target`, this type requires `data-attr` attribute to specify which attribute to set.
To indicate which knob control to create, use `data-type` with appropriate value: `text`, `number`, `checkbox`, or `select`.

```html
<template data-element="expansion-panel" data-target="knob" data-attr="dir" data-type="select">
  <select>
    <option value=""></option>
    <option value="ltr"></option>
    <option value="rtl"></option>
  </select>
</template>
```

If the attribute set using a custom knob has a corresponding property, the UI control will not be kept in sync.
Consider using an auto-generated knob and a `[property]-changed` event name if you need this behavior.
