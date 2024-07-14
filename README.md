# `<autocomplete-input>`

This custom element implements an autocomplete (aka combobox) input as a form associated custom element. As a form associated element, it will "quack" just like a real input when added to form: it will use its name attribute to populate the FormData of it's surrounding form element.

## Motivation

Existing solutions generally expect to manage and filter their own list of options, which is problematic for applications that which to manage this process from outside the element (eg server side).

This element does *not* fetch its own list of elements or do filtering based on the input value. Instead, it relies on the user to provide the current set of options and emits events based on user interaction. This makes it a good fit with event oriented backends such as [LiveView](https://hexdocs.pm/phoenix_live_view/1.0.0-rc.0/Phoenix.LiveView.html) or [LiveState](https://github.com/launchscout/live_state).

The intended usage pattern for this element is to handle the events dispatched by this element(see below), use the data in said events to obtain the current list of items, and populate the list of items as inner content in the `list` slot (see below).

## Installation

```
npm install @launchscout/autocomplete-input
```

## Providing options

This element requires the user to provide the list of options as inner content to the element using the `list` named slot, eg:

```html

```

- **input** This slot is expected to contain the search input
- **list** This slot is expected to contain a list of options. Each element with `aria-role="option"` will be considered an option.

## Events

- `autocomplete-search` sent when the value of the input changes, debounced by the specified interval.
- `autocomplete-commit` sent when an item is selected either by pressing Enter or clicking an option

## Attributes

- `name` This is a required attribute for setting the correct FormData value. It works exactly the same way as the `name` attribute of any other form input.
- `clear-on-select` This will clear the input value when an item is selected
- `debounce` The time in milliseconds to debounce before sending an `autocomplete-search` event when the user enters text into the input

## Styling the selected option

The currently selected option (via keyboard navigation) will be so indicated by adding the `airia-selected` attribute. This allows you to style the selected option like so:

```css
  simple-autocomplete [aria-selected='true'] {
    background-color: lavender;
  }

```

## Example

The [`index.html`](index.html) file in this directory shows a simple example of choosing people and adding them to a list. It requires the [silly_crm](https://github.com/superchris/silly_crm) example app to be up and running. It will also only work if you've created `Person`s that can be found.

## Credits

The excellent [@github/combobox-nav](https://github.com/github/combobox-nav) provides the functionality to navigate and select from the list of options.