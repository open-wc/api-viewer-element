# Guide >> Writing JSDoc || 20

API Viewer generates documentation and live playground based on the web component code and [JSDoc](https://custom-elements-manifest.open-wc.org/analyzer/getting-started/#supported-jsdoc) written by its author.
If the component is authored in TypeScript, analyzer can use its types to get additional data.

## Properties

Use `@property` or `@prop` JSDoc annotation to document properties provided by the web component.
Only public properties are included, private and protected class members are not considered part of the API.

When using one of the [libraries](https://custom-elements-manifest.open-wc.org/analyzer/getting-started/#support)
supported by the analyzer, using JSDoc annotation might be optional.
For example, [Lit properties](https://lit.dev/docs/components/properties/) declared using the decorator or `static get properties()` block are detected.

Apart from property name and description, its type and default value are also shown in the UI if they are detected by the analyzer.
For every property that [reflects to attribute](https://developers.google.com/web/fundamentals/web-components/best-practices#attributes-properties), the attribute name is also listed.

## Attributes

Use `@attribute` or `@attr` JSDoc annotation to document HTML attributes that are considered public API of the web component.
Every attribute that does not have a corresponding property is listed in a corresponding tab.

A typical use case is listing attributes that the web component uses to represent its internal state.
For example, in certain cases the component might toggle boolean attributes on itself, like `focused` or `has-value`.

In the future, using [custom state pseudo-classes](https://css-tricks.com/custom-state-pseudo-classes-in-chrome/) might be a better alternative.
While this feature is available in Chrome, this is just a proposal with no cross-browser support or Custom Elements Manifest support yet.

## Events

All the custom events fired by the web component using `this.dispatchEvent` function calls are detected by the analyzer.
To exclude events that are not considered public API, use `@ignore` or `@internal` JSDoc annotation.

Alternatively, use `@fires` or `@event` JSDoc annotation to explicitly list events that the component might fire.
This allows to specify event type and provide an optional description that will be shown in the Events tab.

## Slots

Slots need to be documented explicitly, because there is no unified approach for custom elements to declare how they render Shadow DOM content.
There are many ways to do it: plain JS, tagged template literals, JSX.

Use `@slot` JSDoc annotation to document [slots](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot) supported by the web component.
Every slot might have a name (except for default unnamed `<slot>` element) and an optional description used e.g. to explain its purpose.

## CSS Custom Properties

Use `@cssproperty` or `@cssprop` JSDoc annotation to document custom CSS properties supported by the web component.
This is typically used for component-specific properties, not for global design system variables.

Apart from property name and description, it is possible to provide default value to be listed in docs and used by the live demo.
Specifying type for custom CSS properties is not currently supported by the analyzer.

## CSS Shadow Parts

Elements that can be styled using `::part` need to be documented using `@cssPart` annotation.
This cover elements with `part` attribute in Shadow DOM, as well as those exposed using `exportparts` attribute.

The parts are currently only used for the documentation, they are not available in the live demo.
Please comment in [this issue](https://github.com/open-wc/api-viewer-element/issues/42) about CSS Shadow Parts and slots inspector if you are interested.
