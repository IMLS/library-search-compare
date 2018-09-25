import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import './imls-table.js'

/**
 * @customElement
 * @polymer
 */
class SearchCompareApp extends PolymerElement {
  constructor() {
    super()
    startAppJs()
  }
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <h2>Hello [[prop1]]!</h2>
    `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'search-compare-app'
      }
    };
  }
}

window.customElements.define('search-compare-app', SearchCompareApp);
