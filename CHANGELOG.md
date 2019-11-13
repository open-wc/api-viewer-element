# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

<!--
   PRs should document their user-visible changes (if any) in the
   Unreleased section, uncommenting the header as necessary.
-->

<!-- ## Unreleased -->
<!-- ### Added -->
<!-- ### Removed -->
<!-- ### Fixed -->
<!-- ### Changed -->

## [0.2.5] - 2019-11-13

### Added

- Exposed `section` property to toggle between docs and demo

## [0.2.4] - 2019-11-11

### Fixed

- Docs: tabs are no longer shown if there is no documented API
- Demo: knobs are now hidden if there is no properties / slots

### Changed

- Demo: adjusted source code snippet vertical padding

## [0.2.3] - 2019-11-06

### Fixed

- Element selector is now hidden if there is only one element

## [0.2.2] - 2019-11-05

### Added

#### API docs viewer

- CSS Shadow Parts: name, description

## [0.2.1] - 2019-11-02

### Fixed

- Docs & demo: UI is no longer shown when JSON is empty
- Docs: elements with empty description are rendered correctly
- Docs: description for properties is not displayed when empty

## [0.2.0] - 2019-10-30

### Added

#### API docs viewer

- CSS custom properties: name, description

#### Live playground

- Source: code with syntax highlighting
- Knobs: edit properties of the component
- Knobs: edit slotted text for each `<slot>`
- Knobs: sync on `[prop]-changed` events
- `<template>` for complex slotted content
- Styles: editing CSS custom properties
- Events: logging events of the component

## [0.1.0] - 2019-10-22

### Added

#### API docs viewer

- Properties: name, type, attribute, description
- Attributes: name, type, description
- Slots: name (if any), description
- Events: name, description
