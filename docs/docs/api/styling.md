# API >> Styling || 40

## Custom CSS properties

The following custom CSS properties are available:

| Property                         | Description                                     |
| -------------------------------- | ----------------------------------------------- |
| `--ave-accent-color`             | Accent color, used for property names           |
| `--ave-border-color`             | Color used for borders and dividers             |
| `--ave-border-radius`            | Border radius used for the outer border         |
| `--ave-button-active-background` | Color of the `:focus` and `:hover` button       |
| `--ave-button-background`        | Background of the button (code snippet, events) |
| `--ave-button-color`             | Color of the button (code snippet, events)      |
| `--ave-header-color`             | Header text color used for tag name             |
| `--ave-item-color`               | API items content color (main text)             |
| `--ave-label-color`              | API items labels color                          |
| `--ave-link-color`               | API description links default color             |
| `--ave-link-hover-color`         | API description links hover color               |
| `--ave-monospace-font`           | Monospace font stack for the API items          |
| `--ave-primary-color`            | Primary color, used for header and active tab   |
| `--ave-tab-color`                | Inactive tabs color                             |
| `--ave-tab-indicator-size`       | Size of the selected tab indicator              |

## CSS shadow parts

The following CSS shadow parts are available:

### Common UI parts

| Part                     | Description                                             |
| -------------------------| --------------------------------------------------------|
| `header`                 | Header containing element name and navigation controls  |
| `header-title`           | Title element placed in the header (element tag name)   |
| `tab`                    | `<api-viewer-tab>` component used in docs and demo      |
| `tab-panel`              | `<api-viewer-panel>` component used in docs and demo    |
| `warning`                | Message shown when no elements or API docs are found    |

### API docs

| Part                     | Description                                             |
| -------------------------| --------------------------------------------------------|
| `docs-description`       | Custom element description                              |
| `docs-column`            | Column, child of a `docs-row` part                      |
| `docs-item`              | Item representing a single entry  (property, event etc) |
| `docs-label`             | Label (name, attribute, type, description)              |
| `docs-markdown`          | Iem description with parsed markdown content            |
| `docs-row`               | Row containing columns. Child of a `docs-item` part     |
| `docs-value`             | Sibling of a `docs-label` part (name, attribute, type)  |
| `md-h1`                  | Markdown `<h1>` elements                                |
| `md-h2`                  | Markdown `<h2>` elements                                |
| `md-h3`                  | Markdown `<h3>` elements                                |
| `md-h4`                  | Markdown `<h4>` elements                                |
| `md-h5`                  | Markdown `<h5>` elements                                |
| `md-h6`                  | Markdown `<h6>` elements                                |
| `md-a`                   | Markdown `<a>` elements                                 |
| `md-p`                   | Markdown `<p>` elements                                 |
| `md-ul`                  | Markdown `<ul>` elements                                |
| `md-ol`                  | Markdown `<ol>` elements                                |
| `md-li`                  | Markdown `<li>` elements                                |
| `md-pre`                 | Markdown `<pre>` elements                               |
| `md-code`                | Markdown `<code>` elements                              |
| `md-strong`              | Markdown `<strong>` elements                            |
| `md-em`                  | Markdown `<em>` elements                                |
| `md-blockquote`          | Markdown `<blockquote>` elements                        |
| `md-del`                 | Markdown `<del>` elements                               |

### Live demo

| Part                     | Description                                             |
| -------------------------| ------------------------------------------------------- |
| `demo-output`            | Wrapper of the rendered component in the live demo      |
| `demo-snippet`           | Wrapper of the code snippet in the live demo            |
| `demo-tabs`              | Tabs component used to switch panels in the live demo   |
| `event-log`              | Wrapper of the event log tab content                    |
| `event-record`           | `<p>` used as a record in the event log                 |
| `knobs`                  | Wrapper of in the properties / styles knobs panel       |
| `knobs-column`           | Column in the properties / styles knobs panel           |
| `knobs-header`           | Header of the properties / styles knobs column          |
| `knob-label`             | Label associated with an input in the knobs panel       |

### Interactive elements

| Part                     | Description                                             |
| ------------------------ | ------------------------------------------------------- |
| `button`                 | `<button>` used to copy code / clear events log         |
| `checkbox`               | `<input type="checkbox">` used by boolean knobs         |
| `input`                  | `<input type="text">` used by knobs                     |
| `radio-button`           | `<input type="radio">` used to toggle docs / demo       |
| `radio-label`            | `<label>` associated with the radio button element      |
| `select`                 | `<select>` used to choose displayed component           |
| `select-label`           | `<label>` associated with the select element            |

Read more about using `::part()` at [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/::part).
