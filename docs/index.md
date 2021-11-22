---
layout: layout-home
title: API Viewer Element
slogan: Document your Web Components
callToActionItems:
  - text: Get started
    href: /docs/guide/intro/
  - text: Examples
    href: /docs/examples/api-viewer/

reasons:
  - header: CLI
    text: Generate manifests from source code.
    image: /_assets/cli.png
    alt: |
      npm i -D \
        @custom-elements-manifest/analyzer

      npx cem analyze --litelement
  - header: Plugins
    text: Plugin-based architecture to customize all the things.
    image: /_assets/plugins.png
    alt: |
      export default {
        plugins: [
          readmePlugin({header: 'head.md'})
        ]
      }
  - header: Ecosystem
    text: Active community contributions.
    image: /_assets/ecosystem.png
    alt: |
      npm i -D \
        cem-plugin-readonly \
        cem-plugin-atomico \
        cem-plugin-jsdoc-example \
        cem-plugin-reactify
---
