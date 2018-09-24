import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import './imls-table.js'
import { searchCompareAppReducer } from './search-compare-app-reducer.js'

/**
 * @customElement
 * @polymer
 */
class SearchCompareApp extends PolymerElement {
  constructor() {
    super()
    const initialState = localStorage.getItem('search-compare-app-state') ? JSON.parse(localStorage.getItem('search-compare-app-state')) : { myLibraries: []}
    this.store = Redux.createStore(searchCompareAppReducer, initialState)
    this.store.subscribe(() => localStorage.setItem('search-compare-app-state', JSON.stringify(this.store.getState())))
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
