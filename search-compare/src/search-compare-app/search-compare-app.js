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
      this.store = Redux.createStore(searchCompareAppReducer, JSON.parse(localStorage.getItem('search-compare-app-state')), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
    } else {
      this.store = Redux.createStore(searchCompareAppReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
    } 
    this.store.subscribe(() => this.onStateUpdate(this.store.getState()))
    window.startAppJs()
  }
  onStateUpdate(state) {
    localStorage.setItem('search-compare-app-state', JSON.stringify(state))
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
