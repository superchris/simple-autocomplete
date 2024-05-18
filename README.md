# `<simple-autocomplete>`

This custom element implements an autocomplete (aka combobox) custom element. Fancy autocompletes know how to fetch and filter options themselves: this element does not. Instead, it relies on the user to provide the current set of options and emits events based on user interaction. This makes it perfect for event oriented backends such as LiveView or LiveState.

## Slots

This element requires the user to provide content in the following named slots:

- **input** This slot is expected to contain the search input
- **list** This slot is expected to contain a list of options. Each element with `aria-role="option"` will be considered an option.

## Styling the selected option


## Attributes

## Events

## Example

## Credits

The excellent [@github/combobox-nav] provides the functionality to navigate and select from the list of options.