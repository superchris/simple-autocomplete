import { expect } from "@esm-bundle/chai";
import { fixture, oneEvent, nextFrame, aTimeout } from '@open-wc/testing';
import '../src/autocomplete-input';

it('renders an input', async () => {
  const el = await fixture(`
    <autocomplete-input name="foo"></autocomplete-input>
  `);
  expect(el.shadowRoot.querySelector('input')).to.exist;
})

it('emits an autocomplte-search event', async () => {
  const el = await fixture(`
    <autocomplete-input name="foo"></autocomplete-input>
  `);

  const searchInput = el.shadowRoot.querySelector('input');
  searchInput.value = 'foo';
  searchInput.dispatchEvent(new Event('input', { bubbles: true }));
  const { detail } = await oneEvent(el, 'autocomplete-search');
  expect(detail.query).to.equal('foo');
});

describe('the combobox', () => {
  it('builds a combobox and sends autocomplete-commit for a slotted list', async () => {
    const el = await fixture(`
      <autocomplete-input name="foo">
        <ul slot="list">
          <li role="option" data-value="foo">Foo</li>
        </ul>
      </autocomplete-input>
    `);
    const option = el.querySelector('li[data-value="foo"]');
    el.addEventListener('autocomplete-commit', (e) => {
      console.debug(e.detail)
      expect(e.detail.value).to.equal('foo');
    });
    option.click();
  });

  it('sets the value on the form', async () => {
    const formElement = await fixture(`
        <form>
          <autocomplete-input name="foo">
            <ul slot="list">
              <li role="option" data-value="bar">Bar</li>
            </ul>
          </autocomplete-input>
        </form>
      `);
    const option = formElement.querySelector('li[data-value="bar"]');
    option.click();
    expect(new FormData(formElement).get('foo')).to.eq('bar')
  });
});
