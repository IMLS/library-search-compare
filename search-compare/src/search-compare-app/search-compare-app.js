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
    if (localStorage.getItem('search-compare-app-state')) {
      this.store = Redux.createStore(searchCompareAppReducer, JSON.parse(localStorage.getItem('search-compare-app-state')))
    } else {
      this.store = Redux.createStore(searchCompareAppReducer)
    } 
    this.store.subscribe(() => this.onStateUpdate(this.store.getState()))
  }

  onStateUpdate(state) {
    localStorage.setItem('search-compare-app-state', JSON.stringify(state))
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
