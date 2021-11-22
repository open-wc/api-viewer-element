# API >> Elements || 10

API Viewer consists of two major features: documentation and demo (interactive live playground).
Both features reuse the same manifest data, and are available by default in the same UI when using `<api-viewer>` element.

Alternatively, you can use separate `<api-docs>` and `<api-demo>` elements.
This does not mean having to load manifest data twice: it can be fetched once and then passed to elements via `manifest` property.

