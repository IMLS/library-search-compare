import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import './imls-table.js'

/**
 * @customElement
 * @polymer
 */
class SearchCompareApp extends PolymerElement {
  constructor() {
    super()
    window.startAppJs()
  }
  static get template() {
    return html`
      <style>
        :host {
          display: hidden;
        }
      </style>
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
