import Combobox from '@github/combobox-nav';
import debounce from 'debounce';

export class SimpleAutocomplete extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
    <input name=${this.getAttribute('name')}>
    <slot name="list"></slot>
    `;
    const debounceMs = this.getAttribute('debounce') ? parseInt(this.getAttribute('debounce')) : 300;
    this.searchInput.addEventListener('input',
      debounce((e) => this.dispatchEvent(
        new CustomEvent('autocomplete-search', { detail: { query: this.searchInput.value } })), debounceMs));
    this.list.addEventListener("combobox-commit", ({detail, target}) => {
      if (this.getAttribute('clear-on-select')) {this.searchInput.value = '';}
      this.dispatchEvent(new CustomEvent('autocomplete-commit', {detail: target.dataset, bubbles: true}));
    })
  }

  get list() {
    if (this.getAttribute('list')) {
      return document.querySelector(`#${this.getAttribute('list')}`);
    }
    const listSlot = this.shadowRoot.querySelector('slot[name="list"]');
    return listSlot.assignedElements().length > 0 ? listSlot.assignedElements()[0] : undefined;
  }

  initializeComboBox() {
    this.combobox = new Combobox(this.searchInput, this.list)
    // when options appear, start intercepting keyboard events for navigation
    this.combobox.start();
  }

  connectedCallback() {
    this.initializeComboBox();
  }

  get searchInput() {
    return this.shadowRoot.querySelector('input');
  }
}

customElements.define('simple-autocomplete', SimpleAutocomplete)