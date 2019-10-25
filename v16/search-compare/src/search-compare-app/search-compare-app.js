define(["../../node_modules/@polymer/polymer/polymer-element.js", "./imls-table.js", "./search-compare-app-reducer.js"], function (_polymerElement, _imlsTable, _searchCompareAppReducer) {
  "use strict";

  function _templateObject_ee456350f72b11e9a64c27114e04f2f8() {
    var data = babelHelpers.taggedTemplateLiteral(["\n      <style>\n        :host {\n          display: hidden;\n        }\n      </style>\n    "]);

    _templateObject_ee456350f72b11e9a64c27114e04f2f8 = function _templateObject_ee456350f72b11e9a64c27114e04f2f8() {
      return data;
    };

    return data;
  }

  /**
   * @customElement
   * @polymer
   */
  var SearchCompareApp =
  /*#__PURE__*/
  function (_PolymerElement) {
    babelHelpers.inherits(SearchCompareApp, _PolymerElement);

    function SearchCompareApp() {
      var _this;

      babelHelpers.classCallCheck(this, SearchCompareApp);
      _this = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(SearchCompareApp).call(this));

      if (localStorage.getItem('search-compare-app-state')) {
        _this.store = Redux.createStore(_searchCompareAppReducer.searchCompareAppReducer, JSON.parse(localStorage.getItem('search-compare-app-state')), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
      } else {
        _this.store = Redux.createStore(_searchCompareAppReducer.searchCompareAppReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
      }

      _this.store.subscribe(function () {
        return _this.onStateUpdate(_this.store.getState());
      });

      window.startAppJs();
      return _this;
    }

    babelHelpers.createClass(SearchCompareApp, [{
      key: "onStateUpdate",
      value: function onStateUpdate(state) {
        localStorage.setItem('search-compare-app-state', JSON.stringify(state));
      }
    }], [{
      key: "template",
      get: function get() {
        return (0, _polymerElement.html)(_templateObject_ee456350f72b11e9a64c27114e04f2f8());
      }
    }, {
      key: "properties",
      get: function get() {
        return {
          prop1: {
            type: String,
            value: 'search-compare-app'
          }
        };
      }
    }]);
    return SearchCompareApp;
  }(_polymerElement.PolymerElement);

  window.customElements.define('search-compare-app', SearchCompareApp);
});