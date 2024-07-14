import Combobox from '@github/combobox-nav';
import debounce from './debounce.js';

export class AutocompleteInputElement extends HTMLElement {
  static formAssociated = true;

  static observedAttributes = ['value', 'display-value'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
    <input name="${this.getAttribute('name')}" value="${this.getAttribute('display-value')}" part="input">
    <slot name="list"></slot>
    `;
    const debounceMs = this.getAttribute('debounce') ? parseInt(this.getAttribute('debounce')) : 300;
    this.searchInput.addEventListener('input', debounce((e) => {
      this.elementInternals.states.delete('closed');
      this.elementInternals.states.add('open');
      this.dispatchEvent(
        new CustomEvent('autocomplete-search', { detail: { query: this.searchInput.value } }));
    }, debounceMs));
    this.list && this.list.addEventListener("combobox-commit", ({ detail, target }) => {
      this.elementInternals.states.add('selected');
      this.elementInternals.states.delete('open');
      this.searchInput.value = target.dataset.label;
      if (this.elementInternals.form) {
        this.elementInternals.setFormValue(target.dataset.value);
        new FormData(this.elementInternals.form).forEach(console.debug);  
      }
      if (this.getAttribute('clear-on-select')) { this.searchInput.value = ''; }
      this.dispatchEvent(new CustomEvent('autocomplete-commit', { detail: target.dataset, bubbles: true }));
    })
    this.elementInternals = this.attachInternals();
  }

  get list() {
    if (this.getAttribute('list')) {
      return document.querySelector(`#${this.getAttribute('list')}`);
    }
    const listSlot = this.shadowRoot.querySelector('slot[name="list"]');
    return listSlot.assignedElements().length > 0 ? listSlot.assignedElements()[0] : undefined;
  }

  initializeComboBox() {
    if (this.searchInput && this.list) {
      this.combobox = new Combobox(this.searchInput, this.list)
      // when options appear, start intercepting keyboard events for navigation
      this.combobox.start();
    }
  }

  connectedCallback() {
    if (this.elementInternals.form && this.getAttribute("value")) {
      this.elementInternals.setFormValue(this.getAttribute("value"));
    }
    this.initializeComboBox();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == 'value') {
      this.elementInternals.setFormValue(newValue);
    }
    if (name == 'display-value') {
      this.searchInput.value = newValue;
    }
  }

  disconnectedCallback() {
    this.combobox && this.combobox.stop();
  }

  get searchInput() {
    return this.shadowRoot.querySelector('input');
  }
}

customElements.define('autocomplete-input', AutocompleteInputElement)